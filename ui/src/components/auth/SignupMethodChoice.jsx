import { useLocation, Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import ManualSignupForm from "./ManualSignupForm";
import { authService } from "../../services/authService";

export default function SignupMethodChoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showManual, setShowManual] = useState(false);

  if (!state?.inviteToken) return <Navigate to="/create-account" replace />;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await authService.signupGoogle(credentialResponse.credential, state.inviteToken);
      navigate("/totp-setup", { state: { fromSignup: true, user: data.user } });
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("This Google account's email doesn't match your invitation.");
      } else {
        toast.error(err.response?.data?.message || "Google sign-up failed. Please try again.");
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!showManual ? (
        <motion.div
          key="choice"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
        >
          <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Create your account</h1>
          <p className="text-sm text-ink-muted mb-8">
            Verified as <span className="font-mono text-blue">{state.email}</span>
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google sign-up failed. Please try again.")}
                width="352"
              />
            </div>

            <div className="flex items-center gap-3 my-1">
              <div className="h-px flex-1 bg-glass-border-light" />
              <span className="text-xs text-ink-muted">or</span>
              <div className="h-px flex-1 bg-glass-border-light" />
            </div>

            <Button variant="ghost" onClick={() => setShowManual(true)}>
              Sign up with email &amp; password
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="manual"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
        >
          <ManualSignupForm
            email={state.email}
            inviteToken={state.inviteToken}
            onBack={() => setShowManual(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}