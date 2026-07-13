// ui/src/pages/auth/ResetPasswordPage.jsx
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import AuthLayout from "../../components/layout/AuthLayout";

export default function ResetPasswordPage() {
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
        <AuthLayout><ResetPasswordForm /></AuthLayout>
    </div>
  );
}