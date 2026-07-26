import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AttendanceModule } from './attendance/attendance.module';
import { DatabaseModule } from './db/database.module';
import { SurveysModule } from './surveys/surveys.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule, TasksModule, AttendanceModule, SurveysModule],
  controllers: [AppController],
})
export class AppModule {}
