'use client';

import { useAuth } from '@/auth';
import { getRoleColor, getUserRoleDisplay } from '@/auth/admin';
import { UserRole } from '@/auth/types';
import { AdminRoute } from '@/components/admin';
import { SessionTimer } from '@/components/features';
import { AppSidebar } from '@/components/main/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { sections } from '@/data/sections';
import {
  UserFilters,
  UserWithMetrics,
  validateUserArray,
  validateUserFilters,
} from '@/schemas/user';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit3,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const mockUsers: UserWithMetrics[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: UserRole.EMPLOYEE,
    department: 'Engineering',
    team: 'Frontend',
    burnoutScore: 3.2,
    lastActive: '2 hours ago',
    surveyCompleted: true,
    riskLevel: 'low',
    tasksCompleted: 24,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: UserRole.TEAM_LEAD,
    department: 'Engineering',
    team: 'Backend',
    burnoutScore: 7.8,
    lastActive: '30 minutes ago',
    surveyCompleted: true,
    riskLevel: 'high',
    tasksCompleted: 31,
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob.wilson@company.com',
    role: UserRole.MANAGER,
    department: 'Product',
    team: 'Design',
    burnoutScore: 5.4,
    lastActive: '1 day ago',
    surveyCompleted: false,
    riskLevel: 'medium',
    tasksCompleted: 18,
  },
  {
    id: '4',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    role: UserRole.EMPLOYEE,
    department: 'Marketing',
    team: 'Content',
    burnoutScore: 2.1,
    lastActive: '5 minutes ago',
    surveyCompleted: true,
    riskLevel: 'low',
    tasksCompleted: 42,
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@company.com',
    role: UserRole.ADMIN,
    department: 'IT',
    team: 'DevOps',
    burnoutScore: 6.7,
    lastActive: '1 hour ago',
    surveyCompleted: true,
    riskLevel: 'medium',
    tasksCompleted: 15,
  },
];

function UserManagementContent() {
  const { logout } = useAuth();
  const [users, setUsers] = useState<UserWithMetrics[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call with validation
    setTimeout(() => {
      // Validate mock data using Zod
      const validationResult = validateUserArray(mockUsers);

      if (!validationResult.allValid) {
        const errors = validationResult.invalid.map(
          (item) =>
            `User at index ${item.index}: ${item.errors?.map((e: { message: string }) => e.message).join(', ')}`
        );
        setValidationErrors(errors);
      }

      // Use only valid users
      setUsers(validationResult.valid.map((item) => item.data!));
      setIsLoading(false);
    }, 1000);
  }, []);

  // Validate filters when they change
  useEffect(() => {
    const filters: UserFilters = {
      searchTerm,
      department: departmentFilter,
      riskLevel: riskFilter as 'all' | 'low' | 'medium' | 'high',
      role: 'all',
    };

    const validationResult = validateUserFilters(filters);
    if (!validationResult.success) {
      console.warn('Filter validation errors:', validationResult.error.issues);
    }
  }, [searchTerm, departmentFilter, riskFilter]);

  const handleLogout = async () => {
    await logout();
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
      const matchesRisk = riskFilter === 'all' || user.riskLevel === riskFilter;

      return matchesSearch && matchesDepartment && matchesRisk;
    });
  }, [users, searchTerm, departmentFilter, riskFilter]);

  const departments = useMemo(() => {
    const depts = Array.from(new Set(users.map((u) => u.department)));
    return depts.sort();
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar sections={sections.sections} defaultSection={sections.defaultSection} />
      <SidebarInset>
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>User Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <SessionTimer />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div
            className="fade-in"
            style={{
              animationDelay: '0ms',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                </div>
                <p className="text-muted-foreground">
                  Manage user accounts, roles, and monitor burnout metrics
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Data Validation Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">
                        {error}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {users.filter((u) => u.riskLevel === 'high').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Surveys Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter((u) => u.surveyCompleted).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Burnout</CardTitle>
                  <Shield className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(users.reduce((sum, u) => sum + u.burnoutScore, 0) / users.length).toFixed(1)}
                    /10
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search users by name, email, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  View and manage user accounts and their burnout risk levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user, index) => (
                    <div
                      key={`user-${user.id}-${user.email}`}
                      className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeIn 0.3s ease-out forwards',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge
                              variant="outline"
                              className={`${getRoleColor(user.role)} text-white`}
                            >
                              {getUserRoleDisplay(user.role)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">{user.email}</p>
                          <p className="text-muted-foreground text-xs">
                            {user.department} • {user.team} • Last active {user.lastActive}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">Burnout: {user.burnoutScore}/10</div>
                          <div className="text-muted-foreground text-xs">
                            {user.tasksCompleted} tasks completed
                          </div>
                        </div>

                        <Badge variant={getRiskBadgeVariant(user.riskLevel)}>
                          {user.riskLevel} risk
                        </Badge>

                        <div className="flex items-center gap-1">
                          {user.surveyCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>

                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function UserManagementPage() {
  return (
    <AdminRoute requireUserManagement>
      <UserManagementContent />
    </AdminRoute>
  );
}
