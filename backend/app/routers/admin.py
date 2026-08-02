from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from app.database import get_db
from app.core.permissions import require_role
from app.core.invite_codes import generate_invite_code, hash_code
from app.models.invite import Invite
from app.models.user import User
from app.schemas.auth import GenerateInviteRequest
from app.services.email_service import invite_email_html
from app.tasks.email_tasks import send_email_task
from app.models.audit_log import AuditLog
from app.models.session import LoginSession
from app.schemas.admin import UserListItem, UpdateUserStatusRequest, AuditLogEntry, SessionEntry
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/invites")
def generate_invite(
    payload: GenerateInviteRequest,
    sg: User = Depends(require_role("sg")),
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status.HTTP_409_CONFLICT, "A user with this email already exists")

    code = generate_invite_code()
    invite = Invite(
        email=payload.email,
        role=payload.role,
        department=payload.department,
        code_hash=hash_code(code),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=48),
        created_by_user_id=sg.id,
    )
    db.add(invite)
    db.commit()

    send_email_task.delay(
        to_email=payload.email,
        subject="You've been invited to FERWAFA Approvals",
        html_body=invite_email_html(payload.email, code, payload.role),
    )

    return {"message": "Invitation sent"}

@router.get("/users", response_model=list[UserListItem])
def list_users(sg: User = Depends(require_role("sg")), db: Session = Depends(get_db)):
    users = db.query(User).filter(User.role != "sg").order_by(User.created_at.desc()).all()
    return users


@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: str,
    payload: UpdateUserStatusRequest,
    sg: User = Depends(require_role("sg")),
    db: Session = Depends(get_db),
):
    target = db.query(User).filter(User.id == user_id).first()
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    if target.role == "sg":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot modify another SG account this way")

    target.status = payload.status
    db.commit()

    db.add(AuditLog(
        action="user_disabled" if payload.status == "disabled" else "user_enabled",
        actor_id=sg.id,
        actor_name=sg.name,
        description=f"{'disabled' if payload.status == 'disabled' else 're-enabled'} {target.name}'s account",
    ))
    db.commit()

    return {"message": "User status updated"}


@router.post("/users/{user_id}/reset-2fa")
def reset_user_totp(
    user_id: str,
    sg: User = Depends(require_role("sg")),
    db: Session = Depends(get_db),
):
    target = db.query(User).filter(User.id == user_id).first()
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    target.totp_enabled = False
    target.totp_secret = None
    db.commit()

    db.add(AuditLog(
        action="totp_reset",
        actor_id=sg.id,
        actor_name=sg.name,
        description=f"reset two-factor authentication for {target.name}",
    ))
    db.commit()

    return {"message": "2FA reset — user will re-enroll on next login"}


@router.get("/users/{user_id}/sessions", response_model=list[SessionEntry])
def get_user_sessions(
    user_id: str,
    sg: User = Depends(require_role("sg")),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(LoginSession)
        .filter(LoginSession.user_id == user_id)
        .order_by(LoginSession.created_at.desc())
        .limit(20)
        .all()
    )
    return [
        SessionEntry(
            id=s.id,
            device=s.device or "Unknown device",
            location=None,  # would need a GeoIP lookup service to populate accurately
            ipAddress=s.ip_address or "Unknown",
            timestamp=s.created_at,
        )
        for s in sessions
    ]


@router.get("/audit-trail", response_model=list[AuditLogEntry])
def get_audit_trail(sg: User = Depends(require_role("sg")), db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()
    return [
        AuditLogEntry(
            id=log.id,
            action=log.action,
            actor=log.actor_name,
            description=log.description,
            department=log.department,
            ipAddress=log.ip_address,
            timestamp=log.created_at,
        )
        for log in logs
    ]


class UpdateDepartmentHeadRequest(BaseModel):
    is_department_head: bool

@router.patch("/users/{user_id}/department-head")
def update_department_head(
    user_id: str,
    payload: UpdateDepartmentHeadRequest,
    sg: User = Depends(require_role("sg")),
    db: Session = Depends(get_db),
):
    target = db.query(User).filter(User.id == user_id).first()
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    if target.department != "referee":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Only referee department staff can be made department head")

    target.is_department_head = payload.is_department_head
    db.commit()

    db.add(AuditLog(
        action="department_head_changed",
        actor_id=sg.id, actor_name=sg.name,
        description=f"{'granted' if payload.is_department_head else 'removed'} Department Head access for {target.name}",
    ))
    db.commit()
    return {"message": "Updated"}