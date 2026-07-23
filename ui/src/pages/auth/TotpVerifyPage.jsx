// ui/src/pages/auth/TotpVerifyPage.jsx
import TotpVerifyForm from "../../components/auth/TotpVerifyForm";
import AuthLayout from "../../components/layout/AuthLayout";

const TAGLINES = [
  "Almost there.",
  "One last step.",
  "Securing your session.",
];

const WORKFLOW_POINTS = [
  "Open Google Authenticator on your phone",
  "Enter the 6-digit code shown for FERWAFA",
  "Codes refresh every 30 seconds",
  "Everything protected behind two-factor authentication",
];

export default function TotpVerifyPage() {
  return (
    <AuthLayout
      taglines={TAGLINES}
      workflowPoints={WORKFLOW_POINTS}
      securityLine="Two-factor authentication · TOTP"
    >
      <TotpVerifyForm />
    </AuthLayout>
  );
}
