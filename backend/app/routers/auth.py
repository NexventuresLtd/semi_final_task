from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from jose import JWTError
from datetime import datetime, timezone, timedelta

from app.database import get_db
from app.models.user import User, UserStatus
from app.core.security import verify_password, create_token, decode_token, create_temp_totp_token, hash_password
from app.core.permissions import get_current_user
from app.schemas.auth import LoginRequest, LoginResponse, TotpVerifyRequest, TokenResponse, UserOut
from app.config import settings
from app.core.totp import generate_totp_secret, get_totp_uri, verify_totp_code
from app.schemas.auth import TotpEnrollStartResponse, TotpEnrollConfirmRequest

from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from app.models.invite import Invite
from app.models.user import Department
from app.models.session import LoginSession
from app.core.invite_codes import verify_code
from app.core.email_tokens import create_email_verification_token, verify_email_verification_token, create_password_reset_token, verify_password_reset_token
from app.services.email_service import verification_email_html,password_reset_email_html
from app.tasks.email_tasks import send_email_task
from app.schemas.auth import (
    VerifyInviteRequest, VerifyInviteResponse, ManualSignupRequest,
    GoogleSignupRequest, VerifyEmailRequest, ResendVerificationRequest,ForgotPasswordRequest, ResetPasswordRequest
)
from itsdangerous import URLSafeTimedSerializer

_invite_serializer = URLSafeTimedSerializer(settings.app_secret_key)

router = APIRouter(prefix="/auth", tags=["auth"])

REFRESH_COOKIE_NAME = "ferwafa_refresh_token"

def _parse_device(user_agent: str) -> str:
    ua = user_agent.lower()
    if "mobile" in ua or "android" in ua:
        browser = "Chrome" if "chrome" in ua else "Safari" if "safari" in ua else "Browser"
        return f"{browser} on Mobile"
    if "windows" in ua:
        os_label = "Windows"
    elif "mac os" in ua or "macintosh" in ua:
        os_label = "macOS"
    elif "linux" in ua:
        os_label = "Linux"
    else:
        os_label = "Unknown OS"
    browser = "Chrome" if "chrome" in ua else "Firefox" if "firefox" in ua else "Safari" if "safari" in ua else "Browser"
    return f"{browser} on {os_label}"

def _set_refresh_cookie(response: Response, user_id: str, role: str):
    token = create_token(user_id, role, "refresh")
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        httponly=True,           # never readable by JS — this is what protects it from XSS
        secure=settings.app_env == "production",  # HTTPS-only in production
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/api/auth",
    )


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if user is None or user.password_hash is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")

    if user.status == UserStatus.DISABLED:
        raise HTTPException(status.HTTP_423_LOCKED, "This account has been disabled")
    if user.status == UserStatus.EMAIL_UNVERIFIED:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Please verify your email before signing in")

    if user.totp_enabled:
        return LoginResponse(requires_totp=True, temp_token=create_temp_totp_token(user.id))

    # Not yet enrolled in 2FA — issue full access so the frontend can route
    # them straight to TotpSetupPage. This only ever applies to brand-new
    # or seeded accounts; every account is forced through enrollment before
    # totp_enabled flips true, so this branch is a one-time-per-account path.
    access_token = create_token(user.id, user.role, "access")
    _set_refresh_cookie(response, user.id, user.role)
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    return LoginResponse(requires_totp=False, access_token=access_token, user=UserOut.model_validate(user))


@router.post("/totp/verify", response_model=TokenResponse)
def totp_verify(payload: TotpVerifyRequest, response: Response, req:Request, db: Session = Depends(get_db)):    
    try:
        temp_payload = decode_token(payload.temp_token)
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "This session has expired — please sign in again")

    if temp_payload.get("type") != "totp_pending":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid session")

    user = db.query(User).filter(User.id == temp_payload["sub"]).first()
    if user is None or not user.totp_secret:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid session")

    if not verify_totp_code(user.totp_secret, payload.code):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect code")

    access_token = create_token(user.id, user.role, "access")
    _set_refresh_cookie(response, user.id, user.role)
    user.last_login_at = datetime.now(timezone.utc)
    user_agent = req.headers.get("user-agent", "Unknown device")
    device_label = _parse_device(user_agent)

    db.add(LoginSession(
        user_id=user.id,
        device=device_label,
        ip_address=req.client.host if req.client else None,
    ))  
    db.commit()

    return TokenResponse(access_token=access_token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def get_me(user: User = Depends(get_current_user)):
    return UserOut.model_validate(user)


@router.post("/refresh")
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "No refresh token")

    try:
        payload = decode_token(token)
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong token type")

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if user is None or user.status == UserStatus.DISABLED:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Account no longer available")

    new_access_token = create_token(user.id, user.role, "access")
    # Rotate the refresh token too — limits how long a stolen refresh
    # cookie stays useful if it's ever compromised.
    _set_refresh_cookie(response, user.id, user.role)

    return {"access_token": new_access_token}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(REFRESH_COOKIE_NAME, path="/api/auth")
    return {"message": "Logged out"}


