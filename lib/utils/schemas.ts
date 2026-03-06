import { z } from "zod";

//Zod validation (used in a RHF)
export const employeesValidation = z.object({
  name: z.string().min(3, "Full name cannot be less than 3 characters"),
  email: z.string().email("valid email is required"),
  department: z.string().min(2, "department required"),
  role: z.string().min(2, "Required"),
  identity: z.string().min(6, "Employee Login ID Mandatory"),
});

//Exported Data type Connected in a RHF
export type EmployeeFormData = z.infer<typeof employeesValidation>;
