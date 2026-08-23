import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useBoardStore } from "../stores/boardStore";
import {
  columnOrder,
  type BoardTask,
  type ColumnId,
  type Priority,
} from "../types/board";

const columns: { id: ColumnId; label: string; accent: string }[] = [
  { id: "backlog", label: "Backlog", accent: "bg-stone-400" },
  { id: "in-progress", label: "In Progress", accent: "bg-sky-500" },
  { id: "review", label: "Review", accent: "bg-violet-500" },
  { id: "done", label: "Done", accent: "bg-emerald-500" },
];

const priorityStyles: Record<Priority, string> = {
  low: "bg-stone-100 text-stone-600",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
};

const TaskCard = memo(function TaskCard({
  task,
  onOpen,
}: {
  task: BoardTask;
  onOpen: (task: BoardTask) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-md border border-stone-200 bg-white p-4 shadow-sm active:cursor-grabbing dark:border-stone-700 dark:bg-stone-900 ${isDragging ? "opacity-40" : ""}`}
      onClick={() => onOpen(task)}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold leading-snug">{task.title}</h3>
        <span
          className={`shrink-0 rounded px-2 py-1 text-[10px] font-black uppercase ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
      <div className="mt-5 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>Assignee {task.assigneeId}</span>
        <time dateTime={task.dueDate}>Due {task.dueDate}</time>
      </div>
    </article>
  );
});

function Column({
  column,
  tasks,
  onOpen,
}: {
  column: (typeof columns)[number];
  tasks: BoardTask[];
  onOpen: (task: BoardTask) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <section
      aria-labelledby={`${column.id}-heading`}
      className={`min-w-[275px] flex-1 rounded-lg bg-stone-100/80 p-3 dark:bg-stone-900/70 ${isOver ? "ring-2 ring-amber-400" : ""}`}
      ref={setNodeRef}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h2
          id={`${column.id}-heading`}
          className="flex items-center gap-2 text-sm font-black"
        >
          <span className={`size-2 rounded-full ${column.accent}`} />
          {column.label}
        </h2>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-stone-500 dark:bg-stone-800">
          {tasks.length}
        </span>
      </header>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-24 space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} onOpen={onOpen} task={task} />
          ))}
        </div>
      </SortableContext>
    </section>
  );
}

function NewTaskForm({ onClose }: { onClose: () => void }) {
  const addTask = useBoardStore((state) => state.addTask);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assigneeId, setAssigneeId] = useState(1);
  const [dueDate, setDueDate] = useState("2026-08-28");
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        addTask({ title, priority, assigneeId, dueDate });
        onClose();
      }}
    >
      <label className="block text-sm font-bold">
        Title
        <input
          className="mt-1 w-full rounded border border-stone-300 bg-white p-2 text-stone-950 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-400"
          onChange={(event) => setTitle(event.target.value)}
          required
          value={title}
        />
      </label>
      <label className="block text-sm font-bold">
        Priority
        <select
          className="mt-1 w-full rounded border border-stone-300 bg-white p-2 text-stone-950 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-white"
          onChange={(event) => setPriority(event.target.value as Priority)}
          value={priority}
        >
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>
      </label>
      <label className="block text-sm font-bold">
        Assignee
        <input
          className="mt-1 w-full rounded border border-stone-300 bg-white p-2 text-stone-950 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-white"
          min="1"
          onChange={(event) => setAssigneeId(Number(event.target.value))}
          type="number"
          value={assigneeId}
        />
      </label>
      <label className="block text-sm font-bold">
        Due date
        <input
          className="mt-1 w-full rounded border border-stone-300 bg-white p-2 text-stone-950 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-white"
          onChange={(event) => setDueDate(event.target.value)}
          type="date"
          value={dueDate}
        />
      </label>
      <button
        className="w-full rounded bg-stone-950 px-4 py-3 font-bold text-white"
        type="submit"
      >
        Create task
      </button>
    </form>
  );
}

