import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * Guards role-specific routes, e.g. <RoleRoute allowed={["sg"]} />
 * Frontend gate only — the backend re-checks the JWT role claim on
 * every request regardless. Never trust this layer alone.
 */
export default function RoleRoute({ allowed = [] }) {
  const { user, isLoading } = useAuthStore();

  // Wait for fetchSession to finish before making a role decision.
  // Without this guard, user is null during the async session restore and
  // RoleRoute would immediately redirect to /unauthorized on every hard reload.
  if (isLoading) return null;

  if (!allowed.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}