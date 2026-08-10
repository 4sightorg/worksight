import { Injectable } from '@nestjs/common';
import {
  AttendanceLookup,
  type AttendanceRecord,
  type AttendanceStats,
} from '@worksight/common';
import { WorksightRepository } from '../db/worksight.repository';

@Injectable()
export class AttendanceService {
  private readonly attendance = new AttendanceLookup();

  constructor(private readonly repo: WorksightRepository) {}

  async findAll(employeeId?: string): Promise<AttendanceRecord[]> {
    if (this.repo.enabled) {
      return this.repo.listAttendance(employeeId);
    }
    if (employeeId) {
      return this.attendance.filter({ employee_id: employeeId }).all();
    }
    return this.attendance.all();
  }

  async getStatsForEmployee(employeeId: string): Promise<AttendanceStats> {
    if (this.repo.enabled) {
      return this.repo.getAttendanceStats(employeeId);
    }
    return this.attendance.getStats(employeeId);
  }
}
