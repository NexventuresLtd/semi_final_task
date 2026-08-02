import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X, Phone } from "lucide-react";
import Button from "../ui/Button";
import QualificationBadgeChip from "../ui/QualificationBadgeChip";
import { REFEREE_ROLES } from "../../utils/constants";
import { useRefereeContacts, useCreateAssignment } from "../../hooks/useReferee";

export default function AssignmentFormModal({ open, onClose, defaultDate }) {
  const { data: referees } = useRefereeContacts();
  const createAssignment = useCreateAssignment();
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues: { match_date: defaultDate || "" } });

  const selectedId = watch("referee_contact_id");
  const selectedReferee = referees?.find((r) => r.id === selectedId);

  const onSubmit = async (data) => {
    await createAssignment.mutateAsync({ ...data, match_date: new Date(data.match_date).toISOString() });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 rounded-2xl bg-white dark:bg-surface-dark shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-ink dark:text-ink-dark">New assignment</h3>
              <button onClick={onClose} className="cursor-pointer"><X className="w-4 h-4 text-ink dark:text-ink-dark cursor-pointer" /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">Match title</label>
                <input {...register("match_title", { required: true })} placeholder="e.g. APR FC vs Rayon Sports"
                  className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">Date & time</label>
                  <input type="datetime-local" {...register("match_date", { required: true })}
                    className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">Venue</label>
                  <input {...register("venue")} placeholder="Stadium"
                    className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">Role</label>
                <select {...register("role")} className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue">
                  {REFEREE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="border-t border-glass-border-light dark:border-glass-border-dark pt-3">
                <label className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5 block">Referee</label>
                {referees?.length ? (
                  <select {...register("referee_contact_id", { required: true })} className="w-full rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue">
                    <option value="">Select a referee</option>
                    {referees.map((r) => <option key={r.id} value={r.id}>{r.fullName}</option>)}
                  </select>
                ) : (
                  <p className="text-xs text-danger">No referees on the roster yet — add one on the Referee Roster page first.</p>
                )}

                {selectedReferee && (
                  <div className="mt-3 rounded-lg border border-glass-border-light dark:border-glass-border-dark p-3 bg-surface-light dark:bg-glass-dark">
                    <p className="text-sm font-medium text-ink dark:text-ink-dark mb-1.5">{selectedReferee.fullName}</p>
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-ink-muted-dark mb-1.5">
                      <Phone className="w-3 h-3" /> {selectedReferee.phoneNumber || "No phone on file"}
                    </div>
                    <QualificationBadgeChip badge={selectedReferee.qualificationBadge} />
                  </div>
                )}
              </div>

              <Button type="submit" loading={createAssignment.isPending} className="w-full mt-2 cursor-pointer" disabled={!referees?.length}>
                Create assignment
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}