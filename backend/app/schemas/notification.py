from pydantic import BaseModel
from datetime import datetime


class NotificationOut(BaseModel):
    id: str
    type: str
    title: str
    message: str
    requestId: str | None
    isRead: bool
    createdAt: datetime

    class Config:
        from_attributes = True


class UnreadCountOut(BaseModel):
    count: int