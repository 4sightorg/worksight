import { Attendance } from '@worksight/common/data/attendance';
import {
  AttendanceRecord,
  AttendanceSchema,
  AttendanceStats
} from '@worksight/common/types/attendance';
import { BaseLookup } from './base';

/**
 * AttendanceLookup
 * ----------------
 * Thin wrapper around BaseLookup specialized for AttendanceRecord.
 * Provides filtering, query helpers, and employee attendance statistics.
 */
export class AttendanceLookup extends BaseLookup<typeof AttendanceSchema> {
  /**
   * Creates an AttendanceLookup instance
   * @param entries - Optional array of AttendanceRecord; defaults to imported Attendance dataset
   */
  constructor(entries: AttendanceRecord[] = Attendance) {
    super(AttendanceSchema, entries);
  }

  /**
   * Computes attendance statistics for a specific employee
   * @param employee_id - Employee's unique identifier
   * @returns Aggregated statistics including total records, total hours, days present, and average hours
   */
  public getStats(employee_id: string): AttendanceStats {
    // Filter records for the employee
    const records: AttendanceRecord[] = this.filter({ employee_id }).all();

    const totalHours: number = records.reduce(
      (sum, r) => sum + (r.hours_worked ?? 0),
      0
    );

    const daysPresent: number = records.filter((r) => r.check_in != null).length;

    const averageHours: number = daysPresent > 0 ? totalHours / daysPresent : 0;

    return {
      totalRecords: records.length,
      totalHours: Math.round(totalHours * 100) / 100,
      daysPresent,
      averageHours: Math.round(averageHours * 100) / 100
    };
  }

  /**
   * Computes the total hours worked by an employee
   * @param employee_id - Employee's unique identifier
   * @returns Sum of hours worked across all attendance records
   */
  public getTotalHoursWorkedByEmployee(employee_id: string): number {
    const records: AttendanceRecord[] = this.filter({ employee_id }).all();
    return records.reduce((sum, r) => sum + (r.hours_worked ?? 0), 0);
  }

  /**
   * Example extension point for custom statistics
   * Allows you to pass a function that takes AttendanceRecord[] and returns any shape
   * @param employee_id - Employee's unique identifier
   * @param callback - Function to compute custom stats from filtered records
   */
  public getCustomStats<T>(
    employee_id: string,
    callback: (records: AttendanceRecord[]) => T
  ): T {
    const records: AttendanceRecord[] = this.filter({ employee_id }).all();
    return callback(records);
  }
}
