import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { Activity, Assignment } from '@worksight/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll(@Query('employee_id') employeeId?: string): Promise<Assignment[]> {
    return this.tasksService.findAll(employeeId);
  }

  @Get('stats/:employeeId')
  getStats(@Param('employeeId') employeeId: string) {
    return this.tasksService.getStatsForEmployee(employeeId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Assignment> {
    const assignment = await this.tasksService.findById(id);
    if (!assignment) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return assignment;
  }

  /** Requires DATABASE_URL; 501 in fixture mode. */
  @Post()
  create(@Body() body: unknown): Promise<Assignment> {
    return this.tasksService.create(body);
  }

  /** Partial update. Requires DATABASE_URL; 501 in fixture mode. */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: unknown): Promise<Assignment> {
    const updated = await this.tasksService.update(id, body);
    if (!updated) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return updated;
  }
}

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll(@Query('employee_id') employeeId?: string): Promise<Activity[]> {
    return this.tasksService.findAllActivities(employeeId);
  }
}
