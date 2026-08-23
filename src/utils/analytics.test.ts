import { describe, expect, test } from "vitest";
import {
  getCompletionTrend,
  getPriorityBreakdown,
  getSprintVelocity,
  getStatusDistribution,
} from "./analytics";
import type { BoardTask } from "../types/board";

const task = (overrides: Partial<BoardTask>): BoardTask => ({
  id: 1,
  title: "Task",
  description: "",
  status: "backlog",
  priority: "medium",
  assigneeId: 1,
  dueDate: "2026-08-30",
  sprintId: 3,
  order: 1,
  createdAt: "2026-08-20T00:00:00Z",
  completedAt: null,
  updatedAt: "2026-08-20T00:00:00Z",
  comments: [],
  ...overrides,
});

describe("analytics transformations", () => {
  test("calculates completed tasks per sprint from board tasks", () => {
    const data = getSprintVelocity([
      task({ id: 1, sprintId: 2, status: "done" }),
      task({ id: 2, sprintId: 3, status: "done" }),
      task({
        id: 3,
        sprintId: 3,
        status: "review",
        completedAt: "2026-08-20T12:00:00Z",
      }),
      task({ id: 4, sprintId: 3, status: "backlog" }),
    ]);

    expect(data).toEqual([
      { sprint: "Sprint 2", completed: 1 },
      { sprint: "Sprint 3", completed: 2 },
    ]);
  });

  test("calculates status and priority distributions from the same task list", () => {
    const tasks = [
      task({ id: 1, status: "backlog", priority: "high" }),
      task({ id: 2, status: "backlog", priority: "low" }),
      task({ id: 3, status: "done", priority: "medium" }),
    ];

    expect(getStatusDistribution(tasks).map((item) => item.value)).toEqual([
      2, 0, 0, 1,
    ]);
    expect(getPriorityBreakdown(tasks)[0]).toMatchObject({
      name: "Backlog",
      low: 1,
      medium: 0,
      high: 1,
    });
    expect(getPriorityBreakdown(tasks)[3]).toMatchObject({
      name: "Done",
      low: 0,
      medium: 1,
      high: 0,
    });
  });

  test("sorts completion dates and returns cumulative completion", () => {
    const data = getCompletionTrend([
      task({ id: 1, completedAt: "2026-08-22T12:00:00Z" }),
      task({ id: 2, completedAt: "2026-08-20T12:00:00Z" }),
      task({ id: 3, completedAt: "2026-08-20T14:00:00Z" }),
      task({ id: 4, completedAt: null }),
    ]);

    expect(data).toEqual([
      { date: "2026-08-20", completed: 2, cumulative: 2 },
      { date: "2026-08-22", completed: 1, cumulative: 3 },
    ]);
  });
});
