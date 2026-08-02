const STYLES = {
  scheduled: "bg-gold-soft text-gold",
  confirmed: "bg-green-soft text-green",
  declined: "bg-danger-soft text-danger",
};
const LABELS = { scheduled: "Scheduled", confirmed: "Confirmed", declined: "Declined" };

export default function AssignmentStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}