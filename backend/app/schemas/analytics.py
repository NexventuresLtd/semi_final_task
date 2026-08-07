from pydantic import BaseModel
from typing import Optional


class StatusBreakdownItem(BaseModel):
    status: str
    count: int


class DepartmentBreakdownItem(BaseModel):
    department: str
    count: int


class VolumeTrendItem(BaseModel):
    date: str
    submitted: int
    approved: int
    rejected: int


class TurnaroundItem(BaseModel):
    department: str
    avgHours: float


class AnalyticsOverview(BaseModel):
    statusBreakdown: list[StatusBreakdownItem]
    departmentBreakdown: list[DepartmentBreakdownItem]
    volumeTrend: list[VolumeTrendItem]
    turnaroundByDepartment: list[TurnaroundItem]
    totalRequests: int
    totalApproved: int
    totalRejected: int
    totalPending: int


class DepartmentDayData(BaseModel):
    day: int  # 0=Monday, 6=Sunday
    count: int


class DepartmentWeeklyData(BaseModel):
    department: str
    days: list[DepartmentDayData]
    total: int
    percentage: float


class DepartmentRequestsResponse(BaseModel):
    weekStart: str
    weekEnd: str
    departments: list[DepartmentWeeklyData]
    totalRequests: int