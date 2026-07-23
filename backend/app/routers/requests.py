import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.permissions import get_current_user
from app.core.encryption import encrypt_field
from app.models.request import RequestRecord, RequestStatus, RequestStage, is_financial
from app.models.user import User
from app.models.audit_log import AuditLog
from app.schemas.request import CreateRequestPayload
from app.services.approval_service import apply_signature, build_request_out
from datetime import datetime, timedelta, timezone
from app.services.notification_service import notify_new_request

router = APIRouter(prefix="/requests", tags=["requests"])


@router.post("")
def create_request(
    payload: CreateRequestPayload,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != "staff":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only staff can submit requests")

    if not user.signature_image_encrypted:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Add your digital signature in Settings before submitting a request")

    amount = None
    for key, value in payload.field_values.items():
        if key.lower() in ("amount requested", "amount asking", "amount"):
            try:
                amount = float(value)
            except (TypeError, ValueError):
                pass

    # This is the two-track routing decision: financial types start awaiting
    # DAF; anything else (e.g. "permission") skips DAF entirely and starts
    # awaiting SG directly.
    first_stage = RequestStage.DAF if is_financial(payload.type) else RequestStage.SG

    request = RequestRecord(
        type=payload.type,
        title=payload.title,
        template_id=payload.template_id,
        requester_id=user.id,
        department=user.department,
        amount=amount,
        currency="RWF",
        field_values_encrypted=encrypt_field(json.dumps(payload.field_values)),
        signatures_encrypted=encrypt_field(json.dumps({})),
        status=RequestStatus.PENDING,
        current_stage=first_stage,
    )
    db.add(request)
    db.flush()  # get request.id before signing

    apply_signature(request, "staff", user)

    db.add(AuditLog(
        action="submitted",
        actor_id=user.id,
        actor_name=user.name,
        description=f"submitted \"{request.title}\"",
        department=user.department,
        request_id=request.id,
    ))

    db.commit()
    db.refresh(request)

    # Notify whichever role is now first in line to review this request
    approver_role = "daf" if first_stage == RequestStage.DAF else "sg"
    approvers = db.query(User).filter(User.role == approver_role, User.status == "active").all()
    for approver in approvers:
        notify_new_request(db, approver, request.title, user, request.id)
    db.commit()
    return build_request_out(request, user, db)


@router.get("/mine")
def get_my_requests(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    requests = (
        db.query(RequestRecord)
        .filter(RequestRecord.requester_id == user.id)
        .order_by(RequestRecord.created_at.desc())
        .all()
    )
    return [build_request_out(r, user, db) for r in requests]


@router.get("/stats")
def get_dashboard_stats(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role == "staff":
        base_query = db.query(RequestRecord).filter(RequestRecord.requester_id == user.id)
    else:
        # DAF/SG stats reflect decisions THEY made, tracked via audit logs
        # rather than request ownership, since they don't "own" requests.
        base_query = db.query(RequestRecord)

    pending = base_query.filter(RequestRecord.status == "pending").count()
    approved = base_query.filter(RequestRecord.status == "approved").count()
    rejected = base_query.filter(RequestRecord.status == "rejected").count()

    return {"pending": pending, "approved": approved, "rejected": rejected, "avgTurnaround": "—"}

@router.get("/trend")
def get_approval_trend(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    since = datetime.now(timezone.utc) - timedelta(days=30)
    logs = (
        db.query(AuditLog)
        .filter(AuditLog.action.in_(["approved", "rejected"]), AuditLog.created_at >= since)
        .all()
    )

    by_day: dict[str, dict[str, int]] = {}
    for log in logs:
        day_key = log.created_at.strftime("%b %-d") if hasattr(log.created_at, "strftime") else str(log.created_at)
        by_day.setdefault(day_key, {"approved": 0, "rejected": 0})
        by_day[day_key][log.action] += 1

    # Ensure chronological order rather than dict insertion order
    sorted_days = sorted(by_day.keys(), key=lambda d: datetime.strptime(d, "%b %d"))
    return [{"date": day, **by_day[day]} for day in sorted_days]


@router.get("/{request_id}")
def get_request(request_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    request = db.query(RequestRecord).filter(RequestRecord.id == request_id).first()
    if request is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Request not found")

    requester = db.query(User).filter(User.id == request.requester_id).first()

    # Staff can only view their own; DAF/SG can view anything in their queue.
    if user.role == "staff" and request.requester_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your request")

    return build_request_out(request, requester, db)


@router.post("/{request_id}/seen")
def mark_request_seen(request_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    request = db.query(RequestRecord).filter(RequestRecord.id == request_id).first()
    if request is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Request not found")
    request.seen_by_approver = True
    db.commit()
    return {"message": "Marked as seen"}