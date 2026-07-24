import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, FileText, Bell } from "lucide-react";

const STAGES = [
  { key: "accountant", label: "Submitted", who: "Accountant" },
  { key: "daf", label: "DAF Review", who: "Director of Finance" },
  { key: "sg", label: "SG Review", who: "Secretary General" },
  { key: "done", label: "Complete", who: "Department notified" },
];

const NOTIFY_AT = {
  1: "DAF approved — Department notified",
  2: "SG approved — request complete",
};

export default function HeroApprovalDemo() {
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % (STAGES.length + 1));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (NOTIFY_AT[step]) {
      setNotice(NOTIFY_AT[step]);
      const t = setTimeout(() => setNotice(null), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const activeIndex = step >= STAGES.length ? STAGES.length - 1 : step;

  return (
    <div className="relative w-full max-w-sm">
      {/* Toast Notification */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute -top-4 left-4 right-4 z-20 bg-blue-600/90 text-white backdrop-blur-md border border-blue-400/30 px-3.5 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-3.5 h-3.5 text-yellow-300" />
            </div>
            <p className="text-xs font-medium leading-snug">{notice}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Card matching Auth Page styling */}
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-2xl transition-colors duration-300">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/50 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">
              Request Initiated
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              PO-2026-0148
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {STAGES.map((stage, i) => {
            const cleared = i < activeIndex || (i === activeIndex && step >= STAGES.length);
            const active = i === activeIndex && step < STAGES.length;

            return (
              <div key={stage.key} className="flex items-center gap-3">
                <motion.div
                  animate={{
                    backgroundColor: cleared
                      ? "#10B981"
                      : active
                      ? "#0284C7"
                      : "transparent",
                    borderColor: cleared
                      ? "#10B981"
                      : active
                      ? "#0284C7"
                      : "rgba(148, 163, 184, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm"
                >
                  <AnimatePresence mode="wait">
                    {cleared ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                    ) : active ? (
                      <motion.div
                        key="clock"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Clock className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {i + 1}
                      </span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      active
                        ? "text-blue-600 dark:text-blue-400"
                        : cleared
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stage.who}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}