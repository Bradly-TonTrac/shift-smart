import EmployeeCard from "@/app/_components/EmployeeCard";
import { getEmployee } from "@/lib/actions/employeesActions";
import { getWeeklyHours } from "@/lib/actions/employeesActions";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const employee = await getEmployee(id);
  const weeklyHours = await getWeeklyHours(id);

  return (
    <div className="flex flex-col items-center gap-6  px-4">
      <EmployeeCard employee={employee} />
      <div className="w-68 bg-white rounded-lg border border-gray-200 border-l-4 border-l-gray-300">
        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
            This week
          </p>
          <div className="flex flex-col gap-2">
            {weeklyHours.length === 0 ? (
              <p className="text-xs text-gray-400">
                No shifts recorded this week
              </p>
            ) : (
              weeklyHours.map(
                (ts: { id: string; clockIn: string; totalMinutes: number }) => (
                  <div
                    key={ts.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-500">
                      {new Date(ts.clockIn).toLocaleDateString("en-ZA", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {ts.totalMinutes
                        ? `${Math.floor(ts.totalMinutes / 60)}h ${ts.totalMinutes % 60}m`
                        : "Active"}
                    </span>
                  </div>
                ),
              )
            )}
          </div>
          {weeklyHours.length > 0 && <div className="h-px bg-gray-100 my-3" />}
          {weeklyHours.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Total</span>
              <span className="text-xs font-bold text-gray-900">
                {Math.floor(
                  weeklyHours.reduce(
                    (acc: number, ts: { totalMinutes: number }) =>
                      acc + (Number(ts.totalMinutes) || 0),
                    0,
                  ) / 60,
                )}
                h{" "}
                {weeklyHours.reduce(
                  (acc: number, ts: { totalMinutes: number }) =>
                    acc + (Number(ts.totalMinutes) || 0),
                  0,
                ) % 60}
                m
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
