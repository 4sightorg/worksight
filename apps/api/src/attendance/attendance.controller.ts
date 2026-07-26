import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { AttendanceRecord, AttendanceStats } from '@worksight/common';
import { AttendanceRecordDto, AttendanceStatsDto } from '../openapi/schemas';
import { AttendanceService } from './attendance.service';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({ summary: 'List attendance records' })
  @ApiQuery({
    name: 'employee_id',
    required: false,
    format: 'uuid',
    description: 'When set, only records for this employee',
  })
  @ApiOkResponse({ type: AttendanceRecordDto, isArray: true })
  getAll(@Query('employee_id') employeeId?: string): Promise<AttendanceRecord[]> {
    return this.attendanceService.findAll(employeeId);
  }

  @Get('stats/:employeeId')
  @ApiOperation({ summary: 'Per-employee attendance stats' })
  @ApiParam({ name: 'employeeId', format: 'uuid' })
  @ApiOkResponse({ type: AttendanceStatsDto })
  getStats(@Param('employeeId', ParseUUIDPipe) employeeId: string): Promise<AttendanceStats> {
    return this.attendanceService.getStatsForEmployee(employeeId);
  }
}
