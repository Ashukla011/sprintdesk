import { beforeEach, describe, expect, test, vi } from "vitest";
import { useBoardStore } from "./boardStore";

const fixture = {
  tasks: [
    {
      id: 1,
      title: "First task",
      description: "Task details",
      status: "backlog",
      priority: "high",
      assigneeId: 1,
      dueDate: "2026-08-28",
      sprintId: 3,
      order: 1,
      createdAt: "2026-08-20T00:00:00Z",
      completedAt: null,
      updatedAt: "2026-08-20T00:00:00Z",
    },
    {
      id: 2,
      title: "Second task",
      description: "More details",
      status: "done",
      priority: "low",
      assigneeId: 2,
      dueDate: "2026-08-29",
      sprintId: 3,
      order: 1,
      createdAt: "2026-08-20T00:00:00Z",
      completedAt: "2026-08-20T00:00:00Z",
      updatedAt: "2026-08-20T00:00:00Z",
    },
  ],
};

describe("board store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useBoardStore.setState({ tasks: [], isLoading: false, error: null });
    vi.restoreAllMocks();
  });

  test("loads the first thirty tasks and persists them", async () => {
    const fetchMock = vi
      .fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
      .mockResolvedValue(
        new Response(JSON.stringify(fixture), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await useBoardStore.getState().loadTasks();

    expect(fetchMock).toHaveBeenCalledWith("/mock-data.json");
    expect(useBoardStore.getState().tasks).toHaveLength(2);
    expect(useBoardStore.getState().tasks[0].comments).toEqual([]);
    expect(window.localStorage.getItem("sprintdesk-board-state")).toContain(
      "First task",
    );
  });

  test("restores persisted tasks without fetching", async () => {
    window.localStorage.setItem(
      "sprintdesk-board-state",
      JSON.stringify(fixture.tasks),
    );
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await useBoardStore.getState().loadTasks();

    expect(useBoardStore.getState().tasks).toHaveLength(2);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("moves tasks, edits details, adds comments, creates and deletes tasks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(fixture), { status: 200 })),
    );
    await useBoardStore.getState().loadTasks();

    useBoardStore.getState().moveTask(1, "done", 0);
    useBoardStore.getState().updateTask(1, { title: "Renamed task" });
    useBoardStore.getState().addComment(1, "Needs review");
    useBoardStore
      .getState()
      .addTask({
        title: "New task",
        priority: "medium",
        assigneeId: 3,
        dueDate: "2026-08-30",
      });

    const state = useBoardStore.getState();
    expect(state.tasks.find((task) => task.id === 1)).toMatchObject({
      status: "done",
      title: "Renamed task",
      comments: ["Needs review"],
    });
    expect(state.tasks).toHaveLength(3);

    state.deleteTask(1);
    expect(useBoardStore.getState().tasks.some((task) => task.id === 1)).toBe(
      false,
    );
    expect(window.localStorage.getItem("sprintdesk-board-state")).not.toContain(
      "Renamed task",
    );
  });
});
