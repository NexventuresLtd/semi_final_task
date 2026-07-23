import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";

export function useUnreadNotifications(limit = 5) {
  return useQuery({
    queryKey: ["notifications", "unread", limit],
    queryFn: () => notificationService.list({ limit, unread_only: true }).then((r) => r.data),
    refetchInterval: 60000, // poll every 5s — simple, reliable, no websocket infra needed
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "count"],
    queryFn: () => notificationService.unreadCount().then((r) => r.data.count),
    refetchInterval: 60000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}