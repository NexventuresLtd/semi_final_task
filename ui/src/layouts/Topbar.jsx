import { Bell, LogOut, Search } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuthStore } from "../../store/authStore";

export default function Topbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [unreadCount] = useState(3); // wired to notifications query later

  return (
    <header className="glass-panel flex items-center justify-between px-4 py-3 mb-6 sticky top-4 z-40">
      <button className="hidden sm:flex items-center gap-2 text-sm text-ink-muted dark:text-ink-muted-dark">
        <Search className="w-4 h-4" />
        <span>Search requests… <kbd className="font-mono text-xs opacity-60">⌘K</kbd></span>
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <LanguageSwitcher />
        <ThemeToggle />

        <button aria-label="Notifications" className="relative glass-panel w-11 h-11 flex items-center justify-center rounded-full p-0">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-[10px] text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-glass-border-light dark:border-glass-border-dark">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-tight">{user?.name}</p>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark capitalize">{user?.role}</p>
          </div>
          <button onClick={logout} aria-label="Log out" className="w-9 h-9 rounded-full hover:bg-danger-soft flex items-center justify-center">
            <LogOut className="w-4 h-4 text-danger" />
          </button>
        </div>
      </div>
    </header>
  );
}