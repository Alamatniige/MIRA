interface PieSegment {
  label: string;
  value: number;
  color: string;
}

interface StatusPieChartProps {
  data: PieSegment[];
}

export function StatusPieChart({ data }: StatusPieChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const segments = data.map((d) => {
    const length = (d.value / total) * 100;
    const seg = { ...d, length, offset };
    offset += length;
    return seg;
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {segments.map((d) => (
            <circle
              key={d.label}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={d.color}
              strokeWidth="20"
              strokeDasharray={`${d.length} ${100 - d.length}`}
              strokeDashoffset={-d.offset}
            />
          ))}
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: d.color }}
            />
            <span className="text-sm text-[var(--mira-gray-600)]">
              {d.label} {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
