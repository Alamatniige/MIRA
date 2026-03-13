# MIRA OJT Revised Sprint Plan
**Duration per Sprint:** 10 Working Days (Mon–Fri)
**Start Date:** March 12, 2026
**Target Completion:** May 6, 2026
**Priority:** Web First → Mobile Second

---

## Analysis Summary & Strategy Update
Since **all API endpoints currently exist**, the backend workload shifts from *creation* to *updating, refactoring, and optimizing*. The frontend workload remains focused on replacing mock data and wiring UI components to these existing endpoints. 

### Web Modules
| Module | Current Status | Required Action |
|--------|----------------|-----------------|
| Users | ✅ Backend Connected | Minor updates if new fields are added |
| Assets | ✅ Backend Connected | **Backend:** Update endpoints to support new UI filters & QR generation fields. **Frontend:** Wire edit/delete and filters. |
| Profile | ⚠️ Partial | **Backend:** Update profile patch endpoint. **Frontend:** Wire UI to use real profile data instead of mocks. |
| Assignment | ❌ Mock Only | **Backend:** Update assignment history/status endpoints tailored for UI. **Frontend:** Wire `useAssignments.ts` and UI forms. |
| Dashboard | ❌ Mock Only | **Backend:** Optimize aggregation endpoints for KPIs. **Frontend:** Replace hardcoded KPIs/activity with APIs. |
| Report & Analytics | ❌ Mock Only | **Backend:** Optimize endpoints for utilization and movement. **Frontend:** Wire charts and add Export (CSV/PDF) features. |
| Settings | ❌ No Backend (UI-only) | **Backend:** Ensure settings config APIs handle UI payloads. **Frontend:** Wire "Save" buttons. |

### Mobile Modules
| Module | Current Status | Required Action |
|--------|----------------|-----------------|
| Login | ❌ Mock Only | **Backend:** Verify token logic. **Frontend:** Implement auth layer via API. |
| Home & Dash | ❌ Mock Only | **Backend:** Ensure summary APIs format well for mobile. **Frontend:** Wire controllers. |
| Assets | ❌ Mock Only | **Backend:** Optimize 'My Assets' API. **Frontend:** Replace `mockMyAssets` with API fetch. |
| History | ❌ Mock Only | **Backend:** Ensure history payload is mobile-friendly. **Frontend:** Wire `HistoryScreen`. |
| Scan (QR) | ❌ Mock Only | **Backend:** Verify lookup endpoint. **Frontend:** Trigger `findAssetById` via API on scan. |
| Profile | ❌ Mock Only | **Frontend:** Sync with auth token and profile API. |

---

## Sprint Schedule

> **Legend:** 1 Manday = 1 full working day (8 hrs)
> **Backend Duties:** Updating, optimizing, and adjusting existing API responses/payloads.
> **Frontend Duties:** Wiring components, implementing state management, consuming APIs.

---

### Sprint 1 — Web: Asset & Assignment Modules
**Dates:** Mar 12, 2026 (Thu) – Mar 25, 2026 (Wed) *(10 days)*

| Sprint No. | Module | Duty | Task Description | Mandays | Date |
|-----------|--------|------|------------------|---------|------|
| 1 | Asset | Backend | Update Asset API to accommodate new fields (QR, advanced filtering, full CRUD validation). | 2 Days | 03/12 – 03/13 |
| 1 | Asset | Frontend | Wire `AssetRegistry.tsx` CRUD actions (add, edit, delete) and status filters to the updated APIs. | 2 Days | 03/16 – 03/17 |
| 1 | Assignment | Backend | Update Assignment API (assign, return, history) to match frontend payload structures & required filters. | 2 Days | 03/18 – 03/19 |
| 1 | Assignment | Frontend | Replace `MOCK_ASSIGNMENTS` in `useAssignments.ts` with real API calls; wire submission forms. | 1.5 Days | 03/20 – 03/23 (Morning) |
| 1 | Assignment | Frontend | Wire "Assignment History" table to real data; eliminate hardcoded stats in `AssignmentView.tsx`. | 1.5 Days | 03/23 (Afternoon) – 03/24 |
| 1 | Validation | Both | End-to-end integration testing for Asset and Assignment modules; bug fixing. | 1 Day | 03/25 |

---

### Sprint 2 — Web: Dashboard, Reports, Settings & Profile
**Dates:** Mar 26, 2026 (Thu) – Apr 8, 2026 (Wed) *(10 days)*

