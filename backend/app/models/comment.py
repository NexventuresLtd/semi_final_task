import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class RequestComment(Base):
    __tablename__ = "request_comments"

    id = Column(String, primary_key=True, default=generate_uuid)
    request_id = Column(String, ForeignKey("requests.id"), nullable=False)

    author_id = Column(String, nullable=False)
    author_name = Column(String, nullable=False)
    author_role = Column(String, nullable=False)
    text = Column(Text, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))