import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-danger-soft flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6 text-danger" />
        </div>
        <h1 className="font-display text-2xl font-semibold mb-2">{t("errors.unauthorizedTitle")}</h1>
        <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-6">
          {t("errors.unauthorizedDesc")}
        </p>
        <Link to="/login">
          <Button variant="ghost" className="w-full cursor-pointer">{t("errors.backToSignIn")}</Button>
        </Link>
      </GlassCard>
    </div>
  );
}