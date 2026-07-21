from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.permissions import get_current_user
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.admin import ActivityEntry

router = APIRouter(prefix="/activity", tags=["activity"])


@router.get("/recent", response_model=list[ActivityEntry])
def get_recent_activity(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(AuditLog).filter(AuditLog.action.in_(["submitted", "approved", "rejected"]))

    # Staff only see activity on their own requests; DAF/SG see everything
    # federation-wide, since they review across all departments.
    if user.role == "staff":
        query = query.filter(AuditLog.actor_id == user.id)

    logs = query.order_by(AuditLog.created_at.desc()).limit(15).all()

    action_map = {"submitted": "submitted", "approved": "approved", "rejected": "rejected"}
    return [
        ActivityEntry(
            action=action_map.get(log.action, log.action),
            actor=log.actor_name,
            description=log.description,
            department=log.department,
            timestamp=log.created_at,
        )
        for log in logs
    ]