import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import logo from "../../assets/logos/ferwafa-logo.png";
import officePhoto from "../../assets/logos/ferwafa-office.jpg";

export default function AuthLayout({ children, taglines, workflowPoints, securityLine }) {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % taglines.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-ink p-4 sm:p-8">
      <motion.img
        src={officePhoto}
        alt="FERWAFA head office, Kigali"
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 30, ease: "linear" }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink/85 to-ink/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

      <div className="hidden lg:flex absolute bottom-8 left-8 items-center gap-2 text-white/60 text-xs z-10">
        <MapPin className="w-3.5 h-3.5" />
        Kigali, Rwanda · FIFA Member Association
      </div>

      <div className="hidden lg:flex flex-col absolute top-10 left-10 z-10 max-w-md">
        <div className="flex items-center gap-2.5 mb-8">
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
            className="font-display text-[2rem] font-semibold text-white leading-[1.2] tracking-tight"
          >
            {taglines[taglineIndex]}
          </motion.p>
        </AnimatePresence>

        <div className="flex items-center gap-2 mt-8 text-white/50 text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          {securityLine}
        </div>

        <div className="flex flex-col gap-4 mt-10 pt-8 border-t border-white/10">
          {workflowPoints.map((point, i) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              <p className="text-[13px] text-white/70 leading-[1.7]">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] lg:ml-auto lg:mr-[6vw]"
      >
        <div className="rounded-2xl bg-gray backdrop-blur-9xl border border-white/40 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-8 sm:p-9">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <img src={logo} alt="FERWAFA" className="w-8 h-8 object-contain" />
            <span className="font-display font-semibold text-sm text-white tracking-tight">
              FERWAFA · Departments
            </span>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}