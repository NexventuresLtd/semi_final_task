import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Lock, ShieldCheck,PenTool } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../components/ui/GlassCard";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import { useChangePassword } from "../hooks/useProfile";
import image from "../assets/logos/ferwafa-logo.png";
import { useState } from "react";
import SignaturePad from "../components/ui/SignaturePad";
import { useAuthStore } from "../store/authStore";
import { userService } from "../services/userService";
import toast from "react-hot-toast";

const createSchema = (t) => z
  .object({
    currentPassword: z.string().min(1, t("auth.errorIncorrectCredentials")),
    newPassword: z.string().min(8, t("auth.errorPasswordMinLength")).regex(/[A-Z]/, t("auth.errorPasswordUppercase")).regex(/[0-9]/, t("auth.errorPasswordNumber")),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: t("auth.errorPasswordsDontMatch"),
    path: ["confirmPassword"],
  });

export default function SettingsPage() {
  const { t } = useTranslation();
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(createSchema(t)) });

  const onSubmit = (data) => {
    changePassword.mutate(
      { current_password: data.currentPassword, new_password: data.newPassword },
      { onSuccess: () => reset() }
    );
  };

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const handleSaveSignature = async (dataUrl) => {
    try {
      const { data } = await userService.updateProfile({ signature_image: dataUrl });
      setUser(data.user);
      toast.success(t("settings.signatureSavedSuccess"));
    } catch (err) {
      toast.error(err.response?.data?.message || t("settings.signatureSaveError"));
    }
  };

  return (
    <>
      <Helmet><title>{t("settings.title")} — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark mb-6">{t("settings.title")}</h1>                                
           {/* Glass Card */}
           <div className="flex flex-wrap w-full justify-around items-center">
                <GlassCard className="max-w-lg">      
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-lg bg-blue-soft flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-blue" />
                    </div>
                    <h2 className="font-display font-semibold text-ink dark:text-ink-dark">{t("settings.changePassword")}</h2>
                  </div>
                  <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-5">
                    {t("settings.changePasswordSubtitle")}
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField label={t("settings.currentPassword")} icon={Lock} type="password" error={errors.currentPassword?.message} registration={register("currentPassword")} />
                    <FormField label={t("auth.newPassword")} icon={Lock} type="password" error={errors.newPassword?.message} registration={register("newPassword")} />
                    <FormField label={t("auth.confirmNewPassword")} icon={Lock} type="password" error={errors.confirmPassword?.message} registration={register("confirmPassword")} />
                    <Button type="submit" loading={isSubmitting} className="w-fit mt-2 cursor-pointer">{t("auth.updatePassword")}</Button>
                  </form>
                </GlassCard>

                <GlassCard className="max-w-lg mt-6">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-lg bg-blue-soft flex items-center justify-center">
                      <PenTool className="w-4 h-4 text-blue" />
                    </div>
                    <h2 className="font-display font-semibold text-ink dark:text-ink-dark">{t("settings.digitalSignature")}</h2>
                  </div>
                  <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-5">
                    {t("settings.digitalSignatureSubtitle")}
                  </p>
                  <SignaturePad onSave={handleSaveSignature} existingSignature={user?.signatureImage} />
              </GlassCard>
           </div>
        
    </>
  );
}