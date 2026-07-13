import axiosInstance from "./axiosInstance";

export const userService = {
  getProfile: () => axiosInstance.get("/users/me"),
  updateProfile: (payload) => axiosInstance.patch("/users/me", payload),
  changePassword: (payload) => axiosInstance.post("/users/me/change-password", payload),
};