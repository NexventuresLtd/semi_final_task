import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-danger-soft flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6 text-danger" />
        </div>
        <h1 className="font-display text-2xl font-semibold mb-2">Access restricted</h1>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-6">
          Your role doesn't have permission to view this page. If you think this is a mistake, contact your Secretary General.
        </p>
        <Link to="/login">
          <Button variant="ghost" className="w-full cursor-pointer">Back to sign in</Button>
        </Link>
      </GlassCard>
    </div>
  );
}