| Sprint No. | Module | Duty | Task Description | Mandays | Date |
|-----------|--------|------|------------------|---------|------|
| 2 | Dashboard | Backend | Optimize Dashboard APIs (total assets, active, maintenance, KPIs, and recent activity feed). | 1.5 Days | 03/26 – 03/27 (Morning) |
| 2 | Dashboard | Frontend | Replace hardcoded KPIs and `recentActivity` in `DashboardContent.tsx`. | 1.5 Days | 03/27 (Afternoon) – 03/30 |
| 2 | Report | Backend | Validate/Update Report APIs for utilization, movement trend, and department distribution. | 1 Day | 03/31 |
| 2 | Report | Frontend | Wire `ReportAnalytics.tsx` to APIs. Implement Export CSV / Export PDF. | 2 Days | 04/01 – 04/02 |
| 2 | Settings & Profile | Backend | Update User Access APIs, Org Settings APIs, and Profile patch endpoint to support UI forms. | 1.5 Days | 04/03 – 04/06 (Morning) |
| 2 | Settings & Profile | Frontend | Wire "Save" buttons in `SettingsPanel.tsx`; Update `ProfileContent.tsx` to handle true backend data. | 1.5 Days | 04/06 (Afternoon) – 04/07 |
| 2 | Web QA | Both | Full Web Module Regression testing & issue resolution. | 1 Day | 04/08 |

---

### Sprint 3 — Mobile: Auth, Home, Dashboard & My Assets
**Dates:** Apr 9, 2026 (Thu) – Apr 22, 2026 (Wed) *(10 days)*

| Sprint No. | Module | Duty | Task Description | Mandays | Date |
|-----------|--------|------|------------------|---------|------|
| 3 | Login | Backend | Review and verify mobile authentication/session handling API. | 1 Day | 04/09 |
| 3 | Login | Frontend | Implement real login flow in `login_screen.dart` via API; implement reliable session storage. | 2 Days | 04/10 – 04/13 |
| 3 | Home/Dash | Backend | Update API structure if required for mobile consumption (compact asset stats / greetings). | 1 Day | 04/14 |
| 3 | Home/Dash | Frontend | Wire `HomeController` & `DashboardController` to real APIs (counters, user state). | 2 Days | 04/15 – 04/16 |
| 3 | Assets | Backend | Review the "My Assets" API endpoint for authenticated staff. | 1 Day | 04/17 |
| 3 | Assets | Frontend | Replace `mockMyAssets` in `AssetsController` with real API calls; display asset details. | 2 Days | 04/20 – 04/21 |
| 3 | Validation | Both | Integration test Mobile Auth and Dashboards. | 1 Day | 04/22 |

---

### Sprint 4 — Mobile: History, Scan, Profile & System Wrap-up
**Dates:** Apr 23, 2026 (Thu) – May 6, 2026 (Wed) *(10 days)*

| Sprint No. | Module | Duty | Task Description | Mandays | Date |
|-----------|--------|------|------------------|---------|------|
| 4 | History | Backend | Ensure activity history API serves chronologically accurate logs for the mobile user. | 1 Day | 04/23 |
| 4 | History | Frontend | Wire `HistoryScreen` replacing `mockActivityHistory`. | 1 Day | 04/24 |
| 4 | Scan (QR) | Backend | Verify QR string generation / validation endpoints. | 1 Day | 04/27 |
| 4 | Scan (QR) | Frontend | Wire QR Scanner to interact with live API for fetching specific asset information (`findAssetById`). | 2 Days | 04/28 – 04/29 |
| 4 | Profile | Frontend | Connect Profile Screen on mobile to actual API fetching user credentials & image. | 1 Day | 04/30 |
| 4 | Final QA | Both | Full regression testing on Web & Mobile apps (E2E workflows). | 2 Days | 05/01 – 05/04 |
| 4 | Final QA | Both | Urgent bug fixes based on regression testing. | 1 Day | 05/05 |
| 4 | Handover | Both | Final code cleanup, deployment prep, and presentation readiness. | 1 Day | 05/06 |

---

## High-Level Sprint Overview

| Sprint | Focus | Dates | Working Days |
|--------|-------|-------|-------------|
| 1 | Web — Assets & Assignments (Integration & Adjustments) | Mar 12 – Mar 25 | 10 |
| 2 | Web — Dash, Reports, Settings, Profile & QA | Mar 26 – Apr 8 | 10 |
| 3 | Mobile — Auth, Home, Dash & My Assets | Apr 9 – Apr 22 | 10 |
| 4 | Mobile — History, Scan, Profile & System Wrap-up | Apr 23 – May 6 | 10 |
