"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
    Users as UsersIcon,
    UserCheck,
    UserX,
    ShieldCheck,
    ShieldAlert,
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    Building2,
    ChevronRight,
    Filter,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User as UserType } from "@/types/mira";
import { useUsers } from "@/hooks/useUsers";
import { getInitials, getAvatarGradient } from "@/utils/user";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

// ─── Types ───────────────────────────────────────────────────────────────────

type RoleVariant = "admin" | "staff";
type StatusVariant = "active" | "inactive";

interface DisplayUser extends UserType {
    roleVariant: RoleVariant;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const ROLE_STYLES: Record<RoleVariant, string> = {
    admin:
        "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20",
    staff:
        "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const STATUS_STYLES: Record<StatusVariant, string> = {
    active:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    inactive:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function UsersContent() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");
    const [addOpen, setAddOpen] = useState(false);
    const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
    const [addFormData, setAddFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        department: "General",
        roleId: "",
    });
    const [viewUser, setViewUser] = useState<DisplayUser | null>(null);
    const [editUser, setEditUser] = useState<DisplayUser | null>(null);
    const [deleteUser, setDeleteUser] = useState<DisplayUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editFormData, setEditFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        department: "",
        roleId: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const { users: dynamicUsers, isLoading: isUsersLoading, refresh, addUser, getRoles, updateUser, deleteUser: removeUser } = useUsers();

    useEffect(() => {
        if (editUser) {
            setEditFormData({
                fullName: editUser.fullName,
                email: editUser.email,
                phoneNumber: editUser.phoneNumber || "",
                department: editUser.department,
                roleId: roles.find(r => r.name === editUser.role?.name)?.id || "",
            });
        }
    }, [editUser, roles]);

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        setIsSubmitting(true);
        try {
            await updateUser(editUser.id, editFormData);
            setEditUser(null);
        } catch (err) {
            alert("Failed to update user. Please check your inputs.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteUser) return;
        setIsSubmitting(true);
        try {
            await removeUser(deleteUser.id);
            setDeleteUser(null);
            setViewUser(null);
        } catch (err) {
            alert("Failed to delete user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (err) {
                console.error("Failed to fetch roles:", err);
            }
        };
        fetchRoles();
    }, [getRoles]);

