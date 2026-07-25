import { Module } from '@nestjs/common';
import { TeamsController, UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, TeamsController],
  providers: [UsersService],
})
export class UsersModule {}
