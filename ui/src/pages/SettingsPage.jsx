import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Lock, ShieldCheck,PenTool } from "lucide-react";
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

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Include at least one uppercase letter").regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SettingsPage() {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

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
      toast.success("Signature saved — it will be applied to future approvals");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save signature");
    }
  };

  return (
    <>
      <Helmet><title>Settings — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark mb-6">Settings</h1>                                
           {/* Glass Card */}
           <div className="flex flex-wrap w-full justify-around items-center">
                <GlassCard className="max-w-lg">      
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-lg bg-blue-soft flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-blue" />
                    </div>
                    <h2 className="font-display font-semibold text-ink dark:text-ink-dark">Change password</h2>
                  </div>
                  <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-5">
                    You'll stay signed in on this device after changing your password.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField label="Current password" icon={Lock} type="password" error={errors.currentPassword?.message} registration={register("currentPassword")} />
                    <FormField label="New password" icon={Lock} type="password" error={errors.newPassword?.message} registration={register("newPassword")} />
                    <FormField label="Confirm new password" icon={Lock} type="password" error={errors.confirmPassword?.message} registration={register("confirmPassword")} />
                    <Button type="submit" loading={isSubmitting} className="w-fit mt-2 cursor-pointer">Update password</Button>
                  </form>
                </GlassCard>

                <GlassCard className="max-w-lg mt-6">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-lg bg-blue-soft flex items-center justify-center">
                      <PenTool className="w-4 h-4 text-blue" />
                    </div>
                    <h2 className="font-display font-semibold text-ink dark:text-ink-dark">Digital signature</h2>
                  </div>
                  <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-5">
                    Captured once, applied automatically whenever you submit or approve a request.
                  </p>
                  <SignaturePad onSave={handleSaveSignature} existingSignature={user?.signatureImage} />
              </GlassCard>
           </div>
        
    </>
  );
}