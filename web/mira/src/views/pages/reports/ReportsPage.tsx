"use client";
import { useState, useEffect } from "react";
import { Download, Calendar, Building2 } from "lucide-react";
import { UtilizationBarChart } from "@/components/reports/UtilizationBarChart";
import { PageLoading } from "@/components/ui/PageLoading";

const utilizationData = [
  { label: "Laptops", value: 92, max: 100 },
  { label: "Monitors", value: 78, max: 100 },
  { label: "Desktops", value: 65, max: 100 },
  { label: "Peripherals", value: 88, max: 100 },
];

const inventorySummary = [
  { category: "Laptops", total: 120, active: 102, maintenance: 10, disposed: 8 },
  { category: "Monitors", total: 85, active: 72, maintenance: 8, disposed: 5 },
  { category: "Desktops", total: 30, active: 25, maintenance: 2, disposed: 3 },
  { category: "Peripherals", total: 13, active: 13, maintenance: 0, disposed: 0 },
];

export function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoading message="Loading reports..." />;
  }

  return (
    <div className="space-y-8">
      <div className="mira-card flex flex-wrap items-center gap-4 p-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[var(--mira-gray-500)]" strokeWidth={1.75} />
          <label className="text-sm font-medium text-[var(--mira-gray-700)]">
            Date range
          </label>
          <input
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="mira-input"
          />
          <span className="text-[var(--mira-gray-400)]">to</span>
          <input type="date" className="mira-input" />
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-[var(--mira-gray-500)]" strokeWidth={1.75} />
          <select className="mira-input w-40">
            <option value="all">All departments</option>
            <option value="it">IT</option>
            <option value="hr">HR</option>
          </select>
        </div>
        <button type="button" className="mira-btn-primary ml-auto inline-flex items-center gap-2">
          <Download className="h-4 w-4" strokeWidth={2} />
          Download PDF
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="mira-card p-6">
          <h2 className="mb-6 text-base font-semibold text-[var(--mira-navy-light)]">
            Asset Utilization
          </h2>
          <UtilizationBarChart data={utilizationData} />
        </div>

        <div className="mira-card overflow-hidden">
          <div className="border-b border-[var(--mira-gray-200)] px-6 py-4">
            <h2 className="text-base font-semibold text-[var(--mira-navy-light)]">
              Inventory Summary
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--mira-gray-200)] bg-[var(--mira-gray-50)]">
                  <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-[var(--mira-gray-600)]">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-[var(--mira-gray-600)]">
                    Active
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-[var(--mira-gray-600)]">
                    Maintenance
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-[var(--mira-gray-600)]">
                    Disposed
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventorySummary.map((row) => (
                  <tr
                    key={row.category}
                    className="border-b border-[var(--mira-gray-100)] hover:bg-[var(--mira-gray-50)]"
                  >
                    <td className="px-6 py-3 font-medium text-[var(--mira-navy-light)]">
                      {row.category}
                    </td>
                    <td className="px-6 py-3 text-right text-[var(--mira-gray-600)]">
                      {row.total}
                    </td>
                    <td className="px-6 py-3 text-right text-[var(--mira-gray-600)]">
                      {row.active}
                    </td>
                    <td className="px-6 py-3 text-right text-[var(--mira-gray-600)]">
                      {row.maintenance}
                    </td>
                    <td className="px-6 py-3 text-right text-[var(--mira-gray-600)]">
                      {row.disposed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
