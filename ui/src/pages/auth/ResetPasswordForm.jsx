import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { z } from "zod";
import { Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { authService } from "../../services/authService";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Include at least one uppercase letter").regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  if (!token) return <Navigate to="/forgot-password" replace />;

  const onSubmit = async ({ password }) => {
    try {
      await authService.resetPassword(token, password);
      toast.success("Password updated. Please sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      const status = err.response?.status;
      toast.error(status === 410 ? "This reset link has expired. Request a new one." : "Could not reset password. The link may be invalid.");
    }
  };

  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Choose a new password</h1>
      <p className="text-sm text-ink-muted mb-8">Make it something you haven't used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="New password" icon={Lock} type="password" error={errors.password?.message} registration={register("password")} />
        <FormField label="Confirm new password" icon={Lock} type="password" error={errors.confirmPassword?.message} registration={register("confirmPassword")} />
        <Button type="submit" loading={isSubmitting} className="w-full mt-2 gap-1.5">
          Update password <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </>
  );
}