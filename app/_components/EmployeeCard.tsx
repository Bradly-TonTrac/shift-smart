"use client";

import Link from "next/link";
import ShiftBtn from "./ShiftBtn";
import { Employee } from "@/types";
import { getColors } from "@/lib/utils/departments";

const EmployeeCard = ({ employee }: { employee: Employee }) => {
  const colors = getColors(employee.department);

  return (
    <div>
      <div
        className={`w-68 bg-white rounded-lg border border-gray-200 mt-20 ${colors.card}`}
      >
        <div className="p-4 ">
          {/* Avatar + Name */}
          <div className="flex  items-center gap-3 mb-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${colors.dot}`}
            >
              {(employee.name ?? "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <Link href={`/employees/${employee.id}`}>
                <p className="text-sm font-semibold text-gray-900 hover:underline truncate">
                  {employee.name}
                </p>
              </Link>
              <p className="text-xs text-gray-400 truncate">{employee.email}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-3" />

          {/* Role + Department */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`}
              />
              <span className="text-xs text-gray-500">{employee.role}</span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}
            >
              {employee.department}
            </span>
          </div>

          {/* Total Hours */}

          <ShiftBtn employeeId={employee.id!} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
