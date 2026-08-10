import { Controller, Get, Param, Query } from '@nestjs/common';
import type { AttendanceRecord, AttendanceStats } from '@worksight/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  getAll(@Query('employee_id') employeeId?: string): Promise<AttendanceRecord[]> {
    return this.attendanceService.findAll(employeeId);
  }

  @Get('stats/:employeeId')
  getStats(@Param('employeeId') employeeId: string): Promise<AttendanceStats> {
    return this.attendanceService.getStatsForEmployee(employeeId);
  }
}
