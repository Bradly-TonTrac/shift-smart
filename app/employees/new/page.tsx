import EmployeeForm from "@/app/_components/EmployeeForm";
import { getSessionAction } from "@/lib/actions/sessionActions";
import { redirect } from "next/navigation";

const New = async () => {
  const { role } = await getSessionAction();
  if (role !== "admin") redirect("/");

  return (
    <div className="border-t border-blue-400">
      {/*Re-usable RHF for adding the Employee */}
      <div className="mt-24">
        <EmployeeForm />
      </div>
    </div>
  );
};

export default New;