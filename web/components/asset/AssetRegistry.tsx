"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssets } from "@/hooks/useAssets";
import { Asset, AssetType } from "@/types/mira";

import { FullPageLoader } from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { sileo } from "sileo";

/* ──────────────────────────────── helpers ──────────────────────────────── */

const statCards = [
  {
    label: "Total Assets",
    value: "1,284",
    sub: "+12 this month",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    color: "from-teal-500/10 to-teal-600/10 text-teal-700 border-teal-200/60 dark:from-teal-500/15 dark:to-teal-400/5 dark:text-teal-300 dark:border-teal-400/20",
    valueColor: "text-teal-800 dark:text-teal-200",
  },
  {
    label: "Unavailable",
    value: "896",
    sub: "69.8% utilization",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    color: "from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200/60 dark:from-sky-500/15 dark:to-sky-400/5 dark:text-sky-300 dark:border-sky-400/20",
    valueColor: "text-blue-800 dark:text-sky-200",
  },
  {
    label: "Available",
    value: "321",
    sub: "Ready to deploy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    color: "from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200/60 dark:from-emerald-500/15 dark:to-emerald-400/5 dark:text-emerald-300 dark:border-emerald-400/20",
    valueColor: "text-emerald-800 dark:text-emerald-200",
  },
  {
    label: "Under Maintenance",
    value: "67",
    sub: "Needs attention",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    color: "from-amber-500/10 to-amber-600/10 text-amber-700 border-amber-200/60 dark:from-amber-500/15 dark:to-amber-400/5 dark:text-amber-300 dark:border-amber-400/20",
    valueColor: "text-amber-800 dark:text-amber-200",
  },
];

type CategoryMeta = { icon: ReactNode; bg: string; text: string };
const categoryMeta: Record<string, CategoryMeta> = {
  Laptop: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M0 21h24" />
      </svg>
    ),
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  Monitor: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <polyline points="8 21 12 17 16 21" />
      </svg>
    ),
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-300",
  },
  Server: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
  },
  Network: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <rect x="16" y="10" width="6" height="4" rx="1" />
        <rect x="2" y="10" width="6" height="4" rx="1" />
        <rect x="9" y="18" width="6" height="4" rx="1" />
        <path d="M12 6v4M5 12h4M15 12h4M12 14v4" />
      </svg>
    ),
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-300",
  },
  Desktop: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
  },
  Peripheral: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="3" y="8" width="18" height="12" rx="2" />
        <path d="M12 8V4M8 4h8" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    ),
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
  },
  Printer: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    ),
    bg: "bg-pink-50 dark:bg-pink-950/40",
    text: "text-pink-700 dark:text-pink-300",
  },
  Mobile: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
  },
  Default: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
    ),
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
  },
};

const statusDot: Record<string, string> = {
  Unavailable: "bg-emerald-500",
  Available: "bg-slate-400",
  "Under Maintenance": "bg-amber-400",
};

const avatarColors = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
];

function getAvatarColor(initials: string) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % avatarColors.length;
  return avatarColors[idx];
}

/* ─────────────────────────────── component ─────────────────────────────── */

