'use client';

import { useAuth } from '@/auth';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Employees } from '@/data/employees';
import { getEmployeeProductivityStats } from '@/data/work-tracking';
import { AlertCircle, CheckCircle, Clock, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  storyPoints: number;
}

// Mock tasks data - in real app this would come from your backend
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement survey results storage',
    description: 'Create Zustand store for survey results with persistence',
    status: 'completed',
    priority: 'high',
    dueDate: '2025-08-24',
    storyPoints: 8,
  },
  {
    id: '2',
    title: 'Fix ESLint warnings',
    description: 'Resolve remaining TypeScript and linting issues',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-08-25',
    storyPoints: 3,
  },
  {
    id: '3',
    title: 'Dashboard navigation improvements',
    description: 'Implement client-side routing for dashboard sections',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-08-26',
    storyPoints: 5,
  },
  {
    id: '4',
    title: 'Mobile responsive design',
    description: 'Ensure dashboard works well on mobile devices',
    status: 'pending',
    priority: 'medium',
    dueDate: '2025-08-28',
    storyPoints: 13,
  },
  {
    id: '5',
    title: 'User authentication improvements',
    description: 'Add password reset and email verification',
    status: 'pending',
    priority: 'low',
    dueDate: '2025-08-30',
    storyPoints: 8,
  },
];

const statusConfig = {
  pending: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Pending' },
  'in-progress': {
    icon: AlertCircle,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: 'In Progress',
  },
  completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Completed' },
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function TasksPage() {
  const { user } = useAuth();

  // Get current user's stats if they're an employee
  const currentEmployee = user
    ? Object.entries(Employees).find(([_, emp]) => emp.email === user.email)
    : null;
  const currentEmployeeStats = currentEmployee
    ? getEmployeeProductivityStats(currentEmployee[0])
    : null;

  const completedTasks = mockTasks.filter((task) => task.status === 'completed');
  const inProgressTasks = mockTasks.filter((task) => task.status === 'in-progress');
  const pendingTasks = mockTasks.filter((task) => task.status === 'pending');

  const totalStoryPoints = mockTasks.reduce((sum, task) => sum + task.storyPoints, 0);
  const completedStoryPoints = completedTasks.reduce((sum, task) => sum + task.storyPoints, 0);

  return (
    <ProtectedRoute>
      <ClientOnly>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
              <p className="text-muted-foreground">Manage your assigned tasks and track progress</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTasks.length}</div>
                <p className="text-muted-foreground text-xs">
                  {totalStoryPoints} story points total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks.length}</div>
                <p className="text-muted-foreground text-xs">{completedStoryPoints} story points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressTasks.length}</div>
                <p className="text-muted-foreground text-xs">Active work items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((completedTasks.length / mockTasks.length) * 100)}%
                </div>
                <p className="text-muted-foreground text-xs">Task completion rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Tasks by Status */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* In Progress */}
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                In Progress ({inProgressTasks.length})
              </h2>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* Pending */}
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-orange-500" />
                Pending ({pendingTasks.length})
              </h2>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* Completed */}
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Completed ({completedTasks.length})
              </h2>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </ProtectedRoute>
  );
}

function TaskCard({ task }: { task: Task }) {
  const statusInfo = statusConfig[task.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox checked={task.status === 'completed'} className="mt-1" />
            <div>
              <CardTitle className="text-sm font-medium leading-tight">{task.title}</CardTitle>
              <p className="text-muted-foreground mt-1 text-xs">{task.description}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            <Badge variant="outline">{task.storyPoints} pts</Badge>
          </div>
          <div className="text-muted-foreground flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
