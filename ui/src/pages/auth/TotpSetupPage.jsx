// ui/src/pages/auth/TotpSetupPage.jsx
import TotpEnrollment from "../../components/auth/TotpEnrollment";
import AuthLayout from "../../components/layout/AuthLayout";

export default function TotpSetupPage() {
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <AuthLayout><TotpEnrollment /></AuthLayout>
    </div>
  );
}