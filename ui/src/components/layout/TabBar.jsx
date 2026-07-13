import { NavLink } from "react-router-dom";
import { LayoutDashboard, FilePlus2, ListChecks, FileStack, Users, ShieldCheck, ClipboardList, User } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const NAV_BY_ROLE = {
  staff: [
    { to: "/staff", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/staff/new-request", label: "New", icon: FilePlus2 },
    { to: "/staff/my-requests", label: "Requests", icon: ListChecks },
    { to: "/staff/templates", label: "Templates", icon: FileStack },
  ],
  daf: [
    { to: "/daf", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/daf/approvals", label: "Queue", icon: ClipboardList },
  ],
  sg: [
    { to: "/sg", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/sg/approvals", label: "Queue", icon: ClipboardList },
    { to: "/sg/admin", label: "Users", icon: Users },
    { to: "/sg/audit-trail", label: "Audit", icon: ShieldCheck },
  ],
};

export default function TabBar() {
  const role = useAuthStore((s) => s.user?.role);
  const links = [...(NAV_BY_ROLE[role] || []), { to: "/profile", label: "Profile", icon: User }];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
      <div className="glass-panel flex items-center justify-around px-1 py-2 overflow-x-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors shrink-0
              ${isActive ? "text-blue" : "text-ink-muted dark:text-ink-muted-dark"}
            `}
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}