import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RequestsTable from "../requests/RequestsTable";
import RequestDetailModal from "../requests/RequestDetailModal";
import axiosInstance from "../../services/axiosInstance";

const TAB_KEYS = [
  { key: "all", translationKey: "tabAll" },
  { key: "approved", translationKey: "tabApproved" },
  { key: "pending_seen", translationKey: "tabPendingSeen" },
  { key: "new", translationKey: "tabNew" },
];

export default function ApprovalQueue({ requests, onApprove, onReject, isSubmitting }) {
  const { state } = useLocation();
  const { t } = useTranslation();
  const [tab, setTab] = useState(state?.filter || "all");
  const [selected, setSelected] = useState(null);

  const tabs = useMemo(() => TAB_KEYS.map(tabKey => ({
    key: tabKey.key,
    label: t(`approvals.${tabKey.translationKey}`)
  })), [t]);

  useEffect(() => {
    if (state?.openRequestId && requests?.length) {
      const target = requests.find((r) => r.id === state.openRequestId);
      if (target) {
        setSelected(target);
        axiosInstance.post(`/requests/${target.id}/seen`).catch(() => {});
      }
    }
  }, [state?.openRequestId, requests]);

  const filtered = useMemo(() => {
    if (!requests) return [];
    switch (tab) {
      case "approved": return requests.filter((r) => r.status === "approved");
      case "pending_seen": return requests.filter((r) => r.status === "pending" && r.seenByApprover);
      case "new": return requests.filter((r) => !r.seenByApprover);
      default: return requests;
    }
  }, [requests, tab]);

  const handleSelect = (request) => {
    setSelected(request);
    if (!request.seenByApprover) {
      axiosInstance.post(`/requests/${request.id}/seen`).catch(() => {});
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              tab === t.key ? "bg-blue text-white" : "bg-surface-light dark:bg-glass-dark text-ink-muted dark:text-ink-muted-dark"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <RequestsTable requests={filtered} loading={false} onSelect={handleSelect} showDepartmentColumn />

      <RequestDetailModal
        request={selected}
        onClose={() => setSelected(null)}
        onApprove={onApprove}
        onReject={onReject}
        isSubmitting={isSubmitting}
        showActions
      />
    </div>
  );
}