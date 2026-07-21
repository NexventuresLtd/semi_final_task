import { useTranslation } from "react-i18next";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import AuthLayout from "../../components/layout/AuthLayout";

export default function ResetPasswordPage() {
  const { t } = useTranslation();

  const taglines = t("auth.resetPasswordTaglines", { returnObjects: true });
  const workflowPoints = t("auth.resetPasswordWorkflowPoints", { returnObjects: true });

  return (
    <AuthLayout
      taglines={taglines}
      workflowPoints={workflowPoints}
      securityLine={t("auth.securityLineInviteOnly")}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}