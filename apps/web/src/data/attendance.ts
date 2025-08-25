export type AttendanceRecord = {
  id: string;
  employee_id: string;
  date: Date;
  check_in: Date | null;
  check_out: Date | null;
  hours_worked: number | null;
  created_at: Date;
};

type AttendanceData = {
  [key: string]: AttendanceRecord;
};

// Helper function to calculate hours worked
export const calculateHoursWorked = (
  checkIn: Date | null,
  checkOut: Date | null
): number | null => {
  if (!checkIn || !checkOut) return null;
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
};

// Generate sample attendance data for the past week
export const attendance: AttendanceData = {
  // John Carlo Santos (E001) - Full week with overtime
  'a1b2c3d4-e5f6-7890-abcd-123456789001': {
    id: 'a1b2c3d4-e5f6-7890-abcd-123456789001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date: new Date('2025-08-18'),
    check_in: new Date('2025-08-18T08:00:00+00:00'),
    check_out: new Date('2025-08-18T18:30:00+00:00'),
    hours_worked: 10.5,
    created_at: new Date('2025-08-18T08:00:00+00:00'),
  },
  'a1b2c3d4-e5f6-7890-abcd-123456789002': {
    id: 'a1b2c3d4-e5f6-7890-abcd-123456789002',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date: new Date('2025-08-19'),
    check_in: new Date('2025-08-19T08:15:00+00:00'),
    check_out: new Date('2025-08-19T17:00:00+00:00'),
    hours_worked: 8.75,
    created_at: new Date('2025-08-19T08:15:00+00:00'),
  },
  'a1b2c3d4-e5f6-7890-abcd-123456789003': {
    id: 'a1b2c3d4-e5f6-7890-abcd-123456789003',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date: new Date('2025-08-20'),
    check_in: new Date('2025-08-20T07:45:00+00:00'),
    check_out: new Date('2025-08-20T16:45:00+00:00'),
    hours_worked: 9.0,
    created_at: new Date('2025-08-20T07:45:00+00:00'),
  },
  'a1b2c3d4-e5f6-7890-abcd-123456789004': {
    id: 'a1b2c3d4-e5f6-7890-abcd-123456789004',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date: new Date('2025-08-21'),
    check_in: new Date('2025-08-21T08:30:00+00:00'),
    check_out: new Date('2025-08-21T17:30:00+00:00'),
    hours_worked: 9.0,
    created_at: new Date('2025-08-21T08:30:00+00:00'),
  },
  'a1b2c3d4-e5f6-7890-abcd-123456789005': {
    id: 'a1b2c3d4-e5f6-7890-abcd-123456789005',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date: new Date('2025-08-22'),
    check_in: new Date('2025-08-22T08:00:00+00:00'),
    check_out: new Date('2025-08-22T17:15:00+00:00'),
    hours_worked: 9.25,
    created_at: new Date('2025-08-22T08:00:00+00:00'),
  },

  // Adriel M. Magalona (E002) - Regular schedule with one late arrival
  'b2c3d4e5-f6g7-8901-bcde-234567890001': {
    id: 'b2c3d4e5-f6g7-8901-bcde-234567890001',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date: new Date('2025-08-18'),
    check_in: new Date('2025-08-18T09:00:00+00:00'),
    check_out: new Date('2025-08-18T17:00:00+00:00'),
    hours_worked: 8.0,
    created_at: new Date('2025-08-18T09:00:00+00:00'),
  },
  'b2c3d4e5-f6g7-8901-bcde-234567890002': {
    id: 'b2c3d4e5-f6g7-8901-bcde-234567890002',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date: new Date('2025-08-19'),
    check_in: new Date('2025-08-19T09:30:00+00:00'), // Late arrival
    check_out: new Date('2025-08-19T17:30:00+00:00'),
    hours_worked: 8.0,
    created_at: new Date('2025-08-19T09:30:00+00:00'),
  },
  'b2c3d4e5-f6g7-8901-bcde-234567890003': {
    id: 'b2c3d4e5-f6g7-8901-bcde-234567890003',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date: new Date('2025-08-20'),
    check_in: new Date('2025-08-20T08:45:00+00:00'),
    check_out: new Date('2025-08-20T16:45:00+00:00'),
    hours_worked: 8.0,
    created_at: new Date('2025-08-20T08:45:00+00:00'),
  },
  'b2c3d4e5-f6g7-8901-bcde-234567890004': {
    id: 'b2c3d4e5-f6g7-8901-bcde-234567890004',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date: new Date('2025-08-21'),
    check_in: new Date('2025-08-21T09:00:00+00:00'),
    check_out: new Date('2025-08-21T17:00:00+00:00'),
    hours_worked: 8.0,
    created_at: new Date('2025-08-21T09:00:00+00:00'),
  },
  'b2c3d4e5-f6g7-8901-bcde-234567890005': {
    id: 'b2c3d4e5-f6g7-8901-bcde-234567890005',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date: new Date('2025-08-22'),
    check_in: new Date('2025-08-22T08:50:00+00:00'),
    check_out: new Date('2025-08-22T16:50:00+00:00'),
    hours_worked: 8.0,
    created_at: new Date('2025-08-22T08:50:00+00:00'),
  },

  // Kiel Ethan L. Lanzanas (E003) - One day with early checkout (sick leave)
  'c3d4e5f6-g7h8-9012-cdef-345678901001': {
    id: 'c3d4e5f6-g7h8-9012-cdef-345678901001',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date: new Date('2025-08-18'),
    check_in: new Date('2025-08-18T08:30:00+00:00'),
    check_out: new Date('2025-08-18T16:30:00+00:00'),
    hours_worked: 8.0,
    created_at: new Date('2025-08-18T08:30:00+00:00'),
  },
  'c3d4e5f6-g7h8-9012-cdef-345678901002': {
    id: 'c3d4e5f6-g7h8-9012-cdef-345678901002',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date: new Date('2025-08-19'),
    check_in: new Date('2025-08-19T08:15:00+00:00'),
    check_out: new Date('2025-08-19T12:00:00+00:00'), // Early checkout - sick
    hours_worked: 3.75,
    created_at: new Date('2025-08-19T08:15:00+00:00'),
  },
  'c3d4e5f6-g7h8-9012-cdef-345678901003': {
    id: 'c3d4e5f6-g7h8-9012-cdef-345678901003',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date: new Date('2025-08-20'),
    check_in: new Date('2025-08-20T08:20:00+00:00'),
    check_out: new Date('2025-08-20T16:20:00+00:00'),
    hours_worked: 8.0,
    created_at: new Date('2025-08-20T08:20:00+00:00'),
  },
  'c3d4e5f6-g7h8-9012-cdef-345678901004': {
    id: 'c3d4e5f6-g7h8-9012-cdef-345678901004',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date: new Date('2025-08-21'),
    check_in: new Date('2025-08-21T08:30:00+00:00'),
    check_out: new Date('2025-08-21T16:45:00+00:00'),
    hours_worked: 8.25,
    created_at: new Date('2025-08-21T08:30:00+00:00'),
  },
  'c3d4e5f6-g7h8-9012-cdef-345678901005': {
    id: 'c3d4e5f6-g7h8-9012-cdef-345678901005',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date: new Date('2025-08-22'),
    check_in: new Date('2025-08-22T08:10:00+00:00'),
    check_out: new Date('2025-08-22T16:30:00+00:00'),
    hours_worked: 8.33,
    created_at: new Date('2025-08-22T08:10:00+00:00'),
  },

  // Ellah D. Benerado (E004) - One day absent, consistent schedule otherwise
  'd4e5f6g7-h8i9-0123-defg-456789012001': {
    id: 'd4e5f6g7-h8i9-0123-defg-456789012001',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67',
    date: new Date('2025-08-18'),
    check_in: new Date('2025-08-18T08:45:00+00:00'),
    check_out: new Date('2025-08-18T17:00:00+00:00'),
    hours_worked: 8.25,
    created_at: new Date('2025-08-18T08:45:00+00:00'),
  },
  // August 19 - Absent (no record)
  'd4e5f6g7-h8i9-0123-defg-456789012003': {
    id: 'd4e5f6g7-h8i9-0123-defg-456789012003',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67',
    date: new Date('2025-08-20'),
    check_in: new Date('2025-08-20T09:00:00+00:00'),
    check_out: new Date('2025-08-20T17:15:00+00:00'),
    hours_worked: 8.25,
    created_at: new Date('2025-08-20T09:00:00+00:00'),
  },
  'd4e5f6g7-h8i9-0123-defg-456789012004': {
    id: 'd4e5f6g7-h8i9-0123-defg-456789012004',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67',
    date: new Date('2025-08-21'),
    check_in: new Date('2025-08-21T08:40:00+00:00'),
    check_out: new Date('2025-08-21T16:55:00+00:00'),
    hours_worked: 8.25,
    created_at: new Date('2025-08-21T08:40:00+00:00'),
  },
  'd4e5f6g7-h8i9-0123-defg-456789012005': {
    id: 'd4e5f6g7-h8i9-0123-defg-456789012005',
    employee_id: '88165ccb-2c80-455a-9ace-466a30448f67',
    date: new Date('2025-08-22'),
    check_in: new Date('2025-08-22T08:35:00+00:00'),
    check_out: new Date('2025-08-22T17:05:00+00:00'),
    hours_worked: 8.5,
    created_at: new Date('2025-08-22T08:35:00+00:00'),
  },

  // Current day (August 25) - Only check-ins, no check-outs yet
  'e5f6g7h8-i9j0-1234-efgh-567890123001': {
    id: 'e5f6g7h8-i9j0-1234-efgh-567890123001',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    date: new Date('2025-08-25'),
    check_in: new Date('2025-08-25T08:05:00+00:00'),
    check_out: null, // Still working
    hours_worked: null,
    created_at: new Date('2025-08-25T08:05:00+00:00'),
  },
  'e5f6g7h8-i9j0-1234-efgh-567890123002': {
    id: 'e5f6g7h8-i9j0-1234-efgh-567890123002',
    employee_id: '58f36d76-f382-41b4-ad3e-f8192958d12b',
    date: new Date('2025-08-25'),
    check_in: new Date('2025-08-25T08:55:00+00:00'),
    check_out: null, // Still working
    hours_worked: null,
    created_at: new Date('2025-08-25T08:55:00+00:00'),
  },
  'e5f6g7h8-i9j0-1234-efgh-567890123003': {
    id: 'e5f6g7h8-i9j0-1234-efgh-567890123003',
    employee_id: '71400e28-3c2a-4694-8124-8fbb9a0b66d8',
    date: new Date('2025-08-25'),
    check_in: new Date('2025-08-25T08:25:00+00:00'),
    check_out: null, // Still working
    hours_worked: null,
    created_at: new Date('2025-08-25T08:25:00+00:00'),
  },
};

