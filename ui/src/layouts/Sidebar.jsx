import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, FilePlus2, ListChecks, Users, ShieldCheck, ClipboardList
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { FileStack } from "lucide-react";

// Role-aware nav config — each role only ever sees its own links
const NAV_BY_ROLE = {
  staff: [
    { to: "/staff", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/staff/new-request", label: "New Request", icon: FilePlus2 },
    { to: "/staff/my-requests", label: "My Requests", icon: ListChecks },
    { to: "/staff/templates", label: "Templates", icon: FileStack },
  ],
  daf: [
    { to: "/daf", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/daf/approvals", label: "Approval Queue", icon: ClipboardList },
  ],
  sg: [
    { to: "/sg", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/sg/approvals", label: "Approval Queue", icon: ClipboardList },
    { to: "/sg/admin", label: "User Management", icon: Users },
    { to: "/sg/audit-trail", label: "Audit Trail", icon: ShieldCheck },
  ],
};

export default function Sidebar() {
  const role = useAuthStore((s) => s.user?.role);
  const links = NAV_BY_ROLE[role] || [];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-full p-4">
      <div className="glass-panel flex-1 flex flex-col p-4 overflow-y-auto">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-emerald flex items-center justify-center font-display font-bold text-white">
            F
          </div>
          <span className="font-display font-semibold text-lg">FERWAFA</span>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? "bg-emerald text-white shadow-[0_4px_14px_rgba(15,169,104,0.3)]"
                  : "text-ink-muted dark:text-ink-muted-dark hover:bg-glass-light dark:hover:bg-glass-dark"}
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}