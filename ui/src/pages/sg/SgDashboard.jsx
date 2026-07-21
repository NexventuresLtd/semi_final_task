import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ClipboardList, Users, ShieldCheck } from "lucide-react";
import StatsBentoGrid from "../../components/dashboard/StatsBentoGrid";
import ApprovalTrendChart from "../../components/dashboard/ApprovalTrendChart";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import { useDashboardStats } from "../../hooks/useRequests";
import { useAuthStore } from "../../store/authStore";

export default function SgDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: stats, isLoading } = useDashboardStats();

  const statCards = [
    { key: "pending", label: "Awaiting your review", value: stats?.pending ?? "–", span: "col-span-1" },
    { key: "approved", label: "You approved this month", value: stats?.approved ?? "–", span: "col-span-1" },
    { key: "rejected", label: "You rejected this month", value: stats?.rejected ?? "–", span: "col-span-1" },
    { key: "users", label: "Active users", value: stats?.activeUsers ?? "–", span: "col-span-1" },
  ];

  return (
    <>
      <Helmet><title>Dashboard — FERWAFA Approvals</title></Helmet>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-ink-muted">
            Final-stage overview across Club Licensing, Referee, Development, Competition, Legal, Marketing, HR, and Finance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/sg/approvals">
            <Button variant="ghost" className="gap-1.5 cursor-pointer"><ClipboardList className="w-4 h-4" /> Review queue</Button>
          </Link>
          <Link to="/sg/admin">
            <Button className="gap-1.5 cursor-pointer"><Users className="w-4 h-4 " /> Manage users</Button>
          </Link>
        </div>
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
          <ApprovalTrendChart />
        </div>
        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-gold-soft flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4 text-gold" />
            </div>
            <h3 className="font-display font-semibold text-ink mb-1.5">Audit trail</h3>
            <p className="text-sm text-ink-muted mb-4">
              Every approval, rejection, and account change — timestamped and unalterable.
            </p>
          </div>
          <Link to="/sg/audit-trail">
            <Button variant="ghost" className="w-full cursor-pointer">View full trail</Button>
          </Link>
        </GlassCard>
      </div>
    </>
  );
}