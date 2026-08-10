import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
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

  @Post()
  @ApiOperation({
    summary: 'Create an assignment',
    description:
      'Requires `DATABASE_URL`. Returns 501 in fixture mode. Timestamps are server-owned.',
  })
  @ApiBody({ type: AssignmentDto })
  @ApiCreatedResponse({ type: AssignmentDto })
  create(@Body() body: unknown): Promise<Assignment> {
    return this.tasksService.create(body);
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Partial update an assignment',
    description:
      'Patch `status`, `priority`, `title`, and/or `points`. Requires `DATABASE_URL` (501 otherwise).',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: AssignmentDto })
  @ApiNotFoundResponse({ description: 'Assignment not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown
  ): Promise<Assignment> {
    const updated = await this.tasksService.update(id, body);
    if (!updated) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return updated;
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
