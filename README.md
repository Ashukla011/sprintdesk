# SprintDesk

A sprint management dashboard — Kanban board, analytics, notifications, and
auth — built as a frontend engineering assignment submission.

**Live demo:** [Live Demo](https://sprintdesk-avnish6.vercel.app/dashboard) `vercel deploy` 
**Demo login:** username `emilys`, password `emilyspass` (DummyJSON test account)

![SprintDesk screenshot]


## What this demonstrates

| Area | Where |
|---|---|
| Token auth + silent refresh + retry | `src/api/client.ts` (axios interceptor) |
| Protected/public-only routing | `src/routes/` |
| Kanban DnD (cross-column + reorder) | `src/components/board/`, `src/pages/BoardPage.tsx` |
| Server vs. client vs. local state split | `src/hooks/` (TanStack Query) vs `src/stores/` (Zustand) |
| Layered data-access architecture | `src/api/*Service.ts` — UI never imports axios directly |
| Charts derived from live board state | `src/pages/AnalyticsPage.tsx` |
| Route-level code splitting | `React.lazy` + `Suspense` in `src/App.tsx` |
| Component library from scratch | `src/components/ui/` |
| Tests | `src/stores/boardStore.test.ts` — `npm run test` |

## Status vs. assignment brief

**Done:** auth (login, protected routes, silent refresh + retry, full-screen
session loading, logout), Kanban board (DnD, add/delete/edit, persisted
locally, side-drawer detail view), analytics (all 4 required charts, driven
by live board state, responsive), theme toggle, core design-system
components (Button, Input, Modal, Skeleton), route-level code splitting,
unit tests for the board store.

**Not yet implemented — documented per §2 of the brief:**
- Remember-me / password-strength (bonus, skipped for scope discipline)
- Select/Toast/DataTable components and the notification polling UI (service
  layer + store + hook exist in `src/api/notificationService.ts` and
  `src/stores/notificationStore.ts`; the bell/panel UI is the remaining wire-up)
- Auth-interceptor and useToast test coverage beyond the board store
- Lighthouse pass / axe-core audit

With more time, next: wire the notification bell + toast-on-new-item, add
Select/Toast/DataTable, add auth-interceptor tests, then a Lighthouse pass.

## Data sources

- **DummyJSON** (`/auth/login`, `/auth/refresh`) — authentication
- **mock-data.json** (`public/mock-data.json`) — primary task/board data.
  This repo ships a schema-matching **generated placeholder** (30 tasks) so
  the app runs standalone; swap in the assignment-provided file at the same
  path and shape — no code changes required, since all access goes through
  `src/api/taskService.ts`.
- **JSONPlaceholder** (`/posts?_limit=5`) — simulated notification polling feed

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build       # production build
npm run test        # vitest
```

No environment variables are required — all API base URLs are public and
hardcoded per the assignment spec (see `src/api/client.ts`).

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the data-flow diagram and the
reasoning behind the API/service-layer separation, state-management split,
and board-persistence strategy.
