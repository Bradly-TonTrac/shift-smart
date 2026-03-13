"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllShifts, deleteShift } from "@/lib/actions/employeesActions";
import { Task, TimeStamp, ShiftWithTasks } from "@/types";
import { getTasksByDate } from "@/lib/actions/taskAction";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";
import { ShiftHistoryClientProps } from "@/types";

// *************** Helpers ***************
const fmt = {
  date: (s: string) => {
    if (!s) return "";
    const d = new Date(s);
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("en-ZA", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  },
  time: (s: string) => {
    if (!s) return "—";
    const d = new Date(s);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  },
  mins: (m: number | string) => {
    const n = Number(m) || 0;
    return n === 0 ? "—" : `${Math.floor(n / 60)}h ${n % 60}m`;
  },
};

// Generates and downloads a CSV file of all shift records for the employee.
const exportCSV = (
  shifts: ShiftWithTasks[],
  name: string,
  reviewed: Set<string>,
) => {
  const header = [
    "Date",
    "Clock In",
    "Clock Out",
    "Duration",
    "Tasks Total",
    "Tasks Done",
    "Reviewed",
  ];
  const rows = shifts.map((s) => [
    fmt.date(s.clockIn),
    fmt.time(s.clockIn),
    s.clockOut ? fmt.time(s.clockOut) : "Active",
    fmt.mins(s.totalMinutes),
    s.tasks.length,
    s.tasks.filter((t) => t.status === "completed").length,
    reviewed.has(s.id) ? "Yes" : "No",
  ]);
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `${name.replace(" ", "_")}_shifts.csv`;
  a.click();
};

//   ********* Component  *********
export default function ShiftHistoryClient({
  employeeId,
  employeeName,
}: ShiftHistoryClientProps) {
  const [mounted, setMounted] = useState(false);
  const [shifts, setShifts] = useState<ShiftWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const { setToast, ToastElement } = useToast();

  // mount guard — prevents hydration mismatch.
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(`reviewed_${employeeId}`);
    if (stored) setReviewed(new Set(JSON.parse(stored)));
  }, [employeeId]);

  const load = useCallback(async () => {
    // Fetches all completed shifts and enriches each with its tasks for that date.
    setLoading(true);
    try {
      const raw: TimeStamp[] = await getAllShifts(employeeId);
      const enriched = await Promise.all(
        raw.map(async (s) => ({
          ...s,
          tasks: await getTasksByDate(employeeId, s.clockIn.split("T")[0]),
        })),
      );
      setShifts(
        enriched.sort(
          (a, b) =>
            new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime(),
        ),
      );
    } catch {
      setToast({ message: "Failed to load shifts", type: "error" });
    }
    setLoading(false);
  }, [employeeId]);

  useEffect(() => {
    load();
  }, [load]);

  // Deletes a single shift record and removes it from local state.
  const handleDelete = async (id: string) => {
    const res = await deleteShift(id);
    setToast({ message: res.message, type: res.success ? "success" : "error" });
    if (res.success) {
      setShifts((p) => p.filter((s) => s.id !== id));
      if (expanded === id) setExpanded(null);
    }
  };

  // Deletes all shift records for this employee one by one.
  const handleClearAll = async () => {
    setClearing(true);
    let ok = true;
    for (const s of shifts) {
      const res = await deleteShift(s.id);
      if (!res.success) ok = false;
    }
    setToast({
      message: ok
        ? "All shift records cleared"
        : "Some records failed to delete",
      type: ok ? "success" : "error",
    });
    if (ok) {
      setShifts([]);
      setReviewed(new Set());
      localStorage.removeItem(`reviewed_${employeeId}`);
    }
    setConfirmClear(false);
    setClearing(false);
  };

  // Toggles the reviewed state for a shift and persists it to localStorage.
  const toggleReviewed = (id: string) => {
    setReviewed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(`reviewed_${employeeId}`, JSON.stringify([...next]));
      return next;
    });
  };

  // Calculate summary stats for the stats cards at the top.
  const totalMins = shifts.reduce(
    (a, s) => a + (Number(s.totalMinutes) || 0),
    0,
  );
  const doneTasks = shifts.reduce(
    (a, s) => a + s.tasks.filter((t) => t.status === "completed").length,
    0,
  );
  const allTasks = shifts.reduce((a, s) => a + s.tasks.length, 0);

  if (!mounted || loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg bg-cyan-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Shifts", value: String(shifts.length) },
          { label: "Total Hours", value: fmt.mins(totalMins) },
          { label: "Tasks Done", value: `${doneTasks}/${allTasks}` },
          { label: "Reviewed", value: `${reviewed.size}/${shifts.length}` },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-100 rounded-2xl px-4 py-4 shadow-sm"
          >
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              {s.label}
            </p>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">
          {shifts.length} shift{shifts.length !== 1 ? "s" : ""} recorded
        </p>
        {shifts.length > 0 && (
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => exportCSV(shifts, employeeName, reviewed)}
              className="border border-gray-200 text-gray-600 text-xs hover:bg-gray-50"
            >
              Export CSV
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setConfirmClear(true)}
              disabled={clearing}
              className="border border-red-200 text-red-500 text-xs hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Clear confirm */}
      {confirmClear && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4">
          <p className="text-sm font-bold text-red-600 mb-1">
            Clear all shift history?
          </p>
          <p className="text-xs text-red-400 mb-4">
            Permanently deletes all {shifts.length} records for {employeeName}.
            Cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleClearAll}
              disabled={clearing}
              className="rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 disabled:opacity-40"
            >
              {clearing ? "Clearing…" : "Yes, delete all"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setConfirmClear(false)}
              className="rounded-lg border border-gray-200 text-gray-500 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Shift list */}
      {shifts.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center shadow-sm">
          <p className="text-sm font-semibold text-gray-400">
            No shift history
          </p>
          <p className="text-xs text-gray-300 mt-1">
            No completed shifts recorded
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          {shifts.map((shift, idx) => {
            const isOpen = expanded === shift.id;
            const isReviewed = reviewed.has(shift.id);
            const done = shift.tasks.filter(
              (t) => t.status === "completed",
            ).length;
            const total = shift.tasks.length;

            return (
              <div
                key={shift.id}
                className={
                  idx < shifts.length - 1 ? "border-b border-gray-50" : ""
                }
              >
                {/* Row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : shift.id)}
                  className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors
                    ${isReviewed ? "bg-emerald-50/40 hover:bg-emerald-50/70" : "hover:bg-gray-50"}`}
                >
                  <div
                    className={`w-1 h-8 rounded-full shrink-0 ${isReviewed ? "bg-emerald-400" : "bg-gray-200"}`}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {fmt.date(shift.clockIn)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                      {fmt.time(shift.clockIn)} —{" "}
                      {shift.clockOut ? fmt.time(shift.clockOut) : "Active"}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-gray-700 shrink-0">
                    {fmt.mins(shift.totalMinutes)}
                  </span>

                  {total > 0 && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0
                      ${done === total ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}
                    >
                      {done}/{total} tasks
                    </span>
                  )}

                  {isReviewed && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                      Reviewed
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(shift.id);
                    }}
                    className="text-gray-200 hover:text-red-400 transition-colors text-sm shrink-0"
                  >
                    ✕
                  </button>

                  <span className="text-gray-300 text-xs shrink-0">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/30">
                    {/* Summary */}
                    <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100 mb-4">
                      {[
                        { label: "Clock In", value: fmt.time(shift.clockIn) },
                        {
                          label: "Clock Out",
                          value: shift.clockOut
                            ? fmt.time(shift.clockOut)
                            : "Active",
                        },
                        {
                          label: "Duration",
                          value: fmt.mins(shift.totalMinutes),
                        },
                        { label: "Tasks", value: `${done}/${total} done` },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-sm font-semibold text-gray-700 font-mono">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tasks */}
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                      Tasks this shift
                    </p>
                    {shift.tasks.length === 0 ? (
                      <p className="text-xs text-gray-300 mb-4">
                        No tasks recorded for this shift
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2 mb-4">
                        {shift.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white border border-gray-100"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0
                              ${
                                task.status === "completed"
                                  ? "bg-emerald-400"
                                  : task.status === "inprogress"
                                    ? "bg-blue-400"
                                    : "bg-gray-300"
                              }`}
                            />
                            <p
                              className={`flex-1 text-xs ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-700"}`}
                            >
                              {task.title}
                            </p>
                            {task.notes && (
                              <span
                                className="text-xs text-gray-400 truncate max-w-xs"
                                title={task.notes}
                              >
                                {task.notes}
                              </span>
                            )}
                            <span
                              className={`text-xs font-semibold px-1.5 py-0.5 rounded-full shrink-0
                              ${
                                task.priority === "high"
                                  ? "bg-red-50 text-red-400"
                                  : task.priority === "medium"
                                    ? "bg-amber-50 text-amber-500"
                                    : "bg-emerald-50 text-emerald-500"
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span
                              className={`text-xs font-semibold px-1.5 py-0.5 rounded-full shrink-0
                              ${
                                task.status === "completed"
                                  ? "bg-emerald-50 text-emerald-500"
                                  : task.status === "inprogress"
                                    ? "bg-blue-50 text-blue-500"
                                    : "bg-gray-50 text-gray-400"
                              }`}
                            >
                              {task.status === "inprogress"
                                ? "In Progress"
                                : task.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mark reviewed */}
                    <button
                      type="button"
                      onClick={() => toggleReviewed(shift.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                        ${
                          isReviewed
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-white"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      {isReviewed
                        ? "✓ Reviewed — click to undo"
                        : "Mark as reviewed"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {ToastElement}
    </div>
  );
}
