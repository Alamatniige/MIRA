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

import { FullPageLoader } from "@/components/ui/loader"; // Added FullPageLoader import

export function ProfileContent() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "IT",
        lastName: "Administrator",
        email: "admin@mira.com",
        phone: "+63 912 345 6789",
        role: "System Administrator",
        department: "Information Technology",
        location: "Manila HQ",
        timezone: "Asia/Manila (GMT+8)"
    });

    const [saved, setSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = () => {
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isLoading) {
        return <FullPageLoader label="Loading user profile..." />;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Profile</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your administrator account settings and preferences.</p>
                </div>

                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-right-4">
                            <CheckCircle2 className="w-4 h-4" />
                            Saved successfully
                        </span>
                    )}

                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
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
                            className="px-4 py-2 text-sm font-medium text-[#0F766E] bg-[#0F766E]/10 rounded-lg hover:bg-[#0F766E]/20 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm shadow-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#0F766E] to-[#0E7490] opacity-90"></div>

                        <div className="relative pt-12 flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-md">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0F766E] to-[#0E7490] flex items-center justify-center border-4 border-white shadow-inner overflow-hidden relative">
                                        <span className="text-white text-3xl font-bold tracking-wider">AD</span>

                                        {/* Camera overlay for edit mode */}
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                            </div>

                            <h2 className="mt-4 text-xl font-bold text-slate-800">{formData.firstName} {formData.lastName}</h2>
                            <p className="text-sm font-medium text-[#0F766E] mt-1">{formData.role}</p>

                            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                                <Shield className="w-3.5 h-3.5" />
                                Super Admin Access
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {formData.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Smartphone className="w-4 h-4 text-slate-400" />
                                {formData.phone}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {formData.location}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm shadow-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Security Settings</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#0F766E]/20 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center group-hover:bg-[#0F766E] group-hover:text-white transition-colors">
                                        <Key className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Password</p>
                                        <p className="text-xs text-slate-500">Last changed 30 days ago</p>
                                    </div>
                                </div>
                                <button className="text-xs font-medium text-[#0F766E]">Update</button>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#0F766E]/20 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center group-hover:bg-[#0F766E] group-hover:text-white transition-colors">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Two-Factor Auth</p>
                                        <p className="text-xs text-slate-500">Enabled via Authenticator</p>
                                    </div>
                                </div>
                                <button className="text-xs font-medium text-[#0F766E]">Manage</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm shadow-slate-100">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                            <User className="w-5 h-5 text-[#0F766E]" />
                            <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                            : "border-transparent bg-slate-50 text-slate-700"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                            : "border-transparent bg-slate-50 text-slate-700"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                            : "border-transparent bg-slate-50 text-slate-700"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                            : "border-transparent bg-slate-50 text-slate-700"
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm shadow-slate-100">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                            <Briefcase className="w-5 h-5 text-[#0F766E]" />
                            <h2 className="text-lg font-bold text-slate-800">Professional Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Job Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                            : "border-transparent bg-slate-50 text-slate-700"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                            : "border-transparent bg-slate-50 text-slate-700"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Office Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none",
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                            : "border-transparent bg-slate-50 text-slate-700"
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Timezone</label>
                                <select
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                                    disabled={!isEditing}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none appearance-none",
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                            : "border-transparent bg-slate-50 text-slate-700"
                                    )}
                                >
                                    <option value="Asia/Manila (GMT+8)">Asia/Manila (GMT+8)</option>
                                    <option value="America/New_York (GMT-5)">America/New_York (GMT-5)</option>
                                    <option value="Europe/London (GMT+0)">Europe/London (GMT+0)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
