# User Management

The User Management API allows you to programmatically manage users within your
WorkSight organization, including creating accounts, updating profiles, managing
roles, and handling user lifecycle events.

## Core User Object

```typescript
interface User {
  id: string; // Unique user identifier
  email: string; // Primary email address
  firstName: string; // User's first name
  lastName: string; // User's last name
  displayName?: string; // Optional display name
  avatar?: string; // Profile image URL
  role: UserRole; // User's role in the organization
  department?: string; // Department or team
  jobTitle?: string; // Job title
  employeeId?: string; // Employee identifier
  startDate?: Date; // Employment start date
  status: UserStatus; // Account status
  preferences: UserPreferences; // User settings and preferences
  metadata: Record<string, any>; // Custom fields
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last modification timestamp
  lastLoginAt?: Date; // Last successful login
  organizationId: string; // Organization identifier
}

type UserRole = 'admin' | 'manager' | 'employee' | 'contractor' | 'viewer';

type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_invitation';

interface UserPreferences {
  language: string; // Preferred language (ISO 639-1)
  timezone: string; // Timezone (IANA format)
  emailNotifications: boolean; // Email notification preference
  theme: 'light' | 'dark' | 'auto';
  dashboardLayout: string[]; // Preferred dashboard widgets
}
```

## List Users

Retrieve a paginated list of users in your organization.

### Request

```http
GET /api/v1/users
```

### Query Parameters

| Parameter    | Type    | Description                                | Default  |
| ------------ | ------- | ------------------------------------------ | -------- |
| `page`       | integer | Page number (1-based)                      | `1`      |
| `limit`      | integer | Items per page (1-100)                     | `20`     |
| `search`     | string  | Search term (name, email)                  | -        |
| `role`       | string  | Filter by user role                        | -        |
| `status`     | string  | Filter by user status                      | `active` |
| `department` | string  | Filter by department                       | -        |
| `sort`       | string  | Sort field (`name`, `email`, `created_at`) | `name`   |
| `order`      | string  | Sort order (`asc`, `desc`)                 | `asc`    |

### Example Request

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.worksight.com/v1/users?page=1&limit=10&role=employee&status=active"
```

### Response

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "email": "john.doe@company.com",
        "firstName": "John",
        "lastName": "Doe",
        "displayName": "John D.",
        "role": "employee",
        "department": "Engineering",
        "jobTitle": "Software Engineer",
        "status": "active",
        "preferences": {
          "language": "en",
          "timezone": "America/New_York",
          "emailNotifications": true,
          "theme": "dark"
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-20T14:22:00Z",
        "lastLoginAt": "2024-01-22T09:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 156,
      "totalPages": 16,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Get User

Retrieve detailed information about a specific user.

### Request

```http
GET /api/v1/users/{userId}
```

### Path Parameters

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| `userId`  | string | User ID or email address |

### Example Request

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.worksight.com/v1/users/user_123
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john.doe@company.com",
      "firstName": "John",
      "lastName": "Doe",
      "displayName": "John D.",
      "avatar": "https://cdn.worksight.com/avatars/user_123.jpg",
      "role": "employee",
      "department": "Engineering",
      "jobTitle": "Software Engineer",
      "employeeId": "ENG-001",
      "startDate": "2023-06-01T00:00:00Z",
      "status": "active",
      "preferences": {
        "language": "en",
        "timezone": "America/New_York",
        "emailNotifications": true,
        "theme": "dark",
        "dashboardLayout": ["burnout-score", "recent-surveys", "team-insights"]
      },
      "metadata": {
        "slackId": "U01234567",
        "team": "Platform Team",
        "level": "Senior"
      },
      "createdAt": "2023-05-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:22:00Z",
      "lastLoginAt": "2024-01-22T09:15:00Z",
      "organizationId": "org_456"
    },
    "stats": {
      "surveysCompleted": 12,
      "assessmentScore": 7.2,
      "lastAssessmentAt": "2024-01-18T16:30:00Z",
      "streakDays": 5
    }
  }
}
```

## Create User

Create a new user account in your organization.

### Request

```http
POST /api/v1/users
```

### Request Body

```json
{
  "email": "jane.smith@company.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "employee",
  "department": "Marketing",
  "jobTitle": "Marketing Manager",
  "employeeId": "MKT-003",
  "startDate": "2024-02-01",
  "sendInvitation": true,
  "preferences": {
    "language": "en",
    "timezone": "America/Los_Angeles"
  },
  "metadata": {
    "team": "Growth Team",
    "level": "Manager"
  }
}
```

### Required Fields

- `email` - Must be unique within the organization
- `firstName` - User's first name
- `lastName` - User's last name
- `role` - User role in the organization

