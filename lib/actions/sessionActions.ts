"use server";
import { cookies } from "next/headers";

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
