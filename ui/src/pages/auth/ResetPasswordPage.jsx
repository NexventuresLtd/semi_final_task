import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import AuthLayout from "../../components/layout/AuthLayout";

const TAGLINES = [
  "Almost done — choose a new password.",
  "One last step and you're back in.",
];

const WORKFLOW_POINTS = [
  "Choose a password you haven't used before",
  "At least 8 characters, one capital letter, one number",
  "You'll be signed out everywhere else once it's changed",
];

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      taglines={TAGLINES}
      workflowPoints={WORKFLOW_POINTS}
      securityLine="Invitation-only · Two-factor protected"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}