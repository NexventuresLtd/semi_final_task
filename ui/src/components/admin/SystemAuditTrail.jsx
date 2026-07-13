import { useAuditTrail } from "../../hooks/useAdmin";
import GlassCard from "../ui/GlassCard";
import { FileCheck2, FileX2, UserCog, ShieldOff } from "lucide-react";

const ICONS = { approved: FileCheck2, rejected: FileX2, role_changed: UserCog, user_disabled: ShieldOff };

export default function SystemAuditTrail() {
  const { data: entries, isLoading } = useAuditTrail();

  return (
    <GlassCard>
      <h2 className="font-display font-semibold text-ink mb-1">Audit trail</h2>
      <p className="text-xs text-ink-muted mb-4">
        A complete, unalterable record of every approval, rejection, and account change.
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-surface-light animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
          {entries?.map((entry) => {
            const Icon = ICONS[entry.action] || FileCheck2;
            return (
              <div key={entry.id} className="flex items-start gap-3 text-sm py-2 border-b border-glass-border-light last:border-0">
                <Icon className="w-4 h-4 mt-0.5 text-ink-muted shrink-0" />
                <div className="flex-1">
                  <p className="text-ink"><span className="font-medium">{entry.actor}</span> {entry.description}</p>
                  <p className="text-xs text-ink-muted font-mono mt-0.5">
                    {new Date(entry.timestamp).toLocaleString()} · {entry.ipAddress}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}