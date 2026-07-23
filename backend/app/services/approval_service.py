import json
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.request import RequestRecord, is_financial, RequestStage
from app.models.user import User
from app.models.template import Template
from app.core.encryption import encrypt_field, decrypt_field


def apply_signature(request: RequestRecord, role: str, user: User):
    """Pulls the approver's OWN stored signature and stamps it onto this
    specific request, permanently, with a real timestamp. The frontend
    never sends a signature image — it's always pulled server-side from
    the signer's profile at the exact moment of the action."""
    signatures = json.loads(decrypt_field(request.signatures_encrypted) or "{}")

    signature_image = decrypt_field(user.signature_image_encrypted)
    signatures[role] = {
        "image": signature_image,
        "name": user.name,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    request.signatures_encrypted = encrypt_field(json.dumps(signatures))


def build_request_out(request: RequestRecord, requester: User, db: Session) -> dict:
    template = db.query(Template).filter(Template.id == request.template_id).first()
    return {
        "id": request.id,
        "type": request.type,
        "title": request.title,
        "department": request.department,
        "requesterName": requester.name if requester else "Unknown",
        "amount": request.amount,
        "currency": request.currency,
        "status": request.status,
        "currentStage": request.current_stage,
        "rejectedAt": request.rejected_at_stage,
        "createdAt": request.created_at,
        "field_values": json.loads(decrypt_field(request.field_values_encrypted) or "{}"),
        "signatures": json.loads(decrypt_field(request.signatures_encrypted) or "{}"),
        "template": {"id": template.id, "name": template.name, "fields": template.fields} if template else None,
        "seenByApprover": request.seen_by_approver,

    }