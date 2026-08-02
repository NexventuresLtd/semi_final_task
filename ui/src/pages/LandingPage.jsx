import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileCheck2, Bell, Lock, Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import LogoWatermark from "../components/ui/LogoWatermark";
import HeroApprovalDemo from "../components/landing/HeroApprovalDemo";
import logo from "../assets/logos/ferwafa-logo.png";

export default function LandingPage() {
  const { t } = useTranslation();

  // Dark Mode Switcher logic
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const PROCESS = [
    { n: "01", title: t("landing.step1Title"), desc: t("landing.step1Desc") },
    { n: "02", title: t("landing.step2Title"), desc: t("landing.step2Desc") },
    { n: "03", title: t("landing.step3Title"), desc: t("landing.step3Desc") },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      {/* ================= BACKGROUND GEOMETRY (MATCHES AUTH PAGE) ================= */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100 dark:from-[#0c2856] dark:via-[#091b3a] dark:to-[#040d1c] transition-colors duration-300" />

        {/* Diagonal Ribbons (Yellow & Blue Layers) */}
        <div className="absolute -top-24 -right-24 w-[700px] h-[1000px] pointer-events-none opacity-20 dark:opacity-90 transition-opacity duration-300">
          <div className="absolute top-0 right-12 w-32 h-[120%] bg-amber-400 rotate-[-28deg] shadow-2xl transform origin-top-right transform-gpu" />
          <div className="absolute top-0 right-40 w-28 h-[120%] bg-yellow-500 rotate-[-28deg] shadow-2xl transform origin-top-right transform-gpu" />
          <div className="absolute top-0 right-64 w-36 h-[120%] bg-blue-600 rotate-[-28deg] shadow-2xl transform origin-top-right transform-gpu" />
          <div className="absolute top-0 right-96 w-44 h-[120%] bg-blue-800 rotate-[-28deg] shadow-2xl transform origin-top-right transform-gpu" />
        </div>

        {/* Soft Radial Ambient Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.15),transparent_50%)]" />
      </div>
      {/* =========================================================================== */}

      <LogoWatermark />

      <header className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <img src={logo} alt="FERWAFA" className="w-8 h-8 object-contain" />
          <span className="font-display text-slate-900 dark:text-white font-semibold text-lg tracking-tight">
            FERWAFA · <span className="text-emerald-600 dark:text-emerald-400">{t("landing.departmentsTag")}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Light / Dark Mode Switch Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-full bg-slate-200/50 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white backdrop-blur-md border border-slate-300/50 dark:border-white/10 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <Link to="/login">
            <Button className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg" size="sm">
              {t("landing.signIn")}
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center pt-10 pb-20 lg:pt-16 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-blue-600 dark:text-blue-300 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              {t("landing.eyebrowTag")}
            </p>
            <h1 className="font-display text-slate-900 dark:text-white text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] max-w-xl">
              {t("landing.heroTitlePart1")}
              <br />
              <span className="text-blue-600 dark:text-blue-200">{t("landing.heroTitlePart2")}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mt-5 text-[15px] leading-relaxed">
              {t("landing.heroSubtitle")}
            </p>

            <div className="flex flex-wrap gap-3 mt-8 items-center">
              <Link to="/login">
                <Button size="lg" className="gap-2 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xl">
                  {t("landing.signIn")} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/create-account">
                <button
                  className="text-sm cursor-pointer text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-400/30 bg-blue-50 dark:bg-white/5 backdrop-blur-md rounded-md p-[13px] hover:bg-blue-100 dark:hover:bg-white/10 transition-all"
                >
                  {t("landing.haveInvitation")}
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <FileCheck2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> {t("landing.threeStage")}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Bell className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> {t("landing.notifiedEveryStep")}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Lock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> {t("landing.invitationOnly")}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <HeroApprovalDemo />
          </motion.div>
        </section>

        {/* Process Section */}
        <section className="py-16 border-t border-slate-200 dark:border-white/10">
          <h2 className="font-display text-2xl text-slate-900 dark:text-white font-semibold mb-10 max-w-md">
            {t("landing.processTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PROCESS.map((step) => (
              <div key={step.n} className="relative bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-6 rounded-xl shadow-sm dark:shadow-none">
                <span className="text-amber-500 dark:text-amber-400 font-mono font-bold text-sm block mb-2">{step.n}</span>
                <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer styled like Auth sub-text */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 mt-8 bg-slate-100/80 dark:bg-black/20 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="FERWAFA" className="w-6 h-6 object-contain" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} {t("landing.footerNote")} · Kigali, Rwanda - FIFA Member Association
            </span>
          </div>
          <Link to="/login" className="text-xs text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 hover:underline transition-colors">
            {t("landing.signInToAccount")}
          </Link>
        </div>
      </footer>
    </div>
  );
}