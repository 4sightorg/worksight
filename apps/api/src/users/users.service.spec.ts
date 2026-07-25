import { Employees, Teams } from '@worksight/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  it('returns the shared employee fixtures', () => {
    expect(service.findAll()).toEqual(Employees);
    expect(service.findAll().length).toBeGreaterThan(0);
  });

  it('finds an employee by id', () => {
    const employee = Employees[0];
    expect(service.findById(employee.id)).toEqual(employee);
  });

  it('returns null for an unknown employee id', () => {
    expect(service.findById('does-not-exist')).toBeNull();
  });

  it('computes stats over the shared fixtures', () => {
    const stats = service.getStats();
    expect(stats.totalEmployees).toBe(Employees.length);
    const employeeRole = stats.roles.find(r => r.role === 'employee');
    expect(employeeRole?.count).toBe(Employees.filter(e => e.role === 'employee').length);
  });

  it('returns the shared team fixtures', () => {
    expect(service.findAllTeams()).toEqual(Teams);
    expect(service.findTeamById(Teams[0].id)).toEqual(Teams[0]);
  });
});
