import { useTranslation } from "react-i18next";
import SignupMethodChoice from "../../components/auth/SignupMethodChoice";
import AuthLayout from "../../components/layout/AuthLayout";

export default function SignupPage() {
  const { t } = useTranslation();

  return (
    <AuthLayout
        taglines={t("auth.signupTaglines", { returnObjects: true })}
        workflowPoints={t("auth.signupWorkflowPoints", { returnObjects: true })}
        securityLine={t("auth.securityLineVerified")}
      >
        <SignupMethodChoice />
      </AuthLayout>
  );
}
