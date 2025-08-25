# Task Management

WorkSight provides comprehensive task management features integrated with wellness tracking.

## Overview

The task management system includes:

- **Kanban Boards**: Visual task organization
- **Table Views**: Detailed task management
- **Drag-and-Drop**: Intuitive task status updates
- **Real-time Sync**: Collaborative task updates

## Task Structure

Each task contains:

- **Title**: Brief description
- **Description**: Detailed information
- **Status**: `pending`, `in-progress`, `completed`
- **Priority**: `low`, `medium`, `high`
- **Due Date**: Target completion date
- **Story Points**: Effort estimation (1-21)
- **Assigned To**: User responsible for task
- **Created By**: Task creator

## Views

### Kanban Board

Visual workflow management:

```
┌─────────────┬─────────────┬─────────────┐
│   Pending   │ In Progress │  Completed  │
├─────────────┼─────────────┼─────────────┤
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │
│ │ Task A  │ │ │ Task B  │ │ │ Task C  │ │
│ │ High    │ │ │ Medium  │ │ │ Low     │ │
│ │ 5 pts   │ │ │ 3 pts   │ │ │ 2 pts   │ │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │
└─────────────┴─────────────┴─────────────┘
```

### Table View

Detailed task information:

| Title | Status | Priority | Due Date | Points | Actions |
|-------|--------|----------|----------|---------|---------|
| Task A | Pending | High | 2025-02-01 | 5 | Edit/Delete |
| Task B | In Progress | Medium | 2025-02-03 | 3 | Edit/Delete |

## Creating Tasks

### From Dashboard

1. Click "New Task" button
2. Fill in task details:
   - Title (required)
   - Description
   - Priority level
   - Due date
   - Story points
3. Assign to team member
4. Save task

### API Creation

```typescript
const newTask = await tasksApi.create({
  title: "Implement user authentication",
  description: "Add login/logout functionality",
  status: "pending",
  priority: "high",
  due_date: "2025-02-15",
  story_points: 8,
  assigned_to: userId,
  created_by: currentUserId
});
```

## Task Operations

### Drag-and-Drop (Kanban)

- **Status Change**: Drag task between columns
- **Reordering**: Drag within same column
- **Visual Feedback**: Hover states and animations

### Inline Editing (Table)

- **Click to Edit**: Click on task row to edit
- **Save/Cancel**: Confirm or discard changes
- **Real-time Updates**: Changes sync immediately

### Bulk Operations

- **Select Multiple**: Checkbox selection
- **Bulk Status Update**: Change multiple task statuses
- **Bulk Assignment**: Reassign multiple tasks

## Filtering & Search

### Available Filters

- **Status**: Filter by task status
- **Priority**: Filter by priority level
- **Assignee**: Filter by assigned user
- **Due Date**: Filter by date range

### Search

- **Text Search**: Search in title and description
- **Advanced Search**: Multiple criteria
- **Saved Searches**: Save common search queries

## Task Analytics

### Individual Stats

- **Completion Rate**: Percentage of completed tasks
- **Average Time**: Time from creation to completion
- **Workload Distribution**: Tasks by priority/status

### Team Analytics

- **Team Productivity**: Collective completion rates
- **Burnout Correlation**: Task load vs. wellness scores
- **Capacity Planning**: Story point velocity

## Integration with Wellness

### Workload Impact

- **High task volume** contributes to burnout scores
- **Overdue tasks** increase stress indicators
- **Story point tracking** helps measure workload

### Automatic Recommendations

Based on task metrics:

- **Workload balancing** suggestions
- **Task prioritization** advice
- **Break recommendations** for heavy workloads

## Permissions

### Role-Based Access

**Employees:**

- View own tasks
- Update task status
- Add time logs

**Managers:**

- View team tasks
- Assign/reassign tasks
- Create new tasks
- Delete tasks

**Executives:**

- View all tasks
- Department analytics
- Resource allocation insights

## Configuration

### Task Settings

```typescript
// Task configuration
export const taskConfig = {
  storyPoints: [1, 2, 3, 5, 8, 13, 21],
  priorities: ['low', 'medium', 'high'],
  statuses: ['pending', 'in-progress', 'completed'],
  autoArchiveDays: 30
};
```

### API Endpoints

```
GET /api/tasks          # Get tasks
POST /api/tasks         # Create task
PUT /api/tasks/:id      # Update task
DELETE /api/tasks/:id   # Delete task
```
