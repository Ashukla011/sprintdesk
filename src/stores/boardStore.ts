import { create } from "zustand";
import type { BoardTask, ColumnId } from "../types/board";

const storageKey = "sprintdesk-board-state";

type NewTask = Pick<
  BoardTask,
  "title" | "priority" | "assigneeId" | "dueDate"
> & { description?: string };

type BoardState = {
  tasks: BoardTask[];
  isLoading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  moveTask: (taskId: number, status: ColumnId, index: number) => void;
  updateTask: (
    taskId: number,
    updates: Partial<
      Pick<
        BoardTask,
        "title" | "description" | "priority" | "assigneeId" | "dueDate"
      >
    >,
  ) => void;
  addComment: (taskId: number, comment: string) => void;
  addTask: (task: NewTask) => void;
  deleteTask: (taskId: number) => void;
};

function persist(tasks: BoardTask[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function withComments(tasks: Omit<BoardTask, "comments">[] | BoardTask[]) {
  return tasks.map((task) => ({
    ...task,
    comments: "comments" in task ? task.comments : [],
  }));
}

async function loadFixtureTasks() {
  const response = await fetch("/mock-data.json");
  if (!response.ok) {
    throw new Error("Sprint fixture is unavailable");
  }
  const body = await response.text();
  if (body.trimStart().startsWith("<"))
    throw new Error("Sprint fixture is unavailable");
  const data = JSON.parse(body) as { tasks?: Omit<BoardTask, "comments">[] };
  if (!Array.isArray(data.tasks))
    throw new Error("Sprint fixture has no tasks");
  return data.tasks.slice(0, 30);
}

export const useBoardStore = create<BoardState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  loadTasks: async () => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      set({
        tasks: withComments(JSON.parse(saved) as BoardTask[]),
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const tasks = withComments(await loadFixtureTasks());
      persist(tasks);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load sprint tasks",
      });
    }
  },
  moveTask: (taskId, status, index) => {
    const current = [...get().tasks];
    const moved = current.find((task) => task.id === taskId);
    if (!moved) return;
    const remaining = current.filter((task) => task.id !== taskId);
    const destination = remaining.filter((task) => task.status === status);
    const insertionIndex = Math.min(Math.max(index, 0), destination.length);
    destination.splice(insertionIndex, 0, {
      ...moved,
      status,
      updatedAt: new Date().toISOString(),
    });
    const ordered = remaining.filter((task) => task.status !== status);
    const tasks = [...ordered, ...destination].map((task, taskIndex) => ({
      ...task,
      order: taskIndex,
    }));
    persist(tasks);
    set({ tasks });
  },
  updateTask: (taskId, updates) => {
    const tasks = get().tasks.map((task) =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task,
    );
    persist(tasks);
    set({ tasks });
  },
  addComment: (taskId, comment) => {
    const text = comment.trim();
    if (!text) return;
    const tasks = get().tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            comments: [...task.comments, text],
            updatedAt: new Date().toISOString(),
          }
        : task,
    );
    persist(tasks);
    set({ tasks });
  },
  addTask: (task) => {
    const now = new Date().toISOString();
    const nextId = Math.max(0, ...get().tasks.map((item) => item.id)) + 1;
    const nextTask: BoardTask = {
      ...task,
      description: task.description ?? "",
      id: nextId,
      status: "backlog",
      sprintId: 3,
      order: 0,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      comments: [],
    };
    const tasks = [...get().tasks, nextTask];
    persist(tasks);
    set({ tasks });
  },
  deleteTask: (taskId) => {
    const tasks = get().tasks.filter((task) => task.id !== taskId);
    persist(tasks);
    set({ tasks });
  },
}));
