from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from app.config import settings

_serializer = URLSafeTimedSerializer(settings.app_secret_key)


def create_email_verification_token(user_id: str) -> str:
    return _serializer.dumps({"user_id": user_id}, salt="email-verify")


def verify_email_verification_token(token: str, max_age_seconds: int = 60 * 60 * 24) -> str | None:
    """Returns user_id if valid, None if expired/tampered."""
    try:
        data = _serializer.loads(token, salt="email-verify", max_age=max_age_seconds)
        return data["user_id"]
    except (BadSignature, SignatureExpired):
        return None


def create_password_reset_token(user_id: str) -> str:
    return _serializer.dumps({"user_id": user_id}, salt="password-reset")


def verify_password_reset_token(token: str, max_age_seconds: int = 60 * 30) -> str | None:
    try:
        data = _serializer.loads(token, salt="password-reset", max_age=max_age_seconds)
        return data["user_id"]
    except (BadSignature, SignatureExpired):
        return None