const STYLES = {
  pending: "bg-gold-soft text-gold",
  approved: "bg-green-soft text-green",
  rejected: "bg-danger-soft text-danger",
};

const LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function RequestStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}