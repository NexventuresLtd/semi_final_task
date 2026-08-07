from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from typing import Optional

from app.database import get_db
from app.core.permissions import require_role
from app.models.request import RequestRecord, RequestStatus
from app.models.audit_log import AuditLog
from app.schemas.analytics import (
    AnalyticsOverview, StatusBreakdownItem, DepartmentBreakdownItem,
    VolumeTrendItem, TurnaroundItem,
    DepartmentDayData, DepartmentWeeklyData, DepartmentRequestsResponse,
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


@router.get("/department-requests", response_model=DepartmentRequestsResponse)
def get_department_requests_by_week(
    week_offset: int = Query(0, ge=0, description="Weeks offset from current week (0=current, 1=previous, etc.)"),
    user=Depends(require_role("sg", "daf")),
    db: Session = Depends(get_db)
):
    """
    Get department request data for a specific week.
    week_offset: 0 for current week, 1 for previous week, etc.
    """
    # Calculate week start and end dates
    today = datetime.now(timezone.utc)
    # Get Monday of the current week
    current_week_start = today - timedelta(days=today.weekday())
    current_week_start = current_week_start.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Calculate the requested week
    week_start = current_week_start - timedelta(weeks=week_offset)
    week_end = week_start + timedelta(days=6, hours=23, minutes=59, seconds=59)
    
    # Query requests for the week
    requests = db.query(RequestRecord).filter(
        RequestRecord.created_at >= week_start,
        RequestRecord.created_at <= week_end
    ).all()
    
    # Group by department and day of week
    dept_day_counts = defaultdict(lambda: defaultdict(int))
    total_by_dept = defaultdict(int)
    
    for req in requests:
        dept = req.department or "unknown"
        day_of_week = req.created_at.weekday()  # 0=Monday, 6=Sunday
        dept_day_counts[dept][day_of_week] += 1
        total_by_dept[dept] += 1
    
    total_requests = len(requests)
    
    # Build response
    departments = []
    for dept in sorted(dept_day_counts.keys()):
        dept_total = total_by_dept[dept]
        percentage = (dept_total / total_requests * 100) if total_requests > 0 else 0
        
        # Build day data (ensure all 7 days are present)
        days = []
        for day in range(7):
            count = dept_day_counts[dept].get(day, 0)
            days.append(DepartmentDayData(day=day, count=count))
        
        departments.append(DepartmentWeeklyData(
            department=dept,
            days=days,
            total=dept_total,
            percentage=round(percentage, 1)
        ))
    
    return DepartmentRequestsResponse(
        weekStart=week_start.strftime("%Y-%m-%d"),
        weekEnd=week_end.strftime("%Y-%m-%d"),
        departments=departments,
        totalRequests=total_requests
    )