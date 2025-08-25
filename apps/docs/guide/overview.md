# API Overview

WorkSight provides a comprehensive REST API for integrating with external systems and building custom applications.

## Base URL

```
Production: https://api.worksight.com
Development: http://localhost:3000/api
```

## Authentication

WorkSight supports multiple authentication methods:

### Bearer Token

```bash
curl -H "Authorization: Bearer your_token_here" \
  https://api.worksight.com/users/me
```

### API Key

```bash
curl -H "X-API-Key: your_api_key_here" \
  https://api.worksight.com/tasks
```

## Rate Limiting

API requests are rate-limited based on your role:

| Role | Requests/Hour | Burst Limit |
|------|---------------|-------------|
| Admin | 10,000 | 500 |
| Manager | 5,000 | 250 |
| Employee | 1,000 | 100 |
| Guest | 100 | 20 |

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {...}
  },
  "timestamp": "2025-01-27T10:00:00Z"
}
```

## Core Endpoints

### Users

- `GET /api/users` - List users
- `GET /api/users/me` - Current user info
- `PUT /api/users/me` - Update profile

### Tasks

- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Surveys

- `POST /api/surveys/submit` - Submit survey
- `GET /api/surveys/results` - Get results
- `GET /api/surveys/history` - Survey history

### Analytics

- `GET /api/analytics/burnout` - Burnout statistics
- `GET /api/analytics/tasks` - Task analytics
- `GET /api/analytics/team` - Team metrics

## SDKs

### JavaScript/TypeScript

```bash
npm install @worksight/api-client
```

```typescript
import { WorkSightAPI } from '@worksight/api-client';

const api = new WorkSightAPI({
  baseURL: 'https://api.worksight.com',
  apiKey: 'your_api_key'
});

// Get user tasks
const tasks = await api.tasks.list();

// Submit survey
const result = await api.surveys.submit({
  responses: {...},
  userId: 'user123'
});
```

### Python

```bash
pip install worksight-api
```

```python
from worksight import WorkSightAPI

api = WorkSightAPI(
    base_url='https://api.worksight.com',
    api_key='your_api_key'
)

# Get burnout analytics
analytics = api.analytics.burnout()
```

## Webhooks

Subscribe to real-time events:

### Available Events

- `survey.completed` - Survey submission
- `task.created` - New task
- `task.updated` - Task status change
- `user.burnout_alert` - High burnout score

### Configuration

```json
{
  "url": "https://your-app.com/webhooks/worksight",
  "events": ["survey.completed", "task.updated"],
  "secret": "your_webhook_secret"
}
```

## OpenAPI Specification

Full API documentation is available in OpenAPI format:

- [View Interactive Docs](https://api.worksight.com/docs)
- [Download OpenAPI JSON](https://api.worksight.com/openapi.json)
