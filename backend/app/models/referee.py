import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, Float, Boolean, Enum as SAEnum, ForeignKey
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class QualificationBadge(str, enum.Enum):
    YOUTH_LOCAL = "youth_local"
    SEMI_PRO = "semi_pro"
    TOP_TIER_NATIONAL = "top_tier_national"
    CAF = "caf"
    FIFA = "fifa"


class AssignmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"   # Head created it, hasn't confirmed availability yet
    CONFIRMED = "confirmed"   # Head confirmed referee will officiate (e.g. after a phone call)
    DECLINED = "declined"     # referee unavailable / assignment fell through


class RefereeContact(Base):
    """
    A referee is NOT a system user — they never log in. This is a contact
    record the Referee Department Head maintains directly: name, phone,
    and qualification badge, reused across every assignment instead of
    re-entered each time.
    """
    __tablename__ = "referee_contacts"

    id = Column(String, primary_key=True, default=generate_uuid)

    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    qualification_badge = Column(SAEnum(QualificationBadge), nullable=True)

    is_active = Column(Boolean, nullable=False, default=True)  # soft-delete instead of hard delete, preserves assignment/grading history

    created_by_id = Column(String, nullable=False)  # which Head added them
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class MatchAssignment(Base):
    __tablename__ = "match_assignments"

    id = Column(String, primary_key=True, default=generate_uuid)

    match_title = Column(String, nullable=False)
    match_date = Column(DateTime, nullable=False)
    venue = Column(String, nullable=True)
    role = Column(String, nullable=False, default="Center Referee")

    referee_contact_id = Column(String, ForeignKey("referee_contacts.id"), nullable=False)
    assigned_by_id = Column(String, nullable=False)  # the Head who created it

    status = Column(SAEnum(AssignmentStatus), nullable=False, default=AssignmentStatus.SCHEDULED)
    decline_reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class RefereeEvaluation(Base):
    __tablename__ = "referee_evaluations"

    id = Column(String, primary_key=True, default=generate_uuid)

    assignment_id = Column(String, ForeignKey("match_assignments.id"), nullable=False)
    referee_contact_id = Column(String, ForeignKey("referee_contacts.id"), nullable=False)
    evaluated_by_id = Column(String, nullable=False)

    fitness_score = Column(Float, nullable=False)
    decision_making_score = Column(Float, nullable=False)
    game_management_score = Column(Float, nullable=False)
    positioning_score = Column(Float, nullable=False)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def overall_score(self) -> float:
        return round(
            (self.fitness_score + self.decision_making_score + self.game_management_score + self.positioning_score) / 4,
            2,
        )