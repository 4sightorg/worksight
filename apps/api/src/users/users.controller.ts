import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { EmployeeProfile, Team } from '@worksight/common';
import { parsePaginationParams } from '../common/pagination.dto';
import { EmployeeProfileDto, EmployeeStatsDto, OrgStatsDto, TeamDto } from '../openapi/schemas';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List employees' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit count' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset count' })
  @ApiOkResponse({ type: EmployeeProfileDto, isArray: true })
  getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<EmployeeProfile[]> {
    return this.usersService.findAll(parsePaginationParams(limit, offset));
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

  @Post()
  @ApiOperation({ summary: 'Create an employee account' })
  @ApiBody({ type: EmployeeProfileDto })
  @ApiCreatedResponse({ type: EmployeeProfileDto })
  create(@Body() body: unknown): Promise<EmployeeProfile> {
    return this.usersService.create(body);
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee profile' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: EmployeeProfileDto })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown
  ): Promise<EmployeeProfile> {
    const updated = await this.usersService.update(id, body);
    if (!updated) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an employee profile' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Employee deleted successfully' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const deleted = await this.usersService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User ${id} not found`);
    }
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
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit count' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset count' })
  @ApiOkResponse({ type: TeamDto, isArray: true })
  getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<Team[]> {
    return this.usersService.findAllTeams(parsePaginationParams(limit, offset));
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
