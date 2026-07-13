import axiosInstance from "./axiosInstance";

export const approvalService = {
  getQueue: () => axiosInstance.get("/approvals/queue"),
  approve: ({ requestId, comment }) =>
    axiosInstance.post(`/approvals/${requestId}/approve`, { comment }),
  reject: ({ requestId, comment }) =>
    axiosInstance.post(`/approvals/${requestId}/reject`, { comment }),
};