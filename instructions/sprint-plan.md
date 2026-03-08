# MIRA OJT Sprint Plan
**Duration per Sprint:** 10 Working Days (Mon–Fri)
**Target Completion:** May 21, 2026
**Priority:** Web First → Mobile Second

---

## Analysis Summary

### Web Modules

| Module | Status | Notes |
|--------|--------|-------|
| Users | ✅ Backend Connected | CRUD fully wired via `useUsers.ts` → API |
| Assets | ✅ Backend Connected | Fetch wired via `useAssets.ts` → `/assets` API |
| Profile | ⚠️ Partial | Uses `useUsers` hook but no profile-specific API endpoint |
| Assignment | ❌ Mock Only | `useAssignments.ts` uses `MOCK_ASSIGNMENTS[]`, no API calls; `AssignmentView.tsx` has hardcoded stats/history |
| Dashboard | ❌ Mock Only | `DashboardContent.tsx` has hardcoded KPIs, departments, activity — no API calls |
| Report & Analytics | ❌ Mock Only | `useReports.ts` uses `UTILIZATION_SUMMARY`, `DEPARTMENT_DISTRIBUTION`, `MOVEMENT_TREND` constants; `ReportAnalytics.tsx` has hardcoded chart values |
| Settings | ❌ No Backend | `SettingsPanel.tsx` has no API calls; all forms are UI-only (no save functionality) |

### Mobile Modules

| Module | Status | Notes |
|--------|--------|-------|
| Login | ❌ Mock Only | No API/HTTP call found; no auth integration |
| Home | ❌ Mock Only | `HomeController` reads from `mock_data.dart` |
| Dashboard | ❌ Mock Only | `DashboardController` reads from `mock_data.dart` |
| Assets (My Assets + Detail) | ❌ Mock Only | `AssetsController` reads from `mockMyAssets` |
| History | ❌ Mock Only | Uses `mockActivityHistory` from `mock_data.dart` |
| Scan (QR Scanner) | ❌ Mock Only | No HTTP/API calls; uses local mock lookup `findAssetById()` |
| Profile | ❌ Mock Only | Uses `mockUserName`, `mockUserEmail` from `mock_data.dart` |

---

## Backend API Routes (Existing)

| Route | Description |
|-------|-------------|
| `/api/users` | User CRUD |
| `/api/users/[id]` | Single user operations |
| `/api/roles` | Roles list |
| `/api/emails` | Email utility |

**Missing backend routes:** `/api/assets`, `/api/assignments`, `/api/reports`, `/api/settings`, plus all mobile-facing API endpoints.

---

## Sprint Schedule

> **Legend:** 1 Manday = 1 full working day (8 hrs)

---

### Sprint 1 — Web: Asset Module Completion
**Dates:** Mar 9, 2026 – Mar 20, 2026 *(10 days)*

| Sprint No. | Module | Items | Mandays | Date |
|-----------|--------|-------|---------|------|
| 1 | Asset Module | Backend — Asset CRUD API (Go): Create, Read, Update, Delete | 1 Day | 03/09/2026 |
| 1 | Asset Module | Backend — QR Code generation for assets (QR image + print template) | 2 Days | 03/10/2026 – 03/11/2026 |
| 1 | Asset Module | Backend — QR scan lookup endpoint; link QR to asset record | 2 Days | 03/12/2026 – 03/13/2026 |
| 1 | Asset Module | Frontend — Wire `AssetRegistry.tsx` CRUD buttons to real API (add, edit, delete) | 2 Days | 03/16/2026 – 03/17/2026 |
| 1 | Asset Module | Frontend — Asset UI adjustments & status filters | 1 Day | 03/18/2026 |
| 1 | Asset Module | Testing — Asset module end-to-end testing | 2 Days | 03/19/2026 – 03/20/2026 |

---

### Sprint 2 — Web: Assignment Module
**Dates:** Mar 23, 2026 – Apr 3, 2026 *(10 days)*

| Sprint No. | Module | Items | Mandays | Date |
|-----------|--------|-------|---------|------|
| 2 | Assignment Module | Backend — Assignment CRUD API (Go): assign, return, update status | 2 Days | 03/23/2026 – 03/24/2026 |
| 2 | Assignment Module | Backend — Assignment history endpoint with filters (date, status, department) | 1 Day | 03/25/2026 |
| 2 | Assignment Module | Frontend — Replace `MOCK_ASSIGNMENTS` in `useAssignments.ts` with real API calls | 1 Day | 03/26/2026 |
| 2 | Assignment Module | Frontend — Wire "New Assignment" form in `AssignmentView.tsx` to API (submit, validate) | 2 Days | 03/27/2026 – 03/30/2026 |
| 2 | Assignment Module | Frontend — Wire "Assignment History" table to real data; replace hardcoded stats | 2 Days | 03/31/2026 – 04/01/2026 |
| 2 | Assignment Module | Testing — Assignment module end-to-end testing | 2 Days | 04/02/2026 – 04/03/2026 |

---

### Sprint 3 — Web: Dashboard & Reports Module
**Dates:** Apr 6, 2026 – Apr 17, 2026 *(10 days)*

