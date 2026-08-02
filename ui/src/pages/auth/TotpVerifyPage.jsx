import { useTranslation } from "react-i18next";
import TotpVerifyForm from "../../components/auth/TotpVerifyForm";
import AuthLayout from "../../components/layout/AuthLayout";

export default function TotpVerifyPage() {
  const { t } = useTranslation();
  return (
    <AuthLayout
      taglines={t("auth.totpVerifyTaglines", { returnObjects: true })}
      workflowPoints={t("auth.totpVerifyWorkflowPoints", { returnObjects: true })}
      securityLine={t("auth.totpVerifySecurityLine")}
    >
      <TotpVerifyForm />
    </AuthLayout>
  );
}
