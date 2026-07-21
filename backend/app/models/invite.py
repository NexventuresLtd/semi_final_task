import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Enum as SAEnum
from app.database import Base
from app.models.user import UserRole, Department


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Invite(Base):
    __tablename__ = "invites"

    id = Column(String, primary_key=True, default=generate_uuid)

    email = Column(String, nullable=False, index=True)
    role = Column(SAEnum(UserRole), nullable=False)
    department = Column(SAEnum(Department), nullable=True)

    code_hash = Column(String, nullable=False)   # never store the raw code
    attempts_remaining = Column(Integer, nullable=False, default=5)

    used = Column(Boolean, nullable=False, default=False)
    expires_at = Column(DateTime, nullable=False)

    created_by_user_id = Column(String, nullable=False)  # SG who issued it
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))