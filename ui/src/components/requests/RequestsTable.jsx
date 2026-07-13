import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, ChevronLeft, ChevronRight, CalendarRange, SlidersHorizontal, X } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import RequestStatusBadge from "./RequestStatusBadge";
import DepartmentBadge from "./DepartmentBadge";
import { REQUEST_TYPES } from "../../utils/constants";

const PAGE_SIZE = 8;

export default function RequestsTable({ requests = [], loading, onSelect, showDepartmentColumn = true }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (dateFrom && new Date(r.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(r.createdAt) > new Date(dateTo + "T23:59:59")) return false;
      return true;
    });
  }, [requests, search, typeFilter, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = [typeFilter !== "all", statusFilter !== "all", dateFrom, dateTo].filter(Boolean).length;

  const clearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("FERWAFA — Requests Export", 14, 16);
    doc.setFontSize(9);
    doc.text(`Generated ${new Date().toLocaleString()} · ${filtered.length} record(s)`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Title", "Department", "Type", "Amount", "Status", "Stage", "Date"]],
      body: filtered.map((r) => [
        r.title,
        r.department || "—",
        r.type?.replace("_", " "),
        `${r.amount?.toLocaleString()} ${r.currency}`,
        r.status,
        r.currentStage,
        new Date(r.createdAt).toLocaleDateString(),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 111, 168] },
    });

    doc.save(`ferwafa-requests-${Date.now()}.pdf`);
  };

  return (
    <GlassCard className="p-0 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-glass-border-light dark:border-glass-border-dark flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search requests by title…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-glass-border-light dark:border-glass-border-dark bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue transition-colors"
            />
          </div>

          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
              activeFilterCount > 0 ? "border-blue text-blue bg-blue-soft" : "border-glass-border-light dark:border-glass-border-dark text-ink dark:text-ink-dark"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <Button variant="ghost" size="sm" onClick={exportPdf} className="gap-1.5">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>

        {/* Type tabs — navigation between request types */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[{ value: "all", label: "All types" }, ...REQUEST_TYPES].map((t) => (
            <button
              key={t.value}
              onClick={() => { setTypeFilter(t.value); setPage(1); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                typeFilter === t.value
                  ? "bg-blue text-white"
                  : "bg-surface-light dark:bg-glass-dark text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Expandable filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-end gap-3 pt-1">
                <div>
                  <label className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark mb-1 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3 py-1.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark mb-1 flex items-center gap-1">
                    <CalendarRange className="w-3 h-3" /> From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                    className="rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3 py-1.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark mb-1 block">To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                    className="rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3 py-1.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
                  />
                </div>

                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-danger hover:underline pb-2">
                    <X className="w-3.5 h-3.5" /> Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table — scrolls horizontally on small screens instead of breaking layout */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-ink-muted dark:text-ink-muted-dark border-b border-glass-border-light dark:border-glass-border-dark">
              <th className="px-4 py-3 font-medium">Title</th>
              {showDepartmentColumn && <th className="px-4 py-3 font-medium">Department</th>}
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-glass-border-light dark:border-glass-border-dark">
                  <td colSpan={7} className="px-4 py-3">
                    <div className="h-6 rounded bg-surface-light dark:bg-glass-dark animate-pulse" />
                  </td>
                </tr>
              ))
            ) : pageData.length ? (
              pageData.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onSelect?.(r)}
                  className="border-b border-glass-border-light dark:border-glass-border-dark last:border-0 cursor-pointer hover:bg-surface-light dark:hover:bg-glass-dark transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-ink dark:text-ink-dark">{r.title}</td>
                  {showDepartmentColumn && (
                    <td className="px-4 py-3"><DepartmentBadge department={r.department} /></td>
                  )}
                  <td className="px-4 py-3 text-ink-muted dark:text-ink-muted-dark capitalize">{r.type?.replace("_", " ")}</td>
                  <td className="px-4 py-3 font-mono text-ink dark:text-ink-dark">{r.amount?.toLocaleString()} {r.currency}</td>
                  <td className="px-4 py-3"><RequestStatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-ink-muted dark:text-ink-muted-dark capitalize">{r.currentStage}</td>
                  <td className="px-4 py-3 text-ink-muted dark:text-ink-muted-dark">
                    {new Date(r.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-muted dark:text-ink-muted-dark">
                  No requests match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-glass-border-light dark:border-glass-border-dark">
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
          Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-glass-border-light dark:border-glass-border-dark disabled:opacity-40 hover:bg-surface-light dark:hover:bg-glass-dark"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-ink dark:text-ink-dark px-2">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-glass-border-light dark:border-glass-border-dark disabled:opacity-40 hover:bg-surface-light dark:hover:bg-glass-dark"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}