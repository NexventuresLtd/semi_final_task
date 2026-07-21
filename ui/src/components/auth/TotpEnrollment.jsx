import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Smartphone, ScanLine, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import OtpInput from "../ui/OtpInput";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

const STEPS = [
  { icon: Smartphone, text: "Install Google Authenticator on your phone, if you haven't already" },
  { icon: ScanLine, text: "Open the app and scan the QR code below" },
  { icon: KeyRound, text: "Enter the 6-digit code it generates to finish setup" },
];

export default function TotpEnrollment() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [otpauthUrl, setOtpauthUrl] = useState(null);
  const [loadingQr, setLoadingQr] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    authService
      .totpEnrollStart()
      .then(({ data }) => setOtpauthUrl(data.otpauth_url))
      .catch(() => toast.error("Could not start 2FA setup"))
      .finally(() => setLoadingQr(false));
  }, []);

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError("Enter all 6 digits");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { data } = await authService.totpEnrollConfirm(code);
      localStorage.setItem("ferwafa-access-token", data.access_token);
      setUser(data.user);
      toast.success("Two-factor authentication enabled");
      navigate(`/${data.user.role}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect code — try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-soft text-blue text-[11px] font-semibold uppercase tracking-wide mb-4">    
        <ShieldCheck className="w-3.5 h-3.5" />
        Required · One-time setup
      </div>

      <h1 className="font-display text-xl font-semibold text-ink mb-1">Secure your account</h1>
      <p className="text-sm text-ink-muted mb-4 max-w-xs mx-auto">
        Two-factor authentication protects every login on your account.
      </p>

      <div className="flex flex-col gap-2 text-left bg-surface-light rounded-xl p-3.5 mb-4">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white border border-glass-border-light flex items-center justify-center shrink-0 text-[11px] font-semibold text-blue">
              {i + 1}
            </div>
            <p className="text-xs text-ink-muted leading-snug">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        {loadingQr ? (
          <div className="w-[152px] h-[152px] rounded-2xl bg-surface-light animate-pulse" />
        ) : (
          <div className="relative p-3 bg-white rounded-2xl border-2 border-glass-border-light">
            {/* corner accents unchanged */}
            <QRCodeSVG value={otpauthUrl} size={128} />
          </div>
        )}
      </div>

      <p className="text-xs font-medium text-ink-muted mb-2.5">Enter the 6-digit code</p>
      <OtpInput value={code} onChange={setCode} error={error} />

      <Button onClick={handleSubmit} loading={submitting} className="w-full mt-4 gap-1.5 cursor-pointer">
        Confirm &amp; continue
      </Button>
    </div>
  );
}