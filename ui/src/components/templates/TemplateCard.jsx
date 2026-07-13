import { FileStack, Trash2 } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { REQUEST_TYPES } from "../../utils/constants";

export default function TemplateCard({ template, onDelete, onUse }) {
  const typeLabel = REQUEST_TYPES.find((t) => t.value === template.request_type)?.label || template.request_type;

  return (
    <GlassCard interactive onClick={() => onUse?.(template)} className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-soft flex items-center justify-center shrink-0">
            <FileStack className="w-4 h-4 text-blue" />
          </div>
          <div>
            <p className="font-medium text-sm text-ink dark:text-ink-dark">{template.name}</p>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{typeLabel}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(template); }}
          className="p-1.5 rounded-lg hover:bg-danger-soft"
        >
          <Trash2 className="w-4 h-4 text-danger" />
        </button>
      </div>
      <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{template.fields?.length || 0} fields</p>
    </GlassCard>
  );
}