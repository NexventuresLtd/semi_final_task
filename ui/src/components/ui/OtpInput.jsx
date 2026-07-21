import { useRef, useState, useEffect } from "react";

/**
 * Six individual boxes instead of one text field — auto-advances focus
 * as each digit is typed, supports paste, and backspace moves back a box.
 * This is the pattern real authenticator/banking apps use because it's
 * dramatically faster to scan visually than a single blank input.
 */
export default function OtpInput({ length = 6, value = "", onChange, error }) {
  const [digits, setDigits] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) setDigits(value.split("").slice(0, length).concat(Array(length).fill("")).slice(0, length));
  }, [value, length]);

  const emitChange = (next) => onChange?.(next.join(""));

  const handleChange = (i, raw) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = char;
    setDigits(next);
    emitChange(next);
    if (char && i < length - 1) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = pasted.split("").concat(Array(length).fill("")).slice(0, length);
    setDigits(next);
    emitChange(next);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            autoFocus={i === 0}
            className={`
              w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-semibold rounded-xl border-2
              text-ink outline-none transition-all
              ${error ? "border-danger" : digit ? "border-blue bg-blue-soft" : "border-glass-border-light bg-white"}
              focus:border-blue focus:ring-4 focus:ring-blue/10
            `}
          />
        ))}
      </div>
      {error && <p className="text-danger text-xs text-center mt-2">{error}</p>}
    </div>
  );
}