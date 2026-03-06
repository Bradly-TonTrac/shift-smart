import { getEmployee } from "@/lib/actions/employeesActions";
import EmployeeForm from "@/app/_components/EmployeeForm";
import { getSessionAction } from "@/lib/actions/sessionActions";
import { getWeeklyHours } from "@/lib/actions/employeesActions";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const employed = await getEmployee(id);
  const { role } = await getSessionAction();
  const shifts = await getWeeklyHours(id);

  const totalMinutes = shifts.reduce(
    (acc: number, ts: { totalMinutes: number }) =>
      acc + (Number(ts.totalMinutes) || 0),
    0,
  );

  return (
    <div className=" px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="mt-20 flex justify-between gap-3">
          <div className="">
            <EmployeeForm employee={employed} role={role} />
          </div>
          {/* Shift History */}
          <div>
            <div className="w-80 bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  This week
                </p>
                <span className="text-xs font-bold text-gray-900">
                  {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m total
                </span>
              </div>
              <div className="px-6 py-4 flex flex-col gap-3">
                {shifts.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    No shifts recorded this week
                  </p>
                ) : (
                  shifts.map(
                    (ts: {
                      id: string;
                      clockIn: string;
                      clockOut: string;
                      totalMinutes: number;
                    }) => (
                      <div
                        key={ts.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-medium text-gray-700">
                            {new Date(ts.clockIn).toLocaleDateString("en-ZA", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(ts.clockIn).toLocaleTimeString("en-ZA", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            —{" "}
                            {ts.clockOut
                              ? new Date(ts.clockOut).toLocaleTimeString(
                                  "en-ZA",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "Active"}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {ts.totalMinutes
                            ? `${Math.floor(ts.totalMinutes / 60)}h ${ts.totalMinutes % 60}m`
                            : "—"}
                        </span>
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
