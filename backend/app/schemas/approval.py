from pydantic import BaseModel


class ApprovalActionRequest(BaseModel):
    comment: str | None = None