import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import { REQUEST_TYPES, TEMPLATE_FIELD_TYPES } from "../../utils/constants";
import { useCreateTemplate } from "../../hooks/useTemplates";

const DEFAULT_FIELDS = [
  { label: "Requested By", type: "text" },
  { label: "Subject", type: "text" },
  { label: "Date", type: "date" },
  { label: "Description", type: "textarea" },
  { label: "Activity", type: "text" },
  { label: "Amount Requested", type: "number" },
];

export default function TemplateBuilderForm({ onCreated }) {
  const createTemplate = useCreateTemplate();
  const [templateName, setTemplateName] = useState("");
  const [requestType, setRequestType] = useState("");

  const { register, control, handleSubmit } = useForm({
    defaultValues: { fields: DEFAULT_FIELDS },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "fields" });

  const onSubmit = async (data) => {
    if (!templateName.trim() || !requestType) return;
    await createTemplate.mutateAsync({
      name: templateName,
      request_type: requestType,
      fields: data.fields,
    });
    onCreated?.();
  };

  return (
    <GlassCard className="max-w-2xl">
      <h2 className="font-display font-semibold text-ink dark:text-ink-dark mb-1">New template</h2>
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-5">
        Define the fields staff will fill in every time this template is used.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">Template name</label>
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. Standard Purchase Order"
              className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">Applies to request type</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
            >
              <option value="">Select a type</option>
              {REQUEST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-glass-border-light dark:border-glass-border-dark pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-ink dark:text-ink-dark">Fields</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ label: "", type: "text" })}
              className="gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add field
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
                <input
                  {...register(`fields.${i}.label`)}
                  placeholder="Field label"
                  className="flex-1 rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3 py-2 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
                />
                <select
                  {...register(`fields.${i}.type`)}
                  className="rounded-lg border border-glass-border-light dark:border-glass-border-dark px-2 py-2 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
                >
                  {TEMPLATE_FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <button type="button" onClick={() => remove(i)} className="p-2 rounded-lg hover:bg-danger-soft shrink-0">
                  <Trash2 className="w-4 h-4 text-danger" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-muted dark:text-ink-muted-dark bg-surface-light dark:bg-glass-dark rounded-lg p-3">
          Every template automatically includes three signature slots — Staff, DAF, and SG — filled in as the request moves through approval. You don't need to add these yourself.
        </p>

        <Button type="submit" loading={createTemplate.isPending} className="w-fit cursor-pointer">
          Save template
        </Button>
      </form>
    </GlassCard>
  );
}