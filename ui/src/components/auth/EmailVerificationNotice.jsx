import { useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";
import Button from "../ui/Button";
import { authService } from "../../services/authService";

export default function EmailVerificationNotice() {
  const { state } = useLocation();
  const [cooldown, setCooldown] = useState(0);

  if (!state?.email) return <Navigate to="/login" replace />;

  const handleResend = async () => {
    try {
      await authService.resendVerificationEmail(state.email);
      toast.success("Verification email sent");
      setCooldown(30);
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) clearInterval(timer);
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resend email");
    }
  };

  return (
    <div className="text-center">
      <div className="w-11 h-11 rounded-xl bg-blue-soft flex items-center justify-center mx-auto mb-4">
        <MailCheck className="w-5 h-5 text-blue" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Check your inbox</h1>
      <p className="text-sm text-ink-muted mb-6">
        We sent a verification link to <span className="font-mono text-blue">{state.email}</span>.
        You won't be able to sign in until it's confirmed.
      </p>
      <Button variant="ghost" onClick={handleResend} disabled={cooldown > 0} className="w-full cursor-pointer">
        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
      </Button>
    </div>
  );
}