    const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addUser(addFormData);
            setAddOpen(false);
            setAddFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                department: "General",
                roleId: "",
            });
        } catch (err) {
            alert("Failed to add user. Please check your inputs.");
        }
    };

    // Map dynamic users to the display interface
    const mappedUsers: DisplayUser[] = dynamicUsers.map((u) => ({
        ...u,
        roleVariant: (u.role?.name?.toLowerCase().includes("admin") ? "admin" : "staff") as RoleVariant,
    }));

    const displayUsers = mappedUsers;

    const kpis = [
        {
            label: "Total Users",
            value: mappedUsers.length.toString(),
            sub: "Registered accounts",
            icon: UsersIcon,
            color: "bg-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Active Users",
            value: mappedUsers.filter(u => u.status === "active").length.toString(),
            sub: "Currently enabled",
            icon: UserCheck,
            color: "bg-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Inactive Users",
            value: mappedUsers.filter(u => u.status === "inactive").length.toString(),
            sub: "Offboarded",
            icon: UserX,
            color: "bg-slate-600",
            bg: "bg-slate-50",
        },
        {
            label: "Admins",
            value: mappedUsers.filter(u => u.role?.name === "admin").length.toString(),
            sub: "Full access",
            icon: ShieldCheck,
            color: "bg-teal-600",
            bg: "bg-teal-50",
        },
        {
            label: "Staff",
            value: mappedUsers.filter(u => u.role?.name === "staff").length.toString(),
            sub: "Dept leads",
            icon: ShieldAlert,
            color: "bg-violet-600",
            bg: "bg-violet-50",
        },
    ];
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const filtered = displayUsers.filter((u) => {
        const matchSearch =
            !search ||
            u.fullName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.department.toLowerCase().includes(search.toLowerCase()) ||
            u.id.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.role?.name === roleFilter;
        const matchStatus =
            statusFilter === "all" || (u.status || "active").toLowerCase() === statusFilter.toLowerCase();
        const matchDept =
            deptFilter === "all" ||
            u.department.toLowerCase().includes(deptFilter.toLowerCase());
        return matchSearch && matchRole && matchStatus && matchDept;
    });

    if (isLoading || isUsersLoading) {
        return <FullPageLoader label="Loading users..." />;
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Page Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400">
                        User Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                        Administer system access, roles, and department synchronization.
                    </p>
                </div>
                <Button
                    onClick={() => setAddOpen(true)}
                    className="h-10 gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-5 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    New User Account
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <Card
                            key={kpi.label}
                            className="group relative overflow-hidden border-slate-200/60 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-[#09090b]"
                        >
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className={cn("rounded-xl p-2.5 text-white shadow-sm transition-transform group-hover:scale-110", kpi.color)}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                        <ArrowUpRight className="h-3 w-3" />
                                        <span>Live</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</span>
                                    </div>
                                    <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                                        {kpi.label}
                                    </p>
                                    <p className="mt-1 text-[10px] text-slate-400 dark:text-zinc-500">
                                        {kpi.sub}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Users Table Card */}
            <Card className="overflow-hidden border-slate-200/60 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-[#09090b]">
                <CardHeader className="border-b border-slate-100 bg-white/50 pb-4 backdrop-blur-sm dark:border-white/10 dark:bg-black/50">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Registered Users</CardTitle>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                {filtered.length} matching administrative accounts
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-slate-600" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Filter by name, email..."
                                    className="h-9 w-64 rounded-xl border-slate-200 bg-slate-50/50 pl-9 text-xs shadow-sm transition-all focus:bg-white focus:ring-slate-200 dark:border-white/10 dark:bg-zinc-900/50 dark:focus:bg-zinc-900"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E] cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                >
                                    <option value="all">All Roles</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.name}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E] cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <select
                                    value={deptFilter}
                                    onChange={(e) => setDeptFilter(e.target.value)}
                                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 focus:border-[#0F766E] focus:outline-none focus:ring-1 focus:ring-[#0F766E] cursor-pointer dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
                                >
                                    <option value="all">All Depts</option>
                                    {Array.from(new Set(displayUsers.map((u) => u.department)))
                                        .filter(Boolean)
                                        .map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableRow className="border-slate-100 hover:bg-transparent dark:border-slate-800">
                                <TableHead className="p-3 font-medium text-slate-500 sm:p-4">
                                    User
                                </TableHead>
                                <TableHead className="p-3 font-medium text-slate-500 sm:p-4">
                                    Contact
                                </TableHead>
                                <TableHead className="p-3 font-medium text-slate-500 sm:p-4">
                                    Department
                                </TableHead>
                                <TableHead className="p-3 font-medium text-slate-500 sm:p-4">
                                    Role
                                </TableHead>
                                <TableHead className="p-3 font-medium text-slate-500 sm:p-4">
                                    Status
                                </TableHead>
                                <TableHead className="p-3 font-medium text-slate-500 sm:p-4">
                                    Assets
                                </TableHead>
                                <TableHead className="p-3 font-medium text-slate-500 sm:p-4">
                                    Last Active
                                </TableHead>
                                <TableHead className="p-3 text-right font-medium text-slate-500 sm:p-4">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="py-12 text-center text-sm text-slate-400 dark:text-slate-500"
                                    >
                                        No users match your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-slate-800/60 dark:hover:bg-slate-800/50"
                                    >
                                        {/* User */}
                                        <TableCell className="p-3 sm:p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getAvatarGradient(user.id)} text-xs font-bold text-white shadow-sm`}
                                                >
                                                    {getInitials(user.fullName)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                        {user.fullName}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                                        {user.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Contact */}
                                        <TableCell className="p-3 sm:p-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                                                    <Mail className="h-3 w-3 flex-shrink-0 text-slate-400" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500">
                                                    <Phone className="h-3 w-3 flex-shrink-0 text-slate-400" />
                                                    {user.phoneNumber}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Department */}
                                        <TableCell className="p-3 sm:p-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                                                <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                                                {user.department}
                                            </div>
                                        </TableCell>

                                        {/* Role Badge */}
                                        <TableCell className="p-3 sm:p-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ROLE_STYLES[user.roleVariant]}`}
                                            >
                                                {user.role?.name}
                                            </span>
                                        </TableCell>

                                        {/* Status Badge */}
                                        <TableCell className="p-3 sm:p-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[user.status as StatusVariant || "active"]}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                                                />
                                                {user.status === "active" ? "Active" : user.status === "inactive" ? "Inactive" : user.status || "Active"}
                                            </span>
                                        </TableCell>

                                        {/* Assets */}
                                        <TableCell className="p-3 sm:p-4">
                                            <span className="inline-flex items-center justify-center h-6 min-w-[24px] rounded-md bg-slate-100 dark:bg-slate-800 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                {user.assetsCount}
                                            </span>
                                        </TableCell>

                                        {/* Last Active */}
                                        <TableCell className="p-3 text-xs text-slate-500 dark:text-slate-400 sm:p-4">
                                            {user.lastActive ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true }) : "Never"}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="p-3 text-right sm:p-4">
                                            <div className="inline-flex items-center gap-2 text-[11px] font-medium">
                                                <Button
                                                    variant="link"
                                                    size="xs"
                                                    onClick={() => setViewUser(user)}
                                                    className="flex items-center gap-0.5 text-[#0F766E] dark:text-teal-400 hover:underline h-auto p-0"
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* ── Add User Modal ──────────────────────────────────────────────── */}
            <Modal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                title="Add New User"
                description="Create a new system account and assign department and role."
            >
                <form onSubmit={handleAddUser} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                Full Name
                            </label>
                            <Input
                                name="fullName"
                                value={addFormData.fullName}
                                onChange={handleAddInputChange}
                                placeholder="e.g. Juan Dela Cruz"
                                className="h-8 text-[11px]"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <Input
                                name="email"
                                type="email"
                                value={addFormData.email}
                                onChange={handleAddInputChange}
                                placeholder="e.g. j.delacruz@company.ph"
                                className="h-8 text-[11px]"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                Phone Number
                            </label>
                            <Input
                                name="phoneNumber"
                                value={addFormData.phoneNumber}
                                onChange={handleAddInputChange}
                                placeholder="+63 9XX XXX XXXX"
                                className="h-8 text-[11px]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                Department
                            </label>
                            <Input
                                name="department"
                                value={addFormData.department}
                                onChange={handleAddInputChange}
                                placeholder="e.g. IT Operations"
                                className="h-8 text-[11px]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                            Role
                        </label>
                        <select
                            name="roleId"
                            value={addFormData.roleId}
                            onChange={handleAddInputChange}
                            required
                            className="h-8 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-2 text-[11px] text-slate-700 dark:text-zinc-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                        >
                            <option value="">Select role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full border-slate-200 px-3 text-[11px]"
                            onClick={() => setAddOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            className="h-8 rounded-full bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-4 text-[11px] font-semibold text-white"
                        >
                            Create User
                        </Button>
                    </div>
                </form>
            </Modal>
            {/* ── View User Modal ─────────────────────────────────────────────── */}
            {viewUser && (
                <Modal
                    open={!!viewUser}
                    onClose={() => setViewUser(null)}
                    title="User Details"
                    description={`Full profile for ${viewUser.fullName}`}
                >
                    <div className="space-y-5">
                        {/* Avatar + Name row */}
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getAvatarGradient(viewUser.id)} text-lg font-bold text-white shadow-md`}
                            >
                                {getInitials(viewUser.fullName)}
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-900 dark:text-white">
                                    {viewUser.fullName}
                                </p>
                                <p className="text-[11px] font-mono text-slate-400">
                                    {viewUser.id}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_STYLES[viewUser.roleVariant]}`}
                                    >
                                        {viewUser.role?.name}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[viewUser.status as StatusVariant || "active"]}`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${viewUser.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                                        />
                                        {viewUser.status === "active" ? "Active" : viewUser.status === "inactive" ? "Inactive" : viewUser.status || "Active"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                            {[
                                { label: "Email", value: viewUser.email, icon: Mail },
                                { label: "Phone", value: viewUser.phoneNumber || "N/A", icon: Phone },
                                {
                                    label: "Department",
                                    value: viewUser.department,
                                    icon: Building2,
                                },
                                {
                                    label: "Assigned Assets",
                                    value: `${viewUser.assetsCount} device${viewUser.assetsCount !== 1 ? "s" : ""}`,
                                    icon: MoreHorizontal,
                                },
                                {
                                    label: "Last Active",
                                    value: viewUser.lastActive ? formatDistanceToNow(new Date(viewUser.lastActive), { addSuffix: true }) : "Never",
                                    icon: UsersIcon,
                                },
                            ].map(({ label, value, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="flex items-start gap-2 rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-zinc-900/50 p-3"
                                >
                                    <Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            {label}
                                        </p>
                                        <p className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200">
                                            {value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                disabled={isSubmitting}
                                className="h-8 rounded-full px-4 text-[11px] font-semibold bg-rose-600 hover:bg-rose-700 text-white"
                                onClick={() => {
                                    setDeleteUser(viewUser);
                                    setViewUser(null);
                                }}
                            >
                                Delete
                            </Button>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isSubmitting}
                                    className="h-8 rounded-full border-slate-200 px-3 text-[11px]"
                                    onClick={() => setViewUser(null)}
                                >
                                    Close
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={isSubmitting}
                                    className="h-8 rounded-full bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-4 text-[11px] font-semibold text-white"
                                    onClick={() => {
                                        setEditUser(viewUser);
                                        setViewUser(null);
                                    }}
                                >
                                    Edit User
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ── Edit User Modal ─────────────────────────────────────────────── */}
            {editUser && (
                <Modal
                    open={!!editUser}
                    onClose={() => setEditUser(null)}
                    title="Edit User"
                    description={`Update profile for ${editUser.fullName}`}
                >
                    <form onSubmit={handleEditUser} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                    Full Name
                                </label>
                                <Input
                                    name="fullName"
                                    value={editFormData.fullName}
                                    onChange={handleEditInputChange}
                                    placeholder="e.g. Juan Dela Cruz"
                                    className="h-8 text-[11px]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                    Email Address
                                </label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={editFormData.email}
                                    onChange={handleEditInputChange}
                                    placeholder="e.g. j.delacruz@company.ph"
                                    className="h-8 text-[11px]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                    Phone Number
                                </label>
                                <Input
                                    name="phoneNumber"
                                    value={editFormData.phoneNumber}
                                    onChange={handleEditInputChange}
                                    placeholder="+63 9XX XXX XXXX"
                                    className="h-8 text-[11px]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                    Department
                                </label>
                                <Input
                                    name="department"
                                    value={editFormData.department}
                                    onChange={handleEditInputChange}
                                    placeholder="e.g. IT Operations"
                                    className="h-8 text-[11px]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                Role
                            </label>
                            <select
                                name="roleId"
                                value={editFormData.roleId}
                                onChange={handleEditInputChange}
                                required
                                className="h-8 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-[11px] text-slate-700 dark:text-slate-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                            >
                                <option value="">Select role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-2 flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-full border-slate-200 px-3 text-[11px]"
                                onClick={() => setEditUser(null)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmitting}
                                className="h-8 rounded-full bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-4 text-[11px] font-semibold text-white"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ── Delete User Confirmation Modal ───────────────────────────────── */}
            {deleteUser && (
                <Modal
                    open={!!deleteUser}
                    onClose={() => setDeleteUser(null)}
                    title="Delete User Account"
                    description={`Are you sure you want to delete ${deleteUser.fullName}? This action cannot be undone.`}
                >
                    <div className="flex items-center justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full border-slate-200 px-3 text-[11px]"
                            onClick={() => setDeleteUser(null)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={isSubmitting}
                            className="h-8 rounded-full bg-rose-600 hover:bg-rose-700 px-4 text-[11px] font-semibold text-white"
                            onClick={handleDeleteUser}
                        >
                            {isSubmitting ? "Deleting..." : "Confirm Delete"}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
