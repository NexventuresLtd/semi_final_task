import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { KeyRound, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { totpSchema } from "../../utils/validators";
import { useAuthStore } from "../../store/authStore";

export default function TotpVerifyForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const verifyTotp = useAuthStore((s) => s.verifyTotp);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(totpSchema) });

  if (!state?.tempToken) return <Navigate to="/login" replace />;

  const onSubmit = async ({ code }) => {
    try {
      await verifyTotp({ tempToken: state.tempToken, code });
      const role = useAuthStore.getState().user?.role;
      navigate(`/${role}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Incorrect code");
    }
  };

  return (
    <div className="text-center">
      <div className="w-11 h-11 rounded-xl bg-blue-soft flex items-center justify-center mx-auto mb-4">
        <KeyRound className="w-5 h-5 text-blue" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Enter your code</h1>
      <p className="text-sm text-ink-muted mb-6">
        Open Google Authenticator and enter the 6-digit code for FERWAFA.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          {...register("code")}
          inputMode="numeric"
          maxLength={6}
          autoFocus
          placeholder="000000"
          className="w-full rounded-lg border border-glass-border-light px-4 py-3 text-center text-xl font-mono tracking-[0.5em] text-ink outline-none focus:border-blue transition-colors"
        />
        {errors.code && <p className="text-danger text-xs">{errors.code.message}</p>}

        <Button type="submit" loading={isSubmitting} className="w-full gap-1.5 cursor-pointer">
          Verify &amp; sign in <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}