import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { manualSignupSchema } from "../../utils/validators";
import { authService } from "../../services/authService";

export default function ManualSignupForm({ email, inviteToken, onBack }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(manualSignupSchema) });

  const onSubmit = async ({ name, password }) => {
    try {
      await authService.signupManual({ invite_token: inviteToken, name, password });
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create account");
    }
  };

  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-ink-muted mb-4 hover:text-blue transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Set up your account</h1>
      <p className="text-sm text-ink-muted mb-8 font-mono">{email}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Full name" icon={User} error={errors.name?.message} registration={register("name")} />
        <FormField label="Password" icon={Lock} type="password" error={errors.password?.message} registration={register("password")} />
        <FormField label="Confirm password" icon={Lock} type="password" error={errors.confirmPassword?.message} registration={register("confirmPassword")} />

        <Button type="submit" loading={isSubmitting} className="w-full mt-2 gap-1.5">
          Create account <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </>
  );
}