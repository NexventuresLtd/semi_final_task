import { Helmet } from "react-helmet-async";
import SystemAuditTrail from "../../components/admin/SystemAuditTrail";

export default function AuditTrailPage() {
  return (
    <>
      <Helmet><title>Audit Trail — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold mb-6">Audit trail</h1>
      <SystemAuditTrail />
    </>
  );
}