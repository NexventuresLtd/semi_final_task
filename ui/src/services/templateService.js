import axiosInstance from "./axiosInstance";

export const templateService = {
  getTemplates: () => axiosInstance.get("/templates"),
  createTemplate: (payload) => axiosInstance.post("/templates", payload),
  deleteTemplate: (id) => axiosInstance.delete(`/templates/${id}`),
};