import Link from "next/link";
import { IoPersonCircleSharp } from "react-icons/io5";
import { getSessionAction } from "@/lib/actions/sessionActions";
import { getEmployee } from "@/lib/actions/employeesActions";
import LogoutBtn from "./LogoutBtn";
import { Button } from "@/components/ui/button";

const Navbar = async () => {
  const { role, employeeId } = await getSessionAction();

  // Fetch employee name to display in the navbar if logged in as employee
  let employeeName = "";
  if (role === "employee" && employeeId) {
    const employee = await getEmployee(employeeId);
    employeeName = employee.name;
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow">
      <div className="max-w-7xl mx-auto px-10 py-4 flex justify-between items-center ">
        <Link href="/">
          <h3 className="font-extrabold text-gray-900">
            sHifT-sM<span className="text-cyan-400">a</span>
            Rt
          </h3>
        </Link>

        <div className="flex items-center gap-3">
          {/* Show Add Employee button for admin, name display for employee */}
          {role === "admin" && (
            <Link href="/employees/new">
              <Button
                size="sm"
                variant="outline"
                className="text-white text-xs font-semibold px-3 py-1.5 hover:cursor-pointer rounded-md bg-cyan-400 hover:bg-cyan-500 transition-colors"
              >
                Add Employee +
              </Button>
            </Link>
          )}
          {role === "employee" && (
            <span className="text-sm text-gray-600 font-medium flex items-center">
              <IoPersonCircleSharp className="text-2xl" />

              {employeeName}
            </span>
          )}
          {role && <LogoutBtn />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
