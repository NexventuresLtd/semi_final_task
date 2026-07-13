import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userService } from "../services/userService";
import { useAuthStore } from "../store/authStore";

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (res) => {
      setUser(res.data.user);
      toast.success("Profile updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not update profile"),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => toast.success("Password updated"),
    onError: (err) => toast.error(err.response?.data?.message || "Could not change password"),
  });
}