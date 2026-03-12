"use server";
import { cookies } from "next/headers";
import { getEmployeeByIdentity } from "./employeesActions";
// Sets the session cookies for role and employeeId on login
export const setSessionAction = async (
  role: "admin" | "employee",
  employeeId?: string,
) => {
  const cookieStore = await cookies();
  cookieStore.set("role", role, { path: "/" });
  if (employeeId) cookieStore.set("employeeId", employeeId, { path: "/" });
};

// Reads the session cookies and returns the current role and employeeId
export const getSessionAction = async () => {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  const employeeId = cookieStore.get("employeeId")?.value;
  return { role, employeeId };
};

// Clears the session cookies on logout
export const clearSessionAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("role");
  cookieStore.delete("employeeId");
};

// Validates the user input against the admin password or employee identity and sets the session
export const loginAction = async (userInput: string) => {
  if (userInput === process.env.ADMIN_PASSWORD) {
    await setSessionAction("admin");
    return {
      success: true,
      role: "admin",
      message: "Welcome to your Administrator activities",
    };
  } else {
    const employee = await getEmployeeByIdentity(userInput);

    if (employee) {
      await setSessionAction("employee", employee.id);
      return {
        success: true,
        role: "employee",
        message: "Welcome to your shift activities ",
        employeeId: employee.id,
      };
    } else {
      return {
        success: false,
        message: "Illegal Login Please Contact Your Administrator",
      };
    }
  }
};
