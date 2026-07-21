from pydantic import BaseModel
from datetime import datetime


class CreateRequestPayload(BaseModel):
    template_id: str
    type: str
    title: str
    field_values: dict


class SignatureOut(BaseModel):
    image: str
    name: str
    timestamp: str


class RequestOut(BaseModel):
    id: str
    type: str
    title: str
    department: str
    requesterName: str
    amount: float | None
    currency: str | None
    status: str
    currentStage: str
    rejectedAt: str | None
    createdAt: datetime
    field_values: dict
    signatures: dict
    template: dict | None