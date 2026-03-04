import type { UtilizationData } from "@/types/report.types";

interface UtilizationBarChartProps {
  data: UtilizationData[];
}

export function UtilizationBarChart({ data }: UtilizationBarChartProps) {
  const maxBar = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.label} className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-[var(--mira-gray-700)]">
              {d.label}
            </span>
            <span className="text-[var(--mira-gray-500)]">{d.value}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--mira-gray-200)]">
            <div
              className="h-full rounded-full bg-[var(--mira-teal)] transition-all"
              style={{ width: `${(d.value / maxBar) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
