import { Controller, Get, NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { EmployeeProfile, Team } from '@worksight/common';
import { EmployeeProfileDto, EmployeeStatsDto, OrgStatsDto, TeamDto } from '../openapi/schemas';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List employees' })
  @ApiOkResponse({ type: EmployeeProfileDto, isArray: true })
  getAll(): Promise<EmployeeProfile[]> {
    return this.usersService.findAll();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Aggregate employee stats',
    description: 'Role and department counts over the active data source (Postgres or fixtures).',
  })
  @ApiOkResponse({ type: EmployeeStatsDto })
  getStats(): Promise<EmployeeStatsDto> {
    return this.usersService.getStats();
  }

  @Get('stats/org')
  @ApiOperation({ summary: 'Org aggregate stats' })
  @ApiOkResponse({ type: OrgStatsDto })
  getOrgStats(): Promise<OrgStatsDto> {
    return this.usersService.getOrgStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: EmployeeProfileDto })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<EmployeeProfile> {
    const employee = await this.usersService.findById(id);
    if (!employee) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return employee;
  }
}

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('org')
  @ApiOperation({ summary: 'Org aggregate stats' })
  @ApiOkResponse({ type: OrgStatsDto })
  getOrgStats(): Promise<OrgStatsDto> {
    return this.usersService.getOrgStats();
  }
}

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List teams' })
  @ApiOkResponse({ type: TeamDto, isArray: true })
  getAll(): Promise<Team[]> {
    return this.usersService.findAllTeams();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: TeamDto })
  @ApiNotFoundResponse({ description: 'Team not found' })
  async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Team> {
    const team = await this.usersService.findTeamById(id);
    if (!team) {
      throw new NotFoundException(`Team ${id} not found`);
    }
    return team;
  }
}
