import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { User, Mail, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../components/ui/GlassCard";
import Avatar from "../components/ui/Avatar";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import DepartmentBadge from "../components/requests/DepartmentBadge";
import { useAuthStore } from "../store/authStore";
import { useUpdateProfile } from "../hooks/useProfile";


const createSchema = (t) => z.object({
  firstName: z.string().min(1, t("profile.firstName") + " is required"),
  lastName: z.string().min(1, t("profile.lastName") + " is required"),
});

export default function ProfilePage() {
  
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const [firstName = "", lastName = ""] = (user?.name || "").split(/\s+/, 2);


  const handleSaveRefereeInfo = () => {
    updateProfile.mutate({ phone_number: phone, qualification_badge: badge || null });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(createSchema(t)), defaultValues: { firstName, lastName } });

  const onSubmit = (data) => {
    updateProfile.mutate({ name: `${data.firstName} ${data.lastName}`.trim() });
  };

  return (
    <>
      <Helmet><title>{t("profile.title")} — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark mb-6">{t("profile.title")}</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1 text-center py-8">
          <Avatar name={user?.name} email={user?.email} size="lg" className="mx-auto mb-4" />
          <p className="font-display font-semibold text-ink dark:text-ink-dark">{user?.name}</p>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark font-mono mb-3">{user?.email}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-soft text-blue capitalize font-medium">{user?.role}</span>
            <DepartmentBadge department={user?.department} />
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h2 className="font-display font-semibold text-ink dark:text-ink-dark mb-4">{t("profile.personalInfo")}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label={t("profile.firstName")} icon={User} error={errors.firstName?.message} registration={register("firstName")} />
              <FormField label={t("profile.lastName")} icon={User} error={errors.lastName?.message} registration={register("lastName")} />
            </div>

            <div>
              <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">{t("profile.emailAddress")}</label>
              <div className="flex items-center gap-2 rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 bg-surface-light dark:bg-glass-dark">
                <Mail className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark" />
                <span className="text-sm text-ink-muted dark:text-ink-muted-dark font-mono">{user?.email}</span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1.5">
                {t("profile.emailNote")}
              </p>
            </div>
        

            <Button type="submit" loading={isSubmitting} className="w-fit gap-1.5 mt-2 cursor-pointer">
              <Save className="w-4 h-4" /> {t("profile.saveChanges")}
            </Button>
          </form>
        </GlassCard>
      </div>
    </>
  );
}