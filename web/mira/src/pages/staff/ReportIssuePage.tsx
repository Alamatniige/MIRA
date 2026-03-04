import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ReportIssuePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/staff"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--mira-gray-600)] hover:text-[var(--mira-teal)]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Back to my assets
      </Link>

      <div className="mira-card p-6">
        <h1 className="text-xl font-semibold text-[var(--mira-navy-light)]">
          Report an Issue
        </h1>
        <p className="mt-1 text-sm text-[var(--mira-gray-500)]">
          Describe the issue with your assigned asset
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--mira-gray-700)]">
              Asset
            </label>
            <select className="mira-input w-full">
              <option value="">Select asset...</option>
              <option value="AST-1042">AST-1042 – Dell Latitude 5520</option>
              <option value="AST-1009">AST-1009 – Logitech MX Keys</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--mira-gray-700)]">
              Issue Type
            </label>
            <select className="mira-input w-full">
              <option value="">Select type...</option>
              <option value="hardware">Hardware malfunction</option>
              <option value="software">Software issue</option>
              <option value="damage">Physical damage</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--mira-gray-700)]">
              Description
            </label>
            <textarea
              rows={4}
              className="mira-input w-full"
              placeholder="Describe the issue in detail..."
            />
          </div>
          <button type="submit" className="mira-btn-primary">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
