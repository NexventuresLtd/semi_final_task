import axiosInstance from "./axiosInstance";

export const requestService = {
  getMyRequests: () => axiosInstance.get("/requests/mine"),
  getStats: () => axiosInstance.get("/requests/stats"),
  getRequestById: (id) => axiosInstance.get(`/requests/${id}`),
  createRequest: (payload) => axiosInstance.post("/requests", payload),
};