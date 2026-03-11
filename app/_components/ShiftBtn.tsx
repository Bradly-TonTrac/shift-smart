"use client";

import { useState, useEffect } from "react";
import {
  clockIn,
  clockOut,
  getShiftStatus,
} from "@/lib/actions/employeesActions";
import { TimeStamp } from "@/types";
import Toasts from "./ui/Toasts";
import { Button } from "@/components/ui/button";

const ShiftBtn = ({ employeeId }: { employeeId: string }) => {
  const [shiftState, setShiftState] = useState<"off" | "on">("off");
  const [shiftRecord, setShiftRecord] = useState<{
    id: string;
    clockIn: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null,
  );

  useEffect(() => {
    const fetchShiftStatus = async () => {
      const data = await getShiftStatus(employeeId);
      const activeShift = data.find((ts: TimeStamp) => ts.status === "active");
      if (activeShift) {
        setShiftState("on");
        setShiftRecord({ id: activeShift.id, clockIn: activeShift.clockIn });
        setElapsed(
          Math.floor(
            (Date.now() - new Date(activeShift.clockIn).getTime()) / 1000,
          ),
        );
      } else {
        setShiftState("off");
        setShiftRecord(null);
      }
      setIsLoading(false);
    };
    fetchShiftStatus();
  }, [employeeId]);

  useEffect(() => {
    if (shiftState !== "on") return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [shiftState]);

  const handleShift = async () => {
    if (shiftState === "off") {
      // duplicate guard
      const latest = await getShiftStatus(employeeId);
      const alreadyActive = latest.find(
        (ts: TimeStamp) => ts.status === "active",
      );
      if (alreadyActive) {
        setShiftRecord({
          id: alreadyActive.id,
          clockIn: alreadyActive.clockIn,
        });
        setShiftState("on");
        return;
      }

      //clockIn trigger condition with Toasts attachment
      const recordIn = await clockIn(employeeId);
      setToast({
        message: recordIn.message,
        type: recordIn.success ? "success" : "error",
      });

      setShiftRecord({ id: recordIn.data.id, clockIn: recordIn.data.clockIn });
      setElapsed(0);
      setShiftState("on");
    } else if (shiftState === "on" && shiftRecord) {
      const recordOut = await clockOut(shiftRecord.id, shiftRecord.clockIn);
      setToast({
        message: recordOut.message,
        type: recordOut.success ? "success" : "error",
      });
      setShiftState("off");
      setElapsed(0);
    }
  };

  const isOn = shiftState === "on";

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex flex-col gap-2">
      {isOn && !isLoading && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-400">On shift</span>
          <span className="text-xs font-mono font-semibold text-emerald-600">
            {formatTime(elapsed)}
          </span>
        </div>
      )}
      <Button
        onClick={handleShift}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className={`w-full hover:cursor-pointer py-2 rounded-md text-xs font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed
          ${
            isOn
              ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
          }`}
      >
        {isLoading ? "Loading..." : isOn ? "End Shift" : "Start Shift"}
      </Button>

      {toast && (
        <Toasts
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ShiftBtn;
