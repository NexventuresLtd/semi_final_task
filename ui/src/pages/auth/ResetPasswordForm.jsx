import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { z } from "zod";
import { Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import { authService } from "../../services/authService";

// Built as a function of t() rather than a module-level constant, since
// t() only exists once useTranslation() has run inside the component.
const buildSchema = (t) =>
  z
    .object({
      password: z
        .string()
        .min(8, t("auth.errorPasswordMinLength"))
        .regex(/[A-Z]/, t("auth.errorPasswordUppercase"))
        .regex(/[0-9]/, t("auth.errorPasswordNumber")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.errorPasswordsDontMatch"),
      path: ["confirmPassword"],
    });

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(buildSchema(t)) });

  if (!token) return <Navigate to="/forgot-password" replace />;

  const onSubmit = async ({ password }) => {
    try {
      await authService.resetPassword(token, password);
      toast.success(t("auth.passwordUpdatedSuccess"));
      navigate("/login", { replace: true });
    } catch (err) {
      const status = err.response?.status;
      toast.error(status === 410 ? t("auth.errorResetLinkExpired") : t("auth.errorResetLinkInvalid"));
    }
  };

  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1.5">{t("auth.chooseNewPasswordTitle")}</h1>
      <p className="text-sm text-ink-muted mb-8">{t("auth.chooseNewPasswordSubtitle")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label={t("auth.newPassword")} icon={Lock} type="password" error={errors.password?.message} registration={register("password")} />
        <FormField label={t("auth.confirmNewPassword")} icon={Lock} type="password" error={errors.confirmPassword?.message} registration={register("confirmPassword")} />
        <Button type="submit" loading={isSubmitting} className="w-full mt-2 gap-1.5">
          {t("auth.updatePassword")} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </>
  );
}