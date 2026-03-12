import { getEmployee } from "@/lib/actions/employeesActions";
import { getSessionAction } from "@/lib/actions/sessionActions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import ShiftHistoryClient from "@/app/_components/ShiftHistoryClient";

const ShiftHistoryPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { role } = await getSessionAction();

  // Protect this page — only admins can view shift history.
  if (role !== "admin") redirect("/");

  const employee = await getEmployee(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <Button
          size="sm"
          variant="outline"
          className="w-fit text-gray-500 text-sm flex items-center mb-6 hover:text-gray-700 hover:cursor-pointer"
        >
          <IoIosArrowRoundBack />
          <Link href={`/employees/${id}`}>Back to Profile</Link>
        </Button>

        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Admin — Shift Records
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {employee.role} &middot; {employee.department}
          </p>
        </div>

        {/* Renders the full shift history UI — see _components/ShiftHistoryClient.tsx */}
        <ShiftHistoryClient employeeId={id} employeeName={employee.name} />
      </div>
    </div>
  );
};

export default ShiftHistoryPage;
