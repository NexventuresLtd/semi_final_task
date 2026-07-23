import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False, index=True)  # who this notification is FOR

    type = Column(String, nullable=False)  # "new_request" | "approved" | "rejected"
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    request_id = Column(String, nullable=True)

    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))