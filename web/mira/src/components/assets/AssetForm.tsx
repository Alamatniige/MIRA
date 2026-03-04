import type { Asset } from "@/types/asset.types";

interface AssetFormProps {
  asset?: Asset | null;
  onSubmit?: (data: Partial<Asset>) => void;
}

export function AssetForm({ asset, onSubmit }: AssetFormProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.({});
      }}
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--mira-gray-700)]">
          Asset Name
        </label>
        <input
          type="text"
          name="name"
          defaultValue={asset?.name}
          className="mira-input w-full"
          placeholder="e.g. Dell Latitude 5520"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--mira-gray-700)]">
          Category
        </label>
        <select name="category" className="mira-input w-full">
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
          name="location"
          defaultValue={asset?.location}
          className="mira-input w-full"
          placeholder="Building A - Floor 2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--mira-gray-700)]">
          Status
        </label>
        <select name="status" className="mira-input w-full" defaultValue={asset?.status}>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="issue">Issue</option>
          <option value="disposed">Disposed</option>
        </select>
      </div>
    </form>
  );
}
