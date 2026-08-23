import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../ui";
import { useNotifications } from "../../hooks/useNotifications";
import { useNotificationStore } from "../../stores/notificationStore";
import { useTheme } from "../../hooks/useTheme";

type NavItem = {
  label: string;
  icon: string;
  path: string;
};

const navItems: NavItem[] = [
  { label: "Overview", icon: "O", path: "/dashboard" },
  { label: "Board", icon: "B", path: "/board" },
  { label: "Analytics", icon: "A", path: "/analytics" },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const {
    notifications,
    isOpen,
    toggleOpen,
    close,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();
  useNotifications();
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const unreadCount = safeNotifications.filter(
    (notification) => !notification.read,
  ).length;
  const pageCount = Math.max(1, Math.ceil(safeNotifications.length / pageSize));
  const visibleNotifications = safeNotifications.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const username = user?.username?.trim() || "User";
  const displayName = [user?.firstName, user?.lastName]
    .filter((name): name is string => Boolean(name?.trim()))
    .join(" ") || username;
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950 transition-colors dark:bg-stone-950 dark:text-stone-50">
      {isSidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-20 bg-stone-950/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-stone-200 bg-white px-5 py-6 transition-transform dark:border-stone-800 dark:bg-stone-900 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <a className="flex items-center gap-3" href="#overview">
            <span className="grid size-10 place-items-center bg-amber-400 text-lg font-black text-stone-950">
              S
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">
                SprintDesk
              </span>
              <span className="block text-xs font-medium text-stone-500 dark:text-stone-400">
                Team workspace
              </span>
            </span>
          </a>
          <button
            aria-label="Close navigation"
            className="rounded-md p-2 text-stone-500 hover:bg-stone-100 lg:hidden dark:hover:bg-stone-800"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          >
            X
          </button>
        </div>

        <div className="mt-10 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Current sprint
            </span>
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 font-bold">Sprint 24</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
            <div className="h-full w-3/5 bg-amber-400" />
          </div>
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            12 of 20 points complete
          </p>
        </div>

        <nav aria-label="Primary navigation" className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-colors ${isActive ? "bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950" : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"}`
              }
              to={item.path}
              key={item.label}
              onClick={() => {
                setIsSidebarOpen(false);
              }}
            >
              <span
                aria-hidden="true"
                className="grid size-6 place-items-center border border-current text-xs font-black"
              >
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-stone-200 pt-5 dark:border-stone-800">
          <div className="flex items-center gap-3 px-2">
            <span className="grid size-9 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-800">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{displayName}</p>
              <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                Product engineer
              </p>
            </div>
            <button
              aria-label="Log out"
              className="text-sm font-bold text-stone-500 hover:text-rose-600"
              onClick={logout}
              type="button"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-stone-200 bg-stone-50/95 px-5 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              aria-label="Open navigation"
              className="rounded-md border border-stone-200 bg-white px-3 py-2 font-bold lg:hidden dark:border-stone-700 dark:bg-stone-900"
              onClick={() => setIsSidebarOpen(true)}
              type="button"
            >
              Menu
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Workspace
              </p>
              <h1 className="text-xl font-black tracking-tight">
                Good morning, {username}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              aria-label="Toggle dark mode"
              className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-bold hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900"
              onClick={toggleTheme}
              type="button"
            >
              {isDark ? "Light" : "Dark"}
            </button>
            <button
              aria-expanded={isOpen}
              aria-label="View notifications"
              className="relative grid size-10 place-items-center rounded-md border border-stone-200 bg-white text-lg dark:border-stone-700 dark:bg-stone-900"
              onClick={() => {
                toggleOpen();
                setPage(1);
              }}
              type="button"
            >
              !
              {unreadCount > 0 && (
                <span
                  aria-label={`${unreadCount} unread`}
                  className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>
        {isOpen && (
          <aside
            aria-label="Notifications panel"
            className="fixed right-5 top-20 z-40 w-[min(24rem,calc(100vw-2.5rem))] rounded-lg border border-stone-200 bg-white p-4 shadow-xl dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-black">Notifications</h2>
              <button
                aria-label="Close notifications"
                onClick={close}
                type="button"
              >
                X
              </button>
            </div>
            <Button
              className="mt-3 w-full"
              onClick={markAllAsRead}
              variant="ghost"
            >
              Mark all as read
            </Button>
            <div className="mt-2 divide-y divide-stone-200 dark:divide-stone-800">
              {visibleNotifications.map((notification) => (
                <button
                  className={`block w-full px-2 py-3 text-left text-sm ${notification.read ? "opacity-60" : "font-semibold"}`}
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  type="button"
                >
                  <span className="block capitalize">{notification.title}</span>
                  <span className="mt-1 block line-clamp-2 text-xs text-stone-500">
                    {notification.body}
                  </span>
                </button>
              ))}
            </div>
            {safeNotifications.length === 0 && (
              <p className="px-2 py-8 text-center text-sm text-stone-500">
                No notifications yet.
              </p>
            )}
            <div className="mt-3 flex items-center justify-between text-xs">
              <button
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
                type="button"
              >
                Previous
              </button>
              <span>
                Page {page} of {pageCount}
              </span>
              <button
                disabled={page === pageCount}
                onClick={() => setPage((value) => value + 1)}
                type="button"
              >
                Next
              </button>
            </div>
          </aside>
        )}
        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
