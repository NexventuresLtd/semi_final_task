import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { z } from "zod";
import toast from "react-hot-toast";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import { authService } from "../../services/authService";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
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
      if (status === 410) {
        toast.error("This reset link has expired. Request a new one.");
      } else {
        toast.error("Could not reset password. The link may be invalid.");
      }
    }
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto">
      <h1 className="font-display text-2xl font-semibold mb-1">Choose a new password</h1>
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-6">
        Make it something you haven't used before.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">New password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full glass-panel px-4 py-2.5 text-sm bg-transparent focus:outline-none"
          />
          {errors.password && (
            <p className="text-danger text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Confirm new password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full glass-panel px-4 py-2.5 text-sm bg-transparent focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-danger text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full mt-2 cursor-pointer">
          Update password
        </Button>
      </form>
    </GlassCard>
  );
}