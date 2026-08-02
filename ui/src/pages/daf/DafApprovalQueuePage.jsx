import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ApprovalQueue from "../../components/approvals/ApprovalQueue";
import { useApprovalQueue, useApprovalActions } from "../../hooks/useApprovals";

export default function DafApprovalQueuePage() {
  const { t } = useTranslation();
  const { data: requests, isLoading } = useApprovalQueue();
  const { approve, reject } = useApprovalActions();

  return (
    <>
      <Helmet><title>{t("requests.dafTitle")} — FERWAFA Approvals</title></Helmet>
      <h1 className="font-display text-2xl font-semibold mb-1">{t("requests.dafTitle")}</h1>
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-6">
        {t("requests.dafSubtitle")}
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