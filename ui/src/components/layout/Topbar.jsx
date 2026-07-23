import { Bell, LogOut, Search, User, Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import Avatar from "../ui/Avatar";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from "react-i18next";
import GlobalSearch from "./GlobalSearch";
import NotificationBell from "./NotificationBell";

export default function Topbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [unreadCount] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="glass-panel flex items-center justify-between px-4 py-3 mb-6 sticky top-4 z-40">
      <button className="hidden sm:flex items-center gap-2 text-sm text-ink-muted dark:text-ink-muted-dark">
          <GlobalSearch />        
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <LanguageSwitcher className="cursor-pointer" /> 
        <ThemeToggle className="cursor-pointer"/>

        <NotificationBell />

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 border-l cursor-pointer border-glass-border-light dark:border-glass-border-dark"
          >
            <Avatar name={user?.name} email={user?.email} size="sm" />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium leading-tight text-ink dark:text-ink-dark">{user?.name}</p>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark capitalize">{user?.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted dark:text-ink-muted-dark hidden sm:block" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="glass-panel absolute right-0 mt-2 w-48 py-1.5 z-50"
              >
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-ink dark:text-ink-dark hover:bg-surface-light dark:hover:bg-glass-dark rounded-lg mx-1.5">
                  <User className="w-4 h-4" /> {t("common.profileNav")}
                </Link>
                <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-ink dark:text-ink-dark hover:bg-surface-light dark:hover:bg-glass-dark rounded-lg mx-1.5">
                  <Settings className="w-4 h-4" /> {t("common.settingsNav")}
                </Link>
                <div className="h-px bg-glass-border-light dark:bg-glass-border-dark my-1.5 mx-1.5" />
                <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-soft rounded-lg mx-1.5 cursor-pointer">
                  <LogOut className="w-4 h-4" /> {t("common.signOut")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}