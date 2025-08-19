"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/store/auth-store"
import { sections } from "@/data/sections"
import { LogOut, Plus, Search, CheckSquare, Clock, AlertCircle, GripVertical } from "lucide-react"
import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  estimatedHours: number
  order: number
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Implement user authentication",
    description: "Set up Supabase auth with OAuth providers and offline fallback",
    status: "completed",
    priority: "high",
    dueDate: "2025-08-20",
    estimatedHours: 8,
    order: 0
  },
  {
    id: "2", 
    title: "Design task management interface",
    description: "Create a clean, intuitive interface for managing work tasks",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-08-21",
    estimatedHours: 6,
    order: 1
  },
  {
    id: "3",
    title: "Add burnout tracking metrics",
    description: "Implement features to track and analyze work burnout patterns",
    status: "todo",
    priority: "high",
    dueDate: "2025-08-23",
    estimatedHours: 12,
    order: 2
  },
  {
    id: "4",
    title: "Setup CI/CD pipeline",
    description: "Configure automated testing and deployment workflows",
    status: "todo",
    priority: "low",
    dueDate: "2025-08-25",
    estimatedHours: 4,
    order: 3
  }
]

interface SortableTaskProps {
  task: Task
  onTaskUpdate: (id: string, updates: Partial<Task>) => void
}

function SortableTask({ task, onTaskUpdate }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const [isEditing, setIsEditing] = useState<string | null>(null)

  const handleFieldUpdate = (field: keyof Task, value: any) => {
    onTaskUpdate(task.id, { [field]: value })
    setIsEditing(null)
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "todo":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            {isEditing === 'title' ? (
              <Input
                defaultValue={task.title}
                onBlur={(e) => handleFieldUpdate('title', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFieldUpdate('title', e.currentTarget.value)
                  }
                  if (e.key === 'Escape') {
                    setIsEditing(null)
                  }
                }}
                autoFocus
                className="text-sm font-medium"
              />
            ) : (
              <h4 
                className="font-medium text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded flex-1"
                onClick={() => setIsEditing('title')}
              >
                {task.title}
              </h4>
            )}
          </div>

          {/* Description */}
          {isEditing === 'description' ? (
            <Input
              defaultValue={task.description}
              onBlur={(e) => handleFieldUpdate('description', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFieldUpdate('description', e.currentTarget.value)
                }
                if (e.key === 'Escape') {
                  setIsEditing(null)
                }
              }}
              autoFocus
              className="text-xs"
            />
          ) : (
            <p 
              className="text-xs text-muted-foreground cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
              onClick={() => setIsEditing('description')}
            >
              {task.description}
            </p>
          )}

          {/* Status and Priority Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select
                value={task.status}
                onValueChange={(value) => handleFieldUpdate('status', value)}
              >
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={task.priority}
                onValueChange={(value) => handleFieldUpdate('priority', value)}
              >
                <SelectTrigger className="w-24 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              <span>{task.estimatedHours}h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TasksContent() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [tasks, setTasks] = useState<Task[]>(mockTasks.sort((a, b) => a.order - b.order))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleLogout = async () => {
    await logout()
  }

  const handleTaskUpdate = (id: string, updates: Partial<Task>) => {
    setTasks(tasks => 
      tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex(task => task.id === active.id)
        const newIndex = tasks.findIndex(task => task.id === over?.id)
        
        const newTasks = arrayMove(tasks, oldIndex, newIndex)
        // Update order property
        return newTasks.map((task, index) => ({ ...task, order: index }))
      })
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === "todo"),
    "in-progress": filteredTasks.filter(t => t.status === "in-progress"),
    completed: filteredTasks.filter(t => t.status === "completed")
  }

  return (
    <SidebarProvider>
      <AppSidebar
        sections={sections.sections}
        defaultSection={sections.defaultSection}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tasks</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden md:inline text-sm text-muted-foreground">
              {user?.email}
            </span>
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tasks</h1>
              <p className="text-muted-foreground mt-1">
                Drag to reorder • Click to edit • Use dropdowns to change status
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Task Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredTasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasksByStatus["in-progress"].length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{tasksByStatus.completed.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* All Tasks - Single Column with Drag and Drop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                All Tasks
                <Badge variant="secondary" className="ml-auto">
                  {filteredTasks.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Drag tasks to reorder, click to edit inline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No tasks found
                      </p>
                    ) : (
                      filteredTasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onTaskUpdate={handleTaskUpdate}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <TasksContent />
    </ProtectedRoute>
  )
}
