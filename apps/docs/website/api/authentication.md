# Authentication

The WorkSight API uses API key authentication to secure access to your
organization's data and functionality.

## API Key Management

### Creating API Keys

Generate API keys through the Admin Dashboard:

1. Navigate to **Settings > API Keys**
2. Click **Create New API Key**
3. Configure permissions and rate limits
4. Save the generated key securely

```typescript
interface ApiKey {
  id: string;
  name: string;
  key: string; // Only shown once during creation
  keyPrefix: string; // First 8 characters for identification
  permissions: Permission[];
  rateLimit: RateLimit;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  active: boolean;
}
```

### API Key Format

API keys follow a structured format:

```
ws_live_1234567890abcdef1234567890abcdef12345678
│   │    │
│   │    └── Random key data (40 characters)
│   └─────── Environment (live/test)
└─────────── Prefix (ws = WorkSight)
```

## Authentication Methods

### Bearer Token Authentication

Include your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer ws_live_1234567890abcdef..." \
     https://api.worksight.com/v1/users
```

```javascript
const response = await fetch('https://api.worksight.com/v1/users', {
  headers: {
    Authorization: 'Bearer ws_live_1234567890abcdef...',
    'Content-Type': 'application/json',
  },
});
```

### Query Parameter (Not Recommended)

For testing only, you can include the API key as a query parameter:

```bash
curl https://api.worksight.com/v1/users?api_key=ws_live_1234567890abcdef...
```

::: warning Never use query parameter authentication in production. API keys in
URLs may be logged by servers, proxies, or browsers. :::

## Permission System

### Permission Levels

API keys can be configured with granular permissions:

#### Read Permissions

- `users:read` - View user information
- `surveys:read` - Access survey data
- `assessments:read` - View assessment results
- `reports:read` - Access reports and analytics
- `organization:read` - View organizational data

#### Write Permissions

- `users:write` - Create and update users
- `surveys:write` - Create and manage surveys
- `assessments:write` - Submit assessment responses
- `reports:write` - Generate custom reports
- `organization:write` - Modify organizational settings

#### Admin Permissions

- `users:admin` - Full user management including deletion
- `organization:admin` - Complete organizational control
- `api:admin` - Manage API keys and webhooks
- `billing:admin` - Access billing and subscription data

### Permission Examples

```json
{
  "name": "HR Dashboard Integration",
  "permissions": [
    "users:read",
    "assessments:read",
    "reports:read",
    "reports:write"
  ]
}
```

```json
{
  "name": "Survey Management Bot",
  "permissions": ["surveys:read", "surveys:write", "users:read"]
}
```

## Rate Limiting

### Rate Limit Headers

Every API response includes rate limit information:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 3600
```

- `X-RateLimit-Limit`: Maximum requests allowed in the time window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit resets
- `X-RateLimit-Window`: Time window in seconds

### Rate Limit Tiers

#### Standard Tier

- 1,000 requests per hour
- 10,000 requests per day
- Suitable for small integrations

#### Professional Tier

- 5,000 requests per hour
- 50,000 requests per day
- Ideal for medium-scale applications

#### Enterprise Tier

- 10,000 requests per hour
- 100,000 requests per day
- Custom limits available

### Handling Rate Limits

When you exceed rate limits, you'll receive a `429 Too Many Requests` response:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 3600 seconds.",
    "details": {
      "limit": 1000,
      "window": 3600,
      "retryAfter": 3600
    }
  }
}
```

#### Best Practices for Rate Limiting

```javascript
async function makeApiRequest(url, options) {
  try {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      console.log(`Rate limited. Retry after ${retryAfter} seconds`);

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, (retryAfter || 60) * 1000)
      );

      return makeApiRequest(url, options); // Retry
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

## Security Best Practices

### API Key Storage

#### ✅ Secure Storage

```bash
# Environment variables
export WORKSIGHT_API_KEY="ws_live_1234567890abcdef..."

# Configuration files (not in version control)
echo "ws_live_1234567890abcdef..." > /etc/myapp/worksight.key
chmod 600 /etc/myapp/worksight.key
```

#### ❌ Insecure Storage

```javascript
// Never hardcode API keys
const API_KEY = 'ws_live_1234567890abcdef...'; // BAD!

// Never commit keys to version control
const config = {
  apiKey: 'ws_live_1234567890abcdef...', // BAD!
};
```

### Key Rotation

