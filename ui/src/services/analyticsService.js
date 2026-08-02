import axiosInstance from "./axiosInstance";

export const analyticsService = {
  getOverview: () => axiosInstance.get("/analytics/overview"),
};