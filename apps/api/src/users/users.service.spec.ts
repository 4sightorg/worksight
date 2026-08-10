import { Employees, Teams } from '@worksight/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  it('returns the shared employee fixtures', async () => {
    expect(await service.findAll()).toEqual(Employees);
    expect((await service.findAll()).length).toBeGreaterThan(0);
  });

  it('finds an employee by id', async () => {
    const employee = Employees[0];
    expect(await service.findById(employee.id)).toEqual(employee);
  });

  it('returns null for an unknown employee id', async () => {
    expect(await service.findById('does-not-exist')).toBeNull();
  });

  it('computes stats over the shared fixtures', async () => {
    const stats = await service.getStats();
    expect(stats.totalEmployees).toBe(Employees.length);
    const employeeRole = stats.roles.find(r => r.role === 'employee');
    expect(employeeRole?.count).toBe(Employees.filter(e => e.role === 'employee').length);
  });

  it('returns the shared team fixtures', async () => {
    expect(await service.findAllTeams()).toEqual(Teams);
    expect(await service.findTeamById(Teams[0].id)).toEqual(Teams[0]);
  });
});
