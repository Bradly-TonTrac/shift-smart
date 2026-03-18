"use client";
import { useRouter } from "next/navigation";
import { employeesValidation, EmployeeFormData } from "@/lib/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  addEmployee,
  deleteTimeStamp,
  getShiftStatus,
  updateEmployee,
  deleteEmployee,
} from "@/lib/actions/employeesActions";
import { EmployeeFormProp } from "@/types";
import { useState } from "react";
import { getColors } from "@/lib/utils/departments";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/useToast";
import Link from "next/link";
import ConfirmDialog from "./ConfirmDialog";
import { getTasksByEmployee } from "@/lib/actions/taskAction";
import { deleteTask } from "@/lib/actions/taskAction";
import { getAllShifts } from "@/lib/actions/employeesActions";
import { deleteShift } from "@/lib/actions/employeesActions";
import { getInitials } from "@/lib/utils/formatters";

const EmployeeForm = ({
  employee,
  role,
}: EmployeeFormProp & { role?: string }) => {
  const [isEditing, setIsEditing] = useState(!employee);
  const { setToast, ToastElement } = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"delete" | "edit" | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeesValidation),
    defaultValues: {
      name: employee?.name ?? "",
      email: employee?.email ?? "",
      department: employee?.department ?? "",
      role: employee?.role ?? "",
      identity: employee?.identity ?? "",
    },
  });

  const router = useRouter();

  // Ends any active shift first, then deletes the employee and goes back to the list.
  const handleDelete = async () => {
    if (!employee?.id) return;

    // Delete active shifts.
    const activeShifts = await getShiftStatus(employee.id);
    for (const shift of activeShifts) {
      await deleteTimeStamp(shift, shift.id);
    }

    // Delete tasks
    const tasks = await getTasksByEmployee(employee.id);
    for (const task of tasks) {
      await deleteTask(task.id!);
    }

    // Delete completed shifts
    const completedShifts = await getAllShifts(employee.id);
    for (const shift of completedShifts) {
      await deleteShift(shift.id);
    }

    // delete employee
    const result = await deleteEmployee(employee.id);
    setToast({
      message: result.message,
      type: result.success ? "success" : "error",
    });

    router.push("/employees");
  };

  // Fires the correct action based on what the admin confirmed — delete or edit.
  const handleConfirm = () => {
    if (pendingAction === "delete") handleDelete();
    if (pendingAction === "edit") handleSubmit(onSubmit)();
    setConfirmOpen(false);
    setPendingAction(null);
  };
  // Saves the form — updates the employee if editing, creates a new one if adding.
  const onSubmit = async (data: EmployeeFormData) => {
    if (employee) {
      const result = await updateEmployee(data, employee.id!);
      setToast({
        message: result.message,
        type: result.success ? "success" : "error",
      });
    } else {
      const result = await addEmployee(data);
      setToast({
        message: result.message,
        type: result.success ? "success" : "error",
      });
    }
    reset();
    router.push("/employees");
  };

  // Get the avatar color and initials based on the employee's department and name.
  const colors = getColors(employee?.department ?? "");
  const initials = getInitials(employee?.name ?? "");

  // FORM MODE — shows the form for adding a new employee or editing an existing one.
  if (employee && !isEditing) {
    return (
      <div className="flex justify-center">
        <div className="w-80 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className={`h-20 ${colors.bg}`} />
          <div className="px-6 -mt-10 mb-4">
            <div
              className={`w-16 h-16 rounded-2xl ${colors.avatar} flex items-center justify-center text-white text-xl font-bold shadow-sm border-4 border-white`}
            >
              {initials}
            </div>
          </div>
          <div className="px-6 pb-2">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {employee.name}
            </h2>
            <p className="text-sm text-gray-400">{employee.role}</p>
          </div>
          <div className="px-6 pb-5">
            <span
              className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
            >
              {employee.department}
            </span>
          </div>
          <div className="h-px bg-gray-100 mx-6" />
          <div className="px-6 py-4 flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Email
              </p>
              <p className="text-sm text-gray-700 mt-0.5">{employee.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Employee ID
              </p>
              <p className="text-sm text-gray-700 mt-0.5">
                {employee.identity}
              </p>
            </div>
          </div>
          <div className="h-px bg-gray-100 mx-6" />
          <div className="px-6 py-4 flex flex-col gap-2">
            {role === "admin" && (
              <>
                <Link
                  href={`/employees/${employee.id}/shifts`}
                  className="w-full"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    className="w-full py-2  hover:cursor-pointer  rounded-lg bg-cyan-400 text-white text-xs font-semibold tracking-wide hover:bg-cyan-500 transition-colors"
                  >
                    View Shift History
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full   hover:cursor-pointer py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold tracking-wide hover:bg-gray-700 transition-colors"
                >
                  Edit Profile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setPendingAction("delete");
                    setConfirmOpen(true);
                  }}
                  className="w-full py-2 rounded-lg border   hover:cursor-pointer border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"
                >
                  Delete Employee
                </Button>
              </>
            )}
          </div>
        </div>
        <ConfirmDialog
          isOpen={confirmOpen}
          message={`Are you sure you want to delete ${employee?.name}? This cannot be undone.`}
          onConfirm={handleConfirm}
          onCancel={() => {
            setConfirmOpen(false);
            setPendingAction(null);
          }}
        />
        {ToastElement}
      </div>
    );
  }

  //----------FORM MODE ------------------
  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-80 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            {employee ? "Editing profile" : "New employee"}
          </p>
          <h2 className="text-base font-bold text-gray-900 mt-0.5">
            {employee ? employee.name : "Add to roster"}
          </h2>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="Bradly TonTrac"
              className="border-b border-gray-200 py-1.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent transition-colors"
            />
            <p className="text-red-400 text-xs h-3">{errors.name?.message}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="bradly@TT.org"
              className="border-b border-gray-200 py-1.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent transition-colors"
            />
            <p className="text-red-400 text-xs h-3">{errors.email?.message}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Department
            </label>
            <input
              {...register("department")}
              placeholder="HR-Management"
              className="border-b border-gray-200 py-1.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent transition-colors"
            />
            <p className="text-red-400 text-xs h-3">
              {errors.department?.message}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Role
            </label>
            <input
              {...register("role")}
              placeholder="Junior HR"
              className="border-b border-gray-200 py-1.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent transition-colors"
            />
            <p className="text-red-400 text-xs h-3">{errors.role?.message}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Employee ID
            </label>
            <input
              {...register("identity")}
              placeholder="Employee21034"
              className="border-b border-gray-200 py-1.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent transition-colors"
            />
            <p className="text-red-400 text-xs h-3">
              {errors.identity?.message}
            </p>
          </div>
        </div>
        <div className="px-6 pb-6 flex flex-col gap-2 border-t border-gray-100 pt-4">
          <Button
            type={employee ? "button" : "submit"}
            onClick={
              employee
                ? () => {
                    setPendingAction("edit");
                    setConfirmOpen(true);
                  }
                : undefined
            }
            className="w-full py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold tracking-wide hover:bg-gray-700 transition-colors"
          >
            {employee ? "Save Changes" : "Add Employee"}
          </Button>
          {employee && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="w-full py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors"
              type="button"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
      <ConfirmDialog
        isOpen={confirmOpen}
        message={`Are you sure you want to save changes to ${employee?.name}?`}
        onConfirm={handleConfirm}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingAction(null);
        }}
      />
      {ToastElement}
    </div>
  );
};

export default EmployeeForm;
