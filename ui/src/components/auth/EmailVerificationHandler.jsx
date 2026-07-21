import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";

export default function EmailVerificationHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!token) {
      setStatus("error");
      return;
    }

    authService.verifyEmail(token)
      .then(() => {
        setStatus("success");
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      })
      .catch((err) => {
        setStatus("error");
        toast.error(err.response?.data?.message || err.response?.data?.detail || "Verification failed");
      });
  }, [token, navigate]);

  if (status === "verifying") {
    return (
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue mx-auto mb-4" />
        <h1 className="font-display text-xl font-semibold text-ink mb-1.5">Verifying email...</h1>
        <p className="text-sm text-ink-muted">Please wait while we confirm your email address.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <h1 className="font-display text-xl font-semibold text-ink mb-1.5">Email Verified!</h1>
        <p className="text-sm text-ink-muted mb-4">Redirecting you to login...</p>
        <Button onClick={() => navigate("/login", { replace: true })} className="w-full">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="font-display text-xl font-semibold text-danger mb-1.5">Verification Failed</h1>
      <p className="text-sm text-ink-muted mb-4">The link may be invalid or expired.</p>
      <Button onClick={() => navigate("/login", { replace: true })} className="w-full">
        Return to Login
      </Button>
    </div>
  );
}
