import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, FileText, CheckCircle2, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useUnreadNotifications, useUnreadCount, useMarkNotificationRead } from "../../hooks/useNotifications";
import { useAuthStore } from "../../store/authStore";

const ICONS = { new_request: FileText, approved: CheckCircle2, rejected: XCircle };
const COLORS = { new_request: "text-blue bg-blue-soft", approved: "text-green bg-green-soft", rejected: "text-danger bg-danger-soft" };

function timeAgo(dateStr) {
  const diffMins = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.round(diffHours / 24)}d`;
}

export default function NotificationBell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user?.role);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data: notifications } = useUnreadNotifications(5);
  const { data: unreadCount } = useUnreadCount();
  const markRead = useMarkNotificationRead();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleClick = (notif) => {
    markRead.mutate(notif.id);
    setOpen(false);

    if (notif.type === "new_request") {
      // DAF/SG land on their approval queue, filtered to "New"
      const targetPath = role === "daf" ? "/daf/approvals" : "/sg/approvals";
      navigate(targetPath, { state: { filter: "new", openRequestId: notif.requestId } });
    } else {
      // Requester (staff) lands on their own request list
      navigate("/staff/my-requests", { state: { openRequestId: notif.requestId } });
    }
  };

  const count = unreadCount || 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("common.notifications")}
        className="relative glass-panel cursor-pointer w-11 h-11 flex items-center justify-center rounded-full p-0"
      >
        <Bell className="w-4 h-4 text-ink dark:text-ink-dark" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-[10px] text-white flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass-overlay rounded-xl absolute right-0 mt-2 w-80 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-glass-border-light dark:border-glass-border-dark">
              <p className="text-sm font-semibold text-ink dark:text-ink-dark">{t("common.notifications")}</p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications?.length ? (
                notifications.map((n) => {
                  const Icon = ICONS[n.type] || FileText;
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleClick(n)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-surface-light dark:hover:bg-glass-dark transition-colors text-left border-b border-glass-border-light dark:border-glass-border-dark last:border-0"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${COLORS[n.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink dark:text-ink-dark leading-snug">{n.title}</p>
                        <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-snug mt-0.5 truncate">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-ink-muted dark:text-ink-muted-dark shrink-0 pt-0.5">
                        {timeAgo(n.createdAt)}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-8">
                  {t("dashboardHome.noActivity")}
                </p>
              )}
            </div>

            {count > 5 && (
              <button
                onClick={() => {
                  setOpen(false);
                  const targetPath = role === "staff" ? "/staff/my-requests" : (role === "daf" ? "/daf/approvals" : "/sg/approvals");
                  navigate(targetPath, { state: { filter: "new" } });
                }}
                className="w-full py-2.5 text-xs font-medium text-blue hover:bg-blue-soft transition-colors border-t border-glass-border-light dark:border-glass-border-dark"
              >
                View {count - 5} more
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}