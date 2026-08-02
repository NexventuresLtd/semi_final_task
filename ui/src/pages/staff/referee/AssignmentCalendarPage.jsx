import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, ChevronLeft, ChevronRight, MapPin, Trash2 } from "lucide-react";
import GlassCard from "../../../components/ui/GlassCard";
import Button from "../../../components/ui/Button";
import AssignmentFormModal from "../../../components/referee/AssignmentFormModal";
import AssignmentStatusBadge from "../../../components/referee/AssignmentStatusBadge";
import { useAssignments, useUpdateAssignmentStatus, useDeleteAssignment } from "../../../hooks/useReferee";

function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function daysInMonth(date) { return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); }

export default function AssignmentCalendarPage() {
  const { data: assignments } = useAssignments();
  const updateStatus = useUpdateAssignmentStatus();
  const deleteAssignment = useDeleteAssignment();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(null);

  const byDay = useMemo(() => {
    const map = {};
    (assignments || []).forEach((a) => {
      const key = new Date(a.matchDate).toDateString();
      map[key] = map[key] || [];
      map[key].push(a);
    });
    return map;
  }, [assignments]);

  const firstDayOffset = startOfMonth(viewMonth).getDay();
  const totalDays = daysInMonth(viewMonth);
  const cells = [...Array(firstDayOffset).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];

  const dayAssignments = selectedDay
    ? byDay[new Date(viewMonth.getFullYear(), viewMonth.getMonth(), selectedDay).toDateString()] || []
    : [];

  return (
    <>
      <Helmet><title>Assignment Calendar — FERWAFA Approvals</title></Helmet>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">Assignment Calendar</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Assign referees from your roster to upcoming matches</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> New assignment
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-glass-dark cursor-pointer">
              <ChevronLeft className="w-4 h-4 text-ink dark:text-ink-dark" />
            </button>
            <p className="font-display font-semibold text-ink dark:text-ink-dark">{viewMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
            <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-glass-dark cursor-pointer">
              <ChevronRight className="w-4 h-4 text-ink dark:text-ink-dark" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-ink-muted dark:text-ink-muted-dark mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateKey = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day).toDateString();
              const dayItems = byDay[dateKey] || [];
              return (
                <button key={i} onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-lg border text-sm flex flex-col items-center justify-center cursor-pointer gap-0.5 transition-colors ${
                    selectedDay === day ? "border-blue bg-blue-soft" : "border-glass-border-light dark:border-glass-border-dark hover:bg-surface-light dark:hover:bg-glass-dark"
                  }`}
                >
                  <span className="text-ink dark:text-ink-dark">{day}</span>
                  {dayItems.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue" />}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-medium text-ink dark:text-ink-dark mb-3">
            {selectedDay ? `${viewMonth.toLocaleDateString(undefined, { month: "short" })} ${selectedDay}` : "Select a day"}
          </p>
          {dayAssignments.length ? (
            <div className="flex flex-col gap-3">
              {dayAssignments.map((a) => (
                <div key={a.id} className="rounded-lg border border-glass-border-light dark:border-glass-border-dark p-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-medium text-ink dark:text-ink-dark">{a.matchTitle}</p>
                    <button onClick={() => deleteAssignment.mutate(a.id)} className="p-1 rounded hover:bg-danger-soft shrink-0">
                      <Trash2 className="w-3.5 h-3.5 text-danger" />
                    </button>
                  </div>
                  <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{a.role} · {a.refereeName}</p>
                  {a.venue && <p className="text-xs text-ink-muted dark:text-ink-muted-dark flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {a.venue}</p>}

                  <div className="flex items-center justify-between mt-2.5">
                    <AssignmentStatusBadge status={a.status} />
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus.mutate({ id: a.id, payload: { status: e.target.value } })}
                      className="text-xs rounded-lg border border-glass-border-light dark:border-glass-border-dark px-2 py-1 bg-transparent text-ink dark:text-ink-dark outline-none"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-8">No assignments this day.</p>
          )}
        </GlassCard>
      </div>

      <AssignmentFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}