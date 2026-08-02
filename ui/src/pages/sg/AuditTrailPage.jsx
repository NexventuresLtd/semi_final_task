import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import SystemAuditTrail from "../../components/admin/SystemAuditTrail";

export default function AuditTrailPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet><title>{t("admin.auditTrailTitle")} — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold mb-6">{t("admin.auditTrailTitle")}</h1>
      <SystemAuditTrail />
    </>
  );
}