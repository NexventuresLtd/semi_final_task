import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, FileText, Bell } from "lucide-react";

const STAGES = [
  { key: "accountant", label: "Submitted", who: "Accountant" },
  { key: "daf", label: "DAF Review", who: "Director of Finance" },
  { key: "sg", label: "SG Review", who: "Secretary General" },
  { key: "done", label: "Complete", who: "Department notified" },
];

// A notification fires the moment DAF decides, and again when SG decides —
// this mirrors the real rule: the accountant is told at every stage, not
// just when the request finally closes.
const NOTIFY_AT = {
  1: "DAF approved — Department notified",
  2: "SG approved — request complete, Department notified",
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
      const t = setTimeout(() => setNotice(null), 1900);
      return () => clearTimeout(t);
    }
  }, [step]);

  const activeIndex = step >= STAGES.length ? STAGES.length - 1 : step;

  return (
    <div className="relative w-full max-w-sm">
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="absolute -top-3 left-4 right-4 z-20 glass-panel !border-blue/20 px-3.5 py-2.5 flex items-center gap-2.5"
          >
            <div className="w-7 h-7 rounded-full bg-blue-soft flex items-center justify-center shrink-0">
              <Bell className="w-3.5 h-3.5 text-blue" />
            </div>
            <p className="text-xs font-medium text-ink leading-snug">{notice}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-glass-border-light dark:border-glass-border-dark">
          <div className="w-9 h-9 rounded-lg bg-blue-soft flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-blue" />
          </div>
          <div>
            <p className="text-sm font-medium leading-tight text-ink">Request Initiated</p>
            <p className="text-xs text-ink-muted font-mono">PO-2026-0148</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {STAGES.map((stage, i) => {
            const cleared = i < activeIndex || (i === activeIndex && step >= STAGES.length);
            const active = i === activeIndex && step < STAGES.length;

            return (
              <div key={stage.key} className="flex items-center gap-3">
                <motion.div
                  animate={{
                    backgroundColor: cleared ? "var(--color-green)" : active ? "var(--color-blue)" : "transparent",
                    borderColor: cleared ? "var(--color-green)" : active ? "var(--color-blue)" : "var(--color-glass-border-light)",
                  }}
                  transition={{ duration: 0.35 }}
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0"
                >
                  <AnimatePresence mode="wait">
                    {cleared ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                    ) : active ? (
                      <motion.div key="clock" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Clock className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                    ) : (
                      <span className="text-[10px] text-ink-muted">{i + 1}</span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${active ? "text-blue" : "text-ink"}`}>{stage.label}</p>
                  <p className="text-xs text-ink-muted">{stage.who}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}