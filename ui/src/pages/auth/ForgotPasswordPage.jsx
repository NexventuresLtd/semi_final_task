import { useTranslation } from "react-i18next";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import AuthLayout from "../../components/layout/AuthLayout";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  return (
    <AuthLayout
      taglines={t("auth.forgotPasswordTaglines", { returnObjects: true })}
      workflowPoints={t("auth.forgotPasswordWorkflowPoints", { returnObjects: true })}
      securityLine={t("auth.securityLineVerified")}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}