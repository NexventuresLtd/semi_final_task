import uuid
import json
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Template(Base):
    __tablename__ = "templates"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    request_type = Column(String, nullable=False)  # memo | purchase_order | reimbursement | travel_advance | permission
    fields_json = Column(Text, nullable=False)      # [{ "label": "...", "type": "text" }, ...]

    created_by_user_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def fields(self) -> list[dict]:
        return json.loads(self.fields_json)

    @fields.setter
    def fields(self, value: list[dict]):
        self.fields_json = json.dumps(value)