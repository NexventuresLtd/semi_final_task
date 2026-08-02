// ui/src/pages/auth/VerifyEmailPage.jsx
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import EmailVerificationNotice from "../../components/auth/EmailVerificationNotice";
import EmailVerificationHandler from "../../components/auth/EmailVerificationHandler";
import AuthLayout from "../../components/layout/AuthLayout";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <AuthLayout
        taglines={t("auth.verifyEmailTaglines", { returnObjects: true })}
        workflowPoints={t("auth.verifyEmailWorkflowPoints", { returnObjects: true })}
        securityLine={t("auth.securityLineVerified")}
      >
        {token ? <EmailVerificationHandler /> : <EmailVerificationNotice />}
      </AuthLayout>
    </div>
  );
}