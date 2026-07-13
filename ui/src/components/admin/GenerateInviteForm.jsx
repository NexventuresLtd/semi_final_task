import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import { useGenerateInvite } from "../../hooks/useAdmin";
import { DEPARTMENTS } from "../../utils/constants";

const schema = z.object({
  email: z.string().email("Enter a valid FERWAFA email").endsWith("@ferwafa.rw", "Must be a @ferwafa.rw address"),
  role: z.enum(["staff", "daf"]),
  department: z.string().min(1, "Select a department"),
});

export default function GenerateInviteForm() {
  const [open, setOpen] = useState(false);
  const generateInvite = useGenerateInvite();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (payload) => {
    await generateInvite.mutateAsync(payload);
    reset();
    setOpen(false);
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-1.5">
        <UserPlus className="w-4 h-4" /> Invite a new user
      </Button>
    );
  }

  return (
    <GlassCard className="max-w-md">
      <h3 className="font-display font-semibold text-ink mb-3">Send an invitation</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Email</label>
          <input
            {...register("email")}
            placeholder="name@ferwafa.rw"
            className="w-full rounded-lg border border-glass-border-light px-4 py-2.5 text-sm text-ink outline-none focus:border-blue transition-colors"
          />
          {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Role</label>
          <select {...register("role")} className="w-full rounded-lg border border-glass-border-light px-4 py-2.5 text-sm text-ink outline-none focus:border-blue transition-colors">
            <option value="">Select a role</option>
            <option value="staff">Department Staff</option>
            <option value="daf">Director of Finance</option>
          </select>
          {errors.role && <p className="text-danger text-xs mt-1">{errors.role.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Department</label>
          <select {...register("department")} className="w-full rounded-lg border border-glass-border-light px-4 py-2.5 text-sm text-ink outline-none focus:border-blue transition-colors">
            <option value="">Select a department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          {errors.department && <p className="text-danger text-xs mt-1">{errors.department.message}</p>}
        </div>

        <div className="flex gap-3 mt-1">
          <Button type="submit" loading={generateInvite.isPending}>Send invitation</Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </form>
    </GlassCard>
  );
}