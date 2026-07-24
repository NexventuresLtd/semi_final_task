import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { X, MessageSquare, Download } from "lucide-react";
import RequestTimeline from "./RequestTimeline";
import RequestStatusBadge from "./RequestStatusBadge";
import DepartmentBadge from "./DepartmentBadge";
import TemplateDocumentPreview from "./TemplateDocumentPreview";
import ApprovalActionPanel from "../approvals/ApprovalActionPanel";
import Button from "../ui/Button";
import { exportDocumentPdf } from "../../utils/exportDocumentPdf";

export default function RequestDetailModal({ request, onClose, onApprove, onReject, isSubmitting, showActions = false }) {
  const [exporting, setExporting] = useState(false);
  const docRef = useRef(null);

  const handleExportPdf = async () => {
    setExporting(true);
    try {
        await exportDocumentPdf(docRef, `ferwafa-${request.type}-${request.id}`);
    } catch (err) {
        console.error("PDF export failed:", err);
        toast.error("Could not generate PDF — see console for details");
    } finally {
        setExporting(false);
    }
};

  return (
    <AnimatePresence>
      {request && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed inset-4 sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl sm:min-h-[90vh] z-50 flex flex-col rounded-2xl bg-white dark:bg-surface-dark shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border-light dark:border-glass-border-dark shrink-0">
              <div className="flex items-center gap-2.5 ">
                <DepartmentBadge department={request.department} />
                <RequestStatusBadge status={request.status} />
              </div>
              <button onClick={onClose} className="p-2 cursor-pointer rounded-full hover:bg-surface-light dark:hover:bg-glass-dark">
                <X className="w-4 h-4 text-ink dark:text-ink-dark" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <RequestTimeline currentStage={request.currentStage} status={request.status} rejectedAt={request.rejectedAt} />

              {request.template && (
                <div className="my-4">
                  <TemplateDocumentPreview
                    ref={docRef}
                    template={request.template}
                    values={request.field_values}
                    signatures={request.signatures}
                  />
                </div>
              )}

              {request.comments?.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-medium text-ink dark:text-ink-dark mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" /> Approver comments
                  </h3>
                  <div className="flex flex-col gap-2">
                    {request.comments.map((c, i) => (
                      <div key={i} className="glass-panel p-3 text-sm">
                        <p className="text-xs font-medium text-blue mb-1">{c.author} · {c.role}</p>
                        <p className="text-ink dark:text-ink-dark">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approve/Reject now lives INSIDE the scrollable modal body,
                  only shown when DAF/SG opened this from their queue and
                  the request is still pending their decision. */}
              {showActions && request.status === "pending" && (
                <div className="mt-5">
                  <ApprovalActionPanel
                    request={request}
                    onApprove={(payload) => { onApprove(payload); onClose(); }}
                    onReject={(payload) => { onReject(payload); onClose(); }}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-glass-border-light dark:border-glass-border-dark shrink-0">
              <Button
                onClick={handleExportPdf}
                loading={exporting}
                className="w-full gap-1.5 cursor-pointer bg-green-500 hover:bg-green-400 hover:opacity-80"
                >
                <Download className="w-4 h-4" /> Save as PDF (A4)
            </Button>
            
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}