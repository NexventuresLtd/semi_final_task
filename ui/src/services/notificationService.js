import axiosInstance from "./axiosInstance";

export const notificationService = {
  list: (params) => axiosInstance.get("/notifications", { params }),
  unreadCount: () => axiosInstance.get("/notifications/unread-count"),
  markRead: (id) => axiosInstance.post(`/notifications/${id}/read`),
  markAllRead: () => axiosInstance.post("/notifications/read-all"),
};