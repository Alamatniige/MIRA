interface Assignment {
  id: string;
  to: string;
  date: string;
  acknowledged: boolean;
}

interface AssignmentTimelineProps {
  assignments: Assignment[];
}

export function AssignmentTimeline({ assignments }: AssignmentTimelineProps) {
  return (
    <div className="relative space-y-0">
      {assignments.map((a, i) => (
        <div key={a.id} className="relative flex gap-6 pb-8 last:pb-0">
          {i < assignments.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[var(--mira-gray-200)]" />
          )}
          <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--mira-teal)] bg-white">
            <div className="h-2 w-2 rounded-full bg-[var(--mira-teal)]" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="font-medium text-[var(--mira-navy-light)]">
              {a.id} → {a.to}
            </p>
            <p className="text-sm text-[var(--mira-gray-500)]">
              {new Date(a.date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {a.acknowledged && (
                <span className="ml-2 inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700">
                  Acknowledged
                </span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
