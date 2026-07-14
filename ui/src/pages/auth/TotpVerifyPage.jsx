// ui/src/pages/auth/TotpVerifyPage.jsx
import TotpVerifyForm from "../../components/auth/TotpVerifyForm";
import AuthLayout from "../../components/layout/AuthLayout";

export default function TotpVerifyPage() {
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <TotpVerifyForm />
    </div>
  );
}