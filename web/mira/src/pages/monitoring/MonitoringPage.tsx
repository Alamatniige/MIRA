import {
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  WifiOff,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/SummaryCard";

const healthCards = [
  { title: "Healthy", value: "198", icon: CheckCircle, trend: "80% of assets" },
  { title: "Warning", value: "24", icon: AlertTriangle, trend: "Needs attention" },
  { title: "Critical", value: "8", icon: XCircle, trend: "Requires action" },
  { title: "Offline", value: "18", icon: WifiOff, trend: "Not reporting" },
];

const healthEvents = [
  { id: 1, assetId: "AST-1042", message: "Battery health below 80%", severity: "warning", time: "15 min ago" },
  { id: 2, assetId: "AST-1038", message: "Disk space low (12% free)", severity: "critical", time: "1 hour ago" },
  { id: 3, assetId: "AST-1021", message: "Software update available", severity: "info", time: "2 hours ago" },
  { id: 4, assetId: "AST-1015", message: "Asset went offline", severity: "critical", time: "3 hours ago" },
  { id: 5, assetId: "AST-1009", message: "Back to normal", severity: "healthy", time: "5 hours ago" },
];

const severityStyles: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

export function MonitoringPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--mira-navy-light)]">
          Asset Health & Monitoring
        </h1>
        <p className="mt-1 text-sm text-[var(--mira-gray-500)]">
          Overview of asset status and recent health events
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {healthCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="mira-card p-6 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-[var(--mira-navy-light)]">
            Recent Health Events
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--mira-gray-200)] bg-[var(--mira-gray-50)]">
                  <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                    Asset ID
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {healthEvents.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--mira-gray-100)] hover:bg-[var(--mira-gray-50)]"
                  >
                    <td className="px-6 py-3 font-medium text-[var(--mira-navy-light)]">
                      {row.assetId}
                    </td>
                    <td className="px-6 py-3 text-[var(--mira-gray-700)]">
                      {row.message}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex rounded-lg border px-2.5 py-0.5 text-xs font-medium capitalize ${severityStyles[row.severity] ?? "bg-gray-50 text-gray-700"}`}
                      >
                        {row.severity}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[var(--mira-gray-500)]">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mira-card p-6">
          <h2 className="mb-4 text-base font-semibold text-[var(--mira-navy-light)]">
            Status by Category
          </h2>
          <div className="space-y-4">
            {[
              { label: "Laptops", healthy: 95, warning: 3, critical: 2 },
              { label: "Monitors", healthy: 88, warning: 8, critical: 4 },
              { label: "Desktops", healthy: 92, warning: 5, critical: 3 },
              { label: "Peripherals", healthy: 98, warning: 1, critical: 1 },
            ].map((cat) => (
              <div key={cat.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-[var(--mira-gray-700)]">
                    {cat.label}
                  </span>
                  <span className="text-[var(--mira-gray-500)]">
                    {cat.healthy}% healthy
                  </span>
                </div>
                <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
                  <div
                    className="bg-[var(--status-active)]"
                    style={{ width: `${cat.healthy}%` }}
                  />
                  <div
                    className="bg-[var(--status-maintenance)]"
                    style={{ width: `${cat.warning}%` }}
                  />
                  <div
                    className="bg-[var(--status-issue)]"
                    style={{ width: `${cat.critical}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mira-card p-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[var(--mira-teal)]" strokeWidth={1.75} />
          <h2 className="text-base font-semibold text-[var(--mira-navy-light)]">
            Monitoring Tips
          </h2>
        </div>
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-[var(--mira-gray-600)]">
          <li>Critical events require immediate attention and may affect productivity.</li>
          <li>Warning events indicate assets that may need maintenance soon.</li>
          <li>Offline assets have not reported status in the last 24 hours.</li>
          <li>Configure alerts in Settings to get notified of health changes.</li>
        </ul>
      </div>
    </div>
  );
}
