import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import StatsBentoGrid from "../../components/dashboard/StatsBentoGrid";
import RequestCard from "../../components/requests/RequestCard";
import DepartmentBadge from "../../components/requests/DepartmentBadge";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import { useMyRequests, useDashboardStats } from "../../hooks/useRequests";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from "react-i18next";

export default function StaffDashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: requests, isLoading: reqLoading } = useMyRequests();

  const statCards = [
    { key: "pending", label: t("dashboardHome.awaitingApproval"), value: stats?.pending ?? "–", span: "col-span-1" },
    { key: "approved", label: t("dashboardHome.approvedThisMonthAcc"), value: stats?.approved ?? "–", span: "col-span-1" },
    { key: "rejected", label: t("dashboardHome.rejectedThisMonthAcc"), value: stats?.rejected ?? "–", span: "col-span-1" },
    { key: "pending", label: t("dashboardHome.avgTurnaround"), value: stats?.avgTurnaround ?? "–", span: "col-span-1" },
  ];

  return (
    <>
      <Helmet><title>Dashboard — FERWAFA Approvals</title></Helmet>

      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
              {t("dashboard.welcomeBack", { name: user?.name?.split(" ")[0] })}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <DepartmentBadge department={user?.department} size="md" />
          </div>
        </div>
        <Link to="/staff/new-request">
           <Button className="gap-1.5"><Plus className="w-4 h-4" /> {t("dashboard.newRequest")}</Button>
        </Link>
      </div>

      <div className="mb-6 mt-6">
        {statsLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-surface-light animate-pulse" />)}
          </div>
        ) : (
          <StatsBentoGrid stats={statCards} />
        )}
      </div>

      <h2 className="font-display text-lg font-semibold text-ink mb-3">
        {t("dashboard.recentRequests")}
      </h2>
      {reqLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-xl bg-surface-light animate-pulse" />)}
        </div>
      ) : requests?.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.slice(0, 6).map((req) => (
            <RequestCard key={req.id} request={req} onClick={() => {}} />
          ))}
        </div>
      ) : (
        <GlassCard className="text-center py-10">
          <p className="text-ink-muted mb-4">
            {t("dashboard.noRequestsYet")}
          </p>
          <Link to="/staff/new-request">
            <Button variant="ghost">
            {t("dashboard.createFirstRequest")}
            </Button>
          </Link>
        </GlassCard>
      )}
    </>
  );
}