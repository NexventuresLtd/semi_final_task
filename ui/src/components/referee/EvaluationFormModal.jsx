import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { useCreateEvaluation } from "../../hooks/useReferee";

const CRITERIA = [
  { key: "fitness_score", label: "Fitness" },
  { key: "decision_making_score", label: "Decision Making" },
  { key: "game_management_score", label: "Game Management" },
  { key: "positioning_score", label: "Positioning" },
];

export default function EvaluationFormModal({ open, onClose, assignment }) {
  const createEvaluation = useCreateEvaluation();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { fitness_score: 7, decision_making_score: 7, game_management_score: 7, positioning_score: 7 },
  });

  const onSubmit = async (data) => {
    await createEvaluation.mutateAsync({
      assignment_id: assignment.id,
      fitness_score: Number(data.fitness_score),
      decision_making_score: Number(data.decision_making_score),
      game_management_score: Number(data.game_management_score),
      positioning_score: Number(data.positioning_score),
      notes: data.notes,
    });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && assignment && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 rounded-2xl bg-white dark:bg-surface-dark shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-semibold text-ink dark:text-ink-dark">Evaluate performance</h3>
              <button onClick={onClose}><X className="w-4 h-4 text-ink dark:text-ink-dark" /></button>
            </div>
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark mb-4">{assignment.refereeName} · {assignment.matchTitle}</p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {CRITERIA.map((c) => (
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-ink dark:text-ink-dark">{c.label}</label>
                    <span className="text-xs font-mono text-blue">/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" step="0.5"
                    {...register(c.key)}
                    className="w-full accent-blue"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">Notes (optional)</label>
                <textarea {...register("notes")} rows={3}
                  className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue" />
              </div>

              <Button type="submit" loading={createEvaluation.isPending} className="w-full">
                Save evaluation
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}