// ui/src/pages/auth/TotpSetupPage.jsx
import { useTranslation } from "react-i18next";
import TotpEnrollment from "../../components/auth/TotpEnrollment";
import AuthLayout from "../../components/layout/AuthLayout";

export default function TotpSetupPage() {
  const { t } = useTranslation();
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <AuthLayout
        taglines={t("auth.verifyEmailTaglines", { returnObjects: true })}
        workflowPoints={t("auth.verifyEmailWorkflowPoints", { returnObjects: true })}
        securityLine={t("auth.securityLineVerified")}
      >
        <TotpEnrollment />
        
      </AuthLayout>
    </div>
  );
}