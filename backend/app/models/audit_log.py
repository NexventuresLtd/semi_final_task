import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)

    action = Column(String, nullable=False)       # "approved" | "rejected" | "submitted" | "user_disabled" | "role_changed" | ...
    actor_id = Column(String, nullable=False)
    actor_name = Column(String, nullable=False)    # denormalized — survives even if the user is later disabled
    description = Column(String, nullable=False)
    department = Column(String, nullable=True)
    request_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))