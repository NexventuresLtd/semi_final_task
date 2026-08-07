import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell, LabelList } from "recharts";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";
import { useDepartmentRequests } from "../../hooks/useAnalytics";

// Professional color palette for departments
const DEPARTMENT_COLORS = [
  "#0F6FA8", // Blue
  "#1A7A4C", // Green
  "#C1454C", // Red
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F97316", // Orange
];

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function DepartmentRequestsBarChart() {
  const { t } = useTranslation();
  const [weekOffset, setWeekOffset] = useState(0);
  const { data, isLoading } = useDepartmentRequests(weekOffset);

  const handlePreviousWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => Math.max(0, prev - 1));
  };

  const handleCurrentWeek = () => {
    setWeekOffset(0);
  };

  // Transform data for the chart - group by day instead of department
  const chartData = DAY_KEYS.map((_, dayIndex) => {
    const dayData = { day: dayIndex };
    data?.departments?.forEach((dept, deptIndex) => {
      const dayCount = dept.days.find(d => d.day === dayIndex)?.count || 0;
      dayData[dept.department] = dayCount;
      dayData[`${dept.department}_color`] = DEPARTMENT_COLORS[deptIndex % DEPARTMENT_COLORS.length];
    });
    return dayData;
  }) || [];

  // Get day labels for Y axis
  const dayLabels = DAY_KEYS.map((key) => t(`days.${key}`));

  // Format week label
  const formatWeekLabel = () => {
    if (!data) return "";
    const startDate = new Date(data.weekStart);
    const endDate = new Date(data.weekEnd);
    const month = startDate.toLocaleDateString("en-US", { month: "long" });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    return `${month} ${startDay} - ${endDay}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dayIndex = label;
      return (
        <div className="bg-surface-dark/95 backdrop-blur-sm border border-glass-border-light dark:border-glass-border-dark rounded-lg p-3 shadow-xl">
          <p className="text-sm font-semibold text-ink dark:text-ink-dark mb-2">{dayLabels[dayIndex]}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-ink-muted dark:text-ink-muted-dark">
                {entry.dataKey}: 
              </span>
              <span className="font-medium text-ink dark:text-ink-dark">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-ink dark:text-ink-dark mb-1">
            {t("departmentRequests.title")}
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
            {t("departmentRequests.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousWeek}
            disabled={isLoading}
            className="cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCurrentWeek}
            disabled={weekOffset === 0 || isLoading}
            className="cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextWeek}
            disabled={weekOffset === 0 || isLoading}
            className="cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 glass-panel animate-pulse rounded-lg" />
      ) : !data || data.departments.length === 0 ? (
        <div className="h-80 flex items-center justify-center">
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
            {t("departmentRequests.noDataThisWeek")}
          </p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
              <XAxis 
                dataKey="day"
                tickFormatter={(dayIndex) => dayLabels[dayIndex]}
                tick={{ fontSize: 11, fill: "currentColor" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "currentColor" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(15, 111, 168, 0.1)" }} />
              <Legend 
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                iconType="circle"
              />
              
              {data?.departments?.map((dept, deptIndex) => (
                <Bar 
                  key={dept.department}
                  dataKey={dept.department}
                  fill={DEPARTMENT_COLORS[deptIndex % DEPARTMENT_COLORS.length]}
                  fillOpacity={0.85}
                  radius={[4, 4, 0, 0]}
                  name={dept.department}
                >
                  <LabelList 
                    dataKey={dept.department}
                    position="top"
                    formatter={(value) => {
                      const total = data.totalRequests;
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                      return percentage > 0 ? `${percentage}%` : '';
                    }}
                    style={{ fontSize: 10, fill: 'currentColor' }}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-glass-border-light dark:border-glass-border-dark">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark" />
              <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                {t("departmentRequests.weekOf")} {formatWeekLabel()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {data.departments.slice(0, 5).map((dept, index) => (
                <div key={dept.department} className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length] }}
                  />
                  <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                    {dept.department}
                  </span>
                </div>
              ))}
              {data.departments.length > 5 && (
                <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                  +{data.departments.length - 5}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </GlassCard>
  );
}
