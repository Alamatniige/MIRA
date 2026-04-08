"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FullPageLoader } from "@/components/ui/loader";
import { Shield, Users, Save, Trash2, Edit2, CheckCircle2, UserPlus, FileLock2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getInitials, getAvatarGradient } from "@/utils/user";
import { cn } from "@/lib/utils";

interface Role {
  id: string | number;
  name: string;
  permittedPages: string[];
}

interface User {
  id: string;
  email: string;
  fullName: string;
  roleId: string | number;
  role: Role;
  avatarUrl?: string;
}

const AVAILABLE_PAGES = ["Dashboard", "Assets", "Assignments", "Reports", "Users"];

export function SettingsPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Role Form State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formRoleName, setFormRoleName] = useState("");
  const [formPermittedPages, setFormPermittedPages] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rolesData, usersData] = await Promise.all([
        apiClient<Role[]>("/roles"),
        apiClient<User[]>("/users")
      ]);
      setRoles(rolesData || []);
      setUsers(usersData || []);
    } catch (error: any) {
      toast.error("Failed to load settings data", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRoleModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormRoleName(role.name);
      setFormPermittedPages(role.permittedPages || []);
    } else {
      setEditingRole(null);
      setFormRoleName("");
      setFormPermittedPages([]);
    }
    setIsRoleModalOpen(true);
  };

  const togglePagePermission = (page: string) => {
    setFormPermittedPages(prev => 
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page]
    );
  };

  const saveRole = async () => {
    if (!formRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    try {
      if (editingRole) {
        await apiClient(`/roles/${editingRole.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: formRoleName, permittedPages: formPermittedPages })
        });
        toast.success("Role updated successfully");
      } else {
        await apiClient("/roles", {
          method: "POST",
          body: JSON.stringify({ name: formRoleName, permittedPages: formPermittedPages })
        });
        toast.success("Role created successfully");
      }
      setIsRoleModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error("Failed to save role", { description: error.message });
    }
  };

  const deleteRole = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await apiClient(`/roles/${id}`, { method: "DELETE" });
      toast.success("Role deleted");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to delete role", { description: error.message });
    }
  };

  const updateUserRole = async (userId: string, newRoleId: string | number) => {
    try {
      await apiClient(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ roleId: newRoleId })
      });
      toast.success("User role updated");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to update user role", { description: error.message });
    }
  };

  if (isLoading) return <FullPageLoader label="Loading access control..." />;

  const adminUsersCount = users.filter(u => u.role?.name === 'Admin').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400">
            System Configurations
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Manage your organization's administrative roles and assign application access.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="group relative overflow-hidden border-slate-200/60 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-[#09090b]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-xl p-2.5 text-white shadow-sm transition-transform group-hover:scale-110 bg-teal-600">
                <FileLock2 className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-teal-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>Configured</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{roles.length}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">Active Roles</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-slate-200/60 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-[#09090b]">
           <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-xl p-2.5 text-white shadow-sm transition-transform group-hover:scale-110 bg-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>Tracked</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{users.length}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">Total Assigned Users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-slate-200/60 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-[#09090b]">
           <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-xl p-2.5 text-white shadow-sm transition-transform group-hover:scale-110 bg-violet-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-violet-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>Secured</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{adminUsersCount}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">System Administrators</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Role Management Card */}
        <Card className="flex flex-col overflow-hidden border-slate-200/60 shadow-sm transition-all dark:border-white/10 dark:bg-[#09090b] min-h-[500px]">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 backdrop-blur-sm dark:border-white/10 dark:bg-black/50">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <FileLock2 className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Role Management</CardTitle>
                  <CardDescription className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Define responsibilities and access scopes.</CardDescription>
                </div>
              </div>
              <Button 
                onClick={() => handleOpenRoleModal()}
                size="sm" 
                className="h-8 gap-2 rounded-lg bg-linear-to-r from-[#0F766E] to-[#0E7490] px-4 text-[11px] font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" /> Define Role
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-white/30 dark:bg-transparent overflow-y-auto">
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {roles.map(role => (
                <div key={role.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30 group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-2xl font-bold text-lg shadow-sm ring-1 ring-inset",
                      role.name === 'Admin' ? "bg-linear-to-br from-teal-400 to-emerald-600 text-white shadow-teal-500/30 ring-teal-500/50" : "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:ring-white/10"
                    )}>
                      {role.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {role.name}
                        {role.name === 'Admin' && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-100/50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 text-[10px] uppercase font-bold tracking-wider">System Level</span>
                        )}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 tracking-wide">
                        {role.name === 'Admin' ? 'All Permissions Granted' : (role.permittedPages?.join(' • ') || 'No Permissions')}
                      </p>
                    </div>
                  </div>
                  {role.name !== 'Admin' && (
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity mt-4 sm:mt-0">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenRoleModal(role)} className="h-9 w-9 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-400">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteRole(role.id)} className="h-9 w-9 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 text-slate-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Assignments Card */}
        <Card className="flex flex-col overflow-hidden border-slate-200/60 shadow-sm transition-all dark:border-white/10 dark:bg-[#09090b] min-h-[500px]">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 backdrop-blur-sm dark:border-white/10 dark:bg-black/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Active Assignments</CardTitle>
                <CardDescription className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Control which roles users hold.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-white/30 dark:bg-transparent overflow-y-auto">
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {users.map(u => (
                <div key={u.id} className="p-4 flex items-center justify-between transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30 group">
                   <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${getAvatarGradient(u.id)} text-lg font-bold text-white shadow-md overflow-hidden ring-2 ring-white dark:ring-[#09090b]`}>
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt={u.fullName} className="h-full w-full object-cover" />
                        ) : (
                          getInitials(u.fullName)
                        )}
                      </div>
                      <div>
                         <p className="font-bold text-slate-900 dark:text-slate-100 leading-none">{u.fullName}</p>
                         <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">{u.email}</p>
                      </div>
                   </div>
                   <div className="relative">
                     <select 
                        value={u.roleId} 
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        className="h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white shadow-sm dark:bg-[#09090b] px-3 pr-8 text-xs font-bold text-slate-700 dark:text-slate-300 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer outline-none transition-all appearance-none hover:bg-slate-50 dark:hover:bg-zinc-900"
                     >
                       {roles.map(r => (
                         <option key={r.id} value={r.id}>{r.name}</option>
                       ))}
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                       <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden border-slate-200/60 dark:border-white/10 dark:bg-[#09090b]">
          <DialogHeader className="border-b border-slate-100 dark:border-white/10 pb-4">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F766E] dark:text-teal-400" />
              {editingRole ? 'Edit Access Role' : 'Create Access Role'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">Role Designation</label>
              <Input 
                 value={formRoleName}
                 onChange={e => setFormRoleName(e.target.value)}
                 placeholder="e.g. Content Manager"
                 className="h-10 text-sm font-medium bg-slate-50/50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus:border-[#0F766E] focus:bg-white dark:focus:bg-[#09090b] transition-all rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">Functional Areas</label>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50/50 dark:bg-white/5">
                {AVAILABLE_PAGES.map(page => {
                  const isChecked = formPermittedPages.includes(page);
                  return (
                     <label key={page} className={cn(
                        "flex items-center justify-between cursor-pointer group px-3 py-2.5 rounded-xl border transition-all",
                        isChecked 
                           ? "border-[#0F766E]/50 bg-[#0F766E]/5 dark:bg-teal-500/10 shadow-sm" 
                           : "border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-[#09090b] bg-white/50 dark:bg-transparent"
                     )}>
                        <span className={cn(
                           "text-xs font-bold transition-colors",
                           isChecked ? "text-[#0F766E] dark:text-teal-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                        )}>{page}</span>
                        <div className={cn(
                           "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                           isChecked ? "border-[#0F766E] bg-[#0F766E] dark:bg-teal-400 dark:border-teal-400" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-zinc-900"
                        )}>
                           {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white dark:text-[#09090b]" />}
                        </div>
                     </label>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-slate-100 dark:border-white/10 pt-4">
            <Button variant="ghost" onClick={() => setIsRoleModalOpen(false)} className="h-10 px-5 text-xs rounded-full font-semibold hover:bg-slate-100 dark:hover:bg-white/5">Cancel</Button>
            <Button onClick={saveRole} className="h-10 px-6 text-xs rounded-full bg-linear-to-r from-[#0F766E] to-[#0E7490] hover:shadow-xl hover:shadow-[#0F766E]/20 active:scale-95 transition-all text-white font-bold">
              {editingRole ? 'Save Changes' : 'Publish Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
