import EmployeeProfilePage from "@/app/_components/EmployeeProfilePage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div className="mt-15">
      <EmployeeProfilePage params={params} />;
    </div>
  );
};

export default page;
