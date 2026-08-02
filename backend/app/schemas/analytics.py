from pydantic import BaseModel


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