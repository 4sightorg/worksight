import { Injectable } from '@nestjs/common';
import { AttendanceLookup, type AttendanceRecord, type AttendanceStats } from '@worksight/common';
import { paginate, PaginationQuery } from '../common/pagination.dto';
import { WorksightRepository } from '../db/worksight.repository';

@Injectable()
export class AttendanceService {
  private readonly attendance = new AttendanceLookup();

  constructor(private readonly repo: WorksightRepository) {}

  async findAll(employeeId?: string, pagination?: PaginationQuery): Promise<AttendanceRecord[]> {
    const list = this.repo.enabled
      ? await this.repo.listAttendance(employeeId)
      : employeeId
        ? this.attendance.filter({ employee_id: employeeId }).all()
        : this.attendance.all();
    return paginate(list, pagination);
  }

  async getStatsForEmployee(employeeId: string): Promise<AttendanceStats> {
    if (this.repo.enabled) {
      return this.repo.getAttendanceStats(employeeId);
    }
    return this.attendance.getStats(employeeId);
  }
}
