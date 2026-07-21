import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { loginSchema } from "../../utils/validators";
import { useAuthStore } from "../../store/authStore";
import image from "../../assets/logos/ferwafa-logo.png";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (credentials) => {
    try {
      const result = await login(credentials);
      if (result.requiresTotp) {
        navigate("/totp-verify", { state: { tempToken: result.tempToken } });
        return;
      }
      if (result.needsTotpSetup) {
        navigate("/totp-setup");
        return;
      }
      const role = useAuthStore.getState().user?.role;
      navigate(`/${role}`, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) toast.error(t("auth.errorVerifyEmailFirst"));
      else if (status === 423) toast.error(t("auth.errorAccountDisabled"));
      else toast.error(t("auth.errorIncorrectCredentials"));
    }
  };

  return (
    <>
      <center><img src={image} alt="" className="w-20 h-20" /></center>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">{t("auth.welcomeBack")}</h1>
      <p className="text-sm text-ink-muted mb-8">{t("auth.signInSubtitle")}</p>

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
            label={t("auth.password")}
            icon={Lock}
            type="password"
            error={errors.password?.message}
            registration={register("password")}
          />
          <div className="flex justify-end mt-1.5">
            <Link to="/forgot-password" className="text-xs text-blue hover:underline">
              {t("auth.forgotPassword")}
            </Link>
          </div>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full mt-2 gap-1.5 cursor-pointer">
          {t("common.signIn")} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-sm text-ink-muted text-center mt-8">
        {t("auth.newToFerwafa")}{" "}
        <Link to="/create-account" className="text-blue font-medium hover:underline">
          {t("auth.useYourInvitation")}
        </Link>
      </p>
    </>
  );
}