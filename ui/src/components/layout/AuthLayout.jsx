import { motion } from "framer-motion";
import { ShieldCheck, Workflow, Bell } from "lucide-react";
import logo from "../../assets/logos/ferwafa-logo.png";

const POINTS = [
  { icon: Workflow, text: "Department Request → DAF → SG, in strict order" },
  { icon: Bell, text: "Every approval or rejection notifies the Department Initiator instantly" },
  { icon: ShieldCheck, text: "Access is invitation-only and protected by two-factor login" },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-bg-light">
      {/* Brand panel — hidden on mobile, shown from lg up */}
      <div className="hidden lg:flex lg:w-[42%] relative bg-ink overflow-hidden">
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] opacity-[0.06]"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="FERWAFA" className="w-8 h-8 object-contain" />
            <span className="font-display font-semibold text-sm text-white tracking-tight">
              FERWAFA · Departments
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-semibold text-white leading-tight max-w-xs mb-8">
              Memos and purchase orders, without the paper trail.
            </h2>
            <div className="flex flex-col gap-4">
              {POINTS.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-white/90" />
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed pt-1.5">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Rwanda Football Federation — Ferwafa Departments
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile-only brand mark */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <img src={logo} alt="FERWAFA" className="w-8 h-8 object-contain" />
            <span className="font-display font-semibold text-sm text-ink tracking-tight">
              FERWAFA · Finance
            </span>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}