import axiosInstance from "./axiosInstance";

export const analyticsService = {
  getOverview: () => axiosInstance.get("/analytics/overview"),
  getDepartmentRequests: (weekOffset = 0) => 
    axiosInstance.get("/analytics/department-requests", { params: { week_offset: weekOffset } }),
};