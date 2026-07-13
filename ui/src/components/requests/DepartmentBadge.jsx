import { DEPARTMENT_LABEL } from "../../utils/constants";

// Distinct hue per department, kept muted so it reads as metadata,
// not competing with status color (green/gold/red) for attention.
const COLORS = {
  finance: "bg-blue-soft text-blue",
  club_licensing: "bg-gold-soft text-gold",
  referee: "bg-green-soft text-green",
  development: "bg-blue-soft text-blue",
  competition: "bg-gold-soft text-gold",
  legal: "bg-danger-soft text-danger",
  marketing_comms: "bg-green-soft text-green",
  hr_contracts: "bg-blue-soft text-blue",
};

export default function DepartmentBadge({ department, size = "sm" }) {
  if (!department) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${COLORS[department] || "bg-surface-light text-ink-muted"} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      {DEPARTMENT_LABEL[department] || department}
    </span>
  );
}