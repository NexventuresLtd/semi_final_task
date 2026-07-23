import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

export default function DisableUserModal({ user, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-overlay rounded-xl p-6 w-full max-w-sm z-50"
          >
            <div className="w-11 h-11 rounded-xl bg-danger-soft flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <h3 className="font-display font-semibold text-ink mb-1.5">Disable {user.name}?</h3>
            <p className="text-sm text-ink-muted mb-5">
              They'll immediately lose access. Their request history stays intact and visible in the audit trail.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1 cursor-pointer" onClick={onConfirm}>Disable user</Button>
              <Button variant="ghost" className="cursor-pointer" onClick={onClose}>Cancel</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}