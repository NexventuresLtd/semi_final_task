// ui/src/pages/auth/VerifyEmailPage.jsx
import { useSearchParams } from "react-router-dom";
import EmailVerificationNotice from "../../components/auth/EmailVerificationNotice";
import EmailVerificationHandler from "../../components/auth/EmailVerificationHandler";
import AuthLayout from "../../components/layout/AuthLayout";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <AuthLayout
        taglines={["Keeping your account secure."]}
        workflowPoints={[
          "Two-factor authentication protects every login",
          "Only you can approve or submit on your behalf",
        ]}
        securityLine="Invitation-only · Two-factor protected"
      >
        {token ? <EmailVerificationHandler /> : <EmailVerificationNotice />}
      </AuthLayout>
    </div>
  );
}