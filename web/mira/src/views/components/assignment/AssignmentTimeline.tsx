import { UserPlus, Check } from "lucide-react";

interface Assignment {
  id: string;
  to: string;
  date: string;
  acknowledged: boolean;
}

interface AssignmentTimelineProps {
  assignments: Assignment[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function AssignmentTimeline({ assignments }: AssignmentTimelineProps) {
  return (
    <div className="divide-y divide-[var(--mira-gray-100)]">
      {assignments.map((a) => (
        <div
          key={a.id}
          className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-[var(--mira-gray-50)]/80"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--mira-gray-100)]">
            <UserPlus className="h-4 w-4 text-[var(--mira-teal)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-[var(--mira-navy-light)]">
              {a.id} → {a.to}
            </p>
            <p className="flex items-center gap-2 truncate text-[13px] text-[var(--mira-gray-600)]">
              {new Date(a.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
              {a.acknowledged && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--mira-teal-muted)] px-2 py-0.5 text-[12px] font-medium text-[var(--mira-teal)]">
                  <Check className="h-3 w-3" />
                  Acknowledged
                </span>
              )}
            </p>
          </div>
          <span className="shrink-0 text-[12px] text-[var(--mira-gray-500)]">
            {formatDate(a.date)}
          </span>
        </div>
      ))}
    </div>
  );
}