function TaskDrawer({
  task,
  onClose,
}: {
  task: BoardTask;
  onClose: () => void;
}) {
  const updateTask = useBoardStore((state) => state.updateTask);
  const addComment = useBoardStore((state) => state.addComment);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState(task.title);
  return (
    <div
      aria-label="Task details"
      className="fixed inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Task details</h2>
        <button aria-label="Close task details" onClick={onClose} type="button">
          X
        </button>
      </div>
      <label className="mt-8 block text-sm font-bold">
        Title
        <input
          className="mt-2 w-full rounded border border-stone-300 bg-white p-3 text-stone-950 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-400"
          onBlur={() => updateTask(task.id, { title })}
          onChange={(event) => setTitle(event.target.value)}
          value={title}
        />
      </label>
      <p className="mt-5 text-sm text-stone-500">
        Priority: <strong>{task.priority}</strong> · Assignee:{" "}
        <strong>{task.assigneeId}</strong> · Due:{" "}
        <strong>{task.dueDate}</strong>
      </p>
      <h3 className="mt-8 font-black">Comments</h3>
      <div className="mt-3 space-y-2">
        {task.comments.map((item, index) => (
          <p
            className="rounded bg-stone-100 p-3 text-sm dark:bg-stone-800"
            key={`${item}-${index}`}
          >
            {item}
          </p>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          addComment(task.id, comment);
          setComment("");
        }}
      >
        <input
          aria-label="New comment"
          className="min-w-0 flex-1 rounded border border-stone-300 bg-white p-2 text-stone-950 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-400"
          onChange={(event) => setComment(event.target.value)}
          placeholder="Add a comment"
          value={comment}
        />
        <button
          className="rounded bg-amber-400 px-3 font-bold text-stone-950"
          type="submit"
        >
          Add
        </button>
      </form>
      <button
        className="mt-10 w-full rounded border border-rose-300 px-4 py-3 font-bold text-rose-700"
        onClick={() => {
          if (window.confirm("Delete this task?")) {
            deleteTask(task.id);
            onClose();
          }
        }}
        type="button"
      >
        Delete task
      </button>
    </div>
  );
}

export const BoardPage = () => {
  const { tasks, isLoading, error, loadTasks, moveTask } = useBoardStore();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);
  const visibleTasks = useMemo(
    () =>
      priorityFilter === "all"
        ? tasks
        : tasks.filter((task) => task.priority === priorityFilter),
    [priorityFilter, tasks],
  );
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const overId = event.over?.id;
    if (!overId) return;
    const targetTask = tasks.find((task) => task.id === Number(overId));
    const status =
      targetTask?.status ??
      (columnOrder.includes(String(overId) as ColumnId)
        ? (String(overId) as ColumnId)
        : null);
    if (!status) return;
    const destination = tasks.filter((task) => task.status === status);
    moveTask(
      Number(event.active.id),
      status,
      targetTask
        ? destination.findIndex((task) => task.id === targetTask.id)
        : destination.length,
    );
    setActiveId(null);
  }, [moveTask, tasks]);
  if (isLoading) return <p aria-label="Loading board">Loading board...</p>;
  if (error) return <p role="alert">{error}</p>;
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
            Sprint 24
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Sprint board
          </h1>
          <p className="mt-1 text-stone-500">
            {tasks.length} tasks across the team workspace
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Filter by priority"
            className="rounded border border-stone-300 bg-white px-3 py-2 text-sm font-bold dark:border-stone-700 dark:bg-stone-900"
            onChange={(event) => setPriorityFilter(event.target.value)}
            value={priorityFilter}
          >
            <option value="all">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
          <button
            className="rounded bg-stone-950 px-4 py-2 font-bold text-white dark:bg-amber-400 dark:text-stone-950"
            onClick={() => setShowNewTask(true)}
            type="button"
          >
            + New task
          </button>
        </div>
      </header>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => setActiveId(Number(event.active.id))}
        sensors={sensors}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Column
              column={column}
              key={column.id}
              onOpen={(task) => setSelectedTaskId(task.id)}
              tasks={visibleTasks.filter((task) => task.status === column.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="rounded-md bg-white p-4 font-bold shadow-xl dark:bg-stone-800">
              {tasks.find((task) => task.id === activeId)?.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {selectedTask && (
        <TaskDrawer
          onClose={() => setSelectedTaskId(null)}
          task={selectedTask}
        />
      )}
      {showNewTask && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-stone-950/40 p-4">
          <section
            aria-label="Create task"
            className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-stone-900"
          >
            <div className="mb-5 flex justify-between">
              <h2 className="text-xl font-black">New task</h2>
              <button
                aria-label="Close create task"
                onClick={() => setShowNewTask(false)}
                type="button"
              >
                X
              </button>
            </div>
            <NewTaskForm onClose={() => setShowNewTask(false)} />
          </section>
        </div>
      )}
    </div>
  );
};
