from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.permissions import get_current_user
from app.models.template import Template
from app.models.user import User
from app.schemas.template import CreateTemplateRequest, TemplateOut

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("", response_model=list[TemplateOut])
def list_templates(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Templates are shared across the federation, not private to one user —
    # anyone can browse and use any saved template for their request type.
    templates = db.query(Template).order_by(Template.created_at.desc()).all()
    return [TemplateOut(id=t.id, name=t.name, request_type=t.request_type, fields=t.fields) for t in templates]


@router.post("", response_model=TemplateOut)
def create_template(
    payload: CreateTemplateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    template = Template(
        name=payload.name,
        request_type=payload.request_type,
        created_by_user_id=user.id,
    )
    template.fields = [f.model_dump() for f in payload.fields]
    db.add(template)
    db.commit()
    db.refresh(template)
    return TemplateOut(id=template.id, name=template.name, request_type=template.request_type, fields=template.fields)


@router.delete("/{template_id}")
def delete_template(
    template_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    template = db.query(Template).filter(Template.id == template_id).first()
    if template is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Template not found")

    # Only the creator or SG can remove a shared template.
    if template.created_by_user_id != user.id and user.role != "sg":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "You can't delete a template you didn't create")

    db.delete(template)
    db.commit()
    return {"message": "Template deleted"}