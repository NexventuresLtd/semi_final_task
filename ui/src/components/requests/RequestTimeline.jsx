import { motion } from "framer-motion";
import { Check, X, Clock, User } from "lucide-react";

const STAGES = [
  { key: "accountant", label: "Submitted" },
  { key: "daf", label: "DAF Review" },
  { key: "sg", label: "SG Review" },
  { key: "done", label: "Complete" },
];

export default function RequestTimeline({ currentStage, status, rejectedAt }) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  const stageState = (index) => {
    if (rejectedAt && STAGES[index].key === rejectedAt) return "rejected";
    if (rejectedAt && index > STAGES.findIndex((s) => s.key === rejectedAt)) return "void";
    if (index < currentIndex) return "cleared";
    if (index === currentIndex) return status === "approved" ? "cleared" : "active";
    return "upcoming";
  };

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-glass-border-light dark:bg-glass-border-dark" />
        <motion.div
          className="absolute top-5 left-5 h-0.5 bg-green"
          initial={{ width: 0 }}
          animate={{ width: `${(Math.max(currentIndex, 0) / (STAGES.length - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ maxWidth: "calc(100% - 2.5rem)" }}
        />

        {STAGES.map((stage, i) => {
          const state = stageState(i);
          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2
                  ${state === "cleared" ? "bg-green border-green text-white" : ""}
                  ${state === "active" ? "bg-blue-soft border-blue text-blue animate-pulse" : ""}
                  ${state === "rejected" ? "bg-danger border-danger text-white" : ""}
                  ${state === "upcoming" || state === "void" ? "bg-surface-light dark:bg-glass-dark border-glass-border-light dark:border-glass-border-dark text-ink-muted dark:text-ink-muted-dark" : ""}
                `}
              >
                {state === "cleared" && <Check className="w-4 h-4" />}
                {state === "rejected" && <X className="w-4 h-4" />}
                {state === "active" && <Clock className="w-4 h-4" />}
                {(state === "upcoming" || state === "void") && <User className="w-4 h-4" />}
              </motion.div>
              <span className="text-xs font-medium text-center max-w-[70px]">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}