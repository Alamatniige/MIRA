"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    Users,
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
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type RoleVariant = "admin" | "manager" | "staff";
type StatusVariant = "active" | "inactive";

interface User {
    id: string;
    name: string;
    initials: string;
    email: string;
    phone: string;
    department: string;
    role: string;
    roleVariant: RoleVariant;
    status: StatusVariant;
    assetsCount: number;
    lastActive: string;
    avatarGradient: string;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const USERS: User[] = [
    {
        id: "USR-001",
        name: "Adriana Dela Cruz",
        initials: "AD",
        email: "a.delacruz@company.ph",
        phone: "+63 917 123 4567",
        department: "Finance",
        role: "IT Manager",
        roleVariant: "manager",
        status: "active",
        assetsCount: 3,
        lastActive: "Just now",
        avatarGradient: "from-violet-500 to-purple-600",
    },
    {
        id: "USR-002",
        name: "Mark Santos",
        initials: "MS",
        email: "m.santos@company.ph",
        phone: "+63 918 234 5678",
        department: "IT Operations",
        role: "IT Administrator",
        roleVariant: "admin",
        status: "active",
        assetsCount: 5,
        lastActive: "2 min ago",
        avatarGradient: "from-[#0F766E] to-[#0E7490]",
    },
    {
        id: "USR-003",
        name: "Bianca Reyes",
        initials: "BR",
        email: "b.reyes@company.ph",
        phone: "+63 919 345 6789",
        department: "HR & Admin",
        role: "Staff",
        roleVariant: "staff",
        status: "active",
        assetsCount: 2,
        lastActive: "1 hour ago",
        avatarGradient: "from-pink-500 to-rose-500",
    },
    {
        id: "USR-004",
        name: "Carlo Mendoza",
        initials: "CM",
        email: "c.mendoza@company.ph",
        phone: "+63 920 456 7890",
        department: "Operations",
        role: "Staff",
        roleVariant: "staff",
        status: "inactive",
        assetsCount: 1,
        lastActive: "3 days ago",
        avatarGradient: "from-amber-500 to-orange-500",
    },
    {
        id: "USR-005",
        name: "Diana Lim",
        initials: "DL",
        email: "d.lim@company.ph",
        phone: "+63 921 567 8901",
        department: "Finance",
        role: "Staff",
        roleVariant: "staff",
        status: "active",
        assetsCount: 2,
        lastActive: "Yesterday",
        avatarGradient: "from-sky-500 to-blue-600",
    },
    {
        id: "USR-006",
        name: "Eduardo Garcia",
        initials: "EG",
        email: "e.garcia@company.ph",
        phone: "+63 922 678 9012",
        department: "IT Operations",
        role: "IT Manager",
        roleVariant: "manager",
        status: "active",
        assetsCount: 4,
        lastActive: "5 min ago",
        avatarGradient: "from-emerald-500 to-teal-600",
    },
];

const ROLE_STYLES: Record<RoleVariant, string> = {
    admin:
        "bg-[#0F766E]/10 text-[#0F766E] dark:bg-teal-500/10 dark:text-teal-400 border border-[#0F766E]/20 dark:border-teal-500/20",
    manager:
        "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20",
    staff:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
};

const STATUS_STYLES: Record<StatusVariant, string> = {
    active:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    inactive:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

// ─── KPI Card ──────────────────────────────────────────────────────────────

const kpis = [
    {
        label: "Total Users",
        value: "148",
        sub: "Registered system accounts",
        icon: Users,
        gradient: "from-blue-500 to-indigo-500",
    },
    {
        label: "Active Users",
        value: "132",
        sub: "Currently enabled",
        icon: UserCheck,
        gradient: "from-emerald-400 to-teal-500",
    },
    {
        label: "Inactive Users",
        value: "16",
        sub: "Disabled / offboarded",
        icon: UserX,
        gradient: "from-slate-400 to-slate-500",
    },
    {
        label: "IT Admins",
        value: "8",
        sub: "Full system access",
        icon: ShieldCheck,
        gradient: "from-[#0F766E] to-[#0E7490]",
    },
    {
        label: "IT Managers",
        value: "24",
        sub: "Department leads",
        icon: ShieldAlert,
        gradient: "from-violet-500 to-purple-500",
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function UsersContent() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");
    const [addOpen, setAddOpen] = useState(false);
    const [viewUser, setViewUser] = useState<User | null>(null);

    const filtered = USERS.filter((u) => {
        const matchSearch =
            !search ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.department.toLowerCase().includes(search.toLowerCase()) ||
            u.id.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.roleVariant === roleFilter;
        const matchStatus =
            statusFilter === "all" || u.status === statusFilter;
        const matchDept =
            deptFilter === "all" ||
            u.department.toLowerCase().includes(deptFilter.toLowerCase());
        return matchSearch && matchRole && matchStatus && matchDept;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {/* Page Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        User Management
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                        Manage system accounts, roles, and department assignments.
                    </p>
                </div>
                <Button
                    onClick={() => setAddOpen(true)}
                    className="gap-2 rounded-full bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-5 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(15,118,110,0.35)] hover:shadow-[0_6px_20px_rgba(15,118,110,0.45)] hover:opacity-90 transition-all"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Add User
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {kpis.map((kpi, i) => {
                    const Icon = kpi.icon;
                    return (
                        <Card
                            key={kpi.label}
                            className="group relative overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl transition-all hover:bg-white/80 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:hover:bg-slate-900/80"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div
                                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${kpi.gradient} opacity-80`}
                            />
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`rounded-lg bg-gradient-to-br ${kpi.gradient} p-2 text-white shadow-sm ring-1 ring-white/20`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        {kpi.value}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {kpi.label}
                                    </p>
                                    <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                                        {kpi.sub}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Users Table Card */}
            <Card className="overflow-hidden border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base">All Users</CardTitle>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {filtered.length} of {USERS.length} users shown
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search name, email, dept…"
                                    className="h-8 w-52 pl-8 text-[11px]"
                                />
                            </div>
                            {/* Role Filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-[11px] text-slate-700 dark:text-slate-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                            >
                                <option value="all">Role: All</option>
                                <option value="admin">IT Administrator</option>
                                <option value="manager">IT Manager</option>
                                <option value="staff">Staff</option>
                            </select>
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-[11px] text-slate-700 dark:text-slate-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                            >
                                <option value="all">Status: All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {/* Department Filter */}
                            <select
                                value={deptFilter}
                                onChange={(e) => setDeptFilter(e.target.value)}
                                className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-[11px] text-slate-700 dark:text-slate-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
                            >
                                <option value="all">Department: All</option>
                                <option value="IT Operations">IT Operations</option>
                                <option value="Finance">Finance</option>
                                <option value="Operations">Operations</option>
                                <option value="HR">HR &amp; Admin</option>
                            </select>
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
                                                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${user.avatarGradient} text-xs font-bold text-white shadow-sm`}
                                                >
                                                    {user.initials}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                        {user.name}
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
                                                    {user.phone}
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
                                                {user.role}
                                            </span>
                                        </TableCell>

                                        {/* Status Badge */}
                                        <TableCell className="p-3 sm:p-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[user.status]}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                                                />
                                                {user.status === "active" ? "Active" : "Inactive"}
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
                                            {user.lastActive}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="p-3 text-right sm:p-4">
                                            <div className="inline-flex items-center gap-2 text-[11px] font-medium">
                                                <button
                                                    onClick={() => setViewUser(user)}
                                                    className="flex items-center gap-0.5 text-[#0F766E] dark:text-teal-400 hover:underline"
                                                >
                                                    View <ChevronRight className="h-3 w-3" />
                                                </button>
                                                <button className="text-slate-600 dark:text-slate-400 hover:underline">
                                                    Edit
                                                </button>
                                                <button className="text-rose-600 dark:text-rose-400 hover:underline">
                                                    Disable
                                                </button>
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
                <form className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                Full Name
                            </label>
                            <Input placeholder="e.g. Juan Dela Cruz" className="h-8 text-[11px]" />
                        </div>
                        <div>
                            <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                placeholder="e.g. j.delacruz@company.ph"
                                className="h-8 text-[11px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                Phone Number
                            </label>
                            <Input placeholder="+63 9XX XXX XXXX" className="h-8 text-[11px]" />
                        </div>
                        <div>
                            <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                                Department
                            </label>
                            <Input placeholder="e.g. IT Operations" className="h-8 text-[11px]" />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                            Role
                        </label>
                        <select className="h-8 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-[11px] text-slate-700 dark:text-slate-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20">
                            <option>Select role</option>
                            <option>IT Administrator</option>
                            <option>IT Manager</option>
                            <option>Staff</option>
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
                    description={`Full profile for ${viewUser.name}`}
                >
                    <div className="space-y-5">
                        {/* Avatar + Name row */}
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${viewUser.avatarGradient} text-lg font-bold text-white shadow-md`}
                            >
                                {viewUser.initials}
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-900 dark:text-white">
                                    {viewUser.name}
                                </p>
                                <p className="text-[11px] font-mono text-slate-400">
                                    {viewUser.id}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_STYLES[viewUser.roleVariant]}`}
                                    >
                                        {viewUser.role}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[viewUser.status]}`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${viewUser.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                                        />
                                        {viewUser.status === "active" ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                            {[
                                { label: "Email", value: viewUser.email, icon: Mail },
                                { label: "Phone", value: viewUser.phone, icon: Phone },
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
                                    value: viewUser.lastActive,
                                    icon: Users,
                                },
                            ].map(({ label, value, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="flex items-start gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3"
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

                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-full border-slate-200 px-3 text-[11px]"
                                onClick={() => setViewUser(null)}
                            >
                                Close
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                className="h-8 rounded-full bg-gradient-to-r from-[#0F766E] to-[#0E7490] px-4 text-[11px] font-semibold text-white"
                            >
                                Edit User
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
