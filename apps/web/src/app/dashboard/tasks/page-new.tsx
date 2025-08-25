'use client';

import { useAuth } from '@/auth';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Employees } from '@/data/employees';
import { getEmployeeProductivityStats } from '@/data/work-tracking';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  GripVertical,
  LayoutGrid,
  List,
  Plus,
} from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  storyPoints: number;
}

type ViewMode = 'kanban' | 'table';

// Mock tasks data - in real app this would come from your backend
const initialTasks: Task[] = [
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
  {
    id: '6',
    title: 'Add task drag and drop',
    description: 'Implement kanban board with draggable tasks',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-08-25',
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

const statusOrder: Task['status'][] = ['pending', 'in-progress', 'completed'];

export default function TasksPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Get current user's stats if they're an employee
  const currentEmployee = user
    ? Object.entries(Employees).find(([_, emp]) => emp.email === user.email)
    : null;
  const currentEmployeeStats = currentEmployee
    ? getEmployeeProductivityStats(currentEmployee[0])
    : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const completedTasks = tasks.filter((task) => task.status === 'completed');
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const pendingTasks = tasks.filter((task) => task.status === 'pending');

  const totalStoryPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0);
  const completedStoryPoints = completedTasks.reduce((sum, task) => sum + task.storyPoints, 0);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) {
      setActiveTask(null);
      return;
    }

    // Check if dropping on a status column
    if (over.id === 'pending' || over.id === 'in-progress' || over.id === 'completed') {
      const newStatus = over.id as Task['status'];
      if (activeTask.status !== newStatus) {
        setTasks((prev) =>
          prev.map((task) => (task.id === activeTask.id ? { ...task, status: newStatus } : task))
        );
      }
    } else {
      // Reordering within same status or between tasks
      const overId = over.id as string;
      const overTask = tasks.find((t) => t.id === overId);

      if (overTask && activeTask.id !== overTask.id) {
        setTasks((prev) => {
          const oldIndex = prev.findIndex((t) => t.id === activeTask.id);
          const newIndex = prev.findIndex((t) => t.id === overTask.id);

          const updatedTasks = arrayMove(prev, oldIndex, newIndex);

          // If moving to a different status group, update the status
          if (activeTask.status !== overTask.status) {
            return updatedTasks.map((task) =>
              task.id === activeTask.id ? { ...task, status: overTask.status } : task
            );
          }

          return updatedTasks;
        });
      }
    }

    setActiveTask(null);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const currentIndex = statusOrder.indexOf(task.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...task, status: statusOrder[nextIndex] };
        }
        return task;
      })
    );
  };

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
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center rounded-lg border p-1">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="mr-1 h-4 w-4" />
                  Kanban
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <List className="mr-1 h-4 w-4" />
                  Table
                </Button>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}</div>
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
                  {Math.round((completedTasks.length / tasks.length) * 100)}%
                </div>
                <p className="text-muted-foreground text-xs">Task completion rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Task Views */}
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {viewMode === 'kanban' ? (
              <KanbanView tasks={tasks} onToggleStatus={toggleTaskStatus} />
            ) : (
              <TableView tasks={tasks} onToggleStatus={toggleTaskStatus} />
            )}

            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </ClientOnly>
    </ProtectedRoute>
  );
}

// Kanban Board View
function KanbanView({
  tasks,
  onToggleStatus,
}: {
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
}) {
  const tasksByStatus = {
    pending: tasks.filter((task) => task.status === 'pending'),
    'in-progress': tasks.filter((task) => task.status === 'in-progress'),
    completed: tasks.filter((task) => task.status === 'completed'),
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {statusOrder.map((status) => {
        const statusInfo = statusConfig[status];
        const StatusIcon = statusInfo.icon;
        const statusTasks = tasksByStatus[status];

        return (
          <KanbanColumn
            key={status}
            status={status}
            title={statusInfo.label}
            icon={StatusIcon}
            tasks={statusTasks}
            onToggleStatus={onToggleStatus}
          />
        );
      })}
    </div>
  );
}

// Kanban Column Component
function KanbanColumn({
  status,
  title,
  icon: Icon,
  tasks,
  onToggleStatus,
}: {
  status: string;
  title: string;
  icon: any;
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
}) {
  const { setNodeRef } = useSortable({
    id: status,
  });

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Icon className="h-5 w-5" />
        {title} ({tasks.length})
      </h2>
      <div
        ref={setNodeRef}
        className="border-muted-foreground/25 min-h-[200px] space-y-3 rounded-lg border-2 border-dashed p-4"
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onToggleStatus={onToggleStatus} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

// Table View
function TableView({
  tasks,
  onToggleStatus,
}: {
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks Table</CardTitle>
      </CardHeader>
      <CardContent>
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead className="w-8"></TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Story Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <SortableTableRow key={task.id} task={task} onToggleStatus={onToggleStatus} />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </CardContent>
    </Card>
  );
}

// Sortable Task Card for Kanban
function SortableTaskCard({
  task,
  onToggleStatus,
}: {
  task: Task;
  onToggleStatus: (taskId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onToggleStatus={onToggleStatus} />
    </div>
  );
}

// Sortable Table Row
function SortableTableRow({
  task,
  onToggleStatus,
}: {
  task: Task;
  onToggleStatus: (taskId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusInfo = statusConfig[task.status];

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'bg-muted' : ''}>
      <TableCell>
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="text-muted-foreground h-4 w-4" />
        </div>
      </TableCell>
      <TableCell>
        <Checkbox
          checked={task.status === 'completed'}
          onCheckedChange={() => onToggleStatus(task.id)}
        />
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{task.title}</div>
          <div className="text-muted-foreground text-sm">{task.description}</div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`${statusInfo.color}`}>
          {statusInfo.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={priorityColors[task.priority]}>
          {task.priority}
        </Badge>
      </TableCell>
      <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
      <TableCell>
        <Badge variant="outline">{task.storyPoints} pts</Badge>
      </TableCell>
    </TableRow>
  );
}

// Task Card Component
function TaskCard({
  task,
  onToggleStatus,
  isDragging = false,
}: {
  task: Task;
  onToggleStatus?: (taskId: string) => void;
  isDragging?: boolean;
}) {
  const statusInfo = statusConfig[task.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card
      className={`cursor-pointer transition-shadow hover:shadow-md ${isDragging ? 'rotate-3 shadow-lg' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={() => onToggleStatus(task.id)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
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
