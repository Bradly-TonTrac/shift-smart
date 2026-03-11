"use server";
import axiosClient from "../api/axiosClient";
import { revalidatePath } from "next/cache";
import { Task } from "@/types";

// Fetches all tasks across all employees — used by admin only
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data } = await axiosClient.get("/tasks");
    return data;
  } catch {
    throw new Error("Failed to fetch tasks");
  }
};

// Fetches tasks assigned to a specific employee
export const getTasksByEmployee = async (
  employeeId: string,
): Promise<Task[]> => {
  try {
    const { data } = await axiosClient.get(`/tasks?assignedTo=${employeeId}`);
    return data;
  } catch {
    throw new Error("Failed to fetch employee tasks");
  }
};

// Creates a new task and attaches a createdAt timestamp
export const addTask = async (task: Omit<Task, "id">) => {
  try {
    const { data } = await axiosClient.post("/tasks", {
      ...task,
      createdAt: new Date().toISOString(),
    });
    revalidatePath("/employees");
    revalidatePath("/dashboard");
    return { success: true, message: "Task added successfully", data };
  } catch {
    return { success: false, message: "Failed to add task", data: null };
  }
};

// Partially updates a task by id — used for status, priority and notes changes
export const updateTask = async (id: string, updates: Partial<Task>) => {
  try {
    const { data } = await axiosClient.patch(`/tasks/${id}`, updates);
    revalidatePath("/employees");
    revalidatePath("/dashboard");
    return { success: true, message: "Task updated", data };
  } catch {
    return { success: false, message: "Failed to update task", data: null };
  }
};

// Deletes a task by id
export const deleteTask = async (id: string) => {
  try {
    const { data } = await axiosClient.delete(`/tasks/${id}`);
    revalidatePath("/employees");
    return { success: true, message: "Task deleted", data };
  } catch {
    return { success: false, message: "Failed to delete task", data: null };
  }
};

// Fetches tasks for a specific employee on a specific shift date
export const getTasksByDate = async (
  employeeId: string,
  date: string,
): Promise<Task[]> => {
  try {
    const { data } = await axiosClient.get(
      `/tasks?assignedTo=${employeeId}&shiftDate=${date}`,
    );
    return data;
  } catch {
    return [];
  }
};
