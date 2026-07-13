import SignupMethodChoice from "../../components/auth/SignupMethodChoice";
import AuthLayout from "../../components/layout/AuthLayout";

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupMethodChoice />
    </AuthLayout>
  );
}