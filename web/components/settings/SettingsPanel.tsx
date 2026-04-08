"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FullPageLoader } from "@/components/ui/loader";
import { Shield, Users, Save, Trash2, Edit2, CheckCircle2, UserPlus, FileLock2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-[#0F766E] to-[#0E7490] shadow-lg shadow-teal-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Access Control
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl px-1">
          Manage system roles and assign permissions to control page visibility.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-xl shadow-background/50 dark:shadow-none bg-card/80 backdrop-blur-xl ring-1 ring-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0F766E]/10">
                  <FileLock2 className="w-4 h-4 text-[#0F766E]" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">Role Management</CardTitle>
              </div>
              <Button 
                onClick={() => handleOpenRoleModal()}
                size="sm" 
                className="bg-[#0F766E] hover:bg-[#0E7490] text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" /> New Role
              </Button>
            </div>
            <CardDescription>Create or modify roles and their permitted pages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {roles.map(role => (
                <div key={role.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10 gap-3 group">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                      {role.name}
                      {role.name === 'Admin' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] uppercase font-bold tracking-wider">System</span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {role.name === 'Admin' ? 'Full Access' : (role.permittedPages?.join(', ') || 'No pages permitted')}
                    </p>
                  </div>
                  {role.name !== 'Admin' && (
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenRoleModal(role)}>
                        <Edit2 className="w-4 h-4 text-emerald-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteRole(role.id)}>
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-background/50 dark:shadow-none bg-card/80 backdrop-blur-xl ring-1 ring-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#0F766E]/10">
                <Users className="w-4 h-4 text-[#0F766E]" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">User Assignments</CardTitle>
            </div>
            <CardDescription>Assign specific roles to active users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/10">
                   <div>
                      <p className="text-sm font-bold text-foreground leading-none">{u.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{u.email}</p>
                   </div>
                   <select 
                      value={u.roleId} 
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/50 cursor-pointer"
                   >
                     {roles.map(r => (
                       <option key={r.id} value={r.id}>{r.name}</option>
                     ))}
                   </select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground px-1">Role Name</label>
              <Input 
                 value={formRoleName}
                 onChange={e => setFormRoleName(e.target.value)}
                 placeholder="e.g. Content Manager"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground px-1">Permitted Pages</label>
              <div className="space-y-2 rounded-xl border border-border/50 p-3 bg-muted/10">
                {AVAILABLE_PAGES.map(page => {
                  const isChecked = formPermittedPages.includes(page);
                  return (
                    <label key={page} className="flex items-center justify-between cursor-pointer group px-1">
                      <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{page}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePagePermission(page)}
                        className="w-4 h-4 rounded-md border-border accent-[#0F766E] transition-all cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>Cancel</Button>
            <Button onClick={saveRole} className="bg-[#0F766E] hover:bg-[#0E7490] text-white">Save Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
