import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { ClipboardCheck, Star } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import GlassCard from "../../../components/ui/GlassCard";
import Button from "../../../components/ui/Button";
import EvaluationFormModal from "../../../components/referee/EvaluationFormModal";
import { useAssignments, useEvaluations, useRefereeContacts } from "../../../hooks/useReferee";

export default function GradingPage() {
  const { data: referees } = useRefereeContacts();
  const [selectedRefereeId, setSelectedRefereeId] = useState(null);
  const { data: assignments } = useAssignments();
  const { data: evaluations, isLoading } = useEvaluations(selectedRefereeId);
  const [evalTarget, setEvalTarget] = useState(null);

  const confirmedNeedingGrade = useMemo(() => {
    if (!assignments) return [];
    const gradedIds = new Set((evaluations || []).map((e) => e.assignmentId));
    return assignments.filter((a) => a.status === "confirmed" && new Date(a.matchDate) < new Date() && !gradedIds.has(a.id));
  }, [assignments, evaluations]);

  const radarData = useMemo(() => {
    if (!evaluations?.length) return [];
    const avg = (key) => evaluations.reduce((sum, e) => sum + e[key], 0) / evaluations.length;
    return [
      { criterion: "Fitness", score: avg("fitnessScore") },
      { criterion: "Decisions", score: avg("decisionMakingScore") },
      { criterion: "Management", score: avg("gameManagementScore") },
      { criterion: "Positioning", score: avg("positioningScore") },
    ];
  }, [evaluations]);

  return (
    <>
      <Helmet><title>Grading — FERWAFA Approvals</title></Helmet>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">Grading</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Evaluate referee performance after each match</p>
        </div>
        <select
          value={selectedRefereeId || ""}
          onChange={(e) => setSelectedRefereeId(e.target.value || null)}
          className="rounded-lg border border-glass-border-light dark:border-glass-border-dark px-3.5 py-2.5 text-sm bg-transparent text-ink dark:text-ink-dark outline-none focus:border-blue"
        >
          <option value="">All referees</option>
          {referees?.map((r) => <option key={r.id} value={r.id}>{r.fullName}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="lg:col-span-1">
          <p className="text-sm font-medium text-ink dark:text-ink-dark mb-3">Average performance</p>
          {radarData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-glass-border-light)" />
                <PolarAngleAxis dataKey="criterion" tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }} />
                <Radar dataKey="score" stroke="#0F6FA8" fill="#0F6FA8" fillOpacity={0.35} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-10">No evaluations yet.</p>
          )}
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <p className="text-sm font-medium text-ink dark:text-ink-dark mb-3">Awaiting evaluation</p>
          {confirmedNeedingGrade.length ? (
            <div className="flex flex-col gap-2">
              {confirmedNeedingGrade.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-glass-border-light dark:border-glass-border-dark p-3">
                  <div>
                    <p className="text-sm font-medium text-ink dark:text-ink-dark">{a.matchTitle}</p>
                    <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{a.refereeName} · {a.role}</p>
                  </div>
                  <Button size="sm" onClick={() => setEvalTarget(a)} className="gap-1.5">
                    <ClipboardCheck className="w-3.5 h-3.5" /> Grade
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-8">Nothing pending.</p>
          )}
        </GlassCard>
      </div>

      <GlassCard>
        <p className="text-sm font-medium text-ink dark:text-ink-dark mb-3">Evaluation history</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-ink-muted dark:text-ink-muted-dark border-b border-glass-border-light dark:border-glass-border-dark">
                <th className="pb-2 font-medium">Match</th>
                <th className="pb-2 font-medium">Referee</th>
                <th className="pb-2 font-medium">Overall</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {evaluations?.map((e) => (
                <tr key={e.id} className="border-b border-glass-border-light dark:border-glass-border-dark last:border-0">
                  <td className="py-2.5 text-ink dark:text-ink-dark">{e.matchTitle}</td>
                  <td className="py-2.5 text-ink-muted dark:text-ink-muted-dark">{e.refereeName}</td>
                  <td className="py-2.5"><span className="inline-flex items-center gap-1 text-gold font-medium"><Star className="w-3.5 h-3.5 fill-gold" /> {e.overallScore}</span></td>
                  <td className="py-2.5 text-ink-muted dark:text-ink-muted-dark">{new Date(e.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!evaluations?.length && !isLoading && <p className="text-sm text-ink-muted dark:text-ink-muted-dark text-center py-8">No evaluation records yet.</p>}
        </div>
      </GlassCard>

      <EvaluationFormModal open={!!evalTarget} onClose={() => setEvalTarget(null)} assignment={evalTarget} />
    </>
  );
}