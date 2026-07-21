import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class LoginSession(Base):
    __tablename__ = "login_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False, index=True)

    device = Column(String, nullable=True)     # parsed from User-Agent
    ip_address = Column(String, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))