import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import DashboardShell from "../components/layout/DashboardShell";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Public / auth pages
import LandingPage from "../pages/LandingPage";
import CreateAccountPage from "../pages/auth/CreateAccountPage";
import SignupPage from "../pages/auth/SignupPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import TotpSetupPage from "../pages/auth/TotpSetupPage";
import TotpVerifyPage from "../pages/auth/TotpVerifyPage";

// Role dashboards
import StaffDashboard from "../pages/staff/StaffDashboard";
import NewRequestPage from "../pages/staff/NewRequestPage";
import MyRequestsPage from "../pages/staff/MyRequestsPage";
import TemplatesPage from "../pages/staff/TemplatesPage";

import DafDashboard from "../pages/daf/DafDashboard";
import DafApprovalQueuePage from "../pages/daf/DafApprovalQueuePage";

import SgDashboard from "../pages/sg/SgDashboard";
import SgApprovalQueuePage from "../pages/sg/SgApprovalQueuePage";
import AdminPanelPage from "../pages/sg/AdminPanelPage";
import AuditTrailPage from "../pages/sg/AuditTrailPage"

import NotFoundPage from "../pages/NotFoundPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/create-account/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/totp-verify" element={<TotpVerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* TOTP enrollment needs auth but no full session yet — protected separately */}
      <Route element={<ProtectedRoute />}>
        <Route path="/totp-setup" element={<TotpSetupPage />} />

        {/* Authenticated app shell */}
        <Route element={<DashboardShell />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          {/* staff */}
          <Route element={<RoleRoute allowed={["staff"]} />}>
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/new-request" element={<NewRequestPage />} />
            <Route path="/staff/my-requests" element={<MyRequestsPage />} />
            <Route path="/staff/templates" element={<TemplatesPage />} />
          </Route>

          {/* DAF */}
          <Route element={<RoleRoute allowed={["daf"]} />}>
            <Route path="/daf" element={<DafDashboard />} />
            <Route path="/daf/approvals" element={<DafApprovalQueuePage />} />
          </Route>

          {/* SG (also has admin panel) */}
          <Route element={<RoleRoute allowed={["sg"]} />}>
            <Route path="/sg" element={<SgDashboard />} />
            <Route path="/sg/approvals" element={<SgApprovalQueuePage />} />
            <Route path="/sg/admin" element={<AdminPanelPage />} />
            <Route path="/sg/audit-trail" element={<AuditTrailPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}