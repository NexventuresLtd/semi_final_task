import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import { REQUEST_TYPES, CURRENCIES } from "../../utils/constants";
import { useCreateRequest } from "../../hooks/useRequests";
import { useAuthStore } from "../../store/authStore";
import { DEPARTMENT_LABEL } from "../../utils/constants";

const schema = z.object({
  type: z.enum(["memo", "purchase_order", "reimbursement", "travel_advance"]),
  title: z.string().min(4, "Give this request a clear title"),
  description: z.string().min(10, "Add a bit more detail for the approver"),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
  currency: z.enum(CURRENCIES),
});

export default function RequestForm() {
  const navigate = useNavigate();
  const createRequest = useCreateRequest();
  const user = useAuthStore((s) => s.user);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { currency: "RWF" } });
  
  const onSubmit = async (payload) => {
    try {
      await createRequest.mutateAsync(payload);
      toast.success("Request submitted — sent to DAF for review");
      navigate("/accountant/my-requests");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit request");
    }
  };

  const inputClass =
    "w-full glass-panel px-4 py-2.5 text-sm bg-transparent focus:outline-none";

  return (
    <GlassCard className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">New request</h1>
      <p className="text-sm text-ink-muted mb-6">
        Submitting as <span className="font-medium text-blue">{DEPARTMENT_LABEL[user?.department]}</span> —
        this will go to your DAF first, then the SG, before it's marked complete.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Request type</label>
          <select {...register("type")} className={inputClass}>
            <option value="">Select a type</option>
            {REQUEST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.type && <p className="text-danger text-xs mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Title</label>
          <input {...register("title")} placeholder="e.g. Referee kits — August tournament" className={inputClass} />
          {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Description</label>
          <textarea {...register("description")} rows={4} className={inputClass} />
          {errors.description && <p className="text-danger text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Amount</label>
            <input type="number" step="0.01" {...register("amount")} className={`${inputClass} font-mono`} />
            {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Currency</label>
            <select {...register("currency")} className={inputClass}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button type="submit" loading={isSubmitting}>Submit for approval</Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </GlassCard>
  );
}