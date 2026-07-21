import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import OtpInput from "../ui/OtpInput";
import { useAuthStore } from "../../store/authStore";

export default function TotpVerifyForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const verifyTotp = useAuthStore((s) => s.verifyTotp);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!state?.tempToken) return <Navigate to="/login" replace />;

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError("Enter all 6 digits");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await verifyTotp({ tempToken: state.tempToken, code });
      const role = useAuthStore.getState().user?.role;
      navigate(`/${role}`, { replace: true });
    } catch (err) {
      // FastAPI returns errors as { detail: "..." }, not { message: "..." }
      const msg = err.response?.data?.detail || err.response?.data?.message || "Incorrect code";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-2xl bg-blue-soft flex items-center justify-center mx-auto mb-4">
        <KeyRound className="w-5 h-5 text-blue" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Enter your code</h1>
      <p className="text-sm text-ink-muted mb-8 max-w-xs mx-auto">
        Open Google Authenticator and enter the 6-digit code for FERWAFA.
      </p>

      <OtpInput value={code} onChange={setCode} error={error} />

      <Button onClick={handleSubmit} loading={submitting} className="w-full mt-6 gap-1.5 cursor-pointer">
        Verify &amp; sign in
      </Button>
    </div>
  );
}