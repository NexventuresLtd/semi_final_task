import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-blue text-white hover:bg-blue/90 shadow-[0_4px_14px_rgba(15,111,168,0.3)]",
  gold: "bg-gold text-white hover:bg-gold/90 shadow-[0_4px_14px_rgba(200,154,44,0.3)]",
  danger: "bg-danger text-white hover:bg-danger/90 shadow-[0_4px_14px_rgba(193,69,76,0.25)]",
  ghost: "bg-transparent border border-glass-border-light dark:border-glass-border-dark text-ink dark:text-ink-dark hover:bg-surface-light dark:hover:bg-glass-dark",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-6 py-3",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}