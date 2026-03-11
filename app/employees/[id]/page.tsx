import EmployeeProfilePage from "@/app/_components/EmployeeProfilePage";
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  return <EmployeeProfilePage params={params} backHref="/employees" />;
};

export default page;
