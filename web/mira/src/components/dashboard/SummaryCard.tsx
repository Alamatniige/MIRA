import { LucideIcon } from "lucide-react";

type CardVariant = "teal" | "green" | "amber" | "slate";

const variantStyles: Record<
  CardVariant,
  { iconBg: string; iconColor: string; glow: string }
> = {
  teal: {
    iconBg: "var(--mira-teal-muted)",
    iconColor: "var(--mira-teal)",
    glow: "rgba(13, 148, 136, 0.06)",
  },
  green: {
    iconBg: "rgba(34, 197, 94, 0.1)",
    iconColor: "var(--status-active)",
    glow: "rgba(34, 197, 94, 0.06)",
  },
  amber: {
    iconBg: "rgba(234, 179, 8, 0.12)",
    iconColor: "var(--status-maintenance)",
    glow: "rgba(234, 179, 8, 0.06)",
  },
  slate: {
    iconBg: "rgba(148, 163, 184, 0.15)",
    iconColor: "var(--status-disposed)",
    glow: "rgba(148, 163, 184, 0.05)",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "teal",
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: CardVariant;
}) {
  const styles = variantStyles[variant];
  return (
    <div
      className="mira-card group relative flex flex-col gap-6 overflow-hidden p-6 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
      style={{
        boxShadow: `var(--shadow), 0 0 0 1px ${styles.glow} inset`,
      }}
    >
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium tracking-wide text-[var(--mira-gray-500)]">
          {title}
        </span>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
          style={{
            background: styles.iconBg,
            color: styles.iconColor,
            boxShadow: "0 2px 8px -2px rgba(0,0,0,0.06)",
          }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
      <div>
        <p className="text-[28px] font-bold tracking-tight text-[var(--mira-navy-light)]">
          {value}
        </p>
        {trend && (
          <p className="mt-1 text-[13px] text-[var(--mira-gray-500)]">{trend}</p>
        )}
      </div>
    </div>
  );
}
