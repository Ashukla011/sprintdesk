import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, type ReactNode } from "react";
import { useBoardStore } from "../stores/boardStore";
import {
  getCompletionTrend,
  getPriorityBreakdown,
  getSprintVelocity,
  getStatusDistribution,
} from "../utils/analytics";

const statusColors = ["#a8a29e", "#0ea5e9", "#8b5cf6", "#10b981"];

export const AnalyticPage = () => {
  const { tasks, isLoading, error, loadTasks } = useBoardStore();

  useEffect(() => {
    if (!tasks.length) void loadTasks();
  }, [loadTasks, tasks.length]);

  const velocity = useMemo(() => getSprintVelocity(tasks), [tasks]);
  const status = useMemo(() => getStatusDistribution(tasks), [tasks]);
  const priority = useMemo(() => getPriorityBreakdown(tasks), [tasks]);
  const trend = useMemo(() => getCompletionTrend(tasks), [tasks]);

  if (isLoading)
    return <p aria-label="Loading analytics">Loading analytics...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
            Sprint 24
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Analytics</h1>
          <p className="mt-1 text-stone-500 dark:text-stone-400">
            Live signals from {tasks.length} board tasks
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white px-4 py-3 text-sm dark:border-stone-800 dark:bg-stone-900">
          <span className="font-bold">
            {tasks.filter((task) => task.status === "done").length}
          </span>{" "}
          completed tasks
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartPanel
          title="Sprint velocity"
          description="Completed tasks by sprint"
        >
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={velocity}>
              <CartesianGrid
                stroke="#d6d3d1"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="sprint" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar
                animationDuration={700}
                dataKey="completed"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Task status"
          description="Current distribution across columns"
        >
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                animationDuration={700}
                data={status}
                dataKey="value"
                nameKey="name"
                outerRadius="72%"
                paddingAngle={3}
              >
                {status.map((entry, index) => (
                  <Cell fill={statusColors[index]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Priority breakdown"
          description="Priority mix within each column"
        >
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={priority}>
              <CartesianGrid
                stroke="#d6d3d1"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                animationDuration={700}
                dataKey="low"
                fill="#78716c"
                name="Low"
                stackId="priority"
              />
              <Bar
                animationDuration={700}
                dataKey="medium"
                fill="#f59e0b"
                name="Medium"
                stackId="priority"
              />
              <Bar
                animationDuration={700}
                dataKey="high"
                fill="#e11d48"
                name="High"
                stackId="priority"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Completion trend"
          description="Cumulative completed tasks over time"
        >
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={trend}>
              <CartesianGrid
                stroke="#d6d3d1"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                animationDuration={700}
                dataKey="cumulative"
                dot={{ r: 3 }}
                name="Completed"
                stroke="#0ea5e9"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </div>
  );
};

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${title}-heading`}
      className="min-w-0 rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="mb-4">
        <h2 id={`${title}-heading`} className="font-black">
          {title}
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {description}
        </p>
      </div>
      <div className="h-64 min-w-0">{children}</div>
    </section>
  );
}
