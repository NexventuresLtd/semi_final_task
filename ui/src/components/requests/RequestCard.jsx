import { FileText, ArrowRight } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import RequestStatusBadge from "./RequestStatusBadge";
import DepartmentBadge from "./DepartmentBadge";

export default function RequestCard({ request, onClick, showRequester = false }) {
  const { title, type, amount, currency, currentStage, status, createdAt, department, requesterName } = request;

  return (
    <GlassCard interactive onClick={onClick} className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-soft flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-blue" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm leading-tight text-ink truncate">{title}</p>
            <p className="text-xs text-ink-muted capitalize">{type.replace("_", " ")}</p>
          </div>
        </div>
        <RequestStatusBadge status={status} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <DepartmentBadge department={department} />
        {showRequester && requesterName && (
          <span className="text-xs text-ink-muted">· {requesterName}</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="font-mono text-sm text-ink">
          {amount?.toLocaleString()} {currency}
        </span>
        <span className="text-xs text-ink-muted capitalize flex items-center gap-1">
          {currentStage} <ArrowRight className="w-3 h-3" />
        </span>
      </div>

      <p className="text-xs text-ink-muted">
        {new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </GlassCard>
  );
}