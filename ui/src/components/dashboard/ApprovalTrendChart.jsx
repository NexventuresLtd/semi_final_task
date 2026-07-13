import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import GlassCard from "../ui/GlassCard";
import axiosInstance from "../../services/axiosInstance";

export default function ApprovalTrendChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats", "trend"],
    queryFn: () => axiosInstance.get("/requests/trend").then((r) => r.data),
    // shape: [{ date: "Jul 1", approved: 4, rejected: 1 }, ...]
  });

  return (
    <GlassCard>
      <h2 className="font-display font-semibold text-ink mb-1">Approval trend</h2>
      <p className="text-xs text-ink-muted mb-4">Last 30 days</p>

      {isLoading ? (
        <div className="h-64 glass-panel animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="approvedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0FA968" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0FA968" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rejectedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5484D" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#E5484D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(20,24,38,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="approved" stroke="#0FA968" fill="url(#approvedFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="rejected" stroke="#E5484D" fill="url(#rejectedFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
}