import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import type { EmployeeProfile, Team } from '@worksight/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): EmployeeProfile[] {
    return this.usersService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  getOne(@Param('id') id: string): EmployeeProfile {
    const employee = this.usersService.findById(id);
    if (!employee) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return employee;
  }
}

@Controller('teams')
export class TeamsController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): Team[] {
    return this.usersService.findAllTeams();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Team {
    const team = this.usersService.findTeamById(id);
    if (!team) {
      throw new NotFoundException(`Team ${id} not found`);
    }
    return team;
  }
}
