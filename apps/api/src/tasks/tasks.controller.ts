import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import type { Activity, Assignment } from '@worksight/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll(@Query('employee_id') employeeId?: string): Assignment[] {
    return this.tasksService.findAll(employeeId);
  }

  @Get('stats/:employeeId')
  getStats(@Param('employeeId') employeeId: string) {
    return this.tasksService.getStatsForEmployee(employeeId);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Assignment {
    const assignment = this.tasksService.findById(id);
    if (!assignment) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return assignment;
  }
}

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll(@Query('employee_id') employeeId?: string): Activity[] {
    return this.tasksService.findAllActivities(employeeId);
  }
}
