from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.permissions import get_current_user
from app.core.security import verify_password, hash_password
from app.core.encryption import encrypt_field, decrypt_field
from app.models.user import User
from app.schemas.user import UpdateProfileRequest, ChangePasswordRequest, ProfileOut

router = APIRouter(prefix="/users", tags=["users"])


def _to_profile_out(user: User) -> ProfileOut:
    return ProfileOut(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        department=user.department,
        totp_enabled=user.totp_enabled,
        signature_image=decrypt_field(user.signature_image_encrypted),
    )


@router.get("/me", response_model=ProfileOut)
def get_my_profile(user: User = Depends(get_current_user)):
    return _to_profile_out(user)


@router.patch("/me")
def update_my_profile(
    payload: UpdateProfileRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.name is not None:
        user.name = payload.name.strip()

    if payload.signature_image is not None:
        # Signature images are encrypted at rest, same as any other
        # sensitive field — decrypted only when actually rendering a
        # document or returning it to its owner.
        user.signature_image_encrypted = encrypt_field(payload.signature_image)

    db.commit()
    db.refresh(user)
    return {"user": _to_profile_out(user)}


@router.post("/me/change-password")
def change_my_password(
    payload: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.password_hash is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "This account signs in with Google and has no password to change",
        )

    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Current password is incorrect")

    user.password_hash = hash_password(payload.new_password)
    db.commit()

    return {"message": "Password updated"}