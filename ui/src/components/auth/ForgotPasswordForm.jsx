import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, MailCheck, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import FormField from "../ui/FormField";
import { authService } from "../../services/authService";
import image from "../../assets/logos/ferwafa-logo.png";

const schema = z.object({ email: z.string().email("Enter a valid email address") });

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-11 h-11 rounded-xl bg-blue-soft flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-5 h-5 text-blue" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Check your inbox</h1>
        <p className="text-sm text-ink-muted mb-6">
          If an account exists for that email, a reset link is on its way. It expires in 30 minutes.
        </p>
        <Link to="/login">
          <Button variant="ghost" className="w-full cursor-pointer">Back to sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <center><img src={image} alt="" className="w-20 h-20"/></center>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">Reset your password</h1>
      <p className="text-sm text-ink-muted mb-8">Enter your email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Email address" icon={Mail} type="email" error={errors.email?.message} registration={register("email")} />
        <Button type="submit" loading={isSubmitting} className="w-full mt-2 gap-1.5 cursor-pointer">
          Send reset link <ArrowRight className="w-4 h-4" />
        </Button>
        <Link to="/login" className="text-xs text-center text-blue hover:underline mt-1">
          Back to sign in
        </Link>
      </form>
    </>
  );
}