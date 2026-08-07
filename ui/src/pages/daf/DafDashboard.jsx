import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatsBentoGrid from "../../components/dashboard/StatsBentoGrid";
import RecentActivityFeed from "../../components/dashboard/RecentActivityFeed";
import DepartmentRequestsBarChart from "../../components/dashboard/DepartmentRequestsBarChart";
import Button from "../../components/ui/Button";
import { useDashboardStats } from "../../hooks/useRequests";
import { useAuthStore } from "../../store/authStore";

export default function DafDashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: stats, isLoading } = useDashboardStats();

  const statCards = [
    { key: "pending", label: t("dashboardHome.yourReview"), value: stats?.pending ?? "–", span: "col-span-1" },
    { key: "approved", label: t("dashboardHome.approvedThisMonth"), value: stats?.approved ?? "–", span: "col-span-1" },
    { key: "rejected", label: t("dashboardHome.rejectedThisMonth"), value: stats?.rejected ?? "–", span: "col-span-1" },
    { key: "pending", label: t("dashboardHome.avgTimeToDecide"), value: stats?.avgTurnaround ?? "–", span: "col-span-1" },
  ];

  return (
    <>
      <Helmet><title>Dashboard — FERWAFA Approvals</title></Helmet>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {t("dashboard.welcomeBack", { name: user?.name?.split(" ")[0] })}
          </h1>
          <p className="text-sm text-ink-muted">
            {t("dashboardHome.directorOverview")}
          </p>
        </div>
        <Link to="/daf/approvals">
          <Button className="gap-1.5 cursor-pointer"><ClipboardList className="w-4 h-4 " /> {t("dashboard.reviewQueue")}</Button>
        </Link>
      </div>

      <div className="mb-6">
        {isLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-surface-light animate-pulse" />)}
          </div>
        ) : (
          <StatsBentoGrid stats={statCards} />
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DepartmentRequestsBarChart />
        </div>
        <RecentActivityFeed />
      </div>
    </>
  );
}