# Architecture

## Data flow

```
UI Components (pages/, components/)
        |
Hooks / Query Layer (hooks/*.ts)      <- TanStack Query: server state, caching, polling
        |
Zustand Stores (stores/*.ts)          <- client state: auth, board, theme, notifications
        |
API / Service Layer (api/*Service.ts) <- one file per domain, the ONLY place that
        |                                 knows about DummyJSON / JSONPlaceholder / mock-data.json
API Client (api/client.ts)            <- axios instances + auth interceptor + refresh queue
        |
DummyJSON / JSONPlaceholder / mock-data.json
```

Nothing above the service layer imports `axios` or knows a URL. Swapping
`mock-data.json` for a real backend means editing `taskService.ts` only.

## State management split (per assignment 7.2)

- **Server state** — TanStack Query (`hooks/useTasks.ts`,
  `hooks/useNotificationsPoll.ts`). Handles loading/error/caching/polling.
  The tasks query is `enabled: !hydrated` — it only hits the network once;
  after that the board is driven by (persisted) Zustand state, which is what
  "persist board state across refresh" and "drag-and-drop reordering
  persists" actually require. This is a deliberate hand-off from server
  state to client state at hydration time, not a duplication of the same
  state in two places.
- **Client/app state** — Zustand: `authStore` (session), `boardStore`
  (tasks + column membership), `themeStore`, `notificationStore`. Each is
  `persist()`-backed to localStorage except the in-memory access token.
- **Local state** — component `useState` for things like the open task
  drawer ID or form inputs; deliberately not lifted to Zustand.

## Auth flow

1. `LoginPage` -> `useLogin` -> `authService.login` (DummyJSON `/auth/login`)
2. On success: access token kept in Zustand memory (not persisted), refresh
   token + user profile persisted to localStorage
3. `client.ts` request interceptor attaches `Authorization: Bearer <token>`
   to every DummyJSON request
4. On a 401, the response interceptor calls `/auth/refresh`, updates tokens,
   and retries the original request exactly once (`_retry` flag prevents
   loops); concurrent 401s are queued and replayed after the single
   in-flight refresh resolves
5. On app boot, `SessionBootstrap` (in `App.tsx`) shows a full-screen loader
   and calls `/auth/refresh` with the persisted refresh token to silently
   restore (or reject) the session before any route renders
6. `ProtectedRoute` / `PublicOnlyRoute` gate `/dashboard`, `/board`,
   `/analytics` vs. `/login`

## Kanban board

`@dnd-kit/core` + `@dnd-kit/sortable`. Each column is a droppable
(`useDroppable`); each card is sortable (`useSortable`). `onDragEnd`
resolves whether the drop target is an empty column or another card, then
calls `boardStore.moveTask(taskId, column, index)`, which removes the task
from its old column array and splices it into the new one — this is what
gives correct cross-column and within-column reordering from a single
handler.

## Known limitations / trade-offs

- `mock-data.json` shipped in this repo is a generated placeholder matching
  the required schema (30 tasks, all required fields) — swap in the real
  assignment file at `public/mock-data.json`.
- Notification service/store/hook are implemented and tested at the data
  layer; the bell + toast UI is not yet wired (see README status table).
- Board persistence uses Zustand's `persist` middleware (localStorage) —
  simplest option that satisfies "persist across refresh" without adding a
  backend.
