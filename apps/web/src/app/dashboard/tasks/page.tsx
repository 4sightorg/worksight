'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
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
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Get current user's stats if they're an employee

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const completedTasks = tasks.filter((task) => task.status === 'completed');
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');

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

  const createNewTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(), // Simple ID generation
    };
    setTasks((prev) => [...prev, task]);
    setShowNewTaskDialog(false);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
  };

  return (
    <ProtectedRoute>
      <ClientOnly>
        <SidebarProvider>
          <SidebarInset>
            <div className="flex flex-1 flex-col space-y-6 p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                  <p className="text-muted-foreground">
                    Manage your assigned tasks and track progress
                  </p>
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
                  <Button onClick={() => setShowNewTaskDialog(true)}>
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
                    <p className="text-muted-foreground text-xs">
                      {completedStoryPoints} story points
                    </p>
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
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
                autoScroll={{
                  enabled: false,
                }}
              >
                {viewMode === 'kanban' ? (
                  <KanbanView tasks={tasks} onToggleStatus={toggleTaskStatus} />
                ) : (
                  <TableView
                    tasks={tasks}
                    onToggleStatus={toggleTaskStatus}
                    onUpdateTask={updateTask}
                    editingTaskId={editingTaskId}
                    setEditingTaskId={setEditingTaskId}
                    isDragging={!!activeTask}
                  />
                )}

                <DragOverlay>
                  {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
                </DragOverlay>
              </DndContext>

              {/* New Task Dialog */}
              <NewTaskDialog
                open={showNewTaskDialog}
                onClose={() => setShowNewTaskDialog(false)}
                onSave={createNewTask}
              />
            </div>
          </SidebarInset>
        </SidebarProvider>
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
    <div className="w-full overflow-hidden">
      <div className="grid gap-6 overflow-hidden lg:grid-cols-3">
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
    </div>
  );
}

// Kanban Column Component
import { ComponentType } from 'react';

function KanbanColumn({
  status,
  title,
  icon: Icon,
  tasks,
  onToggleStatus,
}: {
  status: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
}) {
  const { setNodeRef } = useSortable({
    id: status,
  });

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Icon className="h-5 w-5" />
        {title} ({tasks.length})
      </h2>
      <div
        ref={setNodeRef}
        className="border-muted-foreground/25 max-h-[600px] min-h-[200px] space-y-3 overflow-y-auto rounded-lg border-2 border-dashed p-4"
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
  onUpdateTask,
  editingTaskId,
  setEditingTaskId,
  isDragging,
}: {
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  isDragging: boolean;
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
                <SortableTableRow
                  key={task.id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onUpdateTask={onUpdateTask}
                  isEditing={editingTaskId === task.id}
                  setEditing={(editing) => setEditingTaskId(editing ? task.id : null)}
                  disabled={isDragging}
                />
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
  onUpdateTask,
  isEditing,
  setEditing,
  disabled,
}: {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
  disabled: boolean;
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
  const [editValues, setEditValues] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    storyPoints: task.storyPoints,
  });

  const handleSave = () => {
    onUpdateTask(task.id, editValues);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      storyPoints: task.storyPoints,
    });
    setEditing(false);
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'bg-muted' : ''}>
      <TableCell>
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing ${disabled ? 'pointer-events-none opacity-50' : ''}`}
        >
          <GripVertical className="text-muted-foreground h-4 w-4" />
        </div>
      </TableCell>
      <TableCell>
        <Checkbox
          checked={task.status === 'completed'}
          onCheckedChange={() => onToggleStatus(task.id)}
          disabled={disabled || isEditing}
        />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editValues.title}
              onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
              placeholder="Task title"
              className="font-medium"
            />
            <Textarea
              value={editValues.description}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
              placeholder="Task description"
              className="text-sm"
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div onClick={() => !disabled && setEditing(true)} className="cursor-pointer">
            <div className="font-medium">{task.title}</div>
            <div className="text-muted-foreground text-sm">{task.description}</div>
          </div>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editValues.status}
            onValueChange={(value) =>
              setEditValues({ ...editValues, status: value as Task['status'] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge className={`${statusInfo.color}`}>
            {statusInfo.label}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editValues.priority}
            onValueChange={(value) =>
              setEditValues({ ...editValues, priority: value as Task['priority'] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="date"
            value={editValues.dueDate}
            onChange={(e) => setEditValues({ ...editValues, dueDate: e.target.value })}
          />
        ) : (
          new Date(task.dueDate).toLocaleDateString()
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editValues.storyPoints}
            onChange={(e) =>
              setEditValues({ ...editValues, storyPoints: parseInt(e.target.value) || 0 })
            }
            min="0"
            className="w-20"
          />
        ) : (
          <Badge>{task.storyPoints} pts</Badge>
        )}
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
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            <Badge>{task.storyPoints} pts</Badge>
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

// New Task Dialog Component
function NewTaskDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
}) {
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    storyPoints: 1,
  });

  const handleSave = () => {
    if (newTask.title.trim()) {
      onSave(newTask);
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        storyPoints: 1,
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background mx-4 w-full max-w-md rounded-lg p-6">
        <h2 className="mb-4 text-lg font-semibold">Create New Task</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={newTask.status}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, status: value as Task['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value as Task['priority'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Story Points</label>
              <Input
                type="number"
                value={newTask.storyPoints}
                onChange={(e) =>
                  setNewTask({ ...newTask, storyPoints: parseInt(e.target.value) || 1 })
                }
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!newTask.title.trim()}>
            Create Task
          </Button>
        </div>
      </div>
    </div>
  );
}
