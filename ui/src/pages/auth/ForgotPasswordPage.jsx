import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import AuthLayout from "../../components/layout/AuthLayout";

const TAGLINES = [
  "Locked out happens to everyone.",
  "We'll get you back in, securely.",
];

const WORKFLOW_POINTS = [
  "Enter the email tied to your FERWAFA account",
  "We'll send a one-time reset link if it exists",
  "The link expires in 30 minutes for your security",
  "Set a new password and sign back in",
];

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      taglines={TAGLINES}
      workflowPoints={WORKFLOW_POINTS}
      securityLine="Invitation-only · Two-factor protected"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}