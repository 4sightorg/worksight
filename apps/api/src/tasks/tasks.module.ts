import { Module } from '@nestjs/common';
import { ActivitiesController, TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController, ActivitiesController],
  providers: [TasksService],
})
export class TasksModule {}
