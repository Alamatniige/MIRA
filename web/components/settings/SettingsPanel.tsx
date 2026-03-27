"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FullPageLoader } from "@/components/ui/loader";
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Globe,
  UserCheck,
  Smartphone,
  Database,
  Users,
  Key,
  CheckCircle2,
  Cloud,
  Shield,
  Layout,
  Save,
  UserPlus,
  AlertTriangle,
  FileLock2,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FullPageLoader label="Loading settings..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/20">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl px-1">
          Configure system-wide defaults, user access, and notification
          preferences for the MIRA IT department.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="border-none shadow-xl shadow-background/50 dark:shadow-none bg-card/80 backdrop-blur-xl ring-1 ring-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">General Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground px-1">
                Organization Name
              </label>
              <Input
                placeholder="e.g. MiraTech Solutions Inc."
                className="h-10 bg-background/50 border-border focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground px-1">
                Default Asset Categories
              </label>
              <textarea
                className="min-h-[100px] w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                placeholder="Laptop, Desktop, Monitor, Server, Network, Peripheral"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 px-1 pt-0.5">
                <CheckCircle2 className="w-3 h-3 text-primary" />
                One category per line, used as defaults for asset registration.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground px-1">
                Default Status Types
              </label>
              <textarea
                className="min-h-[100px] w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                placeholder="Active, Available, Under Maintenance, Retired"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 px-1 pt-0.5">
                <CheckCircle2 className="w-3 h-3 text-primary" />
                Used in dropdowns across asset and assignment workflows.
              </p>
            </div>

            <div className="pt-2">
              <Button
                className="w-full sm:w-auto h-11 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#0E7490] hover:shadow-lg hover:shadow-teal-500/20 text-white font-semibold transition-all px-6 gap-2"
              >
                <Save className="w-4 h-4" />
                Save General Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Access */}
        <Card className="border-none shadow-xl shadow-background/50 dark:shadow-none bg-card/80 backdrop-blur-xl ring-1 ring-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">User Access Control</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_140px] gap-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground px-1">
                  Add Admin Email
                </label>
                <Input
                  placeholder="admin.email@mira.local"
                  className="h-10 bg-background/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground px-1">
                  Role
                </label>
                <select className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm text-foreground focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                  <option>System Admin</option>
                  <option>IT Asset Manager</option>
                  <option>Read Only</option>
                </select>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-xl border-primary/20 text-primary hover:bg-primary/10 gap-2 h-10 px-4 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Administrator
            </Button>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Active Administrators</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border/50 group hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      AI
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-none">admin.it@mira.local</p>
                      <p className="text-xs text-muted-foreground mt-1">System Admin · IT Dept</p>
                    </div>
                  </div>
                  <select className="h-8 rounded-lg border-none bg-transparent text-xs font-semibold text-primary focus:ring-0 cursor-pointer">
                    <option>System Admin</option>
                    <option>IT Asset Manager</option>
                    <option>Read Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4 px-1">
                Deactivating an account will immediately revoke all access. This should follow internal HR procedures.
              </p>
              <Button
                variant="destructive"
                className="w-full rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white transition-all h-10 font-medium"
              >
                Deactivate Selected Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card className="border-none shadow-xl shadow-background/50 dark:shadow-none bg-card/80 backdrop-blur-xl ring-1 ring-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">System Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">QR Code Settings</h3>
              </div>
              <div className="space-y-3 rounded-xl border border-border/50 bg-muted/10 p-4">
                {[
                  "Include asset tag and category",
                  "Embed deep link to MIRA asset page",
                  "Require authentication on scan"
                ].map((label, idx) => (
                  <label key={idx} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded-md border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">Notifications</h3>
              </div>
              <div className="space-y-3 rounded-xl border border-border/50 bg-muted/10 p-4">
                {[
                  "Upcoming maintenance due",
                  "High-risk asset changes",
                  "New admin added or role updated"
                ].map((label, idx) => (
                  <label key={idx} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded-md border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            <Button
              className="w-full sm:w-auto h-11 rounded-xl bg-linear-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all px-6 gap-2"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Audit & Compliance */}
        <Card className="border-none shadow-xl shadow-background/50 dark:shadow-none bg-card/80 backdrop-blur-xl ring-1 ring-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileLock2 className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground">Audit & Compliance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-sm text-muted-foreground px-1 leading-relaxed">
              Configure retention policies and audit trails for asset changes.
              These controls ensure alignment with internal IT governance and
              external compliance requirements.
            </div>

            <div className="space-y-4 rounded-xl border border-border/50 bg-muted/10 p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground/60 mb-1">
                  <History className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">History Settings</span>
                </div>

                {[
                  { label: "Retain assignment history for", options: ["36 months", "24 months", "12 months", "6 months"] },
                  { label: "Retain maintenance logs for", options: ["60 months", "36 months", "24 months", "12 months"] }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                    <span className="text-sm text-foreground font-medium">{item.label}</span>
                    <select className="h-9 min-w-[120px] rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:ring-4 focus:ring-primary/10 outline-none transition-all">
                      {item.options.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full sm:w-auto h-11 rounded-xl border-border text-muted-foreground hover:bg-muted/30 font-semibold px-6 transition-all"
            >
              Save Audit Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

