import Link from "next/link";
import { getEmployees } from "@/lib/actions/employeesActions";
import { shiftStatus } from "@/lib/actions/employeesActions";
import { Button } from "@/components/ui/button";

const page = async () => {
  //fetching all the employees using server actions
  const employeesExtractions = await getEmployees();
  const statuses = await shiftStatus();
  const status = statuses.length;

  const totalEmployees = employeesExtractions.length;
  const offShift = totalEmployees - status;

  return (
    <div>
      <div className="flex flex-col items-center border-t border-gray-100 pt-8 gap-6">
        <div className="grid mt-20 grid-cols-3 gap-4">
          {/* Total Employees */}
          <div className="flex flex-col gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6 items-center hover:shadow-md transition-all duration-200">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Total Employees
            </span>
            <span className="text-4xl font-bold text-gray-900">
              {totalEmployees}
            </span>
            <span className="text-xs text-gray-400">Active roster</span>
          </div>

          {/* On Shift */}
          <div className="flex flex-col gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6 items-center hover:shadow-md transition-all duration-200">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              On Shift
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
              <span className="text-4xl font-bold text-green-500">
                {status}
              </span>
            </div>
            <span className="text-xs text-green-400">
              ↗︎ Currently clocked in
            </span>
          </div>

          {/* Off 
          
           */}
          <div className="flex flex-col gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6 items-center hover:shadow-md transition-all duration-200">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Off Shift
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="text-4xl font-bold text-gray-500">
                {offShift}
              </span>
            </div>
            <span className="text-xs text-red-400">Not on shift↘︎</span>
          </div>
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

export default page;
