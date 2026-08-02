from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.permissions import get_current_user, require_department_head
from app.models.user import User
from app.models.referee import RefereeContact, MatchAssignment, RefereeEvaluation, AssignmentStatus
from app.schemas.referee import (
    CreateRefereeContactRequest, UpdateRefereeContactRequest, RefereeContactOut,
    CreateAssignmentRequest, UpdateAssignmentStatusRequest, AssignmentOut,
    CreateEvaluationRequest, EvaluationOut,
)

router = APIRouter(prefix="/referee", tags=["referee"])


# --- Referee roster (contacts, not system users) ---

@router.get("/contacts", response_model=list[RefereeContactOut])
def list_contacts(head: User = Depends(require_department_head("referee")), db: Session = Depends(get_db)):
    contacts = db.query(RefereeContact).filter(RefereeContact.is_active == True).order_by(RefereeContact.full_name).all()  # noqa: E712
    return [
        RefereeContactOut(id=c.id, fullName=c.full_name, phoneNumber=c.phone_number, qualificationBadge=c.qualification_badge, isActive=c.is_active)
        for c in contacts
    ]


@router.post("/contacts", response_model=RefereeContactOut)
def create_contact(payload: CreateRefereeContactRequest, head: User = Depends(require_department_head("referee")), db: Session = Depends(get_db)):
    contact = RefereeContact(
        full_name=payload.full_name.strip(),
        phone_number=payload.phone_number,
        qualification_badge=payload.qualification_badge,
        created_by_id=head.id,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return RefereeContactOut(id=contact.id, fullName=contact.full_name, phoneNumber=contact.phone_number, qualificationBadge=contact.qualification_badge, isActive=contact.is_active)


@router.patch("/contacts/{contact_id}", response_model=RefereeContactOut)
def update_contact(contact_id: str, payload: UpdateRefereeContactRequest, head: User = Depends(require_department_head("referee")), db: Session = Depends(get_db)):
    contact = db.query(RefereeContact).filter(RefereeContact.id == contact_id).first()
    if contact is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Referee not found")

    if payload.full_name is not None:
        contact.full_name = payload.full_name.strip()
    if payload.phone_number is not None:
        contact.phone_number = payload.phone_number
    if payload.qualification_badge is not None:
        contact.qualification_badge = payload.qualification_badge
    if payload.is_active is not None:
        contact.is_active = payload.is_active

    db.commit()
    db.refresh(contact)
    return RefereeContactOut(id=contact.id, fullName=contact.full_name, phoneNumber=contact.phone_number, qualificationBadge=contact.qualification_badge, isActive=contact.is_active)


@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: str, head: User = Depends(require_department_head("referee")), db: Session = Depends(get_db)):
    contact = db.query(RefereeContact).filter(RefereeContact.id == contact_id).first()
    if contact is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Referee not found")
    # Soft-delete — keeps their name/history intact on past assignments and evaluations
    contact.is_active = False
    db.commit()
    return {"message": "Referee removed from active roster"}


# --- Assignments ---

def _assignment_out(a: MatchAssignment, contact: RefereeContact) -> AssignmentOut:
    return AssignmentOut(
        id=a.id, matchTitle=a.match_title, matchDate=a.match_date, venue=a.venue, role=a.role,
        refereeContactId=a.referee_contact_id, refereeName=contact.full_name if contact else "Unknown",
        status=a.status, declineReason=a.decline_reason, createdAt=a.created_at,
    )


@router.get("/assignments", response_model=list[AssignmentOut])
def list_assignments(head: User = Depends(require_department_head("referee")), db: Session = Depends(get_db)):
    assignments = db.query(MatchAssignment).order_by(MatchAssignment.match_date.desc()).all()
    out = []
    for a in assignments:
        contact = db.query(RefereeContact).filter(RefereeContact.id == a.referee_contact_id).first()
        out.append(_assignment_out(a, contact))
    return out


