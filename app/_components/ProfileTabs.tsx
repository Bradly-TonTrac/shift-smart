"use client";
import { useState, useEffect } from "react";
import TasksTab from "./TaskTab";
import ShiftBtn from "./ShiftBtn";
import { ProfileTabsProps } from "@/types";

// Date and time formatters for shift display — locale set to en-ZA
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
        });
  },
  time: (s: string) => {
    if (!s) return "Active";
    const d = new Date(s);
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  },
};

const ProfileTabs = ({
  employeeId,
  role,
  sessionId,
  employees,
  shifts,
  totalMinutes,
  isOwnProfile,
}: ProfileTabsProps) => {
  const isAdmin = role === "admin";
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"shifts" | "tasks">("shifts");

  // Mount guard — prevents hydration mismatch when rendering date/time values
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-80 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Start/End shift — only employee on their own profile */}
      {isOwnProfile && (
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            Current Shift
          </p>
          <ShiftBtn employeeId={employeeId} />
        </div>
      )}

      {/* Tab bar */}
      <div className="flex border-b border-gray-100">
        {(["shifts", "tasks"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-colors
              ${
                activeTab === tab
                  ? "text-gray-900 border-b-2 border-gray-900 -mb-px"
                  : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab === "shifts" ? "This Week" : "Tasks"}
          </button>
        ))}
      </div>

      {/* This Week panel */}
      {activeTab === "shifts" && (
        <div>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              This week
            </p>
            <span className="text-xs font-bold text-gray-900">
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m total
            </span>
          </div>

          {/* Render each shift row with date, time range and duration */}
          <div className="px-6 py-4 flex flex-col gap-3">
            {shifts.length === 0 ? (
              <p className="text-xs text-gray-400">
                No shifts recorded this week
              </p>
            ) : mounted ? (
              shifts.map((ts) => (
                <div key={ts.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-700">
                      {fmt.date(ts.clockIn)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {fmt.time(ts.clockIn)} —{" "}
                      {ts.clockOut ? fmt.time(ts.clockOut) : "Active"}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {ts.totalMinutes
                      ? `${Math.floor(ts.totalMinutes / 60)}h ${ts.totalMinutes % 60}m`
                      : "—"}
                  </span>
                </div>
              ))
            ) : (
              // Skeleton while waiting for mount — prevents hydration mismatch
              shifts.map((ts) => (
                <div key={ts.id} className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-10 bg-gray-100 rounded animate-pulse" />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tasks panel */}
      {activeTab === "tasks" && (
        <div className="p-4">
          <TasksTab
            employeeId={employeeId}
            role={role}
            sessionId={sessionId}
            employees={employees}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileTabs;
