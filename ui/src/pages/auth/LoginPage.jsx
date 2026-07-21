import { useTranslation } from "react-i18next";
import LoginForm from "../../components/auth/LoginForm";
import AuthLayout from "../../components/layout/AuthLayout";

export default function LoginPage() {
  const { t } = useTranslation();

  const taglines = t("auth.loginTaglines", { returnObjects: true });
  const workflowPoints = t("auth.loginWorkflowPoints", { returnObjects: true });

  return (
    <AuthLayout
      taglines={taglines}
      workflowPoints={workflowPoints}
      securityLine={t("auth.securityLineInviteOnly")}
    >
      <LoginForm />
    </AuthLayout>
  );
}