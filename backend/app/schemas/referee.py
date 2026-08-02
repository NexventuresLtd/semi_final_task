from pydantic import BaseModel
from datetime import datetime


class CreateRefereeContactRequest(BaseModel):
    full_name: str
    phone_number: str | None = None
    qualification_badge: str | None = None


class UpdateRefereeContactRequest(BaseModel):
    full_name: str | None = None
    phone_number: str | None = None
    qualification_badge: str | None = None
    is_active: bool | None = None


class RefereeContactOut(BaseModel):
    id: str
    fullName: str
    phoneNumber: str | None
    qualificationBadge: str | None
    isActive: bool

    class Config:
        from_attributes = True


class CreateAssignmentRequest(BaseModel):
    match_title: str
    match_date: datetime
    venue: str | None = None
    role: str = "Center Referee"
    referee_contact_id: str


class UpdateAssignmentStatusRequest(BaseModel):
    status: str  # "scheduled" | "confirmed" | "declined"
    decline_reason: str | None = None


class AssignmentOut(BaseModel):
    id: str
    matchTitle: str
    matchDate: datetime
    venue: str | None
    role: str
    refereeContactId: str
    refereeName: str
    status: str
    declineReason: str | None
    createdAt: datetime


class CreateEvaluationRequest(BaseModel):
    assignment_id: str
    fitness_score: float
    decision_making_score: float
    game_management_score: float
    positioning_score: float
    notes: str | None = None


class EvaluationOut(BaseModel):
    id: str
    assignmentId: str
    refereeContactId: str
    refereeName: str
    matchTitle: str
    fitnessScore: float
    decisionMakingScore: float
    gameManagementScore: float
    positioningScore: float
    overallScore: float
    notes: str | None
    createdAt: datetime