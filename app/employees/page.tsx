import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { getEmployees } from "@/lib/actions/employeesActions";
import { getColors } from "@/lib/utils/departments";
import { Button } from "@/components/ui/button";

const employeesPage = async ({
  searchParams,
}: {
  searchParams: { query?: string };
}) => {
  const employees = await getEmployees();

  return (
    <div>
      <div className="flex justify-center flex-col p-3 pl-10 pr-10 mt-15 m-3 text-gray-600">
        <Button
          size="sm"
          variant="outline"
          className="w-fit text-gray-500 text-sm flex  items-center mt-4 hover:text-gray-600 hover:cursor-pointer"
        >
          <IoIosArrowRoundBack />
          <Link href={"/dashboard"} className="">
            Dashboard
          </Link>
        </Button>

        {employees.length === 0 ? (
          <p>No Employees available at the moment</p>
        ) : (
          <div className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Employee
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Department
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    ID
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map((emp) => {
                  const colors = getColors(emp.department);
                  const initials = emp.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl ${colors.avatar} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                          >
                            {initials}
                          </div>
                          <div>
                            <Link
                              href={`/employees/${emp.id}`}
                              className="text-xs font-semibold text-cyan-500  transition-colors "
                            >
                              <p className="font-semibold text-gray-900 hover:text-blue-600">
                                {emp.name}
                              </p>
                            </Link>

                            <p className="text-xs text-gray-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
                        >
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {emp.role}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-400">
                        {emp.identity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default employeesPage;
