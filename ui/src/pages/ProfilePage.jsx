import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { User, Mail, Save } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import Avatar from "../components/ui/Avatar";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import DepartmentBadge from "../components/requests/DepartmentBadge";
import { useAuthStore } from "../store/authStore";
import { useUpdateProfile } from "../hooks/useProfile";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const [firstName = "", lastName = ""] = (user?.name || "").split(/\s+/, 2);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { firstName, lastName } });

  const onSubmit = (data) => {
    updateProfile.mutate({ name: `${data.firstName} ${data.lastName}`.trim() });
  };

  return (
    <>
      <Helmet><title>Profile — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark mb-6">Profile</h1>

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
          <h2 className="font-display font-semibold text-ink dark:text-ink-dark mb-4">Personal information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="First name" icon={User} error={errors.firstName?.message} registration={register("firstName")} />
              <FormField label="Last name" icon={User} error={errors.lastName?.message} registration={register("lastName")} />
            </div>

            <div>
              <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">Email address</label>
              <div className="flex items-center gap-2 rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 bg-surface-light dark:bg-glass-dark">
                <Mail className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark" />
                <span className="text-sm text-ink-muted dark:text-ink-muted-dark font-mono">{user?.email}</span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1.5">
                Your email is tied to your invitation and can't be changed here. Contact your SG if it needs to change.
              </p>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-fit gap-1.5 mt-2 cursor-pointer">
              <Save className="w-4 h-4" /> Save changes
            </Button>
          </form>
        </GlassCard>
      </div>
    </>
  );
}