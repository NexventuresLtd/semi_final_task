from pydantic import BaseModel


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    signature_image: str | None = None
    phone_number: str | None = None
    qualification_badge: str | None = None


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
    is_department_head: bool = False
    phone_number: str | None = None
    qualification_badge: str | None = None

    class Config:
        from_attributes = True