import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MessageSquare, Download } from "lucide-react";
import RequestTimeline from "./RequestTimeline";
import RequestStatusBadge from "./RequestStatusBadge";
import DepartmentBadge from "./DepartmentBadge";
import TemplateDocumentPreview from "./TemplateDocumentPreview";
import Button from "../ui/Button";
import { exportDocumentPdf } from "../../utils/exportDocumentPdf";

export default function RequestDetailDrawer({ request, onClose }) {
  const docRef = useRef(null);

  return (
    <AnimatePresence>
      {request && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] glass-overlay !rounded-none sm:!rounded-l-2xl z-50 p-6 overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <DepartmentBadge department={request.department} />
                <p className="text-xs text-ink-muted dark:text-ink-muted-dark capitalize">{request.type?.replace("_", " ")}</p>
              </div>
              <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-surface-light dark:hover:bg-glass-dark rounded-full cursor-pointer">
                <X className="w-4 h-4 text-ink dark:text-ink-dark" />
              </button>
            </div>

            <RequestStatusBadge status={request.status} />
            <RequestTimeline currentStage={request.currentStage} status={request.status} rejectedAt={request.rejectedAt} />

            {request.template && (
              <div className="my-6">
                <TemplateDocumentPreview
                  ref={docRef}
                  template={request.template}
                  values={request.field_values}
                  signatures={request.signatures}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => exportDocumentPdf(docRef, `ferwafa-${request.type}-${request.id}`)}
                  className="w-full mt-3 gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Save signed document as PDF
                </Button>
              </div>
            )}

            {request.comments?.length > 0 && (
              <div>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}