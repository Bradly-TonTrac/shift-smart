import {
  getEmployee,
  getWeeklyHours,
  getEmployees,
} from "@/lib/actions/employeesActions";
import EmployeeForm from "@/app/_components/EmployeeForm";
import ProfileTabs from "@/app/_components/ProfileTabs";
import { getSessionAction } from "@/lib/actions/sessionActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiArrowGoBackFill } from "react-icons/ri";
import { EmployeeProfilePageProps } from "@/types";

const EmployeeProfilePage = async ({
  params,
  backHref,
}: EmployeeProfilePageProps) => {
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
      <div className="flex flex-col mt-10 items-center gap-6">
        {backHref && (
          <div className="flex items-center">
            <Button className="w-fit mt-20 bg-gray-100 hover:translate-y-1 hover:bg-gray-200 shadow text-gray-500 text-sm flex items-center  hover:text-gray-600 hover:cursor-pointer">
              <Link href={backHref}>
                <RiArrowGoBackFill />
              </Link>
            </Button>
          </div>
        )}

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

export default EmployeeProfilePage;
