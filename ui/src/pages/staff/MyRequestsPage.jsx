import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMyRequests } from "../../hooks/useRequests";
import RequestsTable from "../../components/requests/RequestsTable";
import RequestDetailModal from "../../components/requests/RequestDetailModal";

export default function MyRequestsPage() {
  const { state } = useLocation();
  const { data: requests, isLoading } = useMyRequests();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (state?.openRequestId && requests?.length) {
      const target = requests.find((r) => r.id === state.openRequestId);
      if (target) setSelected(target);
    }
  }, [state?.openRequestId, requests]);

  return (
    <>
      <Helmet><title>My Requests — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark mb-6">My requests</h1>

      <RequestsTable requests={requests || []} loading={isLoading} onSelect={setSelected} showDepartmentColumn={false} />

      <RequestDetailModal request={selected} onClose={() => setSelected(null)} showActions={false} />
    </>
  );
}