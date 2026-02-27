"use client";

import { useState, useEffect } from "react";
import { User, Mail, Building2, Shield, Calendar, Phone, MapPin, Edit2, Save, X, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { PageLoading } from "@/components/ui/PageLoading";

interface ProfileData {
  displayName: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  role: string;
  employeeId: string;
  joinDate: string;
}

const initialProfileData: ProfileData = {
  displayName: "IT Admin",
  email: "admin@company.com",
  phone: "+1 (555) 123-4567",
  location: "Manila, Philippines",
  department: "Information Technology",
  role: "IT Administrator",
  employeeId: "EMP-2024-001",
  joinDate: "2024-01-15", // ISO format for date input
};

// Helper function to format date for display
const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const DEPARTMENTS = ["Information Technology", "Human Resources", "Operations", "Finance", "Marketing"] as const;
const ROLES = ["IT Administrator", "Manager", "Staff", "Viewer", "Developer"] as const;

export function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [editedData, setEditedData] = useState<ProfileData>(initialProfileData);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = () => {
    setEditedData({ ...profileData });
    setIsEditing(true);
  };


  const handleChange = (field: keyof ProfileData, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, GIF, WebP)");
      e.target.value = "";
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setAvatarPreview(result);
        toast.success("Image selected. Click 'Save Changes' to update your profile picture.");
      } else {
        toast.error("Failed to read image.");
      }
      e.target.value = "";
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // If there's a new avatar preview, save it
      if (avatarPreview) {
        setAvatarUrl(avatarPreview);
        setAvatarPreview(null);
      }
      
      setProfileData({ ...editedData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData({ ...profileData });
    setAvatarPreview(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return <PageLoading message="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
            Profile
          </h1>
          <p className="mt-1 text-sm text-[var(--mira-gray-500)]">
            Manage your account information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleCancel} disabled={isSaving}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" className="gap-2 bg-[var(--mira-teal)] hover:bg-[var(--mira-teal)]/90" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card - Left Column */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-[var(--mira-gray-200)] bg-[var(--mira-white)] shadow-md dark:border-[var(--mira-gray-200)] dark:bg-[var(--mira-white)]">
            {/* Gradient Header */}
            <div className="relative h-32 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            
            {/* Profile Content */}
            <CardContent className="relative -mt-16 pb-6">
              {/* Avatar */}
              <div className="mb-4 flex justify-center">
                <div className="relative group">
                  <div
                    className={`relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full shadow-lg ring-4 transition-all ${
                      avatarPreview
                        ? "ring-teal-400 dark:ring-teal-500"
                        : "ring-[var(--mira-white)] dark:ring-[var(--mira-white)]"
                    }`}
                  >
                    {(avatarPreview || avatarUrl) ? (
                      <img
                        src={avatarPreview || avatarUrl || ""}
                        alt={profileData.displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                        <User className="h-12 w-12" strokeWidth={2} />
                      </div>
                    )}
                  </div>
                  {avatarPreview && (
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white text-xs font-bold shadow-md">
                      !
                    </div>
                  )}
                  <label
                    htmlFor="profile-avatar-upload"
                    className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[var(--mira-white)] shadow-md ring-2 ring-[var(--mira-white)] dark:bg-[var(--mira-white)] hover:bg-[var(--mira-gray-100)] transition-colors"
                    onClick={() => {
                      if (!isEditing) {
                        setEditedData({ ...profileData });
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing ? (
                      <Camera className="h-3.5 w-3.5 text-[var(--mira-teal)]" />
                    ) : (
                      <Edit2 className="h-3.5 w-3.5 text-[var(--mira-teal)]" />
                    )}
                  </label>
                  <input
                    id="profile-avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="sr-only"
                    tabIndex={-1}
                  />
                </div>
              </div>

              {/* Name and Role */}
              <div className="mb-4 text-center">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editedData.displayName}
                      onChange={(e) => handleChange("displayName", e.target.value)}
                      className="text-center text-xl font-bold border-[var(--mira-gray-200)]"
                    />
                    <Select
                      value={editedData.role}
                      onValueChange={(value) => handleChange("role", value)}
                    >
                      <SelectTrigger className="h-8 w-full border-[var(--mira-gray-200)] text-sm text-[var(--mira-gray-500)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                      {profileData.displayName}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--mira-gray-500)]">
                      {profileData.role}
                    </p>
                  </>
                )}
                <Badge className="mt-2 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                  <Shield className="mr-1 h-3 w-3" />
                  Administrator
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 border-t border-[var(--mira-gray-200)] pt-4 dark:border-[var(--mira-gray-200)]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--mira-gray-500)]">Member since</span>
                  <span className="font-medium text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                    {formatDateForDisplay(profileData.joinDate).split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--mira-gray-500)]">Status</span>
                  <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Cards - Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border-[var(--mira-gray-200)] bg-[var(--mira-white)] shadow-md dark:border-[var(--mira-gray-200)] dark:bg-[var(--mira-white)]">
            <CardHeader className="border-b border-[var(--mira-gray-200)] dark:border-[var(--mira-gray-200)]">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-[var(--mira-teal)]" strokeWidth={1.75} />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--mira-gray-500)]">
                    <User className="h-3.5 w-3.5" />
                    Display Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedData.displayName}
                      onChange={(e) => handleChange("displayName", e.target.value)}
                      className="text-base font-semibold border-[var(--mira-gray-200)]"
                    />
                  ) : (
                    <p className="text-base font-semibold text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                      {profileData.displayName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--mira-gray-500)]">
                    <Mail className="h-3.5 w-3.5" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="text-base border-[var(--mira-gray-200)]"
                    />
                  ) : (
                    <p className="text-base text-[var(--mira-gray-700)] dark:text-[var(--mira-gray-300)]">
                      {profileData.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--mira-gray-500)]">
                    <Phone className="h-3.5 w-3.5" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="text-base border-[var(--mira-gray-200)]"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <p className="text-base text-[var(--mira-gray-700)] dark:text-[var(--mira-gray-300)]">
                      {profileData.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--mira-gray-500)]">
                    <MapPin className="h-3.5 w-3.5" />
                    Location
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="text-base border-[var(--mira-gray-200)]"
                      placeholder="Manila, Philippines"
                    />
                  ) : (
                    <p className="text-base text-[var(--mira-gray-700)] dark:text-[var(--mira-gray-300)]">
                      {profileData.location}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card className="border-[var(--mira-gray-200)] bg-[var(--mira-white)] shadow-md dark:border-[var(--mira-gray-200)] dark:bg-[var(--mira-white)]">
            <CardHeader className="border-b border-[var(--mira-gray-200)] dark:border-[var(--mira-gray-200)]">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-[var(--mira-teal)]" strokeWidth={1.75} />
                Work Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--mira-gray-500)]">
                    <Building2 className="h-3.5 w-3.5" />
                    Department
                  </Label>
                  {isEditing ? (
                    <Select
                      value={editedData.department}
                      onValueChange={(value) => handleChange("department", value)}
                    >
                      <SelectTrigger className="text-base font-semibold border-[var(--mira-gray-200)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-base font-semibold text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                      {profileData.department}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--mira-gray-500)]">
                    <Shield className="h-3.5 w-3.5" />
                    Role
                  </Label>
                  {isEditing ? (
                    <Select
                      value={editedData.role}
                      onValueChange={(value) => handleChange("role", value)}
                    >
                      <SelectTrigger className="text-base border-[var(--mira-gray-200)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-base text-[var(--mira-gray-700)] dark:text-[var(--mira-gray-300)]">
                      {profileData.role}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--mira-gray-500)]">
                    <Calendar className="h-3.5 w-3.5" />
                    Employee ID
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedData.employeeId}
                      onChange={(e) => handleChange("employeeId", e.target.value)}
                      className="text-base border-[var(--mira-gray-200)]"
                      placeholder="EMP-2024-001"
                    />
                  ) : (
                    <p className="text-base text-[var(--mira-gray-700)] dark:text-[var(--mira-gray-300)]">
                      {profileData.employeeId}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--mira-gray-500)]">
                    <Calendar className="h-3.5 w-3.5" />
                    Join Date
                  </Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedData.joinDate}
                      onChange={(e) => handleChange("joinDate", e.target.value)}
                      className="text-base border-[var(--mira-gray-200)]"
                    />
                  ) : (
                    <p className="text-base text-[var(--mira-gray-700)] dark:text-[var(--mira-gray-300)]">
                      {formatDateForDisplay(profileData.joinDate)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="border-[var(--mira-gray-200)] bg-[var(--mira-white)] shadow-md dark:border-[var(--mira-gray-200)] dark:bg-[var(--mira-white)]">
            <CardHeader className="border-b border-[var(--mira-gray-200)] dark:border-[var(--mira-gray-200)]">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-[var(--mira-teal)]" strokeWidth={1.75} />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-[var(--mira-gray-200)] p-4 dark:border-[var(--mira-gray-200)]">
                  <div>
                    <p className="font-medium text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                      Password
                    </p>
                    <p className="text-sm text-[var(--mira-gray-500)]">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[var(--mira-gray-200)] p-4 dark:border-[var(--mira-gray-200)]">
                  <div>
                    <p className="font-medium text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-[var(--mira-gray-500)]">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
