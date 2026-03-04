import { X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { Asset } from "@/types/asset.types";

type AssetModalProps = {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
};

export function AssetModal({ open, onClose, asset }: AssetModalProps) {
  if (!open) return null;

  return (
    <Modal onClose={onClose}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--mira-navy-light)]">
          {asset ? "Edit Asset" : "Add Asset"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-[var(--mira-gray-500)] hover:bg-[var(--mira-gray-100)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--mira-gray-700)]">
            Asset Name
          </label>
          <input
            type="text"
            defaultValue={asset?.name}
            className="mira-input w-full"
            placeholder="e.g. Dell Latitude 5520"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--mira-gray-700)]">
            Category
          </label>
          <select className="mira-input w-full">
            <option>Laptop</option>
            <option>Monitor</option>
            <option>Peripheral</option>
            <option>Desktop</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--mira-gray-700)]">
            Location
          </label>
          <input
            type="text"
            defaultValue={asset?.location}
            className="mira-input w-full"
            placeholder="Building A - Floor 2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--mira-gray-700)]">
            Status
          </label>
          <select className="mira-input w-full" defaultValue={asset?.status}>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="issue">Issue</option>
            <option value="disposed">Disposed</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="mira-btn-secondary flex-1"
          >
            Cancel
          </button>
          <button type="submit" className="mira-btn-primary flex-1">
            {asset ? "Save" : "Add Asset"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
