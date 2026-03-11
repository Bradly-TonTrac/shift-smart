export interface Employee {
  id?: string;
  name: string;
  email: string;
  department: string;
  role: string;
  identity: string;
}

export interface EmployeeFormProp {
  employee?: Employee;
}

export interface TimeStamp {
  id: string;
  employeeId: string;
  clockIn: string;
  clockOut: string;
  totalMinutes: string;
  status: string;
}

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

export interface ShiftWithTasks extends TimeStamp {
  tasks: Task[];
  reviewed?: boolean;
}

export interface EmployeeProfilePageProps {
  params: Promise<{ id: string }>;
  backHref?: string;
}

export interface Shift {
  id: string;
  clockIn: string;
  clockOut: string;
  totalMinutes: number;
}

export interface ProfileTabsProps {
  employeeId: string;
  role?: string;
  sessionId?: string;
  employees: { id: string; name: string }[];
  shifts: Shift[];
  totalMinutes: number;
  isOwnProfile: boolean;
}

export interface ShiftHistoryClientProps {
  employeeId: string;
  employeeName: string;
}
