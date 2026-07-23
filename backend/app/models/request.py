import uuid
import json
import enum
from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, String, DateTime, Text, Float, Enum as SAEnum, ForeignKey
from app.database import Base

# Financial requests move Staff -> DAF -> SG.
# General/administrative requests (e.g. permission) move Staff -> SG only.
FINANCIAL_TYPES = {"memo", "purchase_order", "reimbursement", "travel_advance"}
GENERAL_TYPES = {"permission"}


class RequestStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class RequestStage(str, enum.Enum):
    STAFF = "staff"     # submitted, not yet reviewed
    DAF = "daf"          # awaiting DAF (financial track only)
    SG = "sg"             # awaiting SG (both tracks)
    DONE = "done"


def generate_uuid() -> str:
    return str(uuid.uuid4())


def is_financial(request_type: str) -> bool:
    return request_type in FINANCIAL_TYPES


class RequestRecord(Base):
    __tablename__ = "requests"

    id = Column(String, primary_key=True, default=generate_uuid)

    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    template_id = Column(String, ForeignKey("templates.id"), nullable=True)

    requester_id = Column(String, ForeignKey("users.id"), nullable=False)
    department = Column(String, nullable=False)  # copied from requester at submission time

    amount = Column(Float, nullable=True)
    currency = Column(String, nullable=True, default="RWF")

    # Encrypted at rest — see app/core/encryption.py
    field_values_encrypted = Column(Text, nullable=False)   # JSON: { "Subject": "...", ... }
    signatures_encrypted = Column(Text, nullable=False, default="{}")  # JSON: { "staff": {...}, "daf": {...}, "sg": {...} }

    status = Column(SAEnum(RequestStatus), nullable=False, default=RequestStatus.PENDING)
    current_stage = Column(SAEnum(RequestStage), nullable=False, default=RequestStage.STAFF)
    rejected_at_stage = Column(String, nullable=True)  # "daf" | "sg" — which stage rejected it, if any

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    seen_by_approver = Column(Boolean, nullable=False, default=False)
    