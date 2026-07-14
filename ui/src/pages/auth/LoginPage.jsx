import LoginForm from "../../components/auth/LoginForm";
import AuthLayout from "../../components/layout/AuthLayout";

const TAGLINES = [
  "Welcome back to the front office.",
  "Pick up right where you left off.",
  "Your requests, always one tap away.",
];

const WORKFLOW_POINTS = [
  "Check the live status of every request you've submitted",
  "Get notified the instant a request is approved or rejected",
  "Review and act on requests waiting for your decision",
  "Everything protected behind two-factor authentication",
];

export default function LoginPage() {
  return (
    <AuthLayout
      taglines={TAGLINES}
      workflowPoints={WORKFLOW_POINTS}
      securityLine="Invitation-only · Two-factor protected"
    >
      <LoginForm />
    </AuthLayout>
  );
}