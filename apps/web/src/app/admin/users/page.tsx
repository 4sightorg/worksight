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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { logAuditEvent } from '@/lib/audit-store';
import { fetchUsersWithMetricsFromApi } from '@/lib/mvp-api-bridge';
import { getUsersWithMetrics } from '@/lib/mvp-data';
import { isApiDataMode, worksightApi } from '@/lib/worksight-api';
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
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function UserManagementContent() {
  const { user: currentUser, logout } = useAuth();
  const [users, setUsers] = useState<UserWithMetrics[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<'api' | 'fixtures'>('fixtures');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithMetrics | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [formDepartment, setFormDepartment] = useState('engineering');
  const [formTeam, setFormTeam] = useState('Frontend Team');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const applyUsers = (rawUsers: UserWithMetrics[], source: 'api' | 'fixtures') => {
      const validationResult = validateUserArray(rawUsers);

      if (!validationResult.allValid) {
        const errors = validationResult.invalid.map(
          item =>
            `User at index ${item.index}: ${item.errors?.map((e: { message: string }) => e.message).join(', ')}`
        );
        setValidationErrors(errors);
      }

      if (validationResult.valid.length === 0 && rawUsers.length > 0) {
        throw new Error('Employee payloads failed validation; refusing empty fallback');
      }

      if (!cancelled) {
        setDataSource(source);
        setUsers(validationResult.valid.map(item => item.data!));
        setIsLoading(false);
      }
    };

    (async () => {
      if (isApiDataMode()) {
        try {
          const apiUsers = await fetchUsersWithMetricsFromApi();
          applyUsers(apiUsers, 'api');
          return;
        } catch (err) {
          console.warn('API user load failed; falling back to fixtures', err);
        }
      }
      applyUsers(getUsersWithMetrics(), 'fixtures');
    })();

    return () => {
      cancelled = true;
    };
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

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole(UserRole.EMPLOYEE);
    setFormDepartment('engineering');
    setFormTeam('Frontend Team');
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (targetUser: UserWithMetrics) => {
    setEditingUser(targetUser);
    setFormName(targetUser.name);
    setFormEmail(targetUser.email);
    setFormRole(targetUser.role);
    setFormDepartment(targetUser.department || 'engineering');
    setFormTeam(targetUser.team || 'Frontend Team');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      toast.error('Please enter name and email');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isApiDataMode()) {
        await worksightApi.createUser({
          name: formName,
          email: formEmail,
          role: formRole,
          department: [formDepartment as unknown as 'engineering'],
        });
      }

      const newUser: UserWithMetrics = {
        id: `user-${Date.now()}`,
        name: formName,
        email: formEmail,
        role: formRole,
        department: formDepartment,
        team: formTeam,
        burnoutScore: 2.5,
        lastActive: 'Just now',
        surveyCompleted: false,
        riskLevel: 'low',
        tasksCompleted: 0,
      };

      setUsers(prev => [newUser, ...prev]);

      logAuditEvent({
        actor: currentUser?.email || 'admin@worksight.com',
        action: 'USER_CREATE',
        target: `User: ${formName} (${formEmail})`,
        details: `Created new user with role ${formRole} in ${formDepartment}`,
        status: 'success',
      });

      toast.success(`User ${formName} created successfully!`);
      setIsAddModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Failed to create user via API:', err);
      toast.error('Failed to create user on Nest API, added locally');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!formName.trim() || !formEmail.trim()) {
      toast.error('Please enter name and email');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isApiDataMode()) {
        await worksightApi.patchUser(editingUser.id, {
          name: formName,
          email: formEmail,
          role: formRole,
        });
      }

      const updatedUser: UserWithMetrics = {
        ...editingUser,
        name: formName,
        email: formEmail,
        role: formRole,
        department: formDepartment,
        team: formTeam,
      };

      setUsers(prev => prev.map(u => (u.id === editingUser.id ? updatedUser : u)));

      logAuditEvent({
        actor: currentUser?.email || 'admin@worksight.com',
        action: 'USER_UPDATE',
        target: `User: ${formName} (${formEmail})`,
        details: `Updated role to ${formRole}, department to ${formDepartment}`,
        status: 'info',
      });

      toast.success(`User ${formName} updated successfully!`);
      setEditingUser(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update user via API:', err);
      toast.error('Failed to update user on Nest API');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (targetUser: UserWithMetrics) => {
    if (!confirm(`Are you sure you want to delete ${targetUser.name}?`)) return;

    try {
      if (isApiDataMode()) {
        await worksightApi.deleteUser(targetUser.id);
      }

      setUsers(prev => prev.filter(u => u.id !== targetUser.id));

      logAuditEvent({
        actor: currentUser?.email || 'admin@worksight.com',
        action: 'USER_DELETE',
        target: `User: ${targetUser.name} (${targetUser.email})`,
        details: `Deleted user account ${targetUser.id}`,
        status: 'warning',
      });

      toast.success(`User ${targetUser.name} deleted`);
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast.error('Failed to delete user on API');
    }
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
    return users.filter(user => {
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
    const depts = Array.from(new Set(users.map(u => u.department).filter(Boolean)));
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
          <div className="fade-in" style={{ animationDelay: '0ms' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <Badge variant="outline">
                      data: {dataSource === 'api' ? 'Nest API' : 'common fixtures'}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Manage user accounts, roles, and monitor burnout metrics
                </p>
              </div>
              <Button onClick={openAddModal}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Card className="border-red-200 bg-red-50 mt-4">
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
            <div className="grid gap-4 mt-6 md:grid-cols-4">
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
                    {users.filter(u => u.riskLevel === 'high').length}
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
                    {users.filter(u => u.surveyCompleted).length}
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
                    {users.length > 0
                      ? (users.reduce((sum, u) => sum + u.burnoutScore, 0) / users.length).toFixed(1)
                      : '0.0'}
                    /10
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mt-6">
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
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
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
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  View and manage user accounts and their burnout risk levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((u, index) => (
                    <div
                      key={`user-${u.id}-${u.email}`}
                      className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeIn 0.3s ease-out forwards',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {u.name
                              ?.split(' ')
                              .map(n => n[0])
                              .join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{u.name}</h3>
                            <Badge
                              variant="outline"
                              className={`${getRoleColor(u.role)} text-white`}
                            >
                              {getUserRoleDisplay(u.role)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">{u.email}</p>
                          <p className="text-muted-foreground text-xs">
                            {u.department} • {u.team} • Last active {u.lastActive}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">Burnout: {u.burnoutScore}/10</div>
                          <div className="text-muted-foreground text-xs">
                            {u.tasksCompleted} tasks completed
                          </div>
                        </div>

                        <Badge variant={getRiskBadgeVariant(u.riskLevel)}>
                          {u.riskLevel} risk
                        </Badge>

                        <div className="flex items-center gap-1">
                          {u.surveyCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => openEditModal(u)} title="Edit User">
                          <Edit3 className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditModal(u)}>
                              <Edit3 className="mr-2 h-4 w-4" /> Edit Account
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteUser(u)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add User Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <Card className="w-full max-w-lg bg-background">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-bold">Add New User</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <form onSubmit={handleCreateUser}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g. John Doe"
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g. john@worksight.com"
                          value={formEmail}
                          onChange={e => setFormEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={formRole}
                            onValueChange={(val: UserRole) => setFormRole(val)}
                          >
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={UserRole.EMPLOYEE}>Employee</SelectItem>
                              <SelectItem value={UserRole.TEAM_LEAD}>Team Lead</SelectItem>
                              <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            placeholder="e.g. engineering"
                            value={formDepartment}
                            onChange={e => setFormDepartment(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team">Team Name</Label>
                        <Input
                          id="team"
                          placeholder="e.g. Frontend Team"
                          value={formTeam}
                          onChange={e => setFormTeam(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <div className="flex justify-end gap-2 p-6 pt-0">
                      <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create User'}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <Card className="w-full max-w-lg bg-background">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-bold">Edit User Profile</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <form onSubmit={handleUpdateUser}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input
                          id="edit-name"
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">Email Address</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={formEmail}
                          onChange={e => setFormEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-role">Role</Label>
                          <Select
                            value={formRole}
                            onValueChange={(val: UserRole) => setFormRole(val)}
                          >
                            <SelectTrigger id="edit-role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={UserRole.EMPLOYEE}>Employee</SelectItem>
                              <SelectItem value={UserRole.TEAM_LEAD}>Team Lead</SelectItem>
                              <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-department">Department</Label>
                          <Input
                            id="edit-department"
                            value={formDepartment}
                            onChange={e => setFormDepartment(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-team">Team Name</Label>
                        <Input
                          id="edit-team"
                          value={formTeam}
                          onChange={e => setFormTeam(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <div className="flex justify-end gap-2 p-6 pt-0">
                      <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
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
