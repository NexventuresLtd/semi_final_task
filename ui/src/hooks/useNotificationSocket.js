import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

// Strip /api suffix so we hit ws://localhost:8000/api/ws/notifications
const BASE_WS = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/^http/, "ws");

const RECONNECT_DELAY_MS = 3_000;  // wait 3s before reconnecting
const MAX_RECONNECT_DELAY_MS = 30_000; // cap at 30s with exponential backoff

export function useNotificationSocket() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const attemptRef = useRef(0);
  const isMountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!isMountedRef.current || !isAuthenticated) return;

    const token = localStorage.getItem("ferwafa-access-token");
    if (!token) return;

    // Close any stale socket before opening a new one
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      socketRef.current.onclose = null; // prevent reconnect loop from old socket
      socketRef.current.close();
    }

    const url = `${BASE_WS}/ws/notifications?token=${token}`;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      attemptRef.current = 0; // reset backoff on successful connection
    };

    socket.onmessage = (event) => {
      try {
        const notif = JSON.parse(event.data);

        // Immediately bump the badge count in the cache without waiting
        // for a refetch — this makes the badge update feel instant.
        queryClient.setQueryData(["notifications", "count"], (old) =>
          typeof old === "number" ? old + 1 : 1
        );

        // Also add the new notification to the top of the unread list
        queryClient.setQueryData(["notifications", "unread", 5], (old) => {
          const incoming = {
            id: notif.id || `ws-${Date.now()}`,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            requestId: notif.requestId,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          // Prepend and cap at 5, as that's what the bell shows
          const prev = Array.isArray(old) ? old : [];
          return [incoming, ...prev].slice(0, 5);
        });

        // Also trigger a background refetch so the server state stays in sync
        queryClient.invalidateQueries({ queryKey: ["notifications"] });

        // Show toast notification with proper icon
        const icon =
          notif.type === "approved" ? "✅" :
          notif.type === "rejected" ? "❌" : "📩";
        toast(notif.title + (notif.message ? `\n${notif.message}` : ""), { icon });
      } catch {
        // Malformed message — ignore silently
      }
    };

    socket.onclose = (event) => {
      // 4001 = intentional close by the server (bad auth) — don't reconnect
      if (!isMountedRef.current || event.code === 4001) return;

      // Exponential backoff: 3s, 6s, 12s … up to 30s
      const delay = Math.min(
        RECONNECT_DELAY_MS * Math.pow(2, attemptRef.current),
        MAX_RECONNECT_DELAY_MS
      );
      attemptRef.current += 1;

      reconnectTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && isAuthenticated) connect();
      }, delay);
    };

    socket.onerror = () => {
      // onclose fires after onerror, so reconnect logic is handled there
    };
  }, [isAuthenticated, queryClient]);

  useEffect(() => {
    isMountedRef.current = true;

    if (isAuthenticated) {
      connect();
    }

    return () => {
      isMountedRef.current = false;
      clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.onclose = null; // suppress reconnect on intentional unmount
        socketRef.current.close();
      }
    };
  }, [isAuthenticated, connect]);
}