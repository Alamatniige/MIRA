"use client";

import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Shield,
    Key,
    Smartphone,
    MapPin,
    Briefcase,
    Calendar,
    Save,
    CheckCircle2,
    Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUsers } from "@/hooks/useUsers";
import { User as UserType } from "@/types/mira";
import { FullPageLoader } from "@/components/ui/loader";

export function ProfileContent() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { getCurrentUser, updateUser } = useUsers();
    const [formData, setFormData] = useState<UserType>({
        id: "",
        email: "",
        fullName: "",
        department: "",
        phoneNumber: "",
        role: {
            name: "",
        },
    });

    const [saved, setSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUser(formData.id, formData);
            setSaved(true);
            setIsEditing(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await getCurrentUser();
            setFormData(user);
        };
        fetchCurrentUser();
    }, [getCurrentUser]);



    if (isLoading) {
        return <FullPageLoader label="Loading user profile..." />;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Admin Profile</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your administrator account settings and preferences.</p>
                </div>

                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-right-4">
                            <CheckCircle2 className="w-4 h-4" />
                            Saved successfully
                        </span>
                    )}

                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0F766E] rounded-lg hover:bg-[#0E7490] transition-all shadow-sm shadow-[#0F766E]/20"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-sm font-medium text-[#0F766E] dark:text-teal-400 bg-[#0F766E]/10 dark:bg-teal-500/10 rounded-lg hover:bg-[#0F766E]/20 dark:hover:bg-teal-500/20 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm shadow-slate-100 dark:shadow-none relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#0F766E] to-[#0E7490] opacity-90"></div>

                        <div className="relative pt-12 flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-800 p-1.5 shadow-md">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0F766E] to-[#0E7490] flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-inner overflow-hidden relative">
                                        <span className="text-white text-3xl font-bold tracking-wider">AD</span>

                                        {/* Camera overlay for edit mode */}
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm"></div>
                            </div>

                            <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">{formData.fullName}</h2>
                            <p className="text-sm font-medium text-[#0F766E] dark:text-teal-400 mt-1">{formData.role?.name}</p>

                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                {formData.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                {formData.department}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm shadow-slate-100 dark:shadow-none">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <User className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#0F766E] dark:focus:border-teal-500 focus:ring-2 focus:ring-[#0F766E]/10 dark:focus:ring-teal-500/20"
                                            : "border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    readOnly
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#0F766E] dark:focus:border-teal-500 focus:ring-2 focus:ring-[#0F766E]/10 dark:focus:ring-teal-500/20"
                                            : "border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm shadow-slate-100 dark:shadow-none">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <Briefcase className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Professional Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role?.name || ""}
                                    readOnly
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#0F766E] dark:focus:border-teal-500 focus:ring-2 focus:ring-[#0F766E]/10 dark:focus:ring-teal-500/20"
                                            : "border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
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