### Example Request

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@company.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "employee",
    "department": "Marketing",
    "sendInvitation": true
  }' \
  https://api.worksight.com/v1/users
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_456",
      "email": "jane.smith@company.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "employee",
      "department": "Marketing",
      "status": "pending_invitation",
      "createdAt": "2024-01-23T10:30:00Z",
      "organizationId": "org_456"
    },
    "invitation": {
      "id": "inv_789",
      "token": "inv_tok_abcdef123456",
      "expiresAt": "2024-01-30T10:30:00Z",
      "inviteUrl": "https://app.worksight.com/invite/inv_tok_abcdef123456"
    }
  }
}
```

## Update User

Update an existing user's information.

### Request

```http
PUT /api/v1/users/{userId}
```

### Request Body

```json
{
  "firstName": "Jane",
  "lastName": "Smith-Johnson",
  "department": "Product Marketing",
  "jobTitle": "Senior Marketing Manager",
  "preferences": {
    "theme": "light",
    "emailNotifications": false
  },
  "metadata": {
    "team": "Growth Team",
    "level": "Senior Manager"
  }
}
```

### Example Request

```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "department": "Product Marketing",
    "jobTitle": "Senior Marketing Manager"
  }' \
  https://api.worksight.com/v1/users/user_456
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_456",
      "email": "jane.smith@company.com",
      "firstName": "Jane",
      "lastName": "Smith-Johnson",
      "department": "Product Marketing",
      "jobTitle": "Senior Marketing Manager",
      "status": "active",
      "updatedAt": "2024-01-23T15:45:00Z"
    }
  }
}
```

## Update User Role

Change a user's role within the organization.

### Request

```http
PATCH /api/v1/users/{userId}/role
```

### Request Body

```json
{
  "role": "manager",
  "reason": "Promotion to team lead position"
}
```

### Available Roles

- `admin` - Full system access
- `manager` - Team management and reporting
- `employee` - Standard user access
- `contractor` - Limited access for contractors
- `viewer` - Read-only access

### Example Request

```bash
curl -X PATCH \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "manager",
    "reason": "Promotion to team lead position"
  }' \
  https://api.worksight.com/v1/users/user_456/role
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_456",
      "role": "manager",
      "updatedAt": "2024-01-23T16:00:00Z"
    },
    "roleChange": {
      "previousRole": "employee",
      "newRole": "manager",
      "changedBy": "user_789",
      "reason": "Promotion to team lead position",
      "changedAt": "2024-01-23T16:00:00Z"
    }
  }
}
```

## Update User Status

Activate, deactivate, or suspend a user account.

### Request

```http
PATCH /api/v1/users/{userId}/status
```

### Request Body

```json
{
  "status": "suspended",
  "reason": "Policy violation",
  "notifyUser": false
}
```

### Available Statuses

- `active` - User can access the system
- `inactive` - User account is disabled but can be reactivated
- `suspended` - User account is temporarily suspended
- `pending_invitation` - User has been invited but hasn't activated their
  account

### Example Request

```bash
curl -X PATCH \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive",
    "reason": "Employee left the company",
    "notifyUser": false
  }' \
  https://api.worksight.com/v1/users/user_456/status
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_456",
      "status": "inactive",
      "updatedAt": "2024-01-23T17:00:00Z"
    },
    "statusChange": {
      "previousStatus": "active",
      "newStatus": "inactive",
      "changedBy": "user_789",
      "reason": "Employee left the company",
      "changedAt": "2024-01-23T17:00:00Z"
    }
  }
}
```

## Delete User

Permanently delete a user account and all associated data.

### Request

```http
DELETE /api/v1/users/{userId}
```

### Query Parameters

| Parameter          | Type    | Description                 | Default |
| ------------------ | ------- | --------------------------- | ------- |
| `transfer_data_to` | string  | User ID to transfer data to | -       |
| `confirm`          | boolean | Confirmation flag           | `false` |

### Example Request

```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.worksight.com/v1/users/user_456?confirm=true"
```

### Response

```json
{
  "success": true,
  "data": {
    "deleted": true,
    "userId": "user_456",
    "deletedAt": "2024-01-23T18:00:00Z",
    "dataRetention": {
      "surveysTransferred": 5,
      "reportsArchived": 2,
      "transferredTo": null
    }
  }
}
```

::: warning Data Deletion User deletion is permanent and cannot be undone.
Consider deactivating users instead of deleting them to preserve historical data
and analytics. :::

## Bulk Operations

### Bulk Create Users

Create multiple users in a single request.

```http
POST /api/v1/users/bulk
```

```json
{
  "users": [
    {
      "email": "user1@company.com",
      "firstName": "User",
      "lastName": "One",
      "role": "employee",
      "department": "Engineering"
    },
    {
      "email": "user2@company.com",
      "firstName": "User",
      "lastName": "Two",
      "role": "employee",
      "department": "Design"
    }
  ],
  "sendInvitations": true
}
```

### Bulk Update Users

Update multiple users at once.

```http
PATCH /api/v1/users/bulk
```

```json
{
  "userIds": ["user_123", "user_456", "user_789"],
  "updates": {
    "department": "New Department",
    "metadata": {
      "migrated": true
    }
  }
}
```

## User Invitations

### Send Invitation

Send an invitation to an existing user or create a new user with invitation.

```http
POST /api/v1/users/{userId}/invite
```

```json
{
  "message": "Welcome to our WorkSight organization!",
  "expiresIn": "7d"
}
```

### Resend Invitation

Resend an invitation to a user with pending status.

```http
POST /api/v1/users/{userId}/invite/resend
```

### Cancel Invitation

Cancel a pending invitation.

```http
DELETE /api/v1/users/{userId}/invite
```

## User Search

### Advanced Search

Search users with complex filters.

```http
POST /api/v1/users/search
```

```json
{
  "query": "engineering",
  "filters": {
    "roles": ["employee", "manager"],
    "departments": ["Engineering", "Product"],
    "status": ["active"],
    "startDateRange": {
      "from": "2023-01-01",
      "to": "2023-12-31"
    }
  },
  "sort": {
    "field": "lastLoginAt",
    "order": "desc"
  },
  "page": 1,
  "limit": 20
}
```

## User Statistics

### Get User Statistics

Retrieve usage and engagement statistics for a user.

```http
GET /api/v1/users/{userId}/stats
```

```json
{
  "success": true,
  "data": {
    "engagement": {
      "surveysCompleted": 15,
      "averageCompletionTime": 180,
      "lastSurveyAt": "2024-01-20T10:30:00Z",
      "streakDays": 7
    },
    "wellbeing": {
      "currentScore": 7.2,
      "averageScore": 6.8,
      "trend": "improving",
      "lastAssessmentAt": "2024-01-22T14:00:00Z"
    },
    "activity": {
      "loginCount": 45,
      "lastLoginAt": "2024-01-22T09:15:00Z",
      "sessionDuration": 1200,
      "pageViews": 156
    }
  }
}
```

## User Groups

### Get User Groups

Retrieve groups that a user belongs to.

```http
GET /api/v1/users/{userId}/groups
```

### Add User to Group

Add a user to a specific group.

```http
POST /api/v1/users/{userId}/groups/{groupId}
```

### Remove User from Group

Remove a user from a group.

```http
DELETE /api/v1/users/{userId}/groups/{groupId}
```

## Error Handling

### Common Errors

#### User Not Found

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 'user_999' not found"
  }
}
```

