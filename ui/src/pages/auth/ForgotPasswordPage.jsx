// ui/src/pages/auth/ForgotPasswordPage.jsx
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import AuthLayout from "../../components/layout/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <AuthLayout><ForgotPasswordForm /></AuthLayout>
    </div>
  );
}