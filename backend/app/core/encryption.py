from cryptography.fernet import Fernet
from app.config import settings

_fernet = Fernet(settings.field_encryption_key.encode())


def encrypt_field(value: str | None) -> str | None:
    """Encrypts a string for storage. Returns None unchanged (nullable fields)."""
    if value is None:
        return None
    return _fernet.encrypt(value.encode()).decode()


def decrypt_field(value: str | None) -> str | None:
    """Decrypts a stored value back to plain text for use in the app."""
    if value is None:
        return None
    return _fernet.decrypt(value.encode()).decode()