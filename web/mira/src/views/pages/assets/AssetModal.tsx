"use client";
import { useState, useEffect } from "react";
import { Package, MapPin, Tag, Activity, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Asset, AssetStatus } from "@/types/asset.types";

type AssetModalProps = {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
};

export function AssetModal({ open, onClose, asset }: AssetModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    status: "Active" as AssetStatus,
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || "",
        category: asset.category || "",
        location: asset.location || "",
        status: asset.status as AssetStatus || "Active" as AssetStatus,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        location: "",
        status: "Active" as AssetStatus,
      });
    }
  }, [asset, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-[var(--mira-gray-200)] sm:max-w-[600px]">
        <DialogHeader className="space-y-3 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--mira-teal-muted)] text-[var(--mira-teal)]">
              <Package className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <DialogTitle className="text-[15px] font-semibold tracking-tight text-[var(--mira-navy-light)]">
                {asset ? "Edit Asset" : "Add New Asset"}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-[13px] text-[var(--mira-gray-500)]">
                {asset
                  ? "Update asset information below"
                  : "Fill in the details to add a new asset to your inventory"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5">
            {/* Asset Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Asset Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dell Latitude 5520"
                className="h-11"
                required
              />
            </div>

            {/* Category and Location Row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2 text-[13px] font-medium text-[var(--mira-navy-light)]">
                  <Tag className="h-4 w-4 text-[var(--mira-gray-500)]" />
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger id="category" className="h-11 rounded-xl border-[var(--mira-gray-200)]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--mira-white)] border-[var(--mira-gray-200)]">
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="Monitor">Monitor</SelectItem>
                    <SelectItem value="Peripheral">Peripheral</SelectItem>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2 text-[13px] font-medium text-[var(--mira-navy-light)]">
                  <MapPin className="h-4 w-4 text-[var(--mira-gray-500)]" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Building A - Floor 2"
                  className="h-11 rounded-xl border-[var(--mira-gray-200)] text-[var(--mira-navy-light)]"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2 text-[13px] font-medium text-[var(--mira-navy-light)]">
                <Activity className="h-4 w-4 text-[var(--mira-gray-500)]" />
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger id="status" className="h-11 rounded-xl border-[var(--mira-gray-200)]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--mira-white)] border-[var(--mira-gray-200)]">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full border-[var(--mira-gray-200)] text-[var(--mira-navy-light)] sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full bg-[var(--mira-teal)] text-white hover:bg-[var(--mira-teal)]/90 sm:w-auto"
            >
              {asset ? "Save Changes" : "Add Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
