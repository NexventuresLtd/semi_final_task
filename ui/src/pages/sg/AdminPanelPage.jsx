import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import GenerateInviteForm from "../../components/admin/GenerateInviteForm";
import UserManagementTable from "../../components/admin/UserManagementTable";

export default function AdminPanelPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet><title>{t("admin.userManagement")} — FERWAFA Approvals</title></Helmet>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t("admin.userManagement")}</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
            {t("admin.userManagementSubtitle")}
          </p>
        </div>
        <GenerateInviteForm />
      </div>

      <UserManagementTable />
    </>
  );
}