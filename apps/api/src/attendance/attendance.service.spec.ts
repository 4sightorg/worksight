import { Attendance } from '@worksight/common';
import type { WorksightRepository } from '../db/worksight.repository';
import { AttendanceService } from './attendance.service';

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(() => {
    const fixturesOnly = { enabled: false } as WorksightRepository;
    service = new AttendanceService(fixturesOnly);
  });

  it('returns the shared attendance fixtures', async () => {
    await expect(service.findAll()).resolves.toEqual(Attendance);
  });

  it('filters attendance by employee', async () => {
    const employeeId = Attendance[0].employee_id;
    const expected = Attendance.filter(r => r.employee_id === employeeId);
    await expect(service.findAll(employeeId)).resolves.toEqual(expected);
  });

  it('computes per-employee stats from the fixtures', async () => {
    const employeeId = Attendance[0].employee_id;
    const records = Attendance.filter(r => r.employee_id === employeeId);
    const stats = await service.getStatsForEmployee(employeeId);
    expect(stats.totalRecords).toBe(records.length);
    expect(stats.daysPresent).toBe(records.filter(r => r.check_in != null).length);
    expect(stats.totalHours).toBeGreaterThan(0);
  });

  it('returns empty stats for unknown employees', async () => {
    const stats = await service.getStatsForEmployee('00000000-0000-4000-8000-000000000000');
    expect(stats).toEqual({
      totalRecords: 0,
      totalHours: 0,
      daysPresent: 0,
      averageHours: 0,
    });
  });
});
