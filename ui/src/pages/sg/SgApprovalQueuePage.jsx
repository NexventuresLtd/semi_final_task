import { Helmet } from "react-helmet-async";
import ApprovalQueue from "../../components/approvals/ApprovalQueue";
import { useApprovalQueue, useApprovalActions } from "../../hooks/useApprovals";

export default function SgApprovalQueuePage() {
  const { data: requests, isLoading } = useApprovalQueue();
  const { approve, reject } = useApprovalActions();

  return (
    <>
      <Helmet><title>Approval Queue — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold mb-1">Approval queue</h1>
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-6">
        Final-stage requests — your decision marks them complete and notifies the accountant.
      </p>

      {isLoading ? (
        <div className="h-64 glass-panel animate-pulse" />
      ) : (
        <ApprovalQueue
          requests={requests}
          onApprove={approve.mutate}
          onReject={reject.mutate}
          isSubmitting={approve.isPending || reject.isPending}
        />
      )}
    </>
  );
}