"use server";
import { Employee } from "@/types";
import { revalidatePath } from "next/cache";
import axiosClient from "../api/axiosClient";
import { TimeStamp } from "@/types";

//fetching all employees
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const { data } = await axiosClient.get(`/employees`);

    return data;
  } catch (error) {
    throw new Error("Failed to fetch employees");
  }
};

//fetching an employee per their ID
export const getEmployee = async (id: string): Promise<Employee> => {
  try {
    const { data } = await axiosClient.get(`/employees/${id}`);
    return data;
  } catch (error) {
    throw new Error("Failed to fetch a user");
  }
};

//get Employees Weekly hours
export const getWeeklyHours = async (employeeId: string) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const { data } = await axiosClient.get(
      `/timeStamps?employeeId=${employeeId}&status=completed`,
    );
    return data.filter(
      (ts: { clockIn: string }) => new Date(ts.clockIn) >= startOfWeek,
    );
  } catch (error) {
    throw new Error("Failed to fetch weekly hours");
  }
};

//get Employee by their Identity
export const getEmployeeByIdentity = async (
  identity: string,
): Promise<Employee | null> => {
  try {
    const { data } = await axiosClient.get(`/employees?identity=${identity}`);
    console.log(data);
    return data[0] ?? null;
  } catch (error) {
    throw new Error("Sorry we ran  into a problem  with the ID's");
  }
};

//create employee
export const addEmployee = async (employee: Employee) => {
  try {
    const existingID = await axiosClient.get(
      `/employees?identity=${employee.identity}`,
    );
    if (existingID.data.length > 0) {
      return {
        success: false,
        message: "Employee exist in the system",
      };
    }

    const existingMail = await axiosClient.get(
      `/employees?email=${employee.email}`,
    );
    if (existingMail.data.length > 0) {
      return {
        success: false,
        message: "Employee exist in the system",
      };
    }

    const { data } = await axiosClient.post(`/employees`, employee);

    revalidatePath("/employees");
    return {
      success: true,
      message: "New Employee Created Successfully",
      data,
    };
  } catch (error) {
    return { success: false, message: "Failed to create new Employee" };
  }
};

//updating an employee
export const updateEmployee = async (employee: Employee, id: string) => {
  try {
    const { data } = await axiosClient.patch(`/employees/${id}`, employee);
    revalidatePath("/employees");

    return {
      success: true,
      message: "Employee info Updated Successfully",
      data,
    };
  } catch (error) {
    return { success: false, message: "Failed to Update Employee Info" };
  }
};

//deleting an employee
export const deleteEmployee = async (id: string) => {
  try {
    const { data } = await axiosClient.delete(`/employees/${id}`);
    revalidatePath("/employees");

    return {
      success: true,
      message: "Employee Data Deleted Successfully",
      data,
    };
  } catch (error) {
    return { success: false, message: "Failed to delete Employee Data" };
  }
};

//******Times Data Manipulation's***********/

//clockIn functionality
export const clockIn = async (employeeId: string) => {
  try {
    const existing = await axiosClient.get(
      `/timeStamps?employeeId=${employeeId}&status=active`,
    );
    if (existing.data.length > 0) {
      return {
        success: true,
        message: "User Already Clocked in ",
        data: existing.data[0],
      };
    }

    const { data } = await axiosClient.post(`/timeStamps`, {
      employeeId: employeeId,
      clockIn: new Date().toISOString(),
      clockOut: "",
      totalMinutes: "",
      status: "active",
    });

    revalidatePath("/employees");
    return { success: true, message: "Shift Started Successfully", data };
  } catch (error) {
    return { success: false, message: "Failed to start Shift" };
  }
};

//clockOut functionality
export const clockOut = async (id: string, clockIn: string) => {
  try {
    const { data } = await axiosClient.patch(`/timeStamps/${id}`, {
      clockOut: new Date().toISOString(),
      totalMinutes: Math.round(
        (new Date().getTime() - new Date(clockIn).getTime()) / 60000,
      ),
      status: "completed",
    });

    revalidatePath("/employees");

    return { success: true, message: "Shift ended successfully", data };
  } catch (error) {
    return { success: false, message: "Failed to end shift " };
  }
};

//delete Timestamp
export const deleteTimeStamp = async (timeStamp: TimeStamp, id: string) => {
  try {
    const { data } = await axiosClient.delete(`/timeStamps/${id}`);
    revalidatePath("/employees");

    return data;
  } catch (error) {
    throw new Error("Failed to delete Timestamp");
  }
};

// checks the employees status etc
export const getShiftStatus = async (employeeId: string) => {
  try {
    const { data } = await axiosClient.get(
      `/timeStamps?employeeId=${employeeId}&status=active`,
    );
    return data;
  } catch (error) {
    throw new Error(" Time Stamp error not valid");
  }
};

//Used for dashboard only
export const shiftStatus = async () => {
  const { data } = await axiosClient.get(`/timeStamps?status=active`);
  return data;
};

//***************Shifts Manipulation*************/
//get all shifts
export const getAllShifts = async (employeeId: string) => {
  try {
    const { data } = await axiosClient.get(
      `/timeStamps?employeeId=${employeeId}&status=completed`,
    );
    return data;
  } catch {
    throw new Error("Failed to fetch shift history");
  }
};

//delete shifts
export const deleteShift = async (id: string) => {
  try {
    await axiosClient.delete(`/timeStamps/${id}`);
    revalidatePath("/employees");
    return { success: true, message: "Shift record deleted" };
  } catch {
    return { success: false, message: "Failed to delete shift record" };
  }
};