export function AssetRegistry() {
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedQrAsset, setSelectedQrAsset] = useState<Asset | null>(null); // Default to first asset for demo
  const [selectedViewAsset, setSelectedViewAsset] = useState<Asset | null>(null);
  const [selectedEditAsset, setSelectedEditAsset] = useState<Asset | null>(null);
  const [selectedDeleteAsset, setSelectedDeleteAsset] = useState<Asset | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [gallerySource, setGallerySource] = useState<"add" | "edit" | "view" | null>(null);

  // States for dynamic dropdowns
  const [isAddingType, setIsAddingType] = useState(false);
  const [newType, setNewType] = useState("");
  const [localCategories, setLocalCategories] = useState<Record<string, number>>({});

  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoom, setNewRoom] = useState("");
  const [localRooms, setLocalRooms] = useState<Record<string, number>>({});

  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [newFloor, setNewFloor] = useState("");
  const [localFloors, setLocalFloors] = useState<Record<string, number>>({});

  const [formData, setFormData] = useState({
    tag: "",
    assetName: "",
    assetType: "",
    currentStatus: "Available",
    room: "",
    floor: "",
    serialNumber: "",
    specification: "",
  });

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    return () => {
      editImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [editImagePreviews]);

  const handleImageChange = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleEditImageChange = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setEditImageFiles(prev => [...prev, ...newFiles]);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setEditImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const removeEditImage = (index: number) => {
    const newFiles = [...editImageFiles];
    newFiles.splice(index, 1);
    setEditImageFiles(newFiles);

    const newPreviews = [...editImagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setEditImagePreviews(newPreviews);
  };

  const removeExistingImage = (index: number) => {
    if (selectedEditAsset && selectedEditAsset.image) {
      const newExistingImages = [...selectedEditAsset.image];
      newExistingImages.splice(index, 1);
      setSelectedEditAsset({ ...selectedEditAsset, image: newExistingImages });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (editModal) {
      handleEditImageChange(e.dataTransfer.files);
      return;
    }

    handleImageChange(e.dataTransfer.files);
  };

  const editAllImages = [...(selectedEditAsset?.image || []), ...editImagePreviews];
  const allImages =
    gallerySource === "edit"
      ? editAllImages
      : gallerySource === "view"
        ? selectedViewAsset?.image || []
        : imagePreviews;

  const closeEditModal = () => {
    setEditModal(false);
    setSelectedEditAsset(null);
    setIsAddingType(false);
    setIsAddingRoom(false);
    setIsAddingFloor(false);
    setNewType("");
    setNewRoom("");
    setNewFloor("");
    setEditImageFiles([]);
    setEditImagePreviews([]);
    setGallerySource(null);
  };

  const openGallery = (idx: number) => {
    setGalleryIndex(idx);
    setGalleryOpen(true);
  };

  const galleryPrev = () => setGalleryIndex(i => (i - 1 + allImages.length) % allImages.length);
  const galleryNext = () => setGalleryIndex(i => (i + 1) % allImages.length);

  const removeImageFromGallery = (idx: number) => {
    if (gallerySource === "edit") {
      const existingCount = selectedEditAsset?.image?.length || 0;
      if (idx < existingCount) {
        removeExistingImage(idx);
      } else {
        removeEditImage(idx - existingCount);
      }
    } else {
      removeImage(idx);
    }

    if (galleryIndex >= allImages.length - 1) {
      setGalleryIndex(Math.max(0, allImages.length - 2));
    }
  };

  const {
    assets,
    assetsTypes,
    assetRooms,
    assetFloors,
    filterOptions,
    refresh,
    total,
    unavailable,
    available,
    underMaintenance,
  } = useAssets();

  const safeTotal = total || 0;
  const safeUnavailable = unavailable || 0;
  const safeAvailable = available || 0;
  const safeUnderMaintenance = underMaintenance || 0;
  const statCardValues: Record<string, { value: string; sub: string }> = {
    "Total Assets": {
      value: safeTotal.toLocaleString(),
      sub: safeTotal > 0 ? "Live inventory count" : "No assets registered yet",
    },
    Unavailable: {
      value: safeUnavailable.toLocaleString(),
      sub: safeUnavailable > 0 ? `currently in use` : "All assets are available",
    },
    Available: {
      value: safeAvailable.toLocaleString(),
      sub: safeAvailable > 0 ? "Ready to deploy" : "No assets available",
    },
    "Under Maintenance": {
      value: safeUnderMaintenance.toLocaleString(),
      sub: safeUnderMaintenance > 0 ? "Needs attention" : "No maintenance pending",
    },
  };

  // Handle setting incrementing Tag when Modal opens
  useEffect(() => {
    if (open) {
      let maxNum = 0;
      assets.forEach(a => {
        if (a.tag?.toUpperCase().startsWith("AS-")) {
          const num = parseInt(a.tag.slice(3), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
      const nextNum = maxNum + 1;
      const nextTag = `AS-${nextNum.toString().padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, tag: nextTag }));
    }
  }, [open, assets]);

  const handleSaveAsset = async (showQr: boolean = true) => {
    setIsGeneratingQr(true);
    try {
      const token = localStorage.getItem("mira_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      // 1. Resolve Category ID
      let typeId: number | null = null;
      if (formData.assetType) {
        const existing = assetsTypes.find(t => t.name.toLowerCase() === formData.assetType.toLowerCase());
        if (existing) {
          typeId = existing.id;
        } else {
          const res = await fetch("/api/assets/types", { method: "POST", headers, body: JSON.stringify({ name: formData.assetType }) });
          if (res.ok) {
            const data = await res.json();
            typeId = data.id;
          }
        }
      }

      // 2. Resolve Room ID
      let roomId: number | null = null;
      if (formData.room) {
        const existing = assetRooms.find(r => r.name.toLowerCase() === formData.room.toLowerCase());
        if (existing) {
          roomId = existing.id;
        } else {
          const res = await fetch("/api/assets/rooms", { method: "POST", headers, body: JSON.stringify({ name: formData.room }) });
          if (res.ok) {
            const data = await res.json();
            roomId = data.id;
          }
        }
      }

      // 3. Resolve Floor ID
      let floorId: number | null = null;
      if (formData.floor) {
        const existing = assetFloors.find(f => f.name.toLowerCase() === formData.floor.toLowerCase());
        if (existing) {
          floorId = existing.id;
        } else {
          const res = await fetch("/api/assets/floors", { method: "POST", headers, body: JSON.stringify({ name: formData.floor }) });
          if (res.ok) {
            const data = await res.json();
            floorId = data.id;
          }
        }
      }

      // 4. Upload Image if selected
      let uploadedImageUrls: string[] = [];
      if (imageFiles && imageFiles.length > 0) {
        const imgData = new FormData();
        imageFiles.forEach(file => {
          imgData.append("images", file);
        });
        const uploadRes = await fetch("/api/assets/upload", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: imgData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrls = uploadData.imageUrls || [];
        } else {
          const errData = await uploadRes.json();
          console.error("Failed to upload image.", errData);
          sileo.error({ title: "Upload Failed", description: "Image upload failed: " + errData.error });
        }
      }

      // 5. Save Asset
      const payload = {
        assetName: formData.assetName,
        assetType: typeId,
        serialNumber: formData.serialNumber,
        specification: formData.specification,
        room: roomId,
        floor: floorId,
        tag: formData.tag,
        currentStatus: formData.currentStatus || "Available",
        image: uploadedImageUrls
      };

      const res = await fetch("/api/assets", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save asset");

      const resData = await res.json();

      refresh();

      if (showQr) {
        setSelectedQrAsset({ ...resData.asset, assetTypeRel: { name: formData.assetType } });
        setQrOpen(true);
      }
      setOpen(false);
      sileo.success({
        title: "Asset Saved",
        description: "The asset has been successfully registered.",
        fill: "#000000"
      });

      // Reset form
      setFormData({
        tag: "", assetName: "", assetType: "", currentStatus: "Available", room: "", floor: "", serialNumber: "", specification: ""
      });
      setIsAddingType(false);
      setIsAddingRoom(false);
      setIsAddingFloor(false);
      setNewType("");
      setNewRoom("");
      setNewFloor("");
      setImageFiles([]);
      setImagePreviews([]);

    } catch (err) {
      console.error(err);
      sileo.error({ title: "Error", description: "Failed to save asset. Please try again." });
    } finally {
      setIsGeneratingQr(false);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = assets.filter((a) => {
    const matchesSearch =
      search === "" ||
      a.assetName?.toLowerCase().includes(search.toLowerCase()) ||
      a.roomRel?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.floorRel?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.tag?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || a.currentStatus === statusFilter;
    const matchesCategory = !categoryFilter || a.assetTypeRel?.name === categoryFilter;
    const matchesRoom = !roomFilter || a.roomRel?.name === roomFilter;
    const matchesFloor = !floorFilter || a.floorRel?.name === floorFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesRoom && matchesFloor;
  }).sort((a, b) => {
    // Sort by tag ascending (e.g. AS-01, AS-02)
    return (a.tag || "").localeCompare(b.tag || "", undefined, { numeric: true, sensitivity: 'base' });
  });

  const handleUpdateAsset = async () => {
    if (!selectedEditAsset) return;
    try {
      const token = localStorage.getItem("mira_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      // Resolve Category ID
      let typeId: number | null = selectedEditAsset.assetType;
      if (selectedEditAsset.assetTypeRel?.name) {
        const existing = assetsTypes.find(t => t.name.toLowerCase() === selectedEditAsset.assetTypeRel!.name.toLowerCase());
        if (existing) {
          typeId = existing.id;
        } else {
          try {
            const res = await fetch("/api/assets/types", { method: "POST", headers, body: JSON.stringify({ name: selectedEditAsset.assetTypeRel.name }) });
            if (res.ok) {
              const data = await res.json();
              typeId = data.id;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }

      // Resolve Room ID
      let roomId: number | null = selectedEditAsset.room;
      if (selectedEditAsset.roomRel?.name) {
        const existing = assetRooms.find(r => r.name.toLowerCase() === selectedEditAsset.roomRel!.name.toLowerCase());
        if (existing) {
          roomId = existing.id;
        } else {
          try {
            const res = await fetch("/api/assets/rooms", { method: "POST", headers, body: JSON.stringify({ name: selectedEditAsset.roomRel.name }) });
            if (res.ok) {
              const data = await res.json();
              roomId = data.id;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }

      // Resolve Floor ID
      let floorId: number | null = selectedEditAsset.floor;
      if (selectedEditAsset.floorRel?.name) {
        const existing = assetFloors.find(f => f.name.toLowerCase() === selectedEditAsset.floorRel!.name.toLowerCase());
        if (existing) {
          floorId = existing.id;
        } else {
          try {
            const res = await fetch("/api/assets/floors", { method: "POST", headers, body: JSON.stringify({ name: selectedEditAsset.floorRel.name }) });
            if (res.ok) {
              const data = await res.json();
              floorId = data.id;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }

      let uploadedImageUrls = selectedEditAsset.image || [];
      if (editImageFiles && editImageFiles.length > 0) {
        const imgData = new FormData();
        editImageFiles.forEach(file => {
          imgData.append("images", file);
        });
        const uploadRes = await fetch("/api/assets/upload", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: imgData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrls = [...uploadedImageUrls, ...(uploadData.imageUrls || [])];
        } else {
          const errData = await uploadRes.json();
          console.error("Failed to upload image.", errData);
          sileo.error({ title: "Upload Failed", description: "Image upload failed: " + errData.error });
        }
      }

      const payload = {
        assetName: selectedEditAsset.assetName,
        assetType: typeId,
        serialNumber: selectedEditAsset.serialNumber,
        specification: selectedEditAsset.specification,
        room: roomId,
        floor: floorId,
        tag: selectedEditAsset.tag,
        currentStatus: selectedEditAsset.currentStatus,
        image: uploadedImageUrls
      };

      const res = await fetch(`/api/assets/${selectedEditAsset.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to update asset");

      const updatedAssetType = assetsTypes.find((t: AssetType) => t.id === payload.assetType);

      // Reconstruct updated asset using map payload
      const newlyUpdatedAsset: Asset = {
        ...selectedEditAsset,
        ...payload,
        assetTypeRel: updatedAssetType ?? undefined,
      };

      setSelectedViewAsset(newlyUpdatedAsset);

      refresh();
      closeEditModal();
      sileo.success({
        title: "Asset Updated",
        description: "The asset has been successfully updated.",
        fill: "#000000"
      });

    } catch (err) {
      console.error(err);
      sileo.error({ title: "Error", description: "Failed to update asset. Please try again." });
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedDeleteAsset) return;
    try {
      const token = localStorage.getItem("mira_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const res = await fetch(`/api/assets/${selectedDeleteAsset.id}`, {
        method: "DELETE",
        headers
      });
      if (!res.ok) throw new Error("Failed to delete asset");

      refresh();
      setDeleteModal(false);
      setSelectedDeleteAsset(null);
      sileo.success({
        title: "Asset Deleted",
        description: "The asset has been successfully removed.",
        fill: "#000000"
      });

    } catch (err) {
      console.error(err);
      sileo.error({ title: "Error", description: "Failed to delete asset. Please try again." });
    }
  };

  if (isLoading) {
    return <FullPageLoader label="Loading asset registry..." />;
  }

  return (
    <>
      <div className="space-y-6 print:hidden">
        {/* ── Page header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Asset Registry
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Centralized view of all IT hardware assets managed by the department.
            </p>
          </div>
          <Button
            size="sm"
            className="h-9 rounded-full bg-linear-to-r from-[#0F766E] to-[#0E7490] px-5 text-xs font-semibold shadow-sm hover:shadow-lg transition-all active:scale-95"
            onClick={() => setOpen(true)}
          >
            <span className="mr-1.5 text-sm leading-none">+</span>
            Add Asset
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`flex flex-col gap-2 rounded-xl border bg-linear-to-br p-4 transition-all hover:shadow-md dark:hover:shadow-teal-900/30 dark:bg-[#09090b] ${card.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold opacity-75 dark:opacity-90">{card.label}</span>
                <span className="opacity-60 dark:opacity-80">{card.icon}</span>
              </div>
              <p className={`text-2xl font-bold tracking-tight ${card.valueColor}`}>
                {statCardValues[card.label]?.value ?? "0"}
              </p>
              <p className="text-[10px] font-medium opacity-55 dark:opacity-70">{statCardValues[card.label]?.sub ?? "N/A"}</p>
            </div>
          ))}
        </div>

        {/* ── Main table card ── */}
        <Card className="overflow-hidden shadow-sm">
          {/* Filter bar */}
          <CardHeader className="border-b border-slate-100 dark:border-teal-800/25 bg-white dark:bg-[#09090b] pb-3 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold">Asset Inventory</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <Input
                    placeholder="Search assets…"
                    className="h-8 w-52 pl-8 text-[11px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Filters */}
                {[
                  {
                    label: "Status",
                    options: ["All", ...filterOptions.statuses],
                    value: statusFilter,
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)
                  },
                  {
                    label: "Category",
                    options: ["All", ...filterOptions.categories],
                    value: categoryFilter,
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)
                  },
                  {
                    label: "Room",
                    options: ["All", ...filterOptions.rooms],
                    value: roomFilter,
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setRoomFilter(e.target.value)
                  },
                  {
                    label: "Floor",
                    options: ["All", ...filterOptions.floors],
                    value: floorFilter,
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setFloorFilter(e.target.value)
                  },
                ].map((f) => (
                  <select
                    key={f.label}
                    value={f.value}
                    onChange={f.onChange}
                    className="h-8 rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2.5 text-[11px] text-slate-700 dark:text-slate-300 focus:border-primary dark:focus:border-teal-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-teal-500/20 outline-none transition-colors"
                  >
                    <option value="">{f.label}: All</option>
                    {f.options.slice(1).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ))}

                {/* Export button */}
                <Button variant="outline" size="sm" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-3 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-teal-900/20 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>

                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table className="table-fixed w-full">
              <colgroup>
                <col style={{ width: "14%" }} />{/* Asset Tag */}
                <col style={{ width: "30%" }} />{/* Asset */}
                <col style={{ width: "18%" }} />{/* Category */}
                <col style={{ width: "24%" }} />{/* Location */}
                <col style={{ width: "14%" }} />{/* Actions */}
              </colgroup>
              <TableHeader>
                <tr className="bg-slate-50/80 dark:bg-teal-950/50">
                  {[
                    { label: "Asset Tag", cls: "pl-5" },
                    { label: "Asset", cls: "pl-4" },
                    { label: "Category", cls: "pl-4" },
                    { label: "Location", cls: "pl-4" },
                    { label: "Actions", cls: "pl-4 pr-4 text-left" },
                  ].map(({ label, cls }) => (
                    <TableHead
                      key={label}
                      className={`py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400 ${cls ?? ""}`}
                    >
                      {label}
                    </TableHead>
                  ))}
                </tr>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-slate-300">
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.35-4.35" />
                        </svg>
                        <p className="text-xs text-slate-400">No assets match your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((asset) => {
                    const categoryName = asset.assetTypeRel?.name;
                    const found = categoryName
                      ? Object.entries(categoryMeta).find(([k]) => k.toLowerCase() === categoryName.toLowerCase())
                      : undefined;
                    const cat = found ? found[1] : categoryMeta.Default;
                    const displayCategory = categoryName || "Uncategorized";
                    return (
                      <TableRow
                        key={asset.tag}
                        className="group border-b border-slate-100 dark:border-teal-800/20 transition-colors hover:bg-primary/3 dark:hover:bg-teal-900/20 align-middle"
                      >
                        {/* Asset Tag */}
                        <TableCell className="pl-5 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 tracking-wide">
                            {asset.tag}
                          </span>
                        </TableCell>

                        {/* Asset name + brand */}
                        <TableCell className="pl-4 py-3">
                          <div>
                            <p className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate">
                              {asset.assetName}
                            </p>
                            <p className="mt-0.5 text-[10.5px] text-slate-400 dark:text-slate-500">
                              {asset.serialNumber}
                            </p>
                          </div>
                        </TableCell>

                        {/* Category chip */}
                        <TableCell className="pl-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${cat.bg} ${cat.text}`}>
                            {cat.icon}
                            {displayCategory}
                          </span>
                        </TableCell>


                        {/* Location */}
                        <TableCell className="pl-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3 w-3 text-slate-400 shrink-0">
                              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {asset.roomRel?.name} {asset.floorRel ? `– ${asset.floorRel.name}` : ""}
                          </span>
                        </TableCell>



                        {/* Actions */}
                        <TableCell className="pl-4 py-3 pr-4">
                          <div className="flex justify-start items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* View */}
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              title="View"
                              onClick={() => {
                                setSelectedViewAsset(asset);
                                setViewOpen(true);
                              }}
                              className="text-primary hover:bg-primary/10 transition-colors"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </Button>
                            {/* Edit */}
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              title="Edit"
                              onClick={() => {
                                setEditImageFiles([]);
                                setEditImagePreviews([]);
                                setIsAddingType(false);
                                setIsAddingRoom(false);
                                setIsAddingFloor(false);
                                setNewType("");
                                setNewRoom("");
                                setNewFloor("");
                                setGallerySource(null);
                                setEditModal(true);
                                setSelectedEditAsset(asset);
                              }}
                              className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </Button>
                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              title="Delete"
                              onClick={() => {
                                setDeleteModal(true);
                                setSelectedDeleteAsset(asset);
                              }}
                              className="text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                              </svg>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination footer */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-teal-800/25 bg-white dark:bg-[#09090b] px-5 py-3">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">{filtered.length}</span> of{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">{assets.length}</span> assets
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="xs" className="h-7 rounded-md border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2.5 text-[11px] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-teal-900/20 transition-colors">
                  ← Prev
                </Button>
                <Button size="xs" className="h-7 rounded-md border border-primary bg-primary/5 dark:bg-primary/10 px-2.5 text-[11px] font-medium text-primary dark:text-teal-300">
                  1
                </Button>
                <Button variant="outline" size="xs" className="h-7 rounded-md border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2.5 text-[11px] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-teal-900/20 transition-colors">
                  Next →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Generate QR Modal ── */}
        <Modal
          open={qrOpen}
          onClose={() => setQrOpen(false)}
          className={open ? "translate-x-[52%] h-120" : "h-120"}   // Shift to the right if the other modal is open
        >
          <div className="space-y-4 text-xs flex flex-col h-110 pt-4">

            {selectedQrAsset ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-teal-800/30 bg-slate-50 dark:bg-slate-900/50 p-6 text-center">
                <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-white">
                  <QRCodeSVG
                    value={`MIRA Asset\nTag: ${selectedQrAsset.tag || selectedQrAsset.id}\nName: ${selectedQrAsset.assetName}\nCategory: ${selectedQrAsset.assetTypeRel?.name}`}
                    size={220}
                    level="H"
                  />
                </div>
                <p className="mt-5 text-[15px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">{selectedQrAsset.id ? `${selectedQrAsset.id.slice(0, 8)}...` : ""}</p>
                <p className="mt-1.5 text-[12px] text-slate-500">{selectedQrAsset.assetName}</p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-teal-800/30 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <rect x="7" y="7" width="3" height="3" />
                  <rect x="14" y="7" width="3" height="3" />
                  <rect x="7" y="14" width="3" height="3" />
                  <rect x="14" y="14" width="3" height="3" />
                </svg>
                <p className="text-[11px] text-slate-500">Select an asset above to view its QR code</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 mt-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-slate-200 px-4 text-[11px]"
                onClick={() => setQrOpen(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!selectedQrAsset}
                className="h-8 rounded-full bg-slate-900 px-5 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                onClick={() => window.print()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mr-1.5 h-3.5 w-3.5">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Print Tag
              </Button>
            </div>
          </div>
        </Modal>

        {/* ── Add Asset Modal ── */}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Add Asset"
          description="Register a new IT hardware asset into the MIRA registry."
          overlayClassName={qrOpen ? "!bg-transparent dark:!bg-transparent !backdrop-blur-none pointer-events-none" : ""} // Remove double overlay
          className={qrOpen ? "pointer-events-auto -translate-x-[52%]" : ""} // Shift to the left if QR modal is open
        >
          <form className="space-y-4 text-xs flex flex-col">
            {/* Row 1: Tag + Name + Category */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Asset Tag
                </label>
                <Input placeholder="e.g. AS-01" className="h-8 text-[11px]" disabled value={formData.tag} />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Asset Name
                </label>
                <Input placeholder="e.g. Lenovo ThinkPad T14 Gen 3" className="h-8 text-[11px]" value={formData.assetName} onChange={(e) => setFormData(p => ({ ...p, assetName: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                {!isAddingType ? (
                  <select
                    className="h-8 w-full rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2 text-[11px] text-slate-700 dark:text-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    value={formData.assetType}
                    onChange={(e) => {
                      if (e.target.value === "Add another category") {
                        setIsAddingType(true);
                        setFormData(p => ({ ...p, assetType: "" }));
                      } else {
                        setFormData(p => ({ ...p, assetType: e.target.value }));
                      }
                    }}
                  >
                    <option value="" disabled>Select category</option>
                    {Array.from(new Set([...assetsTypes.map(t => t.name), ...Object.keys(localCategories)])).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                    <option value="Add another category" className="font-semibold text-primary">Add another category</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="New category..." className="h-8 text-[11px] flex-1" value={newType} onChange={(e) => setNewType(e.target.value)} autoFocus />
                    <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => {
                      if (newType.trim()) {
                        setLocalCategories(p => ({ ...p, [newType.trim()]: 0 }));
                        setFormData(p => ({ ...p, assetType: newType.trim() }));
                      }
                      setIsAddingType(false);
                      setNewType("");
                    }}>OK</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Status + Room + Floor */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <select
                  className="h-8 w-full rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2 text-[11px] text-slate-700 dark:text-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  value={formData.currentStatus}
                  onChange={(e) => setFormData(p => ({ ...p, currentStatus: e.target.value }))}
                >
                  <option value="" disabled>Select status</option>
                  {["Available", "Unavailable", "Under Maintenance"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Room
                </label>
                {!isAddingRoom ? (
                  <select
                    className="h-8 w-full rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2 text-[11px] text-slate-700 dark:text-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    value={formData.room}
                    onChange={(e) => {
                      if (e.target.value === "Add another room") {
                        setIsAddingRoom(true);
                        setFormData(p => ({ ...p, room: "" }));
                      } else {
                        setFormData(p => ({ ...p, room: e.target.value }));
                      }
                    }}
                  >
                    <option value="" disabled>Select room</option>
                    {Array.from(new Set([...filterOptions.rooms, ...Object.keys(localRooms)])).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                    <option value="Add another room" className="font-semibold text-primary">Add another room</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="New room..." className="h-8 text-[11px] flex-1" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} autoFocus />
                    <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => {
                      if (newRoom.trim()) {
                        setLocalRooms(p => ({ ...p, [newRoom.trim()]: 0 }));
                        setFormData(p => ({ ...p, room: newRoom.trim() }));
                      }
                      setIsAddingRoom(false);
                      setNewRoom("");
                    }}>OK</Button>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Floor
                </label>
                {!isAddingFloor ? (
                  <select
                    className="h-8 w-full rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2 text-[11px] text-slate-700 dark:text-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                    value={formData.floor}
                    onChange={(e) => {
                      if (e.target.value === "Add another floor") {
                        setIsAddingFloor(true);
                        setFormData(p => ({ ...p, floor: "" }));
                      } else {
                        setFormData(p => ({ ...p, floor: e.target.value }));
                      }
                    }}
                  >
                    <option value="" disabled>Select floor</option>
                    {Array.from(new Set([...filterOptions.floors, ...Object.keys(localFloors)])).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                    <option value="Add another floor" className="font-semibold text-primary">Add another floor</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="New floor..." className="h-8 text-[11px] flex-1" value={newFloor} onChange={(e) => setNewFloor(e.target.value)} autoFocus />
                    <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => {
                      if (newFloor.trim()) {
                        setLocalFloors(p => ({ ...p, [newFloor.trim()]: 0 }));
                        setFormData(p => ({ ...p, floor: newFloor.trim() }));
                      }
                      setIsAddingFloor(false);
                      setNewFloor("");
                    }}>OK</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Serial Number
                </label>
                <Input
                  placeholder="e.g. SN-123456"
                  className="h-8 text-[11px]"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(p => ({ ...p, serialNumber: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Specifications
                </label>
                <Input
                  placeholder="e.g. Intel i7, 16GB RAM, 512GB SSD"
                  className="h-8 text-[11px]"
                  value={formData.specification}
                  onChange={(e) => setFormData(p => ({ ...p, specification: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Asset Images
                </label>
                {imagePreviews.length > 1 && (
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    onClick={() => {
                      setGallerySource("add");
                      openGallery(0);
                    }}
                    className="text-[10px] font-semibold text-primary hover:underline p-0 h-auto"
                  >
                    View All ({imagePreviews.length})
                  </Button>
                )}
              </div>

              <div
                className={`relative rounded-xl border-2 border-dashed transition-colors overflow-hidden group ${isDragging
                    ? "border-primary bg-primary/5 dark:bg-teal-900/10"
                    : "border-slate-200 dark:border-teal-800/30"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Invisible file input - only top layer when no images */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className={`absolute inset-0 h-full w-full cursor-pointer opacity-0 ${imagePreviews.length === 0 ? 'z-10' : 'z-0'}`}
                  onChange={(e) => handleImageChange(e.target.files)}
                />

                {imagePreviews.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${isDragging ? "bg-primary/20 text-primary" : "bg-white dark:bg-slate-800 text-slate-400 shadow-sm"
                      }`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="mb-1 text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                      Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                    </p>
                    <p className="text-[10px] text-slate-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                ) : (
                  <div
                    className="relative z-20 h-36 bg-slate-100 dark:bg-slate-900 group cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setGallerySource("add");
                      openGallery(0);
                    }}
                  >
                    <Image
                      src={imagePreviews[0]}
                      alt="Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* dark overlay for readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                    {/* [NEW] Hover Overlay with Plus Sign */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-xl transform scale-75 group-hover:scale-100 transition-transform focus:outline-none">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-6 w-6">
                          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                    </div>

                    {/* Count badge (simplified) */}
                    {imagePreviews.length > 1 && (
                      <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} className="h-3 w-3">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                        </svg>
                        {imagePreviews.length} photos
                      </div>
                    )}

                    {/* Remove first image - Stop propagation so it doesn't open gallery */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(0); }}
                      className="absolute right-2 top-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-500 transition-all hover:scale-110 active:scale-95 shadow-lg p-0"
                      title="Remove image"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-slate-200 px-4 text-[11px]"
                onClick={() => { setOpen(false); setIsAddingType(false); setIsAddingRoom(false); setIsAddingFloor(false); }}
              >
                Close
              </Button>
              <Button
                type="button"
                disabled={isGeneratingQr || !formData.assetName || !formData.tag}
                onClick={() => handleSaveAsset(true)}
                size="sm"
                className="h-8 rounded-full bg-linear-to-r from-[#0F766E] to-[#0E7490] px-5 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-80 flex items-center justify-center gap-1.5"
              >
                {isGeneratingQr ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Save & Generate QR"
                )}
              </Button>
            </div>
          </form>
        </Modal>

        {/* ── View Asset Modal ── */}
        <Modal
          open={viewOpen}
          onClose={() => { setViewOpen(false); }}
          title="View Asset Details"
          description="Detailed information and QR code for this asset."
          className="w-full max-w-3xl"
          contentClassName="p-0"
        >
          {selectedViewAsset && (
            <div className="text-xs flex flex-col">
              <div className="p-6 space-y-6">
                {/* Top Section: Three Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                  <div className="flex flex-col gap-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset QR</h4>
                    <div className="group relative flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-teal-800/30 rounded-2xl bg-slate-50 dark:bg-slate-900/50 aspect-square w-full overflow-hidden">
                      <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-white mb-0 transition-transform duration-300 group-hover:scale-95">
                        <QRCodeSVG
                          value={`MIRA Asset\nTag: ${selectedViewAsset.tag || selectedViewAsset.id}\nName: ${selectedViewAsset.assetName}\nCategory: ${selectedViewAsset.assetTypeRel?.name}`}
                          size={135}
                          level="H"
                        />
                      </div>

                      {/* Hover Overlay for Print */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[1px]">
                        <Button
                          type="button"
                          size="sm"
                          className="h-10 rounded-full bg-white px-5 text-[12px] font-bold text-slate-900 shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
                          onClick={() => window.print()}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                          </svg>
                          Print Tag
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Info (Tag, Name, Status, Location) */}
                  <div className="space-y-4 pt-1">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset Tag</h4>
                      <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-300 font-mono tracking-tight">{selectedViewAsset.tag}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset Name</h4>
                      <p className="text-[16px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{selectedViewAsset.assetName}</p>
                      <p className="text-[12px] text-slate-500 mt-1">{selectedViewAsset.serialNumber || "No Serial"} &nbsp;•&nbsp; {selectedViewAsset.assetTypeRel?.name}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400/80 uppercase tracking-widest mb-1">Status</h4>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusDot[selectedViewAsset.currentStatus] || 'bg-slate-400'}`}></span>
                        <p className="text-[16px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{selectedViewAsset.currentStatus}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400/80 uppercase tracking-widest mb-1">Location</h4>
                      <div className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4 text-slate-500">
                          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <p className="text-[16px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                          {selectedViewAsset.roomRel?.name || "N/A"} {selectedViewAsset.floorRel ? `– ${selectedViewAsset.floorRel.name}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Images */}
                  <div className="flex flex-col">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Asset Images</h4>
                    {selectedViewAsset.image && selectedViewAsset.image.length > 0 ? (
                      <div
                        className="relative z-20 aspect-square w-full overflow-hidden rounded-xl border border-slate-200 dark:border-teal-800/30 bg-slate-100 dark:bg-slate-900 group cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setGallerySource("view");
                          openGallery(0);
                        }}
                      >
                        <Image
                          src={selectedViewAsset.image[0]}
                          alt="Asset preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 420px"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                        </div>

                        {selectedViewAsset.image.length > 1 && (
                          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} className="h-3 w-3">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M3 9h18M9 21V9" />
                            </svg>
                            {selectedViewAsset.image.length} photos
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-teal-800/30 bg-slate-50 dark:bg-slate-900/30">
                        <p className="text-[10px] text-slate-400 italic">No images</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Section: Assignment & Specs - Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Assignment Details */}
                  <div className="p-4 border border-slate-100 dark:border-teal-800/25 rounded-2xl bg-slate-50/50 dark:bg-[#09090b]">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Assignment Details</h4>
                    {selectedViewAsset.assignedTo ? (
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold ${getAvatarColor(selectedViewAsset.assignedTo.slice(0, 2).toUpperCase())} shadow-sm`}>
                          {selectedViewAsset.assignedTo.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{selectedViewAsset.assignedTo}</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">Current Assignee</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 italic">This asset is not currently assigned to anyone.</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Asset Specs */}
                  <div className="p-4 border border-slate-100 dark:border-teal-800/25 rounded-2xl bg-slate-50/50 dark:bg-[#09090b]">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Asset Specs</h4>
                    {selectedViewAsset.specification ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5 mt-0.5 text-slate-400">
                            <path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" />
                          </svg>
                          <p className="text-[12px] font-medium text-slate-600 dark:text-slate-400 leading-snug">
                            {selectedViewAsset.specification}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 py-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 italic">No specifications provided for this asset.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </Modal >

        {/* ── Edit Asset Modal ── */}
        < Modal
          open={editModal}
          onClose={closeEditModal}
          title="Edit Asset"
          description="Update asset details"
          className="w-full max-w-150" // Make it slightly wider since there are more fields
        >
          {selectedEditAsset && (
            <div className="flex flex-col gap-5 pt-2">

              {/* Tag (Read-only) & Initial Category block header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-teal-800/25 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Asset Tag</span>
                  <span className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 font-mono text-[13px] font-semibold text-slate-700 dark:text-slate-300 tracking-wide">{selectedEditAsset.tag}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusDot[selectedEditAsset.currentStatus] || 'bg-slate-400'}`}></span>
                  <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">{selectedEditAsset.currentStatus}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Asset Name */}
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label htmlFor="edit-assetName" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Asset Name</label>
                  <input
                    type="text"
                    id="edit-assetName"
                    value={selectedEditAsset.assetName || ""}
                    onChange={(e) => setSelectedEditAsset({ ...selectedEditAsset, assetName: e.target.value })}
                    className="h-8 rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-3 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:focus:border-teal-500 transition-colors"
                  />
                </div>

                {/* Serial Number */}
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label htmlFor="edit-serialNumber" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Serial Number</label>
                  <input
                    type="text"
                    id="edit-serialNumber"
                    value={selectedEditAsset.serialNumber || ""}
                    onChange={(e) => setSelectedEditAsset({ ...selectedEditAsset, serialNumber: e.target.value })}
                    className="h-8 rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-3 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  {!isAddingType ? (
                    <select
                      value={selectedEditAsset.assetTypeRel?.name || ""}
                      onChange={(e) => {
                        if (e.target.value === "Add another category") {
                          setIsAddingType(true);
                          setSelectedEditAsset((p) => (p ? { ...p, assetTypeRel: { id: 0, name: "", createdAt: "" } } : p));
                        } else {
                          setSelectedEditAsset((p) => (p ? { ...p, assetTypeRel: { id: 0, name: e.target.value, createdAt: "" } } : p));
                        }
                      }}
                      className="h-8 w-full rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:focus:border-teal-500 transition-colors"
                    >
                      <option value="" disabled>Select category</option>
                      {Array.from(new Set([...assetsTypes.map(t => t.name), ...Object.keys(localCategories)])).map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                      <option value="Add another category" className="font-semibold text-primary">Add another category</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <Input placeholder="New category..." className="h-8 text-[11px] flex-1" value={newType} onChange={(e) => setNewType(e.target.value)} autoFocus />
                      <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => {
                        if (newType.trim()) {
                          setLocalCategories(p => ({ ...p, [newType.trim()]: 0 }));
                          setSelectedEditAsset((p) => (p ? { ...p, assetTypeRel: { id: 0, name: newType.trim(), createdAt: "" } } : p));
                        }
                        setIsAddingType(false);
                        setNewType("");
                      }}>OK</Button>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Status</label>
                  <select
                    value={selectedEditAsset.currentStatus || ""}
                    onChange={(e) => setSelectedEditAsset({ ...selectedEditAsset, currentStatus: e.target.value })}
                    className="h-8 w-full rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-2 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:focus:border-teal-500 transition-colors"
                  >
                    <option value="" disabled>Select Status</option>
                    {["Available", "Unavailable", "Under Maintenance"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Room */}
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label htmlFor="edit-room" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Room</label>
                  {!isAddingRoom ? (
                    <select
                      id="edit-room"
                      value={selectedEditAsset.roomRel?.name || ""}
                      onChange={(e) => {
                        if (e.target.value === "Add another room") {
                          setIsAddingRoom(true);
                          setSelectedEditAsset((p) => (p ? { ...p, roomRel: { id: 0, name: "", createdAt: "" } } : p));
                        } else {
                          setSelectedEditAsset((p) => (p ? { ...p, roomRel: { id: 0, name: e.target.value, createdAt: "" } } : p));
                        }
                      }}
                      className="h-8 rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-3 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:focus:border-teal-500 transition-colors"
                    >
                      <option value="" disabled>Select room</option>
                      {Array.from(new Set([...filterOptions.rooms, ...Object.keys(localRooms)])).map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                      <option value="Add another room" className="font-semibold text-primary">Add another room</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <Input placeholder="New room..." className="h-8 text-[11px] flex-1" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} autoFocus />
                      <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => {
                        if (newRoom.trim()) {
                          setLocalRooms(p => ({ ...p, [newRoom.trim()]: 0 }));
                          setSelectedEditAsset((p) => (p ? { ...p, roomRel: { id: 0, name: newRoom.trim(), createdAt: "" } } : p));
                        }
                        setIsAddingRoom(false);
                        setNewRoom("");
                      }}>OK</Button>
                    </div>
                  )}
                </div>

                {/* Floor */}
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label htmlFor="edit-floor" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Floor</label>
                  {!isAddingFloor ? (
                    <select
                      id="edit-floor"
                      value={selectedEditAsset.floorRel?.name || ""}
                      onChange={(e) => {
                        if (e.target.value === "Add another floor") {
                          setIsAddingFloor(true);
                          setSelectedEditAsset((p) => (p ? { ...p, floorRel: { id: 0, name: "", createdAt: "" } } : p));
                        } else {
                          setSelectedEditAsset((p) => (p ? { ...p, floorRel: { id: 0, name: e.target.value, createdAt: "" } } : p));
                        }
                      }}
                      className="h-8 rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] px-3 text-[12px] text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:focus:border-teal-500 transition-colors"
                    >
                      <option value="" disabled>Select floor</option>
                      {Array.from(new Set([...filterOptions.floors, ...Object.keys(localFloors)])).map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                      <option value="Add another floor" className="font-semibold text-primary">Add another floor</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <Input placeholder="New floor..." className="h-8 text-[11px] flex-1" value={newFloor} onChange={(e) => setNewFloor(e.target.value)} autoFocus />
                      <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => {
                        if (newFloor.trim()) {
                          setLocalFloors(p => ({ ...p, [newFloor.trim()]: 0 }));
                          setSelectedEditAsset((p) => (p ? { ...p, floorRel: { id: 0, name: newFloor.trim(), createdAt: "" } } : p));
                        }
                        setIsAddingFloor(false);
                        setNewFloor("");
                      }}>OK</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Image section synced with Add modal layout */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Asset Images
                  </label>
                  {editAllImages.length > 1 && (
                    <Button
                      type="button"
                      variant="link"
                      size="xs"
                      onClick={() => {
                        setGallerySource("edit");
                        openGallery(0);
                      }}
                      className="text-[10px] font-semibold text-primary hover:underline p-0 h-auto"
                    >
                      View All ({editAllImages.length})
                    </Button>
                  )}
                </div>

                <div
                  className={`relative rounded-xl border-2 border-dashed transition-colors overflow-hidden group ${isDragging
                      ? "border-primary bg-primary/5 dark:bg-teal-900/10"
                      : "border-slate-200 dark:border-teal-800/30"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {/* Invisible file input - only top layer when no images */}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className={`absolute inset-0 h-full w-full cursor-pointer opacity-0 ${editAllImages.length === 0 ? 'z-10' : 'z-0'}`}
                    onChange={(e) => handleEditImageChange(e.target.files)}
                  />

                  {editAllImages.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${isDragging ? "bg-primary/20 text-primary" : "bg-white dark:bg-slate-800 text-slate-400 shadow-sm"
                        }`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <p className="mb-1 text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                        Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                      </p>
                      <p className="text-[10px] text-slate-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                  ) : (
                    <div
                      className="relative z-20 h-36 bg-slate-100 dark:bg-slate-900 group cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setGallerySource("edit");
                        openGallery(0);
                      }}
                    >
                      <Image
                        src={editAllImages[0]}
                        alt="Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* dark overlay for readability */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                      {/* Hover Overlay with Plus Sign */}
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-xl transform scale-75 group-hover:scale-100 transition-transform focus:outline-none">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-6 w-6">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </div>
                      </div>

                      {/* Count badge */}
                      <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} className="h-3 w-3">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                        </svg>
                        {editAllImages.length} photos
                        <span className="ml-1 opacity-60">
                          ({selectedEditAsset.image?.length || 0} saved, {editImagePreviews.length} new)
                        </span>
                      </div>

                      {/* Remove first image - Stop propagation so it doesn't open gallery */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (0 < (selectedEditAsset.image?.length || 0)) {
                            removeExistingImage(0);
                          } else {
                            removeEditImage(0 - (selectedEditAsset.image?.length || 0));
                          }
                        }}
                        className="absolute right-2 top-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-500 transition-all hover:scale-110 active:scale-95 shadow-lg p-0"
                        title="Remove image"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-teal-800/25 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-slate-200 px-5 text-[11px] font-medium"
                  onClick={closeEditModal}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="h-8 rounded-full px-6 text-[11px] font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm"
                  onClick={handleUpdateAsset}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </Modal >

        {/* ── Delete Asset Modal ── */}
        < Modal
          open={deleteModal}
          onClose={() => {
            setDeleteModal(false);
            setSelectedDeleteAsset(null);
          }}
          title="Delete Asset"
          description="Are you sure you want to delete this asset?"
          className="w-full max-w-400px"
        >
          <div className="flex flex-col gap-6 pt-4">
            <p className="text-[13px] text-slate-600 dark:text-slate-400">
              This action cannot be undone. This will permanently delete the asset{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">{selectedDeleteAsset?.assetName}</span> and remove all associated data.
            </p>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-teal-800/25">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-slate-200 px-5 text-[11px] font-medium"
                onClick={() => {
                  setDeleteModal(false);
                  setSelectedDeleteAsset(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8 rounded-full px-5 text-[11px] font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm"
                onClick={handleDeleteAsset}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal >
      </div>

      {/* ── Image Lightbox Modal ── */}
      {galleryOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={() => {
            setGalleryOpen(false);
            setGallerySource(null);
          }}
        >
          {/* Modal container – stop propagation so clicking inside doesn't close */}
          <div
            className="relative flex flex-col items-center w-full max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Explicit Close Button at top-right of container */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setGalleryOpen(false);
                setGallerySource(null);
              }}
              className="absolute -right-4 -top-8 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all active:scale-90"
              title="Close Gallery"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Button>

            {/* Counter */}
            <p className="mb-3 text-[12px] font-semibold text-white/70 tracking-widest uppercase">
              {galleryIndex + 1} / {allImages.length}
            </p>

            {/* Main image */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black">
              <Image
                src={allImages[galleryIndex]}
                alt={`Image ${galleryIndex + 1}`}
                width={800}
                height={600}
                className="w-full max-h-[60vh] object-contain"
              />

              {/* Left arrow */}
              {allImages.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={galleryPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                  title="Previous image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </Button>
              )}

              {/* Right arrow */}
              {allImages.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={galleryNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                  title="Next image"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Button>
              )}

              {/* Navigation and Close only as per user request */}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 max-w-full">
                {allImages.map((url, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    onClick={() => setGalleryIndex(idx)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all p-0 ${idx === galleryIndex ? "border-primary scale-110" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={url}
                      alt={`Thumb ${idx}`}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover" />
                  </Button>
                ))}
              </div>
            )}

            {/* Delete button for Add Asset uploads */}
            {gallerySource === "add" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeImageFromGallery(galleryIndex)}
                className="mt-4 h-9 rounded-full px-5 text-[12px] font-semibold text-white shadow-sm self-start"
              >
                Delete this photo
              </Button>
            )}

            {/* Close / Done */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setGalleryOpen(false);
                setGallerySource(null);
              }}
              className="mt-5 h-9 rounded-full px-6 text-[12px] font-semibold text-white transition-colors"
            >
              Done
            </Button>
          </div>
        </div>
      )}


      {/* ── Print-only QR Code Section ── */}
      <div className="hidden print:flex fixed inset-0 items-center justify-center bg-white z-99999">
        {selectedViewAsset && (
          <div className="flex flex-col items-center">
            <QRCodeSVG
              value={`MIRA Asset\nTag: ${selectedViewAsset.tag || selectedViewAsset.id}\nName: ${selectedViewAsset.assetName}\nCategory: ${selectedViewAsset.assetTypeRel?.name}`}
              size={320}
              level="H"
            />
            <div className="mt-8 text-center">
              <p className="text-4xl font-black text-black leading-tight">{selectedViewAsset.assetName}</p>
              <p className="text-2xl font-mono text-slate-800 mt-3 border-t-2 border-slate-100 pt-3">{selectedViewAsset.tag}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}