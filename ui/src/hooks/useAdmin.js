import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminService } from "../services/adminService";

export function useUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminService.getUsers().then((r) => r.data),
  });
}

export function useGenerateInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.generateInvite,
    onSuccess: () => {
      toast.success("Invitation sent");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not send invite"),
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }) => adminService.toggleUserStatus(userId, status),
    onSuccess: (_, { status }) => {
      toast.success(status === "disabled" ? "User disabled" : "User re-enabled");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not update user"),
  });
}

export function useAuditTrail(params) {
  return useQuery({
    queryKey: ["admin", "audit-trail", params],
    queryFn: () => adminService.getAuditTrail(params).then((r) => r.data),
  });
}