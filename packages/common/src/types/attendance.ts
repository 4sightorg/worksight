import { z } from "zod";

/**
 * AttendanceSchema
 * ----------------
 * Represents a single attendance record for an employee.
 */
export const AttendanceSchema = z.object({
  /** Unique ID of the system recording the attendance */
  system_id: z.uuid(),

  /** Unique identifier of the employee */
  employee_id: z.uuid(),

  /** Date of the attendance */
  date: z.date(),

  /** Check-in timestamp (nullable if employee did not check in) */
  check_in: z.date().nullable(),

  /** Check-out timestamp (nullable if employee did not check out) */
  check_out: z.date().nullable(),

  /** Number of hours worked on that day (nullable if not recorded) */
  hours_worked: z.number().nullable(),

  /** Timestamp of when this record was created in the system */
  created_at: z.date(),
});

/**
 * TypeScript type inferred from AttendanceSchema
 */
export type AttendanceRecord = z.infer<typeof AttendanceSchema>;

/**
 * AttendanceStats
 * ----------------
 * Represents aggregated statistics for a single employee's attendance.
 */
export type AttendanceStats = {
  /** Total number of attendance records for the employee */
  totalRecords: number;

  /** Total hours worked across all attendance records */
  totalHours: number;

  /** Number of days the employee was present (has check-in) */
  daysPresent: number;

  /** Average hours worked per day the employee was present */
  averageHours: number;
};
