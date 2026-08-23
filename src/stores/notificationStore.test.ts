import { beforeEach, describe, expect, test } from "vitest";
import { useNotificationStore } from "./notificationStore";

describe("notification store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useNotificationStore.setState({ notifications: [], isOpen: false });
  });

  test("adds only new post ids and persists unread notifications", () => {
    const posts = [
      { id: 1, title: "First", body: "Body" },
      { id: 2, title: "Second", body: "Body" },
    ];
    expect(useNotificationStore.getState().addPosts(posts)).toBe(2);
    expect(
      useNotificationStore.getState().addPosts([
        { id: 2, title: "Duplicate", body: "Body" },
        { id: 3, title: "Third", body: "Body" },
      ]),
    ).toBe(1);
    expect(
      useNotificationStore.getState().notifications.map((item) => item.id),
    ).toEqual([3, 1, 2]);
    expect(
      JSON.parse(
        window.localStorage.getItem("sprintdesk-notifications") ?? "[]",
      ),
    ).toHaveLength(3);
  });

  test("marks one or all notifications as read and toggles the panel", () => {
    useNotificationStore.getState().addPosts([
      { id: 1, title: "First", body: "Body" },
      { id: 2, title: "Second", body: "Body" },
    ]);
    useNotificationStore.getState().markAsRead(1);
    expect(
      useNotificationStore
        .getState()
        .notifications.find((item) => item.id === 1)?.read,
    ).toBe(true);
    useNotificationStore.getState().markAllAsRead();
    expect(
      useNotificationStore.getState().notifications.every((item) => item.read),
    ).toBe(true);
    useNotificationStore.getState().toggleOpen();
    expect(useNotificationStore.getState().isOpen).toBe(true);
  });

  test("recovers when the persisted notification value is not an array", () => {
    useNotificationStore.setState({ notifications: {} as never });

    expect(
      useNotificationStore
        .getState()
        .addPosts([{ id: 1, title: "First", body: "Body" }]),
    ).toBe(1);
    expect(useNotificationStore.getState().notifications).toHaveLength(1);
  });
});
