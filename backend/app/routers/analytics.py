from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from collections import defaultdict

from app.database import get_db
from app.core.permissions import require_role
from app.models.request import RequestRecord, RequestStatus
from app.models.audit_log import AuditLog
from app.schemas.analytics import (
    AnalyticsOverview, StatusBreakdownItem, DepartmentBreakdownItem,
    VolumeTrendItem, TurnaroundItem,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview", response_model=AnalyticsOverview)
def get_overview(user=Depends(require_role("sg", "daf")), db: Session = Depends(get_db)):
    all_requests = db.query(RequestRecord).all()

    # --- Status breakdown (pie) ---
    status_counts = defaultdict(int)
    for r in all_requests:
        status_counts[r.status] += 1
    status_breakdown = [StatusBreakdownItem(status=s, count=c) for s, c in status_counts.items()]

    # --- Department breakdown (pie) ---
    dept_counts = defaultdict(int)
    for r in all_requests:
        dept_counts[r.department or "unknown"] += 1
    department_breakdown = [DepartmentBreakdownItem(department=d, count=c) for d, c in dept_counts.items()]

    # --- Volume trend, last 30 days (line/bar) ---
    since = datetime.now(timezone.utc) - timedelta(days=30)
    logs = db.query(AuditLog).filter(
        AuditLog.action.in_(["submitted", "approved", "rejected"]),
        AuditLog.created_at >= since,
    ).all()

    by_day = defaultdict(lambda: {"submitted": 0, "approved": 0, "rejected": 0})
    for log in logs:
        day_key = log.created_at.strftime("%b %d")
        by_day[day_key][log.action] += 1

    sorted_days = sorted(by_day.keys(), key=lambda d: datetime.strptime(d, "%b %d"))
    volume_trend = [VolumeTrendItem(date=d, **by_day[d]) for d in sorted_days]

    # --- Avg turnaround per department (submission -> final decision) ---
    turnaround_by_dept = defaultdict(list)
    for r in all_requests:
        if r.status in (RequestStatus.APPROVED, RequestStatus.REJECTED):
            hours = (r.updated_at - r.created_at).total_seconds() / 3600
            turnaround_by_dept[r.department or "unknown"].append(hours)

    turnaround = [
        TurnaroundItem(department=dept, avgHours=round(sum(hrs) / len(hrs), 1))
        for dept, hrs in turnaround_by_dept.items() if hrs
    ]

    total_approved = status_counts.get(RequestStatus.APPROVED, 0)
    total_rejected = status_counts.get(RequestStatus.REJECTED, 0)
    total_pending = status_counts.get(RequestStatus.PENDING, 0)

    return AnalyticsOverview(
        statusBreakdown=status_breakdown,
        departmentBreakdown=department_breakdown,
        volumeTrend=volume_trend,
        turnaroundByDepartment=turnaround,
        totalRequests=len(all_requests),
        totalApproved=total_approved,
        totalRejected=total_rejected,
        totalPending=total_pending,
    )