import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMyRequests } from "../../hooks/useRequests";
import { useApprovalQueue } from "../../hooks/useApprovals";
import { useAuthStore } from "../../store/authStore";
import DepartmentBadge from "../requests/DepartmentBadge";
import RequestStatusBadge from "../requests/RequestStatusBadge";

export default function GlobalSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user?.role);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Staff search their own requests; DAF/SG search whatever is currently
  // in their approval queue — the two data sources each role already has
  // loaded elsewhere, so this adds no new backend calls.
  const { data: myRequests } = useMyRequests();
  const { data: queueRequests } = useApprovalQueue();
  const pool = role === "staff" ? myRequests : queueRequests;

  const results = query.trim()
    ? (pool || []).filter((r) => {
        const haystack = `${r.title} ${r.type} ${r.department}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      }).slice(0, 6)
    : [];

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goToResult = (request) => {
    const basePath = role === "staff" ? "/staff/my-requests" : `/${role}/approvals`;
    navigate(basePath, { state: { openRequestId: request.id } });
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="hidden sm:flex items-center gap-2 text-sm text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>{t("common.search")} <kbd className="font-mono text-xs opacity-60">⌘K</kbd></span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-[340px] glass-overlay rounded-xl z-50 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3.5 py-3 border-b border-glass-border-light dark:border-glass-border-dark">
              <Search className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("requests.searchPlaceholder")}
                className="flex-1 bg-transparent text-sm text-ink dark:text-ink-dark outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="shrink-0">
                  <X className="w-3.5 h-3.5 text-ink-muted dark:text-ink-muted-dark" />
                </button>
              )}
            </div>

            {query.trim() && (
              <div className="max-h-72 overflow-y-auto">
                {results.length ? (
                  results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => goToResult(r)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-surface-light dark:hover:bg-glass-dark transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-soft flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5 text-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">{r.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <DepartmentBadge department={r.department} />
                        </div>
                      </div>
                      <RequestStatusBadge status={r.status} />
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-6">
                    {t("common.noResults")}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}