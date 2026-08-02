from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError

from app.database import get_db
from app.core.security import decode_token
from app.models.user import User, UserStatus

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")

    try:
        payload = decode_token(credentials.credentials)
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    if payload.get("type") != "access":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong token type")

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User no longer exists")

    # Re-checked on every single request, not just at login — this is what
    # makes "SG disables a user" take effect immediately, not just at their
    # next login.
    if user.status == UserStatus.DISABLED:
        raise HTTPException(status.HTTP_423_LOCKED, "This account has been disabled")
    if user.status == UserStatus.EMAIL_UNVERIFIED:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Please verify your email first")

    return user


def require_role(*allowed_roles: str):
    """Usage: Depends(require_role('sg')) or Depends(require_role('daf', 'sg'))"""
    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient permissions")
        return user
    return checker


def require_department_head(department: str):
    """
    Usage: Depends(require_department_head("referee"))
    Only lets through staff who are BOTH in the given department AND
    flagged as its head — a regular referee-department staff member
    (submitting their own requests) does not get this access.
    """
    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role != "staff" or user.department != department or not user.is_department_head:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "You don't have access to this department's management tools")
        return user
    return checker