from pydantic import BaseModel
from datetime import datetime


class UserListItem(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: str | None
    status: str
    is_department_head: bool
    
    class Config:
        from_attributes = True


class UpdateUserStatusRequest(BaseModel):
    status: str  # "active" | "disabled"


class AuditLogEntry(BaseModel):
    id: str
    action: str
    actor: str
    description: str
    department: str | None
    ipAddress: str | None
    timestamp: datetime


class ActivityEntry(BaseModel):
    action: str
    actor: str
    description: str
    department: str | None
    timestamp: datetime


class SessionEntry(BaseModel):
    id: str
    device: str
    location: str | None
    ipAddress: str
    timestamp: datetime