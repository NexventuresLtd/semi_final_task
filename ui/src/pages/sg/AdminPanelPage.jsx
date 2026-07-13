import { Helmet } from "react-helmet-async";
import GenerateInviteForm from "../../components/admin/GenerateInviteForm";
import UserManagementTable from "../../components/admin/UserManagementTable";

export default function AdminPanelPage() {
  return (
    <>
      <Helmet><title>User Management — FERWAFA Approvals</title></Helmet>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">User management</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
            Invite, disable, and manage access for FERWAFA staff.
          </p>
        </div>
        <GenerateInviteForm />
      </div>

      <UserManagementTable />
    </>
  );
}