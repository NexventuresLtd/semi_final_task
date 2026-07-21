from datetime import datetime, timedelta, timezone
from typing import Literal
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# --- JWT ---
# Two token types, deliberately kept separate:
#   access  -> short-lived (15 min), sent on every API request
#   refresh -> long-lived (7 days), never touched by JS — lives in an
#              httpOnly cookie, only ever used against /auth/refresh
TokenType = Literal["access", "refresh"]


def create_token(user_id: str, role: str, token_type: TokenType) -> str:
    now = datetime.now(timezone.utc)
    if token_type == "access":
        expire = now + timedelta(minutes=settings.access_token_expire_minutes)
    else:
        expire = now + timedelta(days=settings.refresh_token_expire_days)

    payload = {
        "sub": user_id,
        "role": role,
        "type": token_type,
        "iat": now,
        "exp": expire,
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    """Raises jose.JWTError on invalid/expired tokens — caller handles it."""
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])


def create_temp_totp_token(user_id: str) -> str:
    """
    Short-lived (5 min) token issued after a correct password but before
    TOTP is verified. Proves "this person knows the password" without yet
    granting real access — the frontend's TotpVerifyForm exchanges this
    for real tokens once the 6-digit code checks out.
    """
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "type": "totp_pending",
        "iat": now,
        "exp": now + timedelta(minutes=5),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)