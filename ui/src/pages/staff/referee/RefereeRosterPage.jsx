import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Phone, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import GlassCard from "../../../components/ui/GlassCard";
import Button from "../../../components/ui/Button";
import QualificationBadgeChip from "../../../components/ui/QualificationBadgeChip";
import { QUALIFICATION_BADGES } from "../../../utils/constants";
import { useRefereeContacts, useCreateContact, useUpdateContact, useDeleteContact } from "../../../hooks/useReferee";

export default function RefereeRosterPage() {
  const { data: referees, isLoading } = useRefereeContacts();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newBadge, setNewBadge] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBadge, setEditBadge] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await createContact.mutateAsync({ full_name: newName, phone_number: newPhone || null, qualification_badge: newBadge || null });
    setNewName(""); setNewPhone(""); setNewBadge(""); setAdding(false);
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditName(r.fullName);
    setEditPhone(r.phoneNumber || "");
    setEditBadge(r.qualificationBadge || "");
  };

  const saveEdit = (id) => {
    updateContact.mutate(
      { id, payload: { full_name: editName, phone_number: editPhone, qualification_badge: editBadge || null } },
      { onSuccess: () => setEditingId(null) }
    );
  };

  const inputClass = "rounded-lg border border-glass-border-light dark:border-glass-border-dark px-2.5 py-1.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue";

  return (
    <>
      <Helmet><title>Referee Roster — FERWAFA Approvals</title></Helmet>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">Referee Roster</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
            Manage the officials you assign to matches — name, contact, and qualification badge.
          </p>
        </div>
        <Button onClick={() => setAdding((a) => !a)} className="gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Add referee
        </Button>
      </div>

      {adding && (
        <GlassCard className="mb-4">
          <div className="grid sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark mb-1 block">Full name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Jean Bosco Habimana" className={`${inputClass} w-full`} />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark mb-1 block">Mobile phone</label>
              <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+250 7XX XXX XXX" className={`${inputClass} w-full`} />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark mb-1 block">Badge</label>
              <select value={newBadge} onChange={(e) => setNewBadge(e.target.value)} className={`${inputClass} w-full`}>
                <option value="">No badge</option>
                {QUALIFICATION_BADGES.map((b) => <option key={b.value} value={b.value}>{`[${b.level}] ${b.label}`}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} loading={createContact.isPending} size="sm" className="flex-1 cursor-pointer">Save</Button>
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)} className="cursor-pointer">Cancel</Button>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard>
        {isLoading ? (
          <div className="h-40 rounded-lg bg-surface-light dark:bg-glass-dark animate-pulse" />
        ) : referees?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs text-ink-muted dark:text-ink-muted-dark border-b border-glass-border-light dark:border-glass-border-dark">
                  <th className="pb-2 font-medium">Full name</th>
                  <th className="pb-2 font-medium">Mobile phone</th>
                  <th className="pb-2 font-medium">Qualification badge</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {referees.map((r) => {
                  const isEditing = editingId === r.id;
                  return (
                    <tr key={r.id} className="border-b border-glass-border-light dark:border-glass-border-dark last:border-0">
                      <td className="py-3">
                        {isEditing ? (
                          <input value={editName} onChange={(e) => setEditName(e.target.value)} className={inputClass} />
                        ) : (
                          <span className="font-medium text-ink dark:text-ink-dark">{r.fullName}</span>
                        )}
                      </td>
                      <td className="py-3">
                        {isEditing ? (
                          <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className={inputClass} />
                        ) : (
                          <span className="flex items-center gap-1.5 text-ink-muted dark:text-ink-muted-dark">
                            <Phone className="w-3.5 h-3.5" /> {r.phoneNumber || "—"}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {isEditing ? (
                          <select value={editBadge} onChange={(e) => setEditBadge(e.target.value)} className={inputClass}>
                            <option value="">No badge</option>
                            {QUALIFICATION_BADGES.map((b) => <option key={b.value} value={b.value}>{`[${b.level}] ${b.label}`}</option>)}
                          </select>
                        ) : (
                          <QualificationBadgeChip badge={r.qualificationBadge} />
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => saveEdit(r.id)} className="p-1.5 rounded-lg hover:bg-green-soft cursor-pointer">
                              <Check className="w-4 h-4 text-green" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-danger-soft cursor-pointer">
                              <X className="w-4 h-4 text-danger" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => startEdit(r)} className="p-1.5 rounded-lg hover:bg-surface-light dark:hover:bg-glass-dark cursor-pointer">
                              <Pencil className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark" />
                            </button>
                            <button onClick={() => setConfirmDelete(r)} className="p-1.5 rounded-lg hover:bg-danger-soft cursor-pointer">
                              <Trash2 className="w-4 h-4 text-danger" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-10">No referees added yet.</p>
        )}
      </GlassCard>

      {confirmDelete && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="max-w-sm">
            <p className="font-medium text-ink dark:text-ink-dark mb-2">Remove {confirmDelete.fullName}?</p>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark mb-4">
              They'll be removed from the active roster. Past assignments and evaluations stay intact.
            </p>
            <div className="flex gap-2">
              <Button variant="danger" className="flex-1" onClick={() => { deleteContact.mutate(confirmDelete.id); setConfirmDelete(null); }}>Remove</Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}