@router.post("/totp/enroll/start", response_model=TotpEnrollStartResponse)
def totp_enroll_start(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.totp_enabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Two-factor authentication is already enabled")

    # Only generate a new secret if one doesn't already exist — this stops
    # the QR code silently changing (and the app entry going stale) if the
    # user reloads the enrollment page or the network hiccups before they
    # confirm.
    if not user.totp_secret:
        user.totp_secret = generate_totp_secret()
        db.commit()

    return TotpEnrollStartResponse(otpauth_url=get_totp_uri(user.totp_secret, user.email))

@router.post("/totp/enroll/confirm", response_model=TokenResponse)
def totp_enroll_confirm(
    payload: TotpEnrollConfirmRequest,
    response: Response,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.totp_secret:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Start enrollment first")

    if not verify_totp_code(user.totp_secret, payload.code):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect code — try again")

    user.totp_enabled = True
    db.commit()

    # Enrollment itself now counts as a completed login — hand back real
    # tokens immediately rather than making them log in a second time.
    access_token = create_token(user.id, user.role, "access")
    _set_refresh_cookie(response, user.id, user.role)

    return TokenResponse(access_token=access_token, user=UserOut.model_validate(user))


@router.post("/invite/verify", response_model=VerifyInviteResponse)
def verify_invite(payload: VerifyInviteRequest, db: Session = Depends(get_db)):
    invite = (
        db.query(Invite)
        .filter(Invite.email == payload.email, Invite.used == False)  # noqa: E712
        .order_by(Invite.created_at.desc())
        .first()
    )

    if invite is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired invitation code")

    if invite.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "This invitation has expired — ask your SG for a new one")

    if invite.attempts_remaining <= 0:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Too many incorrect attempts — ask your SG for a new invitation")

    if not verify_code(payload.code, invite.code_hash):
        invite.attempts_remaining -= 1
        db.commit()
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail={"message": "Incorrect code", "attempts_left": invite.attempts_remaining},
        )

    # Code is correct — issue a short-lived invite_token proving verification
    # succeeded, so the raw code never needs to be sent again on this device.
    invite_token = _invite_serializer.dumps({"invite_id": invite.id}, salt="invite-verified")
    return VerifyInviteResponse(invite_token=invite_token)


def _resolve_invite(invite_token: str, db: Session) -> Invite:
    try:
        data = _invite_serializer.loads(invite_token, salt="invite-verified", max_age=60 * 30)
    except Exception:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "This invitation session has expired — verify your code again")

    invite = db.query(Invite).filter(Invite.id == data["invite_id"], Invite.used == False).first()  # noqa: E712
    if invite is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "This invitation is no longer valid")
    return invite


@router.post("/signup/manual")
def signup_manual(payload: ManualSignupRequest, db: Session = Depends(get_db)):
    invite = _resolve_invite(payload.invite_token, db)

    user = User(
        email=invite.email,
        name=payload.name,
        role=invite.role,
        department=invite.department,
        status="email_unverified",
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    invite.used = True
    db.commit()
    db.refresh(user)

    verification_token = create_email_verification_token(user.id)
    verify_link = f"{settings.frontend_url}/verify-email?token={verification_token}"
    send_email_task.delay(
        to_email=user.email,
        subject="Confirm your FERWAFA Approvals account",
        html_body=verification_email_html(verify_link),
    )

    return {"message": "Account created — check your email to verify"}


@router.post("/signup/google", response_model=TokenResponse)
def signup_google(payload: GoogleSignupRequest, response: Response, db: Session = Depends(get_db)):
    invite = _resolve_invite(payload.invite_token, db)

    try:
        google_info = google_id_token.verify_oauth2_token(
            payload.id_token, google_requests.Request(), settings.google_client_id
        )
    except ValueError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Google credential")

    google_email = google_info.get("email")
    if google_email != invite.email:
        raise HTTPException(status.HTTP_409_CONFLICT, "This Google account's email doesn't match your invitation")

    user = User(
        email=invite.email,
        name=google_info.get("name", invite.email),
        role=invite.role,
        department=invite.department,
        status="active",  # Google already proved inbox ownership — no separate email step needed
        google_id=google_info["sub"],
    )
    db.add(user)
    invite.used = True
    db.commit()
    db.refresh(user)

    access_token = create_token(user.id, user.role, "access")
    _set_refresh_cookie(response, user.id, user.role)

    return TokenResponse(access_token=access_token, user=UserOut.model_validate(user))


@router.post("/verify-email")
def verify_email(payload: VerifyEmailRequest, db: Session = Depends(get_db)):
    user_id = verify_email_verification_token(payload.token)
    if user_id is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "This verification link has expired or is invalid")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Account not found")

    user.status = "active"
    db.commit()
    return {"message": "Email verified — you can now sign in"}


@router.post("/verify-email/resend")
def resend_verification(payload: ResendVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    # Same "always succeeds" pattern as password reset — never reveal
    # whether an email exists in the system.
    if user and user.status == "email_unverified":
        token = create_email_verification_token(user.id)
        link = f"{settings.frontend_url}/verify-email?token={token}"
        send_email_task.delay(
            to_email=user.email,
            subject="Confirm your FERWAFA Approvals account",
            html_body=verification_email_html(link),
        )
    return {"message": "If that account needs verification, an email has been sent"}

@router.post("/password/forgot")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    # Always returns the same response regardless of whether the email
    # exists — this is what stops an attacker from using this endpoint to
    # discover which emails have accounts in the system.
    if user and user.password_hash is not None:
        token = create_password_reset_token(user.id)
        link = f"{settings.frontend_url}/reset-password?token={token}"
        send_email_task.delay(
            to_email=user.email,
            subject="Reset your FERWAFA Approvals password",
            html_body=password_reset_email_html(link),
        )

    return {"message": "If an account exists for that email, a reset link has been sent"}


@router.post("/password/reset")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user_id = verify_password_reset_token(payload.token)
    if user_id is None:
        raise HTTPException(status.HTTP_410_GONE, "This reset link has expired or is invalid")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Account not found")

    user.password_hash = hash_password(payload.new_password)
    db.commit()

    return {"message": "Password updated — please sign in"}