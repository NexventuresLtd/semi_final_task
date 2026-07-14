import InviteCodeForm from "../../components/auth/InviteCodeForm";
import AuthLayout from "../../components/layout/AuthLayout";

const TAGLINES = [
  "You've been invited to FERWAFA Finance.",
  "A closed system, built for our staff only.",
  "From invitation to your first request in minutes.",
];

const WORKFLOW_POINTS = [
  "Enter the invitation code sent to your FERWAFA email",
  "Create your account with Google or a password of your own",
  "Confirm your email and set up two-factor authentication",
  "You're in — start submitting requests from your department",
];

export default function CreateAccountPage() {
  return (
    <AuthLayout
      taglines={TAGLINES}
      workflowPoints={WORKFLOW_POINTS}
      securityLine="Issued by the Secretary General · Single use only"
    >
      <InviteCodeForm />
    </AuthLayout>
  );
}