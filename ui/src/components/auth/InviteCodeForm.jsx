import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, KeyRound, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { inviteCodeSchema } from "../../utils/validators";
import { authService } from "../../services/authService";
import image from "../../assets/logos/ferwafa-logo.png";
import { Link } from "react-router-dom";

export default function InviteCodeForm() {
  const navigate = useNavigate();
  const [attemptsLeft, setAttemptsLeft] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(inviteCodeSchema) });

  const onSubmit = async ({ email, code }) => {
    try {
      const { data } = await authService.verifyInviteCode(email, code);
      navigate("/create-account/signup", { state: { inviteToken: data.invite_token, email } });
    } catch (err) {
      const detail = err.response?.data;
      if (detail?.attempts_left !== undefined) setAttemptsLeft(detail.attempts_left);
      toast.error(detail?.message || "Invalid or expired invitation code");
    }
  };

  return (
    <>
      <center><img src={image} alt="" className="w-20 h-20"/></center>
      <h1 className="font-display text-2xl font-semibold text-white mb-1.5">Enter your invitation</h1>
      <p className="text-sm text-white muted mb-8">
        Use the email address and code you Received
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          label="Email address"
          icon={Mail}
          type="email"
          error={errors.email?.message}
          registration={register("email")}
        />

        <div>
          <FormField
            label="Invitation code"
            icon={KeyRound}
            error={errors.code?.message}
            registration={register("code")}
            className="[&_input]:font-mono [&_input]:tracking-widest [&_input]:uppercase"
          />
          {attemptsLeft !== null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gold mt-1.5 ml-1"
            >
              {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining before this code is locked
            </motion.p>
          )}
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full mt-2 gap-1.5 cursor-pointer">
          Verify code <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-sm text-ink-dark text-center mt-8">
        Back to Login{" "}
        <Link to="/login" className="text-blue font-medium hover:underline">
          Sign In
        </Link>
      </p>
      </form>
    </>
  );
}