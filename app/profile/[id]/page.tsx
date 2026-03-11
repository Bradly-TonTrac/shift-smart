import EmployeeProfilePage from "@/app/_components/EmployeeProfilePage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  return <EmployeeProfilePage params={params} />;
};

export default page;
