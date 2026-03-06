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