@router.post("/assignments", response_model=AssignmentOut)
def create_assignment(payload: CreateAssignmentRequest, head: User = Depends(require_department_head("referee")), db: Session = Depends(get_db)):
    contact = db.query(RefereeContact).filter(RefereeContact.id == payload.referee_contact_id, RefereeContact.is_active == True).first()  # noqa: E712
    if contact is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Referee not found in the active roster")

    assignment = MatchAssignment(
        match_title=payload.match_title, match_date=payload.match_date, venue=payload.venue,
        role=payload.role, referee_contact_id=contact.id, assigned_by_id=head.id,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return _assignment_out(assignment, contact)


@router.patch("/assignments/{assignment_id}/status", response_model=AssignmentOut)
def update_assignment_status(
    assignment_id: str,
    payload: UpdateAssignmentStatusRequest,
    head: User = Depends(require_department_head("referee")),
    db: Session = Depends(get_db),
):
    """
    Since referees have no login, the Head updates status manually —
    typically after calling the referee to confirm availability.
    """
    assignment = db.query(MatchAssignment).filter(MatchAssignment.id == assignment_id).first()
    if assignment is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Assignment not found")

    assignment.status = payload.status
    assignment.decline_reason = payload.decline_reason if payload.status == "declined" else None
    db.commit()
    db.refresh(assignment)

    contact = db.query(RefereeContact).filter(RefereeContact.id == assignment.referee_contact_id).first()
    return _assignment_out(assignment, contact)


@router.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: str, head: User = Depends(require_department_head("referee")), db: Session = Depends(get_db)):
    assignment = db.query(MatchAssignment).filter(MatchAssignment.id == assignment_id).first()
    if assignment is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Assignment not found")
    db.delete(assignment)
    db.commit()
    return {"message": "Assignment removed"}


# --- Evaluations ---

@router.get("/evaluations", response_model=list[EvaluationOut])
def list_evaluations(referee_contact_id: str | None = None, head: User = Depends(require_department_head("referee")), db: Session = Depends(get_db)):
    query = db.query(RefereeEvaluation)
    if referee_contact_id:
        query = query.filter(RefereeEvaluation.referee_contact_id == referee_contact_id)
    evaluations = query.order_by(RefereeEvaluation.created_at.desc()).all()

    out = []
    for e in evaluations:
        contact = db.query(RefereeContact).filter(RefereeContact.id == e.referee_contact_id).first()
        assignment = db.query(MatchAssignment).filter(MatchAssignment.id == e.assignment_id).first()
        out.append(EvaluationOut(
            id=e.id, assignmentId=e.assignment_id, refereeContactId=e.referee_contact_id,
            refereeName=contact.full_name if contact else "Unknown", matchTitle=assignment.match_title if assignment else "—",
            fitnessScore=e.fitness_score, decisionMakingScore=e.decision_making_score,
            gameManagementScore=e.game_management_score, positioningScore=e.positioning_score,
            overallScore=e.overall_score, notes=e.notes, createdAt=e.created_at,
        ))
    return out


@router.post("/evaluations", response_model=EvaluationOut)
def create_evaluation(payload: CreateEvaluationRequest, head: User = Depends(require_department_head("referee")), db: Session = Depends(get_db)):
    assignment = db.query(MatchAssignment).filter(MatchAssignment.id == payload.assignment_id).first()
    if assignment is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Assignment not found")

    evaluation = RefereeEvaluation(
        assignment_id=assignment.id, referee_contact_id=assignment.referee_contact_id, evaluated_by_id=head.id,
        fitness_score=payload.fitness_score, decision_making_score=payload.decision_making_score,
        game_management_score=payload.game_management_score, positioning_score=payload.positioning_score,
        notes=payload.notes,
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    contact = db.query(RefereeContact).filter(RefereeContact.id == assignment.referee_contact_id).first()
    return EvaluationOut(
        id=evaluation.id, assignmentId=assignment.id, refereeContactId=contact.id, refereeName=contact.full_name,
        matchTitle=assignment.match_title, fitnessScore=evaluation.fitness_score,
        decisionMakingScore=evaluation.decision_making_score, gameManagementScore=evaluation.game_management_score,
        positioningScore=evaluation.positioning_score, overallScore=evaluation.overall_score,
        notes=evaluation.notes, createdAt=evaluation.created_at,
    )