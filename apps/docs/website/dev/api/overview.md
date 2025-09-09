# API Overview

The WorkSight API provides comprehensive access to all platform features through
RESTful endpoints, enabling seamless integration with your existing systems and
custom applications.

## Getting Started

### Base URL

```
Production: https://api.worksight.com/v1
Staging: https://staging-api.worksight.com/v1
Development: http://localhost:3000/api/v1
```

### Authentication

WorkSight API uses API keys for authentication. Include your API key in the
`Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.worksight.com/v1/users
```

### Quick Start

1. **Get your API key** from the Admin Dashboard
2. **Make your first request** to test connectivity
3. **Explore the endpoints** using our interactive documentation
4. **Integrate** with your applications

```javascript
// Example: Get organization health metrics
const response = await fetch('https://api.worksight.com/v1/metrics/health', {
  headers: {
    Authorization: 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
});

const healthData = await response.json();
console.log('Organization health score:', healthData.overallScore);
```

## API Design Principles

### RESTful Architecture

- **Resource-based URLs**: Each endpoint represents a specific resource
- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE for different operations
- **Status Codes**: Standard HTTP status codes for responses
- **JSON Format**: All requests and responses use JSON

### Consistency

- **Naming Conventions**: Consistent parameter and field naming
- **Response Structure**: Standardized response format across all endpoints
- **Error Handling**: Uniform error response structure
- **Versioning**: Clear API versioning strategy

## Authentication & Authorization

### API Key Management

```typescript
interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: Permission[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  expiresAt?: Date;
  lastUsed?: Date;
  active: boolean;
}
```

### Permission Levels

#### Read-Only Access

- View users and organizational data
- Access reports and analytics
- Retrieve survey responses (with appropriate permissions)

#### Read-Write Access

- Create and update users
- Manage surveys and assessments
- Modify organizational settings

#### Admin Access

- Full API access
- User management
- System configuration
- Billing and subscription management

### Rate Limiting

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

Default rate limits:

- **Standard Plan**: 1,000 requests per hour
- **Professional Plan**: 5,000 requests per hour
- **Enterprise Plan**: 10,000 requests per hour

## Core Resources

### Users

Manage user accounts, profiles, and organizational relationships.

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  manager?: string;
  startDate: Date;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Endpoints:**

- `GET /users` - List all users
- `GET /users/{id}` - Get specific user
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Deactivate user

### Surveys

Create, manage, and analyze survey data.

```typescript
interface Survey {
  id: string;
  title: string;
  description: string;
  type: 'burnout' | 'engagement' | 'custom';
  questions: Question[];
  schedule: Schedule;
  status: 'draft' | 'active' | 'completed' | 'archived';
  participantCount: number;
  responseCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Endpoints:**

- `GET /surveys` - List surveys
- `POST /surveys` - Create survey
- `PUT /surveys/{id}` - Update survey
- `POST /surveys/{id}/send` - Send survey to participants
- `GET /surveys/{id}/responses` - Get survey responses

### Assessments

Burnout assessments and well-being evaluations.

```typescript
interface Assessment {
  id: string;
  userId: string;
  surveyId: string;
  responses: Record<string, any>;
  score: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  completedAt: Date;
  analysis: {
    emotionalExhaustion: number;
    depersonalization: number;
    personalAccomplishment: number;
    workLifeBalance: number;
  };
}
```

**Endpoints:**

- `GET /assessments` - List assessments
- `POST /assessments` - Submit assessment
- `GET /assessments/{id}` - Get assessment details
- `GET /users/{userId}/assessments` - Get user's assessments

### Reports

Access analytics and reporting data.

```typescript
interface Report {
  id: string;
  type: 'individual' | 'team' | 'organization';
  title: string;
  data: any;
  generatedAt: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  format: 'json' | 'pdf' | 'excel';
}
```

**Endpoints:**

- `GET /reports` - List available reports
- `POST /reports/generate` - Generate custom report
- `GET /reports/{id}` - Get report data
- `GET /reports/{id}/download` - Download report file

## Request/Response Format

### Standard Response Structure

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    requestId: string;
    timestamp: Date;
    version: string;
  };
}
```

