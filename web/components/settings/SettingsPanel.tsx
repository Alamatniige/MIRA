"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Configure system-wide defaults, user access, and notification
          preferences for the IT department.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Organization Name
              </label>
              <Input
                placeholder="e.g. MiraTech Solutions Inc."
                className="h-8 text-[11px]"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Default Asset Categories
              </label>
              <textarea
                className="min-h-[72px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Laptop, Desktop, Monitor, Server, Network, Peripheral"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                One category per line, used as defaults for asset registration.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Default Status Types
              </label>
              <textarea
                className="min-h-[72px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Active, Available, Under Maintenance, Retired"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Used in dropdowns across asset and assignment workflows.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                className="h-8 rounded-full bg-gradient-to-r from-primary to-secondary px-4 text-[11px] font-semibold"
              >
                Save General Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Access (Admin Only)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Add Admin
                </label>
                <Input
                  placeholder="Admin email address"
                  className="h-8 text-[11px]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Role
                </label>
                <select className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option>System Admin</option>
                  <option>IT Asset Manager</option>
                  <option>Read Only</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-full border-slate-200 px-4 text-[11px]"
              >
                Add Admin
              </Button>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h3 className="text-[11px] font-medium text-slate-700">
                Manage Roles
              </h3>
              <p className="mt-1 text-[10px] text-slate-500">
                Review existing administrators and adjust their access levels.
              </p>
              <div className="mt-3 space-y-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div>
                    <p className="font-medium text-slate-800">
                      admin.it@mira.local
                    </p>
                    <p className="text-[10px] text-slate-500">
                      System Admin · IT Department
                    </p>
                  </div>
                  <select className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option>System Admin</option>
                    <option>IT Asset Manager</option>
                    <option>Read Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h3 className="text-[11px] font-medium text-red-700">
                Deactivate Account
              </h3>
              <p className="mt-1 text-[10px] text-slate-500">
                Disable access for a specific administrator. This action is
                reversible but should follow internal HR procedures.
              </p>
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 rounded-full bg-red-600 px-4 text-[11px] font-semibold text-white hover:bg-red-700"
                >
                  Deactivate Selected Admin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                QR Code Settings
              </label>
              <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                <label className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                  <span>Include asset tag and category</span>
                  <input type="checkbox" defaultChecked />
                </label>
                <label className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                  <span>Embed deep link to MIRA asset page</span>
                  <input type="checkbox" defaultChecked />
                </label>
                <label className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                  <span>Require authentication on scan</span>
                  <input type="checkbox" defaultChecked />
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-700">
                Notification Preferences
              </label>
              <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                <label className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                  <span>Upcoming maintenance due</span>
                  <input type="checkbox" defaultChecked />
                </label>
                <label className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                  <span>High-risk asset changes</span>
                  <input type="checkbox" defaultChecked />
                </label>
                <label className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                  <span>New admin added or role updated</span>
                  <input type="checkbox" defaultChecked />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                className="h-8 rounded-full bg-gradient-to-r from-primary to-secondary px-4 text-[11px] font-semibold"
              >
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit &amp; Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-[11px] text-slate-600">
              Configure retention policies and audit trails for asset changes.
              These controls ensure alignment with internal IT governance and
              external compliance requirements.
            </p>
            <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
              <div className="grid grid-cols-[2fr_1fr] items-center gap-3">
                <span className="text-[11px] text-slate-700">
                  Retain assignment history for
                </span>
                <select className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option>36 months</option>
                  <option>24 months</option>
                  <option>12 months</option>
                  <option>6 months</option>
                </select>
              </div>
              <div className="grid grid-cols-[2fr_1fr] items-center gap-3">
                <span className="text-[11px] text-slate-700">
                  Retain maintenance logs for
                </span>
                <select className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option>60 months</option>
                  <option>36 months</option>
                  <option>24 months</option>
                  <option>12 months</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-full border-slate-200 px-4 text-[11px]"
              >
                Save Audit Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

