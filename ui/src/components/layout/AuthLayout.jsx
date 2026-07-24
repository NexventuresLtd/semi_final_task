import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import logo from "../../assets/logos/ferwafa-logo.png";
import background from "../../assets/logos/ferwafa-background.jpg";

export default function AuthLayout({ children, taglines, workflowPoints, securityLine }) {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % taglines.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    // fixed + inset-0 pins this to the actual browser viewport, bypassing
    // any ancestor width/height quirks entirely — this is what guarantees
    // the photo always fills the full screen with zero white margin,
    // regardless of what wraps it. overflow-y-auto lets content scroll
    // WITHIN this fixed frame if it's ever taller than the viewport,
    // instead of the whole page growing and leaving background gaps.
    <div className="fixed inset-0 overflow-y-auto bg-ink ">
      <motion.img
        src={background}
        alt="FERWAFA head office, Kigali"
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 30, ease: "linear" }}
        className="fixed inset-0 w-full h-full object-cover -z-10 "
      />
      <div className="fixed inset-0 bg-gradient-to-bl  to-ink/60 -z-10" />
      <div className="fixed inset-0 bg-gradient-to-t from-ink via-transparent to-transparent -z-10" />

      <div className="relative z-10 min-h-full flex flex-col lg:flex-row items-center justify-center gap-8 p-4 sm:p-8 max-w-[1400px] mx-auto">

        <div className="hidden lg:flex flex-col flex-1 max-w-md self-center py-6">
          <div className="flex items-center gap-2.5 mb-6">
            <img src={logo} alt="FERWAFA" className="w-9 h-9 object-contain" />
            <span className="font-display font-semibold text-sm text-white tracking-tight">
              FERWAFA · Departments
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="font-display text-[1.85rem] font-semibold text-white leading-[1.2] tracking-tight"
            >
              {taglines[taglineIndex]}
            </motion.p>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-6 text-white/50 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            {securityLine}
          </div>

          <div className="flex flex-col gap-3.5 mt-8 pt-6 border-t border-white/10">
            {workflowPoints.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <p className="text-[13px] text-white/70 leading-[1.6]">{point}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-8 text-white/60 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            Kigali, Rwanda · FIFA Member Association
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[420px] shrink-0 my-auto"
        >
          <div className="rounded-2xl bg-white backdrop-blur-2xl border border-white/40 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-7 sm:p-8">
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <img src={logo} alt="FERWAFA" className="w-8 h-8 object-contain" />
              <span className="font-display font-semibold text-sm text-ink tracking-tight">
                FERWAFA · Departments
              </span>
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}