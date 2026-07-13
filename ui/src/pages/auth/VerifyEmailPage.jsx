// ui/src/pages/auth/VerifyEmailPage.jsx
import EmailVerificationNotice from "../../components/auth/EmailVerificationNotice";
import AuthLayout from "../../components/layout/AuthLayout";

export default function VerifyEmailPage() {
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <AuthLayout><EmailVerificationNotice /></AuthLayout>
    </div>
  );
}