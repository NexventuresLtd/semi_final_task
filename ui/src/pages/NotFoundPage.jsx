import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-glass-light dark:bg-glass-dark flex items-center justify-center mx-auto mb-4">
          <Compass className="w-6 h-6 text-emerald" />
        </div>
        <h1 className="font-display text-3xl font-semibold mb-2">404</h1>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-6">
          This page doesn't exist, or you don't have a bookmark worth keeping.
        </p>
        <Link to="/">
          <Button className="w-full cursor-pointer">Take me home</Button>
        </Link>
      </GlassCard>
    </div>
  );
}