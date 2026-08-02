import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";

export function useUnreadNotifications(limit = 5) {
  return useQuery({
    queryKey: ["notifications", "unread", limit],
    queryFn: () => notificationService.list({ limit, unread_only: true }).then((r) => r.data),
    refetchInterval: 30_000, // poll every 30s as reliable fallback; WebSocket handles real-time
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "count"],
    queryFn: () => notificationService.unreadCount().then((r) => r.data.count),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}