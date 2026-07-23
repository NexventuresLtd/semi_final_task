import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import TemplateDocumentPreview from "./TemplateDocumentPreview";
import { useCreateRequest } from "../../hooks/useRequests";
import { useAuthStore } from "../../store/authStore";

export default function TemplateFillForm({ template }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const createRequest = useCreateRequest();
  const [values, setValues] = useState({});

  const handleChange = (label, value) => setValues((v) => ({ ...v, [label]: value }));

  const signatures = user?.signatureImage
    ? { staff: { image: user.signatureImage, name: user.name, timestamp: new Date().toISOString() } }
    : {};

  const handleSubmit = async () => {
    if (!user?.signatureImage) {
      toast.error("Add your digital signature in Settings before submitting a request.");
      return;
    }
    try {
      await createRequest.mutateAsync({
        template_id: template.id,
        type: template.request_type,
        title: values["Subject"] || template.name,
        field_values: values,
      });
      toast.success("Request submitted — sent to DAF for review");
      navigate("/staff/my-requests");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit request");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <GlassCard>
        <h2 className="font-display font-semibold text-ink dark:text-ink-dark mb-4">Fill in the details</h2>
        <div className="flex flex-col gap-4">
          {template.fields?.map((field) => (
            <div key={field.label}>
              <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
                />
              )}
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit} loading={createRequest.isPending} className="w-full mt-6 gap-1.5 cursor-pointer">
          <Send className="w-4 h-4" /> Submit for approval
        </Button>
      </GlassCard>

      <div>
        <p className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark uppercase tracking-wide mb-2">
          Live preview
        </p>
        <TemplateDocumentPreview template={template} values={values} signatures={signatures} />
      </div>
    </div>
  );
}