import { useTranslation } from "react-i18next";
import InviteCodeForm from "../../components/auth/InviteCodeForm";
import AuthLayout from "../../components/layout/AuthLayout";

export default function CreateAccountPage() {
  const { t } = useTranslation();

  const taglines = t("auth.createAccountTaglines", { returnObjects: true });
  const workflowPoints = t("auth.createAccountWorkflowPoints", { returnObjects: true });

  return (
    <AuthLayout
      taglines={taglines}
      workflowPoints={workflowPoints}
      securityLine={t("auth.securityLineSgIssued")}
    >
      <InviteCodeForm />
    </AuthLayout>
  );
}