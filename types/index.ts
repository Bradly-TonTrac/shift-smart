// Core employee data structure.
export interface Employee {
  id?: string;
  name: string;
  email: string;
  department: string;
  role: string;
  identity: string;
}

// Props for the EmployeeForm component.
export interface EmployeeFormProp {
  employee?: Employee;
}

// Represents a single clock-in/clock-out record.
export interface TimeStamp {
  id: string;
  employeeId: string;
  clockIn: string;
  clockOut: string;
  totalMinutes: string;
  status: string;
}

// Represents a task assigned to an employee for a shift.
export interface Task {
  id?: string;
  title: string;
  notes: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "inprogress" | "completed";
  assignedTo: string;
  assignedBy: string;
  shiftDate: string;
  createdAt?: string;
}

// Extends TimeStamp with tasks and reviewed status — used in shift history.
export interface ShiftWithTasks extends TimeStamp {
  tasks: Task[];
  reviewed?: boolean;
}

// Props for the shared EmployeeProfilePage component.
export interface EmployeeProfilePageProps {
  params: Promise<{ id: string }>;
  backHref?: string;
}

// Simplified shift used for weekly hours display in ProfileTabs.
export interface Shift {
  id: string;
  clockIn: string;
  clockOut: string;
  totalMinutes: number;
}

// Props for the ProfileTabs component.
export interface ProfileTabsProps {
  employeeId: string;
  role?: string;
  sessionId?: string;
  employees: { id: string; name: string }[];
  shifts: Shift[];
  totalMinutes: number;
  isOwnProfile: boolean;
}

// Props for the ShiftHistoryClient component.
export interface ShiftHistoryClientProps {
  employeeId: string;
  employeeName: string;
}

// Props for the TasksTab component — used in _components/TaskTab.tsx.
export interface TasksTabProps {
  employeeId: string;
  role?: string;
  sessionId?: string;
  employees?: { id: string; name: string }[];
}
