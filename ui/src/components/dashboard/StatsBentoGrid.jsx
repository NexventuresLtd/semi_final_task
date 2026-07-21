import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Users } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import BentoGrid from "../ui/BentoGrid";

const ICONS = { pending: Clock, approved: CheckCircle2, rejected: XCircle, users: Users };
const COLORS = {
  pending: "text-gold bg-gold-soft",
  approved: "text-green bg-green-soft",
  rejected: "text-danger bg-danger-soft",
  users: "text-blue bg-blue-soft",
};

export default function StatsBentoGrid({ stats }) {
  return (
    <BentoGrid>
      {stats.map((stat) => {
        const Icon = ICONS[stat.key] || Clock;
        return (
          <BentoGrid.Item key={stat.label} span={stat.span || "col-span-1"}>
            <GlassCard  className="h-full flex flex-col justify-between">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${COLORS[stat.key]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="mt-4">
                <p className="font-display text-3xl font-semibold text-ink">{stat.value}</p>
                <p className="text-sm text-ink-muted mt-0.5">{stat.label}</p>
              </div>
            </GlassCard>
          </BentoGrid.Item>
        );
      })}
    </BentoGrid>
  );
}