#### Email Already Exists

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "A user with email 'john@company.com' already exists",
    "details": {
      "existingUserId": "user_123"
    }
  }
}
```

#### Invalid Role

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ROLE",
    "message": "Role 'super_admin' is not valid for this organization",
    "details": {
      "validRoles": ["admin", "manager", "employee", "contractor", "viewer"]
    }
  }
}
```

#### Insufficient Permissions

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Cannot modify user with higher privileges",
    "details": {
      "requiredRole": "admin",
      "currentRole": "manager"
    }
  }
}
```

## Best Practices

### User Management

1. **Email Validation**: Always validate email addresses before creating users
2. **Role Assignment**: Use the principle of least privilege when assigning
   roles
3. **Bulk Operations**: Use bulk endpoints for large user imports/updates
4. **Data Transfer**: When deleting users, consider transferring their data to
   another user
5. **Audit Trail**: Keep track of user changes for compliance and debugging

### Performance Optimization

```javascript
// Batch user operations when possible
const users = await Promise.all([
  worksight.users.get('user_1'),
  worksight.users.get('user_2'),
  worksight.users.get('user_3'),
]);

// Better: Use bulk endpoint
const users = await worksight.users.getBulk(['user_1', 'user_2', 'user_3']);
```

### Security Considerations

1. **Sensitive Data**: Never store sensitive information in user metadata
2. **Access Control**: Implement proper role-based access control
3. **Data Retention**: Follow data retention policies when deleting users
4. **Audit Logging**: Log all user management operations

## SDK Examples

### JavaScript/TypeScript

```typescript
import { WorkSight } from '@worksight/sdk';

const worksight = new WorkSight({
  apiKey: process.env.WORKSIGHT_API_KEY,
});

// Create a new user
const newUser = await worksight.users.create({
  email: 'john.doe@company.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'employee',
  department: 'Engineering',
  sendInvitation: true,
});

// Update user preferences
await worksight.users.update('user_123', {
  preferences: {
    theme: 'dark',
    emailNotifications: false,
  },
});

// Search users
const engineers = await worksight.users.search({
  query: 'engineering',
  filters: {
    departments: ['Engineering'],
    roles: ['employee', 'manager'],
  },
});
```

### Python

```python
from worksight import WorkSight

worksight = WorkSight(api_key=os.environ['WORKSIGHT_API_KEY'])

# Create a new user
new_user = worksight.users.create(
    email='john.doe@company.com',
    first_name='John',
    last_name='Doe',
    role='employee',
    department='Engineering',
    send_invitation=True
)

# Update user status
worksight.users.update_status(
    user_id='user_123',
    status='inactive',
    reason='Employee left the company'
)
```

## Next Steps

- [Survey Endpoints](./survey-endpoints.md) - Manage surveys and assessments
- [Reports API](./reports.md) - Generate and access reports
- [Webhooks](./webhooks.md) - Real-time event notifications
- [Organizations](./organizations.md) - Manage organizational settings
