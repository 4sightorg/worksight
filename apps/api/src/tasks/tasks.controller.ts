import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Activity, Assignment } from '@worksight/common';
import { ActivityDto, AssignmentDto, TaskStatsDto } from '../openapi/schemas';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List assignments (tasks)' })
  @ApiQuery({
    name: 'employee_id',
    required: false,
    format: 'uuid',
    description: 'When set, only assignments for this employee',
  })
  @ApiOkResponse({ type: AssignmentDto, isArray: true })
  getAll(@Query('employee_id') employeeId?: string): Promise<Assignment[]> {
    return this.tasksService.findAll(employeeId);
  }

  @Get('stats/:employeeId')
  @ApiOperation({
    summary: 'Per-employee task + activity stats',
    description: 'Completion rates, story points, and work-life signals for one employee.',
  })
  @ApiParam({ name: 'employeeId', format: 'uuid' })
  @ApiOkResponse({ type: TaskStatsDto })
  getStats(@Param('employeeId', ParseUUIDPipe) employeeId: string): Promise<TaskStatsDto> {
    return this.tasksService.getStatsForEmployee(employeeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assignment by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: AssignmentDto })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Assignment> {
    const assignment = await this.tasksService.findById(id);
    if (!assignment) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return assignment;
  }
}

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List activities' })
  @ApiQuery({
    name: 'employee_id',
    required: false,
    format: 'uuid',
    description: 'When set, only activities for this employee',
  })
  @ApiOkResponse({ type: ActivityDto, isArray: true })
  getAll(@Query('employee_id') employeeId?: string): Promise<Activity[]> {
    return this.tasksService.findAllActivities(employeeId);
  }
}
