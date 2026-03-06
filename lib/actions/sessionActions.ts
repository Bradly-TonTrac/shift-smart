"use server";
import { cookies } from "next/headers";

export const setSessionAction = async (role: "admin" | "employee", employeeId?: string) => {
  const cookieStore = await cookies();
  cookieStore.set("role", role, { path: "/" });
  if (employeeId) cookieStore.set("employeeId", employeeId, { path: "/" });
};

export const getSessionAction = async () => {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  const employeeId = cookieStore.get("employeeId")?.value;
  return { role, employeeId };
};

export const clearSessionAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("role");
  cookieStore.delete("employeeId");
};