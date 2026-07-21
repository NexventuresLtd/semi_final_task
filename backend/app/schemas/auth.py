from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    requires_totp: bool
    temp_token: str | None = None
    access_token: str | None = None
    user: "UserOut | None" = None


class TotpVerifyRequest(BaseModel):
    temp_token: str
    code: str


class TokenResponse(BaseModel):
    access_token: str
    user: "UserOut"


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    department: str | None
    totp_enabled: bool

    class Config:
        from_attributes = True



class TotpEnrollStartResponse(BaseModel):
    otpauth_url: str


class TotpEnrollConfirmRequest(BaseModel):
    code: str

class GenerateInviteRequest(BaseModel):
    email: EmailStr
    role: str  # "staff" | "daf"
    department: str


class VerifyInviteRequest(BaseModel):
    email: EmailStr
    code: str


class VerifyInviteResponse(BaseModel):
    invite_token: str


class ManualSignupRequest(BaseModel):
    invite_token: str
    name: str
    password: str


class GoogleSignupRequest(BaseModel):
    id_token: str
    invite_token: str


class VerifyEmailRequest(BaseModel):
    token: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    
LoginResponse.model_rebuild()
TokenResponse.model_rebuild()