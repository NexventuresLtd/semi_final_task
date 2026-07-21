from pydantic import BaseModel


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    signature_image: str | None = None  # base64 PNG data URL from SignaturePad


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ProfileOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    department: str | None
    totp_enabled: bool
    signature_image: str | None = None

    class Config:
        from_attributes = True