import axiosInstance from "./axiosInstance";

export const adminService = {
  getUsers: () => axiosInstance.get("/admin/users"),
  generateInvite: (payload) => axiosInstance.post("/admin/invites", payload),
  toggleUserStatus: (userId, status) =>
    axiosInstance.patch(`/admin/users/${userId}/status`, { status }),
  resetUserTotp: (userId) => axiosInstance.post(`/admin/users/${userId}/reset-2fa`),
  getAuditTrail: (params) => axiosInstance.get("/admin/audit-trail", { params }),
};