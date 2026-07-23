from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.permissions import get_current_user, require_role
from app.models.request import RequestRecord, RequestStatus, RequestStage, is_financial
from app.models.user import User
from app.models.audit_log import AuditLog
from app.models.comment import RequestComment
from app.schemas.approval import ApprovalActionRequest
from app.services.approval_service import apply_signature, build_request_out
from app.services.notification_service import notify_decision, notify_new_request

router = APIRouter(prefix="/approvals", tags=["approvals"])

STAGE_LABEL = {"daf": "Director of Finance", "sg": "Secretary General"}


@router.get("/queue")
def get_queue(user: User = Depends(require_role("daf", "sg")), db: Session = Depends(get_db)):
    stage = RequestStage.DAF if user.role == "daf" else RequestStage.SG

    # Currently pending at my stage — still needs my decision
    pending = (
        db.query(RequestRecord)
        .filter(RequestRecord.current_stage == stage, RequestRecord.status == RequestStatus.PENDING)
        .all()
    )

    # Requests I've already personally approved/rejected — needed so the
    # "Approved" tab has anything in it once a request moves past my stage
    decided_ids = (
        db.query(AuditLog.request_id)
        .filter(AuditLog.actor_id == user.id, AuditLog.action.in_(["approved", "rejected"]))
        .distinct()
        .all()
    )
    decided_ids = [row[0] for row in decided_ids]
    decided = db.query(RequestRecord).filter(RequestRecord.id.in_(decided_ids)).all() if decided_ids else []

    # Merge + dedupe (a request could theoretically appear in both briefly)
    all_requests = {r.id: r for r in pending + decided}.values()
    sorted_requests = sorted(all_requests, key=lambda r: r.created_at, reverse=True)

    out = []
    for r in sorted_requests:
        requester = db.query(User).filter(User.id == r.requester_id).first()
        out.append(build_request_out(r, requester, db))
    return out


def _handle_decision(
    request_id: str,
    payload: ApprovalActionRequest,
    decision: str,  # "approved" | "rejected"
    stage: str,     # "daf" | "sg"
    user: User,
    req: Request,
    db: Session,
):
    request = db.query(RequestRecord).filter(RequestRecord.id == request_id).first()
    if request is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Request not found")
    
    # Guard added — same rule staff already have, now enforced for DAF/SG too
    if not user.signature_image_encrypted:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Add your digital signature in Settings before approving or rejecting requests",
        )
    expected_stage = RequestStage.DAF if stage == "daf" else RequestStage.SG
    if request.current_stage != expected_stage or request.status != RequestStatus.PENDING:
        raise HTTPException(status.HTTP_409_CONFLICT, "This request is no longer awaiting your review")

    if decision == "rejected" and not payload.comment:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "A reason is required when rejecting a request")

    apply_signature(request, stage, user)

    if decision == "rejected":
        request.status = RequestStatus.REJECTED
        request.rejected_at_stage = stage
        request.current_stage = RequestStage.DONE
    else:
        if stage == "daf":
            # Financial track: DAF approval moves it on to SG, not to DONE.
            request.current_stage = RequestStage.SG
        else:
            # SG approval always finalizes — whether this was the second
            # step of the financial track or the only step of the general
            # track.
            request.status = RequestStatus.APPROVED
            request.current_stage = RequestStage.DONE

    if payload.comment:
        db.add(RequestComment(
            request_id=request.id,
            author_id=user.id,
            author_name=user.name,
            author_role=user.role,
            text=payload.comment,
        ))

    db.add(AuditLog(
        action=decision,
        actor_id=user.id,
        actor_name=user.name,
        description=f"{decision} \"{request.title}\"",
        department=request.department,
        request_id=request.id,
        ip_address=req.client.host if req.client else None,
    ))

    db.commit()
    db.refresh(request)

    requester = db.query(User).filter(User.id == request.requester_id).first()
    notify_decision(db, requester, decision, STAGE_LABEL[stage], request.title, request.id, payload.comment)
    if decision == "approved" and stage == "daf":
        sg_users = db.query(User).filter(User.role == "sg", User.status == "active").all()
    for sg_user in sg_users:
        notify_new_request(db, sg_user, request.title, requester, request.id)

    db.commit()

    return build_request_out(request, requester, db)


@router.post("/{request_id}/approve")
def approve_request(
    request_id: str,
    payload: ApprovalActionRequest,
    req: Request,
    user: User = Depends(require_role("daf", "sg")),
    db: Session = Depends(get_db),
):
    return _handle_decision(request_id, payload, "approved", user.role, user, req, db)


@router.post("/{request_id}/reject")
def reject_request(
    request_id: str,
    payload: ApprovalActionRequest,
    req: Request,
    user: User = Depends(require_role("daf", "sg")),
    db: Session = Depends(get_db),
):
    return _handle_decision(request_id, payload, "rejected", user.role, user, req, db)