| Sprint No. | Module | Items | Mandays | Date |
|-----------|--------|-------|---------|------|
| 3 | Dashboard Module | Backend — Dashboard summary API (total assets, active, assigned, maintenance, unassigned KPIs) | 1 Day | 04/06/2026 |
| 3 | Dashboard Module | Backend — Recent activity feed endpoint (latest asset movements) | 1 Day | 04/07/2026 |
| 3 | Dashboard Module | Backend — Department distribution aggregation endpoint | 1 Day | 04/08/2026 |
| 3 | Dashboard Module | Frontend — Replace hardcoded KPIs and `recentActivity` in `DashboardContent.tsx` with API | 2 Days | 04/09/2026 – 04/10/2026 |
| 3 | Report Module | Backend — Utilization rate, movement trend, department distribution report endpoints | 2 Days | 04/13/2026 – 04/14/2026 |
| 3 | Report Module | Frontend — Replace mock constants in `useReports.ts` and `ReportAnalytics.tsx` with real API data | 1 Day | 04/15/2026 |
| 3 | Report Module | Frontend — Implement Export CSV / Export PDF functionality | 1 Day | 04/16/2026 |
| 3 | Dashboard & Report | Testing — Dashboard and Reports end-to-end testing | 1 Day | 04/17/2026 |

---

### Sprint 4 — Web: Settings, Profile & Web Wrap-Up
**Dates:** Apr 20, 2026 – May 1, 2026 *(10 days)*

| Sprint No. | Module | Items | Mandays | Date |
|-----------|--------|-------|---------|------|
| 4 | Settings Module | Backend — Settings CRUD API (org settings, QR preferences, notification flags, audit retention) | 2 Days | 04/20/2026 – 04/21/2026 |
| 4 | Settings Module | Backend — User Access Control API (add admin, assign role, deactivate admin) | 1 Day | 04/22/2026 |
| 4 | Settings Module | Frontend — Wire all "Save" buttons in `SettingsPanel.tsx` to API; load existing settings on mount | 2 Days | 04/23/2026 – 04/24/2026 |
| 4 | Profile Module | Backend — Profile endpoint: GET current user, PATCH profile (fullName, phone, department) | 1 Day | 04/27/2026 |
| 4 | Profile Module | Frontend — Update `ProfileContent.tsx` to load profile from API; fix avatar initials to be dynamic | 1 Day | 04/28/2026 |
| 4 | Web Wrap-Up | Full web regression testing across all modules | 2 Days | 04/29/2026 – 04/30/2026 |
| 4 | Web Wrap-Up | Bug fixes from regression + final web QA sign-off | 1 Day | 05/01/2026 |

---

### Sprint 5 — Mobile: Login, Home, Dashboard & Assets
**Dates:** May 4, 2026 – May 15, 2026 *(10 days)*

| Sprint No. | Module | Items | Mandays | Date |
|-----------|--------|-------|---------|------|
| 5 | Mobile — Login | Backend — Mobile auth API (JWT / session token for staff login) | 1 Day | 05/04/2026 |
| 5 | Mobile — Login | Mobile — Implement real login flow in `login_screen.dart`; replace mock session with API token | 2 Days | 05/05/2026 – 05/06/2026 |
| 5 | Mobile — Home | Mobile — Wire `HomeController` to real API (asset count, active count, user name from token) | 1 Day | 05/07/2026 |
| 5 | Mobile — Dashboard | Mobile — Wire `DashboardController` to real API (my assets, greetings, asset stats) | 2 Days | 05/08/2026 – 05/11/2026 |
| 5 | Mobile — Assets | Backend — Mobile assets endpoint (get assets assigned to authenticated staff user) | 1 Day | 05/12/2026 |
| 5 | Mobile — Assets | Mobile — Replace `AssetsController` mock data with real API call; wire asset detail screen | 2 Days | 05/13/2026 – 05/14/2026 |
| 5 | Mobile — Assets | Testing — Login, Home, Dashboard, Assets module testing | 1 Day | 05/15/2026 |

---

### Sprint 6 — Mobile: History, Scan, Profile & Final QA
**Dates:** May 18, 2026 – May 21, 2026 *(4 days — final buffer)*

| Sprint No. | Module | Items | Mandays | Date |
|-----------|--------|-------|---------|------|
| 6 | Mobile — History | Backend — Activity history endpoint (asset events for the logged-in staff user) | 1 Day | 05/18/2026 |
| 6 | Mobile — History | Mobile — Replace `mockActivityHistory` with real API; wire `HistoryScreen` | 0.5 Day | 05/18/2026 |
| 6 | Mobile — Scan | Mobile — Wire QR scan result to live API lookup (`findAssetById` → real GET endpoint) | 1 Day | 05/19/2026 |
| 6 | Mobile — Profile | Mobile — Wire profile screen to real user data from API token / profile endpoint | 0.5 Day | 05/19/2026 |
| 6 | Final QA | Full mobile regression testing (all screens, login flow, scan flow) | 1 Day | 05/20/2026 |
| 6 | Final QA | Bug fixes, polish, and OJT project sign-off | 1 Day | 05/21/2026 |

---

## Sprint Overview

| Sprint | Focus | Dates | Working Days |
|--------|-------|-------|-------------|
| 1 | Web — Asset Module (Backend + Frontend + QR) | Mar 9 – Mar 20 | 10 |
| 2 | Web — Assignment Module (Backend + Frontend) | Mar 23 – Apr 3 | 10 |
| 3 | Web — Dashboard & Reports (Backend + Frontend) | Apr 6 – Apr 17 | 10 |
| 4 | Web — Settings, Profile & Web QA | Apr 20 – May 1 | 10 |
| 5 | Mobile — Login, Home, Dashboard & Assets | May 4 – May 15 | 10 |
| 6 | Mobile — History, Scan, Profile & Final QA | May 18 – May 21 | 4 (buffer) |
