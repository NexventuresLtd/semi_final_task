import { QUALIFICATION_BADGE_LABEL } from "../../utils/constants";

const COLORS = {
  youth_local: "bg-surface-light text-ink-muted dark:bg-glass-dark dark:text-ink-muted-dark",
  semi_pro: "bg-blue-soft text-blue",
  top_tier_national: "bg-green-soft text-green",
  caf: "bg-gold-soft text-gold",
  fifa: "bg-danger-soft text-danger",
};

export default function QualificationBadgeChip({ badge }) {
  if (!badge) return <span className="text-xs text-ink-muted dark:text-ink-muted-dark italic">Not set</span>;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${COLORS[badge] || ""}`}>
      {QUALIFICATION_BADGE_LABEL[badge] || badge}
    </span>
  );
}