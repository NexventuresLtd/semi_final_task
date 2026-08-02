import { NavLink } from "react-router-dom";
import { LayoutDashboard, FilePlus2, ListChecks, FileStack, Users, ShieldCheck, ClipboardList, User, Settings, CalendarDays, ClipboardCheck, Users2, BarChart3 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/logos/ferwafa-logo.png";
import { useTranslation } from "react-i18next";


export default function Sidebar() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const isRefereeHead = role === "staff" && user?.department === "referee" && user?.is_department_head;

  const NAV_BY_ROLE = {
    staff: [
      { to: "/staff", label: t("common.dashboardNav"), icon: LayoutDashboard, end: true },
      { to: "/staff/new-request", label: t("common.newRequestNav"), icon: FilePlus2 },
      { to: "/staff/my-requests", label: t("common.myRequestsNav"), icon: ListChecks },
      { to: "/staff/templates", label: t("common.templatesNav"), icon: FileStack },

    ],

    daf: [
      { to: "/daf", label: t("common.dashboardNav"), icon: LayoutDashboard, end: true },
      { to: "/daf/approvals", label: t("common.approvalQueueNav"), icon: ClipboardList },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
    ],

    sg: [
      { to: "/sg", label: t("common.dashboardNav"), icon: LayoutDashboard, end: true },
      { to: "/sg/approvals", label: t("common.approvalQueueNav"), icon: ClipboardList },
      { to: "/sg/admin", label: t("common.manageUsersNav"), icon: Users },
      { to: "/sg/audit-trail", label: t("common.auditTrailNav"), icon: ShieldCheck },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  };

  const REFEREE_NAV = [
    { to: "/staff/referee/calendar", label: "Assignment Calendar", icon: CalendarDays },
    { to: "/staff/referee/roster", label: "Referee Roster", icon: Users2 },
    { to: "/staff/referee/grading", label: "Grading", icon: ClipboardCheck },
  ];

  const ACCOUNT_NAV = [
    { to: "/profile", label: t("common.profileNav"), icon: User },
    { to: "/settings", label: t("common.settingsNav"), icon: Settings },
  ];

  const links = NAV_BY_ROLE[role] || [];
  const renderLink = ({ to, label, icon: Icon, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0
        ${isActive ? "bg-blue text-white" : "text-ink-muted dark:text-ink-muted-dark hover:bg-surface-light dark:hover:bg-glass-dark"}
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </NavLink>
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-full p-4">
      <div className="glass-panel flex-1 flex flex-col p-4 min-h-0">
        {/* Fixed header — never scrolls */}
        <div className="flex items-center gap-2.5 px-2 mb-6 pb-4 border-b border-glass-border-light dark:border-glass-border-dark shrink-0">
          <img src={logo} alt="FERWAFA" className="w-9 h-9 object-contain" />
          <div className="leading-tight">
            <p className="font-display font-semibold text-sm text-ink dark:text-ink-dark">FERWAFA</p>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">{t("common.appName")}</p>
          </div>
        </div>

        {/* Scrollable nav area — independent from body/topbar scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark px-3 mb-2">
            {t("common.general")}
          </p>
          <nav className="flex flex-col gap-1 mb-6">{links.map(renderLink)}</nav>

          {isRefereeHead && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark px-3 mb-2">
                Referee Management
              </p>
              <nav className="flex flex-col gap-1 mb-6">{REFEREE_NAV.map(renderLink)}</nav>
            </>
          )}

          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark px-3 mb-2">
            {t("common.profileSettings")}
          </p>
          <nav className="flex flex-col gap-1">{ACCOUNT_NAV.map(renderLink)}</nav>
        </div>
      </div>
    </aside>
  );
}