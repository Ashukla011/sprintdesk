import { create } from "zustand";
import type { Notification, PlaceholderPost } from "../types/notification";

const storageKey = "sprintdesk-notifications";

type NotificationState = {
  notifications: Notification[];
  isOpen: boolean;
  addPosts: (posts: PlaceholderPost[]) => number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  toggleOpen: () => void;
  close: () => void;
};

function persist(notifications: Notification[]) {
  window.localStorage.setItem(
    storageKey,
    JSON.stringify(notifications.slice(0, 100)),
  );
}

function readInitial() {
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return [];
  try {
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as Notification[]) : [];
  } catch {
    return [];
  }
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: readInitial(),
  isOpen: false,
  addPosts: (posts) => {
    const current = Array.isArray(get().notifications)
      ? get().notifications
      : [];
    const knownIds = new Set(current.map((notification) => notification.id));
    const newItems = posts
      .filter((post) => !knownIds.has(post.id))
      .map((post) => ({
        id: post.id,
        title: post.title,
        body: post.body,
        read: false,
        receivedAt: new Date().toISOString(),
      }));
    if (!newItems.length) return 0;
    const notifications = [...newItems, ...current].slice(0, 100);
    persist(notifications);
    set({ notifications });
    return newItems.length;
  },
  markAsRead: (id) => {
    const notifications = get().notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    );
    persist(notifications);
    set({ notifications });
  },
  markAllAsRead: () => {
    const notifications = get().notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    persist(notifications);
    set({ notifications });
  },
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));
