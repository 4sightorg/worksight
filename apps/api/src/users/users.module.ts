import { Module } from '@nestjs/common';
import { StatsController, TeamsController, UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, TeamsController, StatsController],
  providers: [UsersService],
})
export class UsersModule {}
