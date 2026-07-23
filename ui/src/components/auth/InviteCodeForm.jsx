import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Mail, KeyRound, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { inviteCodeSchema } from "../../utils/validators";
import { authService } from "../../services/authService";
import image from "../../assets/logos/ferwafa-logo.png";

export default function InviteCodeForm() {
  const { t } = useTranslation();
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
      toast.error(detail?.message || t("auth.errorInvalidInviteCode"));
    }
  };

  return (
    <>
      <center><img src={image} alt="" className="w-20 h-20" /></center>
      <h1 className="font-display text-2xl font-semibold text-center mb-1.5">{t("auth.createAccountTitle")}</h1>
      <p className="text-sm text-center muted mb-8">
        {t("auth.createAccountSubtitleShort")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          label={t("auth.email")}
          icon={Mail}
          type="email"
          error={errors.email?.message}
          registration={register("email")}
        />

        <div>
          <FormField
            label={t("auth.invitationCode")}
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
              {t("auth.attemptsRemaining", { count: attemptsLeft })}
            </motion.p>
          )}
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full mt-2 gap-1.5 cursor-pointer">
          {t("auth.verifyCode")} <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-sm text-black text-center mt-8">
          {t("auth.backToLogin")}{": "}
          <Link to="/login" className="text-blue font-medium hover:underline">
            {t("common.signIn")}
          </Link>
        </p>
      </form>
    </>
  );
}