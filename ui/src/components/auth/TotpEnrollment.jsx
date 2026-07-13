import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { totpSchema } from "../../utils/validators";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

export default function TotpEnrollment() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [otpauthUrl, setOtpauthUrl] = useState(null);
  const [loadingQr, setLoadingQr] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(totpSchema) });

  useEffect(() => {
    authService
      .totpEnrollStart()
      .then(({ data }) => setOtpauthUrl(data.otpauth_url))
      .catch(() => toast.error("Could not start 2FA setup"))
      .finally(() => setLoadingQr(false));
  }, []);

  const onSubmit = async ({ code }) => {
    try {
      const { data } = await authService.totpEnrollConfirm(code);
      setUser(data.user);
      toast.success("Two-factor authentication enabled");
      navigate(`/${data.user.role}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code — try again");
    }
  };

  return (
    <div className="text-center">
      <div className="w-11 h-11 rounded-xl bg-blue-soft flex items-center justify-center mx-auto mb-4">
        <ShieldCheck className="w-5 h-5 text-blue" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Secure your account</h1>
      <p className="text-sm text-ink-muted mb-6">
        Scan this with Google Authenticator, then enter the 6-digit code to finish setup.
      </p>

      <div className="flex justify-center mb-6">
        {loadingQr ? (
          <div className="w-44 h-44 rounded-xl bg-surface-light animate-pulse" />
        ) : (
          <div className="p-4 bg-white rounded-xl border border-glass-border-light">
            <QRCodeSVG value={otpauthUrl} size={176} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          {...register("code")}
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="w-full rounded-lg border border-glass-border-light px-4 py-3 text-center text-xl font-mono tracking-[0.5em] text-ink outline-none focus:border-blue transition-colors"
        />
        {errors.code && <p className="text-danger text-xs">{errors.code.message}</p>}

        <Button type="submit" loading={isSubmitting} className="w-full gap-1.5">
          Confirm &amp; continue <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}