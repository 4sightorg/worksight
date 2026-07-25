import { getEmployeesRecord } from '@/lib/mvp-data';

/**
 * Compatibility shim: employees now come from @worksight/common via mvp-data.
 * Prefer importing from `@/lib/mvp-data` or `@worksight/common/data` directly.
 */
export type EmployeeProfile = {
  [key: string]: {
    internal_id: string;
    email: string;
    name: string;
    role: string;
    manager_id: string;
    date_joined: Date;
    department: string;
    created_at: Date;
    updated_at: Date;
  };
};

export const Employees: EmployeeProfile = getEmployeesRecord();

// Also export with the old name for backward compatibility
export const employees = Employees;
