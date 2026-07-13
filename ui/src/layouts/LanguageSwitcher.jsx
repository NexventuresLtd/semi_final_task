import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "rw", label: "Kinyarwanda" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("ferwafa-lang", code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className="glass-panel flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium"
      >
        <Globe className="w-4 h-4 text-emerald" />
        <span className="uppercase">{i18n.language}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass-panel absolute right-0 mt-2 w-44 py-1.5 z-50"
          >
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => changeLang(lang.code)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-emerald-soft transition-colors"
                >
                  {lang.label}
                  {i18n.language === lang.code && (
                    <Check className="w-4 h-4 text-emerald" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}