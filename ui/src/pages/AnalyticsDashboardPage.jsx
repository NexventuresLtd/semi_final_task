import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import { FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import { DEPARTMENT_CHART_LABEL } from "../utils/constants";
import { useAnalyticsOverview } from "../hooks/useAnalytics";

const STATUS_COLORS = { pending: "#C89A2C", approved: "#1A7A4C", rejected: "#C1454C" };
const DEPT_COLORS = ["#0F6FA8", "#1A7A4C", "#C89A2C", "#C1454C", "#7C5CBF", "#2A9D8F", "#E07A5F", "#3D5A80"];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <GlassCard className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">{value}</p>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{label}</p>
      </div>
    </GlassCard>
  );
}

export default function AnalyticsDashboardPage() {
  const { data, isLoading } = useAnalyticsOverview();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-surface-light dark:bg-glass-dark animate-pulse" />)}
      </div>
    );
  }

  const statusData = (data?.statusBreakdown || []).map((s) => ({ 
    name: s.status, 
    originalName: s.status,
    value: s.count 
  }));
  const deptData = (data?.departmentBreakdown || []).map((d) => ({
    name: DEPARTMENT_CHART_LABEL[d.department] || d.department,
    value: d.count,
  }));

  const statusFormatter = (value) => {
    const statusMap = {
      pending: t("analytics.pending"),
      approved: t("analytics.approved"),
      rejected: t("analytics.rejected"),
      submitted: t("analytics.submitted")
    };
    return statusMap[value] || value;
  };

  return (
    <>
      <Helmet><title>{t("analytics.title")} — FERWAFA Approvals</title></Helmet>

      <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark mb-1">{t("analytics.title")}</h1>
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-6">{t("analytics.subtitle")}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FileText} label={t("analytics.totalRequests")} value={data?.totalRequests ?? 0} color="bg-blue-soft text-blue" />
        <StatCard icon={CheckCircle2} label={t("analytics.approved")} value={data?.totalApproved ?? 0} color="bg-green-soft text-green" />
        <StatCard icon={XCircle} label={t("analytics.rejected")} value={data?.totalRejected ?? 0} color="bg-danger-soft text-danger" />
        <StatCard icon={Clock} label={t("analytics.pending")} value={data?.totalPending ?? 0} color="bg-gold-soft text-gold" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <GlassCard>
          <p className="text-sm font-medium text-ink dark:text-ink-dark mb-3">{t("analytics.statusBreakdown")}</p>
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="originalName" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || "#8A93A6"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(value, name) => [value, statusFormatter(name)]} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => statusFormatter(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-16">{t("analytics.noDataYet")}</p>
          )}
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-ink dark:text-ink-dark mb-3">{t("analytics.requestsByDepartment")}</p>
          {deptData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={deptData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {deptData.map((entry, i) => (
                    <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-16">{t("analytics.noDataYet")}</p>
          )}
        </GlassCard>
      </div>

      <GlassCard className="mb-6">
        <p className="text-sm font-medium text-ink dark:text-ink-dark mb-1">{t("analytics.requestVolumeTrend")}</p>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mb-4">{t("analytics.last30Days")}</p>
        {data?.volumeTrend?.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.volumeTrend}>
              <defs>
                <linearGradient id="submittedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F6FA8" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0F6FA8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="approvedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A7A4C" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1A7A4C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rejectedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C1454C" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C1454C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(value, name) => [value, statusFormatter(name)]} />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => statusFormatter(value)} />
              <Area type="monotone" dataKey="submitted" stroke="#0F6FA8" fill="url(#submittedFill)" strokeWidth={2} />
              <Area type="monotone" dataKey="approved" stroke="#1A7A4C" fill="url(#approvedFill)" strokeWidth={2} />
              <Area type="monotone" dataKey="rejected" stroke="#C1454C" fill="url(#rejectedFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-16">{t("analytics.noActivityLast30Days")}</p>
        )}
      </GlassCard>

      <GlassCard>
        <p className="text-sm font-medium text-ink dark:text-ink-dark mb-1">{t("analytics.avgApprovalTurnaround")}</p>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mb-4">{t("analytics.avgTurnaroundSubtitle")}</p>
        {data?.turnaroundByDepartment?.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.turnaroundByDepartment.map((t) => ({ ...t, name: DEPARTMENT_CHART_LABEL[t.department] || t.department }))}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: t("analytics.hrs"), angle: -90, position: "insideLeft", fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [`${v} ${t("analytics.hrs")}`, t("analytics.avgTurnaround")]} />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => statusFormatter(value)} />
              <Bar dataKey="avgHours" fill="#0F6FA8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-16">{t("analytics.noCompletedRequestsYet")}</p>
        )}
      </GlassCard>
    </>
  );
}