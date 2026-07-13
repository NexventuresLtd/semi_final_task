import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, LayoutList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TemplateBuilderForm from "../../components/templates/TemplateBuilderForm";
import TemplateCard from "../../components/templates/TemplateCard";
import GlassCard from "../../components/ui/GlassCard";
import { useTemplates, useDeleteTemplate } from "../../hooks/useTemplates";

export default function TemplatesPage() {
  const [tab, setTab] = useState("view"); // "view" | "add"
  const { data: templates, isLoading } = useTemplates();
  const deleteTemplate = useDeleteTemplate();
  const navigate = useNavigate();

  return (
    <>
      <Helmet><title>Templates — FERWAFA Approvals</title></Helmet>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">Templates</h1>
        <div className="flex gap-1.5 p-1 rounded-lg bg-surface-light dark:bg-glass-dark">
          <button
            onClick={() => setTab("view")}
            className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-md text-sm font-medium transition-colors ${tab === "view" ? "bg-blue text-white" : "text-ink-muted dark:text-ink-muted-dark"}`}
          >
            <LayoutList className="w-3.5 h-3.5" /> My templates
          </button>
          <button
            onClick={() => setTab("add")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${tab === "add" ? "bg-blue text-white" : "text-ink-muted dark:text-ink-muted-dark"}`}
          >
            <Plus className="w-3.5 h-3.5" /> Add template
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "view" ? (
          <motion.div key="view" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-surface-light dark:bg-glass-dark animate-pulse" />)}
              </div>
            ) : templates?.length ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    onDelete={(t) => deleteTemplate.mutate(t.id)}
                    onUse={(t) => navigate("/staff/new-request", { state: { templateId: t.id } })}
                  />
                ))}
              </div>
            ) : (
              <GlassCard className="text-center py-10">
                <p className="text-ink-muted dark:text-ink-muted-dark mb-4">No templates saved yet.</p>
              </GlassCard>
            )}
          </motion.div>
        ) : (
          <motion.div key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <TemplateBuilderForm onCreated={() => setTab("view")} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}