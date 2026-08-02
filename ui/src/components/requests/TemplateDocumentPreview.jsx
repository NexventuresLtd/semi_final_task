import { forwardRef } from "react";
import logo from "../../assets/logos/ferwafa-logo.png";

/**
 * Renders the filled template as a formal document with three signature
 * slots (Staff → DAF → SG). Each slot shows the captured signature image
 * plus a timestamp/actor audit line the moment that stage approves —
 * the image alone is decorative; the audit line is what actually proves it.
 */
const TemplateDocumentPreview = forwardRef(function TemplateDocumentPreview(
  { template, values, signatures = {} },
  ref
) {
  return (
    <div ref={ref} className="bg-white border border-glass-border-light rounded-xl p-8 max-w-2xl mx-auto shadow-sm">
      <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-ink">
        <img src={logo} alt="FERWAFA" className="w-14 h-14 object-contain" />
        <div>
          <p className="font-display font-bold text-ink text-lg">FERWAFA</p>
          <p className="text-xs text-ink-muted uppercase tracking-wide">Rwanda Football Federation — All Departments</p>
        </div>
      </div>

      <h2 className="font-display font-semibold text-center text-ink mb-6 uppercase tracking-wide text-sm">
        {template?.name}
      </h2>

      <div className="flex flex-col gap-3 mb-8">
        {template?.fields?.map((field) => (
          <div key={field.label} className="flex border-b border-glass-border-light pb-1.5">
            <span className="w-40 shrink-0 text-xs font-medium text-ink-muted uppercase">{field.label}</span>
            <span className="text-sm text-ink flex-1">{values?.[field.label] || "—"}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-glass-border-light">
        <SignatureSlot label="Staff" role="staff" signatures={signatures} />
        <SignatureSlot label="DAF" role="daf" signatures={signatures} />
        <SignatureSlot label="Secretary General" role="sg" signatures={signatures} />
      </div>
    </div>
  );
});

function SignatureSlot({ label, role, signatures }) {
  const sig = signatures[role];

  return (
    <div className="text-center">
      <div className="h-16 flex items-end justify-center border-b border-ink mb-1.5">
        {sig ? (
          <img src={sig.image} alt={`${sig.name} signature`} className="h-14 object-contain" />
        ) : (
          <span className="text-xs text-ink-muted italic pb-2">Pending</span>
        )}
      </div>
      <p className="text-xs font-medium text-ink">{label}</p>
      {sig ? (
        <p className="text-[10px] text-ink-muted font-mono mt-0.5">
          {sig.name} · {new Date(sig.timestamp).toLocaleString()}
        </p>
      ) : (
        <p className="text-[10px] text-ink-muted">Awaiting signature</p>
      )}
    </div>
  );
}

export default TemplateDocumentPreview;