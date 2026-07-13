import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileStack } from "lucide-react";
import { useTemplates } from "../../hooks/useTemplates";
import TemplateFillForm from "../../components/requests/TemplateFillForm";
import GlassCard from "../../components/ui/GlassCard";

export default function NewRequestPage() {
  const { state } = useLocation();
  const { data: templates, isLoading } = useTemplates();
  const [selected, setSelected] = useState(null);

  const activeTemplate = selected || templates?.find((t) => t.id === state?.templateId);

  return (
    <>
      <Helmet><title>New Request — FERWAFA Approvals</title></Helmet>

      {!activeTemplate ? (
        <>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark mb-1">Choose a template</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-6">
            Pick the saved template that matches your request.
          </p>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-surface-light dark:bg-glass-dark animate-pulse" />)}
            </div>
          ) : templates?.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <GlassCard key={tpl.id} interactive onClick={() => setSelected(tpl)} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-soft flex items-center justify-center shrink-0">
                    <FileStack className="w-4 h-4 text-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink dark:text-ink-dark">{tpl.name}</p>
                    <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{tpl.fields?.length || 0} fields</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard className="text-center py-10">
              <p className="text-ink-muted dark:text-ink-muted-dark">No templates yet — create one under Templates first.</p>
            </GlassCard>
          )}
        </>
      ) : (
        <TemplateFillForm template={activeTemplate} />
      )}
    </>
  );
}