// Utility functions for working with attendance data
export const getAttendanceByEmployee = (employeeId: string): AttendanceRecord[] => {
  return Object.values(attendance).filter((record) => record.employee_id === employeeId);
};

export const getAttendanceByDate = (date: Date): AttendanceRecord[] => {
  const targetDate = date.toISOString().split('T')[0];
  return Object.values(attendance).filter(
    (record) => record.date.toISOString().split('T')[0] === targetDate
  );
};

export const getTotalHoursWorkedByEmployee = (employeeId: string): number => {
  return getAttendanceByEmployee(employeeId).reduce(
    (total, record) => total + (record.hours_worked || 0),
    0
  );
};

export const getEmployeeAttendanceStats = (employeeId: string) => {
  const records = getAttendanceByEmployee(employeeId);
  const totalHours = records.reduce((sum, record) => sum + (record.hours_worked || 0), 0);
  const daysPresent = records.filter((record) => record.check_in !== null).length;
  const averageHours = daysPresent > 0 ? totalHours / daysPresent : 0;

  return {
    totalHours: Math.round(totalHours * 100) / 100,
    daysPresent,
    averageHours: Math.round(averageHours * 100) / 100,
    totalRecords: records.length,
  };
};

// Example usage:
// const johnAttendance = getAttendanceByEmployee("08b6fc43-77e6-4fcf-8ed8-dafc16b4b025");
// const todayAttendance = getAttendanceByDate(new Date("2025-08-25"));
// const johnStats = getEmployeeAttendanceStats("08b6fc43-77e6-4fcf-8ed8-dafc16b4b025");