### Success Response Example

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "john.doe@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employee"
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email",
      "constraint": "Must be a valid email address"
    }
  },
  "meta": {
    "requestId": "req_xyz789",
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

## Pagination

### Query Parameters

```
GET /users?page=1&limit=20&sort=createdAt&order=desc
```

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field
- `order`: Sort direction (asc/desc)

### Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Search

### Query Filters

```
GET /users?department=Engineering&role=employee&status=active
```

### Search

```
GET /users?search=john&fields=firstName,lastName,email
```

### Date Ranges

```
GET /assessments?startDate=2024-01-01&endDate=2024-01-31
```

## Webhooks

### Event Types

```typescript
type WebhookEvent =
  | 'user.created'
  | 'user.updated'
  | 'user.deactivated'
  | 'survey.created'
  | 'survey.completed'
  | 'assessment.submitted'
  | 'assessment.high_risk'
  | 'report.generated';
```

### Webhook Payload

```json
{
  "event": "assessment.high_risk",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "assessmentId": "assess_123",
    "userId": "user_456",
    "riskLevel": "high",
    "score": 75,
    "previousScore": 45
  },
  "organization": {
    "id": "org_789",
    "name": "Acme Corp"
  }
}
```

### Configuration

```bash
curl -X POST https://api.worksight.com/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/worksight",
    "events": ["assessment.high_risk", "survey.completed"],
    "secret": "your-webhook-secret"
  }'
```

## SDKs and Libraries

### Official SDKs

#### JavaScript/TypeScript

```bash
npm install @worksight/api-client
```

```javascript
import { WorkSightAPI } from '@worksight/api-client';

const api = new WorkSightAPI({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.worksight.com/v1',
});

// Get organization health
const health = await api.metrics.getHealth();
```

#### Python

```bash
pip install worksight-api
```

```python
from worksight import WorkSightAPI

api = WorkSightAPI(api_key='your-api-key')

# Get all users
users = api.users.list()
```

#### PHP

```bash
composer require worksight/api-client
```

```php
use WorkSight\ApiClient;

$api = new ApiClient('your-api-key');

// Create new survey
$survey = $api->surveys->create([
    'title' => 'Weekly Check-in',
    'type' => 'burnout'
]);
```

## Error Codes

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

### Application Error Codes

```typescript
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
}
```

## Best Practices

### API Usage

1. **Use appropriate HTTP methods** for different operations
2. **Handle rate limits** gracefully with exponential backoff
3. **Validate input data** before sending requests
4. **Cache responses** when appropriate
5. **Use webhooks** for real-time updates instead of polling

### Security

1. **Store API keys securely** - never expose in client-side code
2. **Use HTTPS** for all requests
3. **Validate webhook signatures** to ensure authenticity
4. **Implement proper error handling** without exposing sensitive data
5. **Monitor API usage** for unusual patterns

### Performance

1. **Use pagination** for large result sets
2. **Request only needed fields** using field selection
3. **Batch operations** when possible
4. **Implement caching** for frequently accessed data
5. **Use compression** for large payloads

## Testing

### Test Environment

Use the staging environment for testing:

```
https://staging-api.worksight.com/v1
```

### Postman Collection

Download our Postman collection for easy testing:

```
https://api.worksight.com/docs/postman.json
```

### Sample Data

The staging environment includes sample data for testing:

- 50 test users across 5 departments
- Historical survey responses
- Generated reports and analytics

## Support

### Documentation

- **Interactive API Docs**: <https://api.worksight.com/docs>
- **Changelog**: <https://api.worksight.com/changelog>
- **Status Page**: <https://status.worksight.com>

### Contact

- **Email**: <api-support@worksight.com>
- **Slack**: #api-support in our community Slack
- **GitHub**: <https://github.com/worksight/api-issues>

### SLA

- **Uptime**: 99.9% guaranteed
- **Response Time**: < 200ms average
- **Support Response**: < 24 hours for standard plans, < 4 hours for enterprise

## Next Steps

- [Authentication Guide](./authentication.md) - Detailed authentication setup
- [Survey Endpoints](./survey-endpoints.md) - Survey management API
- [User Management](./user-management.md) - User administration API
- [Webhooks Guide](./webhooks.md) - Real-time event notifications
