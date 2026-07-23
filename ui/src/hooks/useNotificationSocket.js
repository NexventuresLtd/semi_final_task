import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const WS_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/^http/, "ws");

export function useNotificationSocket() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("ferwafa-access-token");
    if (!token) return;

    const socket = new WebSocket(`${WS_URL}/ws/notifications?token=${token}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const notif = JSON.parse(event.data);

      // Instantly refresh the bell — no waiting for the next poll cycle.
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      toast(notif.title, {
        icon: notif.type === "approved" ? "✅" : notif.type === "rejected" ? "❌" : "📩",
      });
    };

    socket.onerror = () => {
      // Silent — the bell still works via the periodic refetch fallback
      // in useUnreadCount/useUnreadNotifications if the socket drops.
    };

    return () => socket.close();
  }, [isAuthenticated, queryClient]);
}