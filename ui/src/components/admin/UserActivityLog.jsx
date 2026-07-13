import { useQuery } from "@tanstack/react-query";
import { LogIn, MonitorSmartphone } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import axiosInstance from "../../services/axiosInstance";

export default function UserActivityLog({ userId }) {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["admin", "user-activity", userId],
    queryFn: () => axiosInstance.get(`/admin/users/${userId}/sessions`).then((r) => r.data),
    enabled: !!userId,
  });

  if (!userId) return null;

  return (
    <GlassCard>
      <h3 className="font-display font-semibold mb-3">Login activity</h3>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-10 glass-panel animate-pulse" />)}
        </div>
      ) : sessions?.length ? (
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 text-sm py-2 border-b border-glass-border-light dark:border-glass-border-dark last:border-0">
              <LogIn className="w-4 h-4 text-emerald shrink-0" />
              <div className="flex-1">
                <p className="flex items-center gap-1.5">
                  <MonitorSmartphone className="w-3.5 h-3.5 text-ink-muted dark:text-ink-muted-dark" />
                  {s.device} · {s.location || "Unknown location"}
                </p>
                <p className="text-xs text-ink-muted dark:text-ink-muted-dark font-mono mt-0.5">
                  {s.ipAddress} · {new Date(s.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark">No login history yet.</p>
      )}
    </GlassCard>
  );
}