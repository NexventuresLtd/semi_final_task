import SignupMethodChoice from "../../components/auth/SignupMethodChoice";
import AuthLayout from "../../components/layout/AuthLayout";

export default function SignupPage() {
  return (
    <AuthLayout
        taglines={["Almost there.", "One more step to get started."]}
        workflowPoints={[
          "Verify your email or Google account",
          "Set up two-factor authentication",
          "Capture your digital signature",
          "Start submitting your first request",
        ]}
        securityLine="Verified invitation · Secure signup"
      >
        
      </AuthLayout>
  );
}