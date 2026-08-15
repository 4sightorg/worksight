import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { AttendanceRecord, AttendanceStats } from '@worksight/common';
import { parsePaginationParams } from '../common/pagination.dto';
import { ParseOptionalUUIDPipe } from '../common/parse-optional-uuid.pipe';
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
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit count' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset count' })
  @ApiOkResponse({ type: AttendanceRecordDto, isArray: true })
  getAll(
    @Query('employee_id', ParseOptionalUUIDPipe) employeeId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<AttendanceRecord[]> {
    return this.attendanceService.findAll(employeeId, parsePaginationParams(limit, offset));
  }

  @Get('stats/:employeeId')
  @ApiOperation({ summary: 'Per-employee attendance stats' })
  @ApiParam({ name: 'employeeId', format: 'uuid' })
  @ApiOkResponse({ type: AttendanceStatsDto })
  getStats(@Param('employeeId', ParseUUIDPipe) employeeId: string): Promise<AttendanceStats> {
    return this.attendanceService.getStatsForEmployee(employeeId);
  }
}
