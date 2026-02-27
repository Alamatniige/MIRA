"use client";

import { useState, useEffect } from "react";
import { UserPlus, Mail, User, Building2, Shield } from "lucide-react";
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

type UserModalProps = {
  open: boolean;
  onClose: () => void;
};

const ROLES = ["Admin", "Manager", "Staff", "Viewer"] as const;
const DEPARTMENTS = ["IT", "HR", "Operations", "Finance"] as const;

export function UserModal({ open, onClose }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Staff" as (typeof ROLES)[number],
    department: "IT" as (typeof DEPARTMENTS)[number],
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        email: "",
        role: "Staff",
        department: "IT",
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to API
    console.log("Add user:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[var(--foreground)] sm:max-w-[600px] dark:bg-[var(--mira-white)] dark:border-[var(--mira-gray-200)]">
        <DialogHeader className="space-y-3 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--mira-teal-muted)] text-[var(--mira-teal)] dark:bg-[var(--mira-teal-muted)] dark:text-[var(--mira-teal)]">
              <UserPlus className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <DialogTitle className="text-[15px] font-semibold tracking-tight text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                Add User
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-[13px] text-[var(--mira-gray-500)] dark:text-[var(--mira-gray-400)]">
                Enter the user details below to add them to the system
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="user-name" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="user-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maria Santos"
                className="h-11 border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[var(--foreground)] dark:border-[var(--mira-gray-200)] dark:bg-[var(--mira-gray-100)]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email" className="flex items-center gap-2 text-[13px] font-medium text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                <Mail className="h-4 w-4 text-[var(--mira-gray-500)] dark:text-[var(--mira-gray-400)]" />
                Email
              </Label>
              <Input
                id="user-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. maria.santos@company.com"
                className="h-11 rounded-xl border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[var(--foreground)] dark:border-[var(--mira-gray-200)] dark:bg-[var(--mira-gray-100)]"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user-role" className="flex items-center gap-2 text-[13px] font-medium text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                  <Shield className="h-4 w-4 text-[var(--mira-gray-500)] dark:text-[var(--mira-gray-400)]" />
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as (typeof ROLES)[number] })}
                  required
                >
                  <SelectTrigger id="user-role" className="h-11 rounded-xl border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[var(--foreground)] dark:bg-[var(--mira-gray-100)] dark:border-[var(--mira-gray-200)]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--mira-white)] dark:bg-[var(--mira-white)]">
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-department" className="flex items-center gap-2 text-[13px] font-medium text-[var(--mira-navy-light)] dark:text-[var(--foreground)]">
                  <Building2 className="h-4 w-4 text-[var(--mira-gray-500)] dark:text-[var(--mira-gray-400)]" />
                  Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value as (typeof DEPARTMENTS)[number] })}
                  required
                >
                  <SelectTrigger id="user-department" className="h-11 rounded-xl border-[var(--mira-gray-200)] bg-[var(--mira-white)] text-[var(--foreground)] dark:bg-[var(--mira-gray-100)] dark:border-[var(--mira-gray-200)]">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--mira-white)] dark:bg-[var(--mira-white)]">
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full border-[var(--mira-gray-200)] text-[var(--mira-navy-light)] dark:border-[var(--mira-gray-200)] dark:text-[var(--foreground)] sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full bg-[var(--mira-teal)] text-white hover:bg-[var(--mira-teal)]/90 sm:w-auto"
            >
              Add User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
