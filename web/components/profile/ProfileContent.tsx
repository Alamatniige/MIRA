'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, MapPin, Briefcase, Save, CheckCircle2, Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/lib/auth';
import { Avatar } from '../ui/avatar';
import { User as UserType } from '@/types/mira';
import { FullPageLoader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getCurrentUser, updateUser, uploadAvatar } = useUsers();
  const { user: sessionUser, updateUser: updateSessionUser } = useAuth();
  const sessionUserId = sessionUser?.id;
  const [formData, setFormData] = useState<UserType>({
    id: '',
    email: '',
    fullName: '',
    department: '',
    phoneNumber: '',
    role: {
      name: '',
    },
  });

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const user = await getCurrentUser();

        setFormData(user);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, [getCurrentUser, sessionUserId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser(formData.id, formData);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error('Failed to save profile', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const result = await uploadAvatar(formDataUpload);
      setFormData((prev) => ({ ...prev, avatarUrl: result.avatarUrl }));
      updateSessionUser({ avatarUrl: result.avatarUrl });
    } catch (error) {
      toast.error('Failed to upload avatar', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <FullPageLoader label="Loading user profile..." />;
  }

  if (loadError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-sm font-medium text-destructive">{loadError}</p>
        <Button
          variant="outline"
          onClick={() => {
            setLoadError(null);
            setIsLoading(true);
            getCurrentUser()
              .then(setFormData)
              .catch((err) =>
                setLoadError(err instanceof Error ? err.message : 'Failed to load profile.'),
              )
              .finally(() => setIsLoading(false));
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/*Header Section*/}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your administrator account settings and preferences.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-4 h-4" />
              Saved successfully
            </span>
          )}

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium border-border hover:bg-accent hover:text-accent-foreground transition-colors h-auto"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-sm shadow-primary/20 h-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-primary border-primary/20 bg-primary/10 hover:bg-primary/20 transition-colors h-auto dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500/20"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-br from-primary to-secondary opacity-90 dark:from-teal-900/40 dark:to-teal-950/20"></div>

            <div className="relative pt-12 flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={handleFileClick}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-28 h-28 rounded-full bg-card p-1.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden relative">
                    {formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-foreground text-3xl font-bold tracking-wider">
                        {formData.fullName
                          ? formData.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()
                          : '??'}
                      </span>
                    )}

                    {/* Camera overlay for edit mode */}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {isUploading ? (
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        ) : (
                          <Camera className="w-8 h-8 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="mt-4 text-xl font-bold text-foreground">{formData.fullName}</h2>
              <p className="text-sm font-medium text-primary dark:text-teal-400 mt-1">
                {formData.role?.name}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-muted-foreground/60" />
                {formData.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-muted-foreground/60" />
                {formData.department}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <User className="w-5 h-5 text-primary dark:text-teal-400" />
              <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none',
                    isEditing
                      ? 'border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10'
                      : 'border-transparent bg-muted/30 text-muted-foreground',
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  readOnly
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none border-transparent bg-muted/30 text-muted-foreground cursor-not-allowed',
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none',
                    isEditing
                      ? 'border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10'
                      : 'border-transparent bg-muted/30 text-muted-foreground',
                  )}
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Briefcase className="w-5 h-5 text-primary dark:text-teal-400" />
              <h2 className="text-lg font-bold text-foreground">Professional Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role?.name || ''}
                  readOnly
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none border-transparent bg-muted/30 text-muted-foreground cursor-not-allowed',
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none',
                    isEditing
                      ? 'border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10'
                      : 'border-transparent bg-muted/30 text-muted-foreground',
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
