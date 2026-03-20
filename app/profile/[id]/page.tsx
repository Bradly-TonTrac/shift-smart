import EmployeeProfilePage from "@/app/_components/EmployeeProfilePage";
import { getEmployee } from "@/lib/actions/employeesActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = await getEmployee(id);
  return {
    title: `${employee.name} — ShiftSmart`,
  };
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div className="mt-15">
      <EmployeeProfilePage params={params} />;
    </div>
  );
};

export default page;
