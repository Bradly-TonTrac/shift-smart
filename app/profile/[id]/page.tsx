import {
  getEmployee,
  getWeeklyHours,
  getEmployees,
} from "@/lib/actions/employeesActions";
import EmployeeForm from "@/app/_components/EmployeeForm";
import ProfileTabs from "@/app/_components/ProfileTabs";
import { getSessionAction } from "@/lib/actions/sessionActions";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const employed = await getEmployee(id);
  const { role, employeeId: sessionId } = await getSessionAction();
  const shifts = await getWeeklyHours(id);
  const allEmployees = role === "admin" ? await getEmployees() : [];

  const totalMinutes = shifts.reduce(
    (acc: number, ts: { totalMinutes: number }) =>
      acc + (Number(ts.totalMinutes) || 0),
    0,
  );

  const isOwnProfile = role === "employee" && sessionId === id;

  return (
    <div className="px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="mt-20 flex justify-between gap-3 w-full max-w-2xl">
          <div className="shrink-0">
            <EmployeeForm employee={employed} role={role} />
          </div>
          <div className="flex-1 min-w-0">
            <ProfileTabs
              employeeId={id}
              role={role}
              sessionId={sessionId}
              employees={allEmployees.map((e) => ({ id: e.id!, name: e.name }))}
              shifts={shifts}
              totalMinutes={totalMinutes}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
