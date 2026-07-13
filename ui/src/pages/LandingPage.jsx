import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileCheck2, Bell, Lock } from "lucide-react";
import Button from "../components/ui/Button";
import LogoWatermark from "../components/ui/LogoWatermark";
import HeroApprovalDemo from "../components/landing/HeroApprovalDemo";
import logo from "../assets/logos/ferwafa-logo.png";

const PROCESS = [
  {
    n: "01",
    title: "Ferwafa Department",
    desc: "A memo or purchase order is created and sent for review — nothing moves until it's complete.",
  },
  {
    n: "02",
    title: "DAF reviews",
    desc: "The Director of Finance approves or sends it back with a reason. No stage is ever skipped.",
  },
  {
    n: "03",
    title: "SG confirms",
    desc: "The Secretary General gives the final decision. The accountant is notified the moment it happens.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-bg-light">
      <LogoWatermark />

      <header className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="FERWAFA" className="w-8 h-8 object-contain" />
          <span className="font-display text-blue-500 font-semibold text-lg tracking-tight">FERWAFA · 
            <span className="text-green-500">Departments </span>
          </span>
        </div>
        <Link to="/login">
          <Button className="cursor-pointer" size="sm">Sign in</Button>
        </Link>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16">
        {/* Hero — asymmetric split */}
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center pt-10 pb-20 lg:pt-16 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs  font-medium tracking-[0.15em] uppercase text-blue mb-4">
              Ferwafa Departments · Internal System
            </p>
            <h1 className="font-display text-blue-400 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.08] max-w-xl">
              Digital requisition to signature,
              <br />
              without the paper trail.
            </h1>
            <p className="text-ink-muted max-w-md mt-5 text-[15px] leading-relaxed">
              Every Request moves from Initiator to DAF to
              Secretary General in strict order — tracked, notified, and
              recorded at each step.
            </p>

            <div className="flex flex-wrap gap-3 mt-8 items-center">
              <Link to="/login">
                <Button size="lg" className="gap-1.5 cursor-pointer">
                  Sign in <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/create-account">
                <button className="text-sm cursor-pointer text-blue-500 border-1 border-blue-500/20 rounded-md p-[13px]" size="lg">I have an invitation</button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-12 pt-8 border-t border-glass-border-light">
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <FileCheck2 className="w-4 h-4 text-blue" /> Three-stage approval
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Bell className="w-4 h-4 text-blue" /> Notified at every step
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Lock className="w-4 h-4 text-blue" /> Invitation-only access
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

        {/* Process — numbered because order genuinely carries meaning here */}
        <section className="py-16 border-t border-glass-border-light">
          <h2 className="font-display text-2xl text-gray-500 font-semibold mb-10 max-w-md">
            How a request moves through the system
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PROCESS.map((step) => (
              <div key={step.n} className="relative text-blue-500">                
                <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-glass-border-light mt-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="FERWAFA" className="w-6 h-6 object-contain" />
            <span className="text-xs text-ink-muted">
              © {new Date().getFullYear()} Rwanda Football Federation — Ferwafa Departments
            </span>
          </div>
          <Link to="/login" className="text-xs text-blue hover:underline">
            Sign in to your account
          </Link>
        </div>
      </footer>
    </div>
  );
}