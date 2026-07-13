import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle, FileText } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import axiosInstance from "../../services/axiosInstance";

const ICONS = { submitted: FileText, approved: CheckCircle2, rejected: XCircle };
const COLORS = { submitted: "text-gold", approved: "text-emerald", rejected: "text-danger" };

export default function RecentActivityFeed() {
  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", "recent"],
    queryFn: () => axiosInstance.get("/activity/recent").then((r) => r.data),
  });

  return (
    <GlassCard>
      <h2 className="font-display font-semibold mb-4">Recent activity</h2>
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-10 glass-panel animate-pulse" />)}
        </div>
      ) : activity?.length ? (
        <ul className="flex flex-col gap-3">
          {activity.map((item, i) => {
            const Icon = ICONS[item.action] || FileText;
            return (
              <li key={i} className="flex items-center gap-3 text-sm">
                <Icon className={`w-4 h-4 shrink-0 ${COLORS[item.action]}`} />
                <span className="flex-1">
                  <span className="font-medium">{item.actor}</span> {item.description}
                </span>
                <span className="text-xs text-ink-muted dark:text-ink-muted-dark shrink-0">
                  {new Date(item.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark">No recent activity.</p>
      )}
    </GlassCard>
  );
}