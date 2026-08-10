import { Employees, Teams } from '@worksight/common';
import type { WorksightRepository } from '../db/worksight.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    const fixturesOnly = { enabled: false } as WorksightRepository;
    service = new UsersService(fixturesOnly);
  });

  it('returns the shared employee fixtures', async () => {
    await expect(service.findAll()).resolves.toEqual(Employees);
    expect((await service.findAll()).length).toBeGreaterThan(0);
  });

  it('finds an employee by id', async () => {
    const employee = Employees[0];
    await expect(service.findById(employee.id)).resolves.toEqual(employee);
  });

  it('returns null for an unknown employee id', async () => {
    await expect(service.findById('does-not-exist')).resolves.toBeNull();
  });

  it('computes stats over the shared fixtures', () => {
    const stats = service.getStats();
    expect(stats.totalEmployees).toBe(Employees.length);
    const employeeRole = stats.roles.find(r => r.role === 'employee');
    expect(employeeRole?.count).toBe(Employees.filter(e => e.role === 'employee').length);
  });

  it('returns the shared team fixtures', async () => {
    await expect(service.findAllTeams()).resolves.toEqual(Teams);
    await expect(service.findTeamById(Teams[0].id)).resolves.toEqual(Teams[0]);
  });
});
