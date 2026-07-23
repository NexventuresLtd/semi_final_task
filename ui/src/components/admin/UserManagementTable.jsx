import { useState } from "react";
import { ShieldOff, ShieldCheck, KeyRound } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import DisableUserModal from "./DisableUserModal";
import DepartmentBadge from "../requests/DepartmentBadge";
import { useUsers, useToggleUserStatus } from "../../hooks/useAdmin";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  active: "bg-green-soft text-green",
  email_unverified: "bg-gold-soft text-gold",
  disabled: "bg-danger-soft text-danger",
};

export default function UserManagementTable() {
  const { data: users, isLoading } = useUsers();
  const toggleStatus = useToggleUserStatus();
  const [confirmingDisable, setConfirmingDisable] = useState(null);

  const handleResetTotp = async (userId) => {
    try {
      await adminService.resetUserTotp(userId);
      toast.success("2FA reset — user will re-enroll on next login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not reset 2FA");
    }
  };

  if (isLoading) return <div className="h-64 rounded-xl bg-surface-light animate-pulse" />;

  return (
    <GlassCard className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-ink-muted dark:text-ink-muted-dark border-b border-glass-border-light dark:border-glass-border-dark">
            <th className="pb-3 font-medium">Name</th>
            <th className="pb-3 font-medium">Email</th>
            <th className="pb-3 font-medium">Role</th>
            <th className="pb-3 font-medium">Department</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.id} className="border-b border-glass-border-light dark:border-glass-border-dark last:border-0">
              <td className="py-3 font-medium text-ink">{u.name}</td>
              <td className="py-3 font-mono text-xs text-ink-muted">{u.email}</td>
              <td className="py-3 capitalize text-ink">{u.role}</td>
              <td className="py-3">
                <DepartmentBadge department={u.department} />
              </td>
              <td className="py-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[u.status]}`}>
                  {u.status.replace("_", " ")}
                </span>
              </td>
              <td className="py-3">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleResetTotp(u.id)}
                    title="Reset 2FA"
                    className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-glass-dark cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark" />
                  </button>
                  {u.status === "disabled" ? (
                    <button
                      onClick={() => toggleStatus.mutate({ userId: u.id, status: "active" })}
                      title="Re-enable user"
                      className="p-2 rounded-lg hover:bg-green-soft cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-green" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmingDisable(u)}
                      title="Disable user"
                      className="p-2 rounded-lg hover:bg-danger-soft cursor-pointer"
                    >
                      <ShieldOff className="w-4 h-4 text-danger" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DisableUserModal
        user={confirmingDisable}
        onClose={() => setConfirmingDisable(null)}
        onConfirm={() => {
          toggleStatus.mutate({ userId: confirmingDisable.id, status: "disabled" });
          setConfirmingDisable(null);
        }}
      />
    </GlassCard>
  );
}