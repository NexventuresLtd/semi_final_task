import InviteCodeForm from "../../components/auth/InviteCodeForm";
import AuthLayout from "../../components/layout/AuthLayout";

export default function CreateAccountPage() {
  return (
    <AuthLayout>
      <InviteCodeForm />
    </AuthLayout>
  );
}