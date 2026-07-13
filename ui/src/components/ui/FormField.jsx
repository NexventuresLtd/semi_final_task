import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Floating-label input with icon slot, focus glow, and animated error text.
 * Used across every auth form so inputs feel consistent and considered.
 */
export default function FormField({
  label,
  icon: Icon,
  error,
  type = "text",
  registration,
  className = "",
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={className}>
      <div
        className={`
          relative flex items-center rounded-lg border bg-white transition-colors duration-150
          ${error ? "border-danger" : focused ? "border-blue" : "border-glass-border-light"}
        `}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 ml-3.5 shrink-0 transition-colors ${
              error ? "text-danger" : focused ? "text-blue" : "text-ink-muted"
            }`}
          />
        )}
        <div className="relative flex-1">
          <input
            type={type}
            placeholder=" "
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              registration?.onBlur?.(e);
            }}
            className="peer w-full bg-transparent px-3.5 pt-5 pb-2 text-sm text-ink outline-none placeholder-transparent"
            {...registration}
            {...props}
          />
          <label
            className="
              pointer-events-none absolute left-3.5 top-3.5 text-sm text-ink-muted
              transition-all duration-150 origin-left
              peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
              peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-blue
              not-placeholder-shown:top-1.5 not-placeholder-shown:text-[11px]
            "
          >
            {label}
          </label>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-danger text-xs mt-1.5 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}