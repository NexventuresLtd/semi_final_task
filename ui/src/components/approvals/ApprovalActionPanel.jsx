import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, X } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";

const schema = z.object({ comment: z.string().optional() });

export default function ApprovalActionPanel({ request, onApprove, onReject, isSubmitting }) {
  const [mode, setMode] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = ({ comment }) => {
    if (mode === "reject" && !comment?.trim()) {
      setError("comment", { message: "A reason is required when rejecting a request" });
      return;
    }
    if (mode === "approve") onApprove({ requestId: request.id, comment });
    if (mode === "reject") onReject({ requestId: request.id, comment });
  };

  return (
    <GlassCard>
      <h3 className="font-display font-semibold text-ink mb-3">Your decision</h3>

      {!mode ? (
        <div className="flex gap-3">
          <Button variant="primary" className="flex-1 gap-1.5 cursor-pointer" onClick={() => setMode("approve")}>
            <Check className="w-4 h-4" /> Approve
          </Button>
          <Button variant="danger" className="flex-1 gap-1.5 cursor-pointer" onClick={() => setMode("reject")}>
            <X className="w-4 h-4" /> Reject
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">
              {mode === "reject" ? "Reason for rejection" : "Comment (optional)"}
            </label>
            <textarea
              {...register("comment")}
              rows={3}
              placeholder={mode === "reject" ? "Explain what needs to change…" : "Add a note for the record…"}
              className="w-full rounded-lg border border-glass-border-light px-4 py-2.5 text-sm text-ink outline-none focus:border-blue transition-colors"
            />
            {errors.comment && <p className="text-danger text-xs mt-1">{errors.comment.message}</p>}
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant={mode === "approve" ? "primary" : "danger"} loading={isSubmitting} className="flex-1 cursor-pointer">
              Confirm {mode === "approve" ? "approval" : "rejection"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setMode(null)}>Cancel</Button>
          </div>
        </form>
      )}
    </GlassCard>
  );
}