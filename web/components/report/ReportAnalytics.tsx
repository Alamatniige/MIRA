"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ReportAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Reports &amp; Analytics
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            High-level utilization, maintenance, and distribution metrics for
            IT hardware assets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-full border-slate-200 px-4 text-[11px]"
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            className="h-8 rounded-full bg-gradient-to-r from-primary to-secondary px-4 text-[11px] font-semibold"
          >
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Asset Utilization Rate</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                Percentage of active assets currently in use.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  84%
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Target: &gt; 80% utilization
                </p>
              </div>
            <Badge variant="success">Healthy</Badge>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-primary to-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Maintenance Frequency</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                Average number of maintenance events per month.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  37
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Includes preventive and corrective tickets.
                </p>
              </div>
              <Badge variant="warning">Monitor</Badge>
            </div>
            <div className="mt-4 grid grid-cols-6 gap-1 text-[10px] text-slate-500">
              {["O", "N", "D", "J", "F", "M"].map((m, idx) => (
                <div key={m} className="space-y-1">
                  <div className="h-10 w-full rounded-full bg-slate-100">
                    <div
                      className="h-full w-full rounded-full bg-gradient-to-t from-secondary/70 to-primary/80"
                      style={{ height: `${40 + idx * 8}%` }}
                    />
                  </div>
                  <div className="text-center">{m}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Department Distribution</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">
                Asset allocation across key departments.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "IT & Infrastructure", value: "26%" },
                { label: "Operations", value: "24%" },
                { label: "Finance", value: "18%" },
                { label: "HR & Admin", value: "14%" },
                { label: "Others", value: "18%" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-[11px] text-slate-600"
                >
                  <span>{item.label}</span>
                  <span className="font-medium text-slate-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assets per Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-56">
              <div className="absolute inset-0 flex items-end justify-between gap-3">
                {[
                  { label: "IT", h: 90 },
                  { label: "Ops", h: 80 },
                  { label: "Fin", h: 65 },
                  { label: "HR", h: 50 },
                  { label: "Other", h: 55 },
                ].map((bar) => (
                  <div
                    key={bar.label}
                    className="flex flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div className="flex h-40 w-full items-end rounded-md bg-slate-50">
                      <div
                        className="mx-auto w-6 rounded-md bg-gradient-to-t from-primary to-secondary"
                        style={{ height: `${bar.h}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Movement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-56 rounded-lg bg-slate-50/70">
              <svg
                viewBox="0 0 320 160"
                className="h-full w-full text-primary"
              >
                <polyline
                  fill="url(#fill)"
                  stroke="none"
                  points="0,120 40,110 80,90 120,100 160,80 200,70 240,60 280,55 320,50 320,160 0,160"
                />
                <polyline
                  fill="none"
                  stroke="url(#line)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="0,120 40,110 80,90 120,100 160,80 200,70 240,60 280,55 320,50"
                />
                <defs>
                  <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#0f766e" />
                    <stop offset="1" stopColor="#0e7490" />
                  </linearGradient>
                  <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#0f766e" stopOpacity="0.25" />
                    <stop offset="1" stopColor="#0f766e" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Movement includes assignments, returns, and maintenance transfers
              across all locations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

