"use client";
import { useState, useEffect, useTransition } from "react";

import {
  getTasksByEmployee,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "@/lib/actions/taskAction";

import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { TasksTabProps } from "@/types";
import { useToast } from "@/lib/hooks/useToast";
import { PRIORITY_META, STATUS_META } from "@/lib/constants";
import EmptyState from "./ui/EmptyState";
import Badge from "./ui/Badge";

// Defines the cycle order when clicking the status button on a task.
const STATUS_CYCLE: Task["status"][] = ["pending", "inprogress", "completed"];

const today = () => new Date().toISOString().split("T")[0];

const TasksTab = ({
  employeeId,
  role,
  sessionId,
  employees = [],
}: TasksTabProps) => {
  const isAdmin = role === "admin";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { setToast, ToastElement } = useToast();
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | Task["priority"]
  >("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Task, "id" | "createdAt">>({
    title: "",
    notes: "",
    priority: "medium",
    status: "pending",
    assignedTo: employeeId,
    assignedBy: isAdmin ? "admin" : (sessionId ?? employeeId),
    shiftDate: today(),
  });

  // Fetch tasks.
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let data: Task[] = [];

      if (isAdmin) {
        // Admin fetches all tasks and filters to this employee.
        const all = await getTasks();
        data = all.filter((t: Task) => t.assignedTo === employeeId);
      } else {
        // Employee only fetches their own.
        data = await getTasksByEmployee(employeeId);
      }

      setTasks(data);
      setLoading(false);
    };
    load();
  }, [employeeId, isAdmin]);

  // Filter tasks by active status and priority filters.
  const filtered = tasks.filter((t) => {
    const s = statusFilter === "all" || t.status === statusFilter;
    const p = priorityFilter === "all" || t.priority === priorityFilter;
    return s && p;
  });

  // Count tasks per status for the filter pill badges.
  const counts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    inprogress: tasks.filter((t) => t.status === "inprogress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  // Cycles task status in order: pending → inprogress → completed.
  const handleAdd = () => {
    if (!form.title.trim()) return;
    startTransition(async () => {
      const result = await addTask(form);
      setToast({
        message: result.message,
        type: result.success ? "success" : "error",
      });
      if (result.success) {
        setTasks((prev) => [...prev, result.data]);
        setShowForm(false);
        setForm((f) => ({ ...f, title: "", notes: "" }));
      }
    });
  };

  // Saves the edited note for a task.
  const handleCycleStatus = (task: Task) => {
    const next =
      STATUS_CYCLE[
        (STATUS_CYCLE.indexOf(task.status) + 1) % STATUS_CYCLE.length
      ];
    startTransition(async () => {
      const result = await updateTask(task.id!, { status: next });
      if (result.success)
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)),
        );
    });
  };

  // Saves the edited note for a task.
  const handleSaveNote = (task: Task) => {
    startTransition(async () => {
      const result = await updateTask(task.id!, { notes: noteValue });
      if (result.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, notes: noteValue } : t)),
        );
        setEditingNoteId(null);
      }
    });
  };

  // Updates the priority of a task.
  const handleChangePriority = (task: Task, priority: Task["priority"]) => {
    startTransition(async () => {
      const result = await updateTask(task.id!, { priority });
      if (result.success)
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, priority } : t)),
        );
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTask(id);

      setToast({
        message: result.message,
        type: result.success ? "success" : "error",
      });

      if (result.success) setTasks((prev) => prev.filter((t) => t.id !== id));
    });
  };

  return (
    <div className="w-full">
      {/* Status filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["pending", "inprogress", "completed"] as const).map((s) => (
          <div
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all
              ${
                statusFilter === s
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${STATUS_META[s].dot}`}
            />
            {STATUS_META[s].label}
            <span className="font-bold">{counts[s]}</span>
          </div>
        ))}

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as typeof priorityFilter)
          }
          className="ml-auto border border-gray-100 rounded-full px-3 py-1 text-xs text-gray-500 bg-white focus:outline-none cursor-pointer"
        >
          <option value="all">All priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      {/* Add task button */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-3 py-2 border border-dashed border-gray-200 rounded-xl text-xs font-semibold text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors bg-white"
        >
          + Add task for this shift
        </button>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
            New Task
          </p>

          <div className="flex flex-col gap-1 mb-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Restock aisle 4…"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="border-b border-gray-200 py-1.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as Task["priority"],
                  }))
                }
                className="border-b border-gray-200 py-1.5 text-sm text-gray-700 bg-transparent focus:outline-none"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Shift Date
              </label>
              <input
                type="date"
                value={form.shiftDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shiftDate: e.target.value }))
                }
                className="border-b border-gray-200 py-1.5 text-sm text-gray-700 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Admin only — assign to dropdown */}
          {isAdmin && employees.length > 0 && (
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Assign To
              </label>
              <select
                value={form.assignedTo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assignedTo: e.target.value }))
                }
                className="border-b border-gray-200 py-1.5 text-sm text-gray-700 bg-transparent focus:outline-none"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1 mb-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Notes (optional)
            </label>
            <textarea
              placeholder="Any details…"
              value={form.notes}
              rows={2}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="border-b border-gray-200 py-1.5 text-sm text-gray-700 placeholder-gray-300 bg-transparent focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={isPending || !form.title.trim()}
              className="rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 disabled:opacity-40"
            >
              {isPending ? "Saving…" : "Save Task"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-md bg-cyan-400" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No tasks found"
            subtitle="Add a task or adjust your filters"
          />
        ) : (
          filtered.map((task, idx) => {
            const pri = PRIORITY_META[task.priority];
            const sta = STATUS_META[task.status];
            const isExpanded = expandedId === task.id;
            const isEditNote = editingNoteId === task.id;

            return (
              <div
                key={task.id}
                className={
                  idx < filtered.length - 1 ? "border-b border-gray-50" : ""
                }
              >
                {/* Task row */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : (task.id ?? null))
                  }
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${pri.dot}`}
                  />

                  <p
                    className={`flex-1 text-sm font-medium text-gray-800 truncate
                      ${task.status === "completed" ? "line-through text-gray-400" : ""}`}
                  >
                    {task.title}
                  </p>

                  <Badge type="priority" value={task.priority} />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCycleStatus(task);
                    }}
                    disabled={isPending}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 hover:opacity-80 transition-colors ${sta.ring}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${sta.dot}`} />
                      {sta.label}
                    </span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id!);
                      }}
                      className="text-gray-200 hover:text-red-400 transition-colors text-sm shrink-0"
                    >
                      ✕
                    </button>
                  )}

                  <span className="text-gray-300 text-xs">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded panel */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50 bg-gray-50/50">
                    <div className="flex items-center gap-4 pt-3 pb-2 text-xs text-gray-400">
                      <span>
                        📅{" "}
                        {new Date(task.shiftDate).toLocaleDateString("en-ZA", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span>
                        Added by{" "}
                        {task.assignedBy === "admin" ? "Manager" : "Employee"}
                      </span>
                    </div>

                    {/* Priority switcher */}
                    <div className="flex gap-2 mb-3 items-center">
                      <span className="text-xs text-gray-400">Priority:</span>
                      {(["high", "medium", "low"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => handleChangePriority(task, p)}
                          disabled={isPending}
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all
                            ${
                              task.priority === p
                                ? PRIORITY_META[p].badge
                                : "border-gray-200 text-gray-400 hover:border-gray-300"
                            }`}
                        >
                          {PRIORITY_META[p].label}
                        </button>
                      ))}
                    </div>

                    {/* Notes */}
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      Notes
                    </p>
                    {isEditNote ? (
                      <div>
                        <textarea
                          rows={3}
                          value={noteValue}
                          onChange={(e) => setNoteValue(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400 resize-none mb-2"
                          placeholder="Add a note…"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveNote(task)}
                            disabled={isPending}
                            className="rounded-lg bg-gray-900 text-white text-xs hover:bg-gray-700"
                          >
                            Save Note
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNoteId(null)}
                            className="rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <p
                          className={`flex-1 text-sm leading-relaxed ${
                            task.notes ? "text-gray-600" : "text-gray-300"
                          }`}
                        >
                          {task.notes || "No notes yet…"}
                        </p>
                        <button
                          onClick={() => {
                            setEditingNoteId(task.id!);
                            setNoteValue(task.notes);
                          }}
                          className="text-xs text-cyan-500 hover:text-cyan-700 font-semibold shrink-0"
                        >
                          {task.notes ? "Edit" : "+ Add note"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {ToastElement}
    </div>
  );
};

export default TasksTab;
