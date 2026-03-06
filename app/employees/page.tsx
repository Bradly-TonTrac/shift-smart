import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import EmployeeCard from "../_components/EmployeeCard";
import { getEmployees } from "@/lib/actions/employeesActions";

const employeesPage = async ({
  searchParams,
}: {
  searchParams: { query?: string };
}) => {
  const employees = await getEmployees();
  return (
    <div>
      <div className="flex justify-center flex-col p-3 pl-10 pr-10  m-3  text-gray-600">
        {/*Navigation back to the home Page from the table*/}
        <Link href={"/"}>
          <button className="flex items-center text-cyan-500  text-sm border-b hover:text-cyan-600 hover:cursor-pointer">
            <IoIosArrowRoundBack />
            Dashboard
          </button>
        </Link>
        {employees.length === 0 ? (
          <>No Employees available at the moment</>
        ) : (
          <>
            <div className="flex justify-center flex-wrap gap-4 mt-20">
              {employees.map((emp) => (
                <EmployeeCard key={emp.id} employee={emp} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default employeesPage;
