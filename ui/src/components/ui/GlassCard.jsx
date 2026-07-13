import { motion } from "framer-motion";

/**
 * Base glass panel used across the app: dashboards, forms, modals.
 * `interactive` adds hover lift for clickable cards (e.g. request cards).
 */
export default function GlassCard({
  children,
  className = "",
  interactive = false,
  as: Tag = "div",
  ...props
}) {
  const Component = motion[Tag] || motion.div;

  return (
    <Component
      className={`glass-panel p-5 ${interactive ? "cursor-pointer" : ""} ${className}`}
      whileHover={interactive ? { y: -3, scale: 1.005 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      {...props}
    >
      {children}
    </Component>
  );
}