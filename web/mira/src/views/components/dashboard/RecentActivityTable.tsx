interface ActivityRow {
  id: string;
  action: string;
  date: string;
  type: string;
}

interface RecentActivityTableProps {
  data: ActivityRow[];
}

export function RecentActivityTable({ data }: RecentActivityTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--mira-gray-200)] bg-[var(--mira-gray-50)]">
            <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
              Asset ID
            </th>
            <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
              Activity
            </th>
            <th className="px-6 py-3 text-left font-medium text-[var(--mira-gray-600)]">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[var(--mira-gray-100)] hover:bg-[var(--mira-gray-50)]"
            >
              <td className="px-6 py-3 font-medium text-[var(--mira-navy-light)]">
                {row.id}
              </td>
              <td className="px-6 py-3 text-[var(--mira-gray-600)]">
                {row.action}
              </td>
              <td className="px-6 py-3 text-[var(--mira-gray-500)]">
                {row.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
