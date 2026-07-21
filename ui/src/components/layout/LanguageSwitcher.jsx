import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FlagUS, FlagFR, FlagRW } from "../ui/FlagIcons";

const LANGUAGES = [
  { code: "en", label: "English", Flag: FlagUS },
  { code: "fr", label: "Français", Flag: FlagFR },
  { code: "rw", label: "Kinyarwanda", Flag: FlagRW },
];

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

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
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className="glass-panel flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium cursor-pointer"
      >
        <current.Flag className="w-4 h-4 rounded-[2px] shrink-0" />
        <span className="uppercase">{current.code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass-panel absolute right-0 mt-2 w-48 py-1.5 z-50"
          >
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => changeLang(lang.code)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-blue-soft transition-colors cursor-pointer"
                >
                  <lang.Flag className="w-4 h-4 rounded-[2px] shrink-0" />
                  <span className="flex-1 text-left">{lang.label}</span>
                  {i18n.language === lang.code && <Check className="w-4 h-4 text-blue" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}