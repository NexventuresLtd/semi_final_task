from pydantic import BaseModel


class TemplateField(BaseModel):
    label: str
    type: str  # text | textarea | number | date


class CreateTemplateRequest(BaseModel):
    name: str
    request_type: str
    fields: list[TemplateField]


class TemplateOut(BaseModel):
    id: str
    name: str
    request_type: str
    fields: list[dict]

    class Config:
        from_attributes = True