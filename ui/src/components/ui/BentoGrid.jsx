/**
 * Responsive bento grid. Children control their own span via `span` prop
 * on GlassCard-wrapped items, e.g. <BentoGrid.Item span="col-span-2">.
 */
export default function BentoGrid({ children, className = "" }) {
  return (
    <div
      className={`
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        auto-rows-[minmax(140px,auto)] gap-4 ${className}
      `}
    >
      {children}
    </div>
  );
}

BentoGrid.Item = function BentoItem({ children, span = "", className = "" }) {
  return <div className={`${span} ${className}`}>{children}</div>;
};