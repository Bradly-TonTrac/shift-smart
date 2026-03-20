import Link from "next/link";
import { getEmployees } from "@/lib/actions/employeesActions";
import { shiftStatus } from "@/lib/actions/employeesActions";
import { Button } from "@/components/ui/button";
import StatCard from "../_components/ui/StatCard";

const DashboardPage = async () => {
  //fetching all the employees using server actions.
  const employeesExtractions = await getEmployees();
  const statuses = await shiftStatus();
  const status = statuses.length;

  const totalEmployees = employeesExtractions.length;

  // Calculate on shift and off shift counts from active timestamps.
  const offShift = totalEmployees - status;

  return (
    <div>
      <div className="flex flex-col items-center border-t border-gray-100 pt-8 gap-6">
        <div className="grid mt-20 grid-cols-3 gap-4">
          {/* Total Employees */}
          <StatCard
            label="Total Employees"
            value={totalEmployees}
            valueColor="text-gray-900"
            subtextColor="text-gray-400"
            subtext="Active roster"
          />

          {/* On Shift */}
          <StatCard
            label={"On Shift"}
            dot="bg-green-400 animate-ping"
            value={status}
            valueColor="text-green-500"
            subtextColor="text-green-400"
            subtext="↗︎ Currently clocked in"
          />

          {/* Off Shift */}

          <StatCard
            label="Off Shift"
            dot="bg-gray-300"
            value={offShift}
            valueColor="text-gray-500"
            subtextColor="text-red-400"
            subtext="Not on shift↘︎"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold tracking-wide hover:bg-gray-700 active:scale-95 transition-all duration-150"
        >
          <Link href={"/employees"}>Manage Employees</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