Regularly rotate your API keys:

1. **Generate a new key** in the Admin Dashboard
2. **Update your applications** with the new key
3. **Test thoroughly** to ensure everything works
4. **Deactivate the old key** after successful migration

### Monitoring

Monitor API key usage for security:

- **Unusual traffic patterns** - Sudden spikes in requests
- **Geographic anomalies** - Requests from unexpected locations
- **Permission escalation** - Attempts to access unauthorized resources
- **Error patterns** - High rates of authentication failures

## Environment Management

### Test vs Production Keys

Use different API keys for different environments:

```typescript
const API_CONFIG = {
  development: {
    baseUrl: 'http://localhost:3000/api/v1',
    apiKey: process.env.WORKSIGHT_TEST_API_KEY,
  },
  staging: {
    baseUrl: 'https://staging-api.worksight.com/v1',
    apiKey: process.env.WORKSIGHT_STAGING_API_KEY,
  },
  production: {
    baseUrl: 'https://api.worksight.com/v1',
    apiKey: process.env.WORKSIGHT_LIVE_API_KEY,
  },
};
```

### Key Prefixes

WorkSight uses key prefixes to identify environments:

- `ws_test_` - Test/development environment
- `ws_live_` - Production environment

## Authentication Errors

### Common Error Responses

#### Missing API Key

```http
HTTP/1.1 401 Unauthorized
```

```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "message": "API key is required for this endpoint"
  }
}
```

#### Invalid API Key

```http
HTTP/1.1 401 Unauthorized
```

```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid or has been revoked"
  }
}
```

#### Insufficient Permissions

```http
HTTP/1.1 403 Forbidden
```

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "API key does not have permission to access this resource",
    "details": {
      "required": "users:write",
      "provided": ["users:read", "surveys:read"]
    }
  }
}
```

#### Expired API Key

```http
HTTP/1.1 401 Unauthorized
```

```json
{
  "success": false,
  "error": {
    "code": "API_KEY_EXPIRED",
    "message": "API key has expired",
    "details": {
      "expiredAt": "2024-01-15T00:00:00Z"
    }
  }
}
```

## Advanced Authentication

### IP Allowlisting

Restrict API key usage to specific IP addresses:

```json
{
  "name": "Production Server",
  "permissions": ["users:read", "assessments:write"],
  "ipAllowlist": ["203.0.113.1", "203.0.113.0/24"]
}
```

### Webhook Authentication

Secure webhook endpoints with signature verification:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Express.js middleware
app.use('/webhooks/worksight', (req, res, next) => {
  const signature = req.headers['x-worksight-signature'];
  const isValid = verifyWebhookSignature(
    req.body,
    signature,
    process.env.WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
});
```

### Session-based Authentication (Web Applications)

For web applications, use session-based authentication:

```javascript
// Exchange API key for session token
const session = await fetch('/api/auth/session', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ws_live_1234567890abcdef...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    expiresIn: '1h',
  }),
});

const { token } = await session.json();

// Use session token for subsequent requests
const response = await fetch('/api/users', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Testing Authentication

### Test API Key

Use the test environment to validate your authentication setup:

```bash
curl -H "Authorization: Bearer ws_test_1234567890abcdef..." \
     https://staging-api.worksight.com/v1/auth/test
```

Response:

```json
{
  "success": true,
  "data": {
    "apiKey": {
      "id": "key_123",
      "name": "Test Key",
      "permissions": ["users:read", "surveys:read"],
      "organization": "org_456"
    },
    "user": {
      "id": "user_789",
      "email": "api@company.com",
      "role": "api_user"
    }
  }
}
```

### Authentication Health Check

```bash
# Check if your API key is working
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.worksight.com/v1/health
```

## Migration Guide

### Upgrading from API v1 to v2

When migrating to newer API versions:

1. **Generate new API keys** with v2 permissions
2. **Update base URLs** to include version
3. **Review breaking changes** in the changelog
4. **Test thoroughly** before switching production traffic

### Deprecation Timeline

- **v1**: Supported until December 2024
- **v2**: Current stable version
- **v3**: Beta, general availability Q2 2024

## Next Steps

- [Survey Endpoints](./survey-endpoints.md) - Manage surveys and assessments
- [User Management](./user-management.md) - User administration API
- [Webhooks](./webhooks.md) - Real-time event notifications
- [Rate Limiting Guide](./rate-limiting.md) - Optimize your API usage
