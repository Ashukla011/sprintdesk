import type { BoardTask, ColumnId, Priority } from "../types/board";

export const columnLabels: Record<ColumnId, string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export const priorityLabels: Priority[] = ["low", "medium", "high"];

export function getSprintVelocity(tasks: BoardTask[]) {
  const sprints = new Map<number, number>();
  tasks.forEach((task) => {
    if (task.status === "done" || task.completedAt)
      sprints.set(task.sprintId, (sprints.get(task.sprintId) ?? 0) + 1);
  });
  return [...sprints.entries()]
    .sort(([first], [second]) => first - second)
    .map(([sprint, completed]) => ({ sprint: `Sprint ${sprint}`, completed }));
}

export function getStatusDistribution(tasks: BoardTask[]) {
  return (Object.keys(columnLabels) as ColumnId[]).map((status) => ({
    name: columnLabels[status],
    value: tasks.filter((task) => task.status === status).length,
  }));
}

export function getPriorityBreakdown(tasks: BoardTask[]) {
  return (Object.keys(columnLabels) as ColumnId[]).map((status) => {
    const columnTasks = tasks.filter((task) => task.status === status);
    return {
      name: columnLabels[status],
      low: columnTasks.filter((task) => task.priority === "low").length,
      medium: columnTasks.filter((task) => task.priority === "medium").length,
      high: columnTasks.filter((task) => task.priority === "high").length,
    };
  });
}

export function getCompletionTrend(tasks: BoardTask[]) {
  const completionByDate = new Map<string, number>();
  tasks.forEach((task) => {
    if (task.completedAt) {
      const date = task.completedAt.slice(0, 10);
      completionByDate.set(date, (completionByDate.get(date) ?? 0) + 1);
    }
  });
  let cumulative = 0;
  return [...completionByDate.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([date, completed]) => {
      cumulative += completed;
      return { date, completed, cumulative };
    });
}
