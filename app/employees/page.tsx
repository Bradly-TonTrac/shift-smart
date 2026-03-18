import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { getEmployees, shiftStatus } from "@/lib/actions/employeesActions";
import { getColors } from "@/lib/utils/departments";
import { Button } from "@/components/ui/button";
import TablePagination from "../_components/TablePagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import SearchBar from "../_components/SearchBar";
import { PiEmptyThin } from "react-icons/pi";
import { PER_PAGE } from "@/lib/constants";
import Avatar from "../_components/ui/Avatar";

const employeesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) => {
  const employees = await getEmployees();

  const { query, page } = await searchParams;

  // Filter employees by name if a search query is present.
  const filtered = query
    ? employees.filter((emp) =>
        emp.name.toLowerCase().includes(query.toLowerCase()),
      )
    : employees;

  const statuses = await shiftStatus();

  // Calculate pagination slice based on current page.
  const currentPage = Number(page) || 1;
  const perPage = PER_PAGE;
  const totalPage = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <div>
      <div className="flex justify-center flex-col p-3 pl-10 pr-10 mt-15 m-3 text-gray-600">
        <Button
          size="sm"
          variant="outline"
          className="w-fit text-gray-500 text-sm flex items-center mt-4 hover:text-gray-600 hover:cursor-pointer"
        >
          <IoIosArrowRoundBack />
          <Link href={"/dashboard"}>Dashboard</Link>
        </Button>
        <div className="flex justify-center ">
          <SearchBar />
        </div>

        {filtered.length === 0 ? (
          <div className="flex justify-center gap-3 border mt-2 p-2 rounded">
            <div className=" font-bold  flex items-center">
              <p>No employees found matching your search</p>
              <PiEmptyThin className="text-red-500" />
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="border-b border-gray-100 bg-gray-50">
                  <TableHead className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Employee
                  </TableHead>
                  <TableHead className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Department
                  </TableHead>
                  <TableHead className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Role
                  </TableHead>
                  <TableHead className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    ID
                  </TableHead>
                  <TableHead className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-50">
                {/* Render each employee row with initials, shift status and department color */}
                {paginated.map((emp) => {
                  const colors = getColors(emp.department);
                  const isOnShift = statuses.some(
                    (s: { employeeId: string }) => s.employeeId === emp.id,
                  );

                  return (
                    <TableRow
                      key={emp.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={emp.name}
                            department={emp.department}
                            size="sm"
                          />
                          <div>
                            <Link
                              href={`/employees/${emp.id}`}
                              className="text-xs font-semibold text-cyan-500 transition-colors"
                            >
                              <p className="font-semibold text-gray-900 hover:text-blue-600">
                                {emp.name}
                              </p>
                            </Link>
                            <p className="text-xs text-gray-400">{emp.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
                        >
                          {emp.department}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-xs text-gray-500">
                        {emp.role}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-xs font-mono text-gray-400">
                        {emp.identity}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${isOnShift ? "bg-green-50 text-green-600 border border-green-200" : "bg-gray-50 text-gray-400 border border-gray-200"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isOnShift ? "bg-green-500 animate-ping" : "bg-gray-300"}`}
                          />
                          {isOnShift ? "On Shift" : "Off Shift"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <TablePagination currentPage={currentPage} totalPage={totalPage} />
      </div>
    </div>
  );
};

export default employeesPage;
