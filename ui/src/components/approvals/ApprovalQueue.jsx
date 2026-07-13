import { useState } from "react";
import RequestCard from "../requests/RequestCard";
import RequestTimeline from "../requests/RequestTimeline";
import DepartmentBadge from "../requests/DepartmentBadge";
import ApprovalActionPanel from "./ApprovalActionPanel";
import GlassCard from "../ui/GlassCard";

export default function ApprovalQueue({ requests, onApprove, onReject, isSubmitting }) {
  const [selected, setSelected] = useState(null);

  if (!requests?.length) {
    return (
      <GlassCard className="text-center py-10">
        <p className="text-ink-muted">No requests waiting on your review right now.</p>
      </GlassCard>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 content-start">
        {requests.map((req) => (
          <RequestCard key={req.id} request={req} onClick={() => setSelected(req)} showRequester />
        ))}
      </div>

      <div className="lg:sticky lg:top-4 self-start">
        {selected ? (
          <div className="flex flex-col gap-4">
            <GlassCard>
              <p className="text-xs text-ink-muted capitalize mb-1">{selected.type?.replace("_", " ")}</p>
              <h3 className="font-display font-semibold text-ink mb-2">{selected.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <DepartmentBadge department={selected.department} />
                <span className="text-xs text-ink-muted">{selected.requesterName}</span>
              </div>
              <p className="text-sm text-ink-muted mb-3">{selected.description}</p>
              <p className="font-mono text-sm text-ink">
                {selected.amount?.toLocaleString()} {selected.currency}
              </p>
              <RequestTimeline currentStage={selected.currentStage} status={selected.status} rejectedAt={selected.rejectedAt} />
            </GlassCard>
            <ApprovalActionPanel request={selected} onApprove={onApprove} onReject={onReject} isSubmitting={isSubmitting} />
          </div>
        ) : (
          <GlassCard className="text-center py-10 text-sm text-ink-muted">
            Select a request to review it here.
          </GlassCard>
        )}
      </div>
    </div>
  );
}