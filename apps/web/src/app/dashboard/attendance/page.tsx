'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { DashboardSubNav } from '@/components/dashboard/sub-nav';
import { EmptyState } from '@/components/empty/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { employeeLookup } from '@/lib/mvp-data';
import {
  ApiAttendanceRecord,
  ApiAttendanceStats,
  isApiDataMode,
  worksightApi,
} from '@/lib/worksight-api';
import { AttendanceLookup } from '@worksight/common';

interface UIEmployee {
  id: string;
  name: string;
}

function formatDate(val: string | Date | null | undefined): string {
  if (!val) return '—';
  const d = typeof val === 'string' ? new Date(val) : val;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(val: string | Date | null | undefined): string {
  if (!val) return '—';
  const d = typeof val === 'string' ? new Date(val) : val;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function computeStats(records: ApiAttendanceRecord[]): ApiAttendanceStats {
  const totalRecords = records.length;
  const totalHours =
    Math.round(
      records.reduce((sum, r) => sum + (r.hours_worked ?? 0), 0) * 100
    ) / 100;
  const daysPresent = records.filter((r) => r.check_in != null).length;
  const averageHours =
    daysPresent > 0 ? Math.round((totalHours / daysPresent) * 100) / 100 : 0;
  return { totalRecords, totalHours, daysPresent, averageHours };
}

export default function AttendancePage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all');
  const [records, setRecords] = useState<ApiAttendanceRecord[]>([]);
  const [stats, setStats] = useState<ApiAttendanceStats>({
    totalRecords: 0,
    totalHours: 0,
    daysPresent: 0,
    averageHours: 0,
  });
  const [employees, setEmployees] = useState<UIEmployee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize employees list from common fixtures or API
  useEffect(() => {
    const fixtureEmployees = employeeLookup.all().map((e) => ({
      id: e.id,
      name: e.name,
    }));
    setEmployees(fixtureEmployees);

    if (isApiDataMode()) {
      worksightApi
        .getUsers()
        .then((users) => {
          if (users && users.length > 0) {
            setEmployees(
              users.map((u) => ({
                id: u.id,
                name: u.name,
              }))
            );
          }
        })
        .catch((err) => {
          console.warn('Failed to fetch users for employee filter', err);
        });
    }
  }, []);

  const employeeNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const emp of employees) {
      map.set(emp.id, emp.name);
    }
    // Also include common fixture employees for fallback
    for (const emp of employeeLookup.all()) {
      if (!map.has(emp.id)) {
        map.set(emp.id, emp.name);
      }
      if (emp.internal_id && !map.has(emp.internal_id)) {
        map.set(emp.internal_id, emp.name);
      }
    }
    return map;
  }, [employees]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const filterId = selectedEmployeeId === 'all' ? undefined : selectedEmployeeId;

    if (isApiDataMode()) {
      try {
        const fetchedRecords = await worksightApi.getAttendance(filterId);
        setRecords(fetchedRecords);

        if (filterId) {
          try {
            const fetchedStats = await worksightApi.getAttendanceStats(filterId);
            setStats(fetchedStats);
          } catch {
            setStats(computeStats(fetchedRecords));
          }
        } else {
          setStats(computeStats(fetchedRecords));
        }
      } catch (err) {
        console.warn('API getAttendance failed; falling back to fixtures', err);
        const attendanceLookup = new AttendanceLookup();
        const fallbackRecords = filterId
          ? attendanceLookup.filter({ employee_id: filterId }).all()
          : attendanceLookup.all();
        setRecords(fallbackRecords as unknown as ApiAttendanceRecord[]);
        const fallbackStats = filterId
          ? attendanceLookup.getStats(filterId)
          : computeStats(fallbackRecords as unknown as ApiAttendanceRecord[]);
        setStats(fallbackStats);
      }
    } else {
      const attendanceLookup = new AttendanceLookup();
      const fixtureRecords = filterId
        ? attendanceLookup.filter({ employee_id: filterId }).all()
        : attendanceLookup.all();
      setRecords(fixtureRecords as unknown as ApiAttendanceRecord[]);
      const fixtureStats = filterId
        ? attendanceLookup.getStats(filterId)
        : computeStats(fixtureRecords as unknown as ApiAttendanceRecord[]);
      setStats(fixtureStats);
    }
    setIsLoading(false);
  }, [selectedEmployeeId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const getEmployeeName = (empId: string): string => {
    return employeeNameMap.get(empId) ?? `Employee (${empId.slice(0, 8)})`;
  };

  return (
    <ProtectedRoute>
      <ClientOnly>
        <SidebarProvider>
          <SidebarInset>
            <div className="flex flex-1 flex-col space-y-6 p-6">
              <DashboardSubNav
                aria-label="Attendance sub navigation"
                items={[
                  { label: 'Tasks', href: '/dashboard/tasks' },
                  { label: 'Attendance', href: '/dashboard/attendance', badge: records.length },
                  { label: 'Reports', href: '/dashboard/reports', soon: true },
                  { label: 'Wellness', href: '/dashboard/wellness' },
                ]}
              />

              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
                  <p className="text-muted-foreground">
                    Track check-in history, working hours, and presence statistics
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Filter by Employee */}
                  <div className="flex items-center gap-2">
                    <Filter className="text-muted-foreground h-4 w-4" />
                    <Select
                      value={selectedEmployeeId}
                      onValueChange={(val) => setSelectedEmployeeId(val)}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="All Employees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => void loadData()}
                    title="Refresh data"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                    <Calendar className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalRecords}</div>
                    <p className="text-muted-foreground text-xs">Logged attendance entries</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                    <Clock className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalHours} hrs</div>
                    <p className="text-muted-foreground text-xs">Accumulated work hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Days Present</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.daysPresent} days</div>
                    <p className="text-muted-foreground text-xs">Active check-in days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Hours / Day</CardTitle>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageHours} hrs</div>
                    <p className="text-muted-foreground text-xs">Average per present day</p>
                  </CardContent>
                </Card>
              </div>

              {/* Records List / Table */}
              {records.length === 0 ? (
                <EmptyState
                  icon={<Clock className="h-6 w-6" />}
                  title="No attendance records found"
                  description={
                    selectedEmployeeId !== 'all'
                      ? 'No attendance history recorded for the selected employee.'
                      : 'There are no attendance records logged in the system.'
                  }
                  primaryAction={
                    selectedEmployeeId !== 'all'
                      ? {
                          label: 'Show All Employees',
                          onClick: () => setSelectedEmployeeId('all'),
                        }
                      : undefined
                  }
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                      <Clock className="h-5 w-5" />
                      Attendance History ({records.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Check-In</TableHead>
                          <TableHead>Check-Out</TableHead>
                          <TableHead>Hours Worked</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records.map((record, index) => {
                          const recordId = record.system_id ?? (record as { id?: string }).id ?? `attendance-${index}`;
                          const isCompleted = record.check_out != null;
                          const isWorking = record.check_in != null && record.check_out == null;

                          return (
                            <TableRow key={recordId}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <User className="text-muted-foreground h-4 w-4" />
                                  <span>{getEmployeeName(record.employee_id)}</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(record.date)}</TableCell>
                              <TableCell>{formatTime(record.check_in)}</TableCell>
                              <TableCell>{formatTime(record.check_out)}</TableCell>
                              <TableCell>
                                {record.hours_worked != null
                                  ? `${record.hours_worked} hrs`
                                  : '—'}
                              </TableCell>
                              <TableCell>
                                {isCompleted ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    Completed
                                  </Badge>
                                ) : isWorking ? (
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    Active / Working
                                  </Badge>
                                ) : (
                                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                    Absent
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ClientOnly>
    </ProtectedRoute>
  );
}
