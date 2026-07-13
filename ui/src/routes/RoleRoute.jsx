import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * Guards role-specific routes, e.g. <RoleRoute allowed={["sg"]} />
 * Frontend gate only — the backend re-checks the JWT role claim on
 * every request regardless. Never trust this layer alone.
 */
export default function RoleRoute({ allowed = [] }) {
  const role = useAuthStore((s) => s.user?.role);

  if (!allowed.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}