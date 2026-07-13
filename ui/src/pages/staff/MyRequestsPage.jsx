import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMyRequests } from "../../hooks/useRequests";
import RequestsTable from "../../components/requests/RequestsTable";
import RequestDetailDrawer from "../../components/requests/RequestDetailDrawer";

export default function MyRequestsPage() {
  const { data: requests, isLoading } = useMyRequests();
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Helmet><title>My Requests — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark mb-6">My requests</h1>

      <RequestsTable
        requests={requests || []}
        loading={isLoading}
        onSelect={setSelected}
        showDepartmentColumn={false}
      />

      <RequestDetailDrawer request={selected} onClose={() => setSelected(null)} />
    </>
  );
}