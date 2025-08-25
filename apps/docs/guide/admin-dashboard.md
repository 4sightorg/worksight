# Admin Dashboard

The admin dashboard provides comprehensive system management and analytics
capabilities.

## Access Requirements

- **Role**: Admin or Executive
- **Permissions**: System administration rights
- **URL**: `/dashboard/admin`

## Features Overview

### User Management

- Employee directory and roles
- Account creation and deactivation
- Permission management
- Department organization

### System Analytics

- Platform usage statistics
- Performance metrics
- Error monitoring
- Resource utilization

### Wellness Oversight

- Organization-wide burnout trends
- High-risk employee identification
- Intervention recommendations
- Compliance reporting

## User Management

### Employee Directory

View and manage all employees:

```
┌─────────────────────────────────────────────────────────┐
│ Employee Management                                     │
├─────────────┬──────────────┬──────────┬─────────────────┤
│ ID         │ Name          │ Role     │ Department      │
├─────────────┼──────────────┼──────────┼─────────────────┤
│ E001       │ John Santos   │ Exec     │ Infrastructure  │
│ E002       │ Jane Doe      │ Employee │ Engineering     │
│ E003       │ Mike Johnson  │ Manager  │ Data Science    │
└─────────────┴──────────────┴──────────┴─────────────────┘
```

### Role Assignment

Available roles:

- **Admin**: Full system access
- **Executive**: Department-level access
- **Manager**: Team-level access
- **Employee**: Individual access
- **Guest**: Limited read-only access

### Bulk Operations

- **Import Users**: CSV upload
- **Export Data**: User directory export
- **Bulk Role Changes**: Mass permission updates

## System Analytics

### Key Metrics Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ System Overview                                         │
├─────────────┬─────────────┬─────────────┬─────────────┤
│ Total Users │ Active      │ Surveys     │ Tasks       │
│    247      │    198      │    1,023    │    567      │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Uptime      │ Response    │ Errors      │ Storage     │
│   99.9%     │   150ms     │      12     │   2.3GB     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Performance Monitoring

- **Response Times**: API endpoint performance
- **Error Rates**: System reliability metrics
- **User Activity**: Login and usage patterns
- **Database Health**: Query performance and capacity

## Wellness Analytics

### Organization Health

**Burnout Distribution:**

- Low Risk: 60% (147 employees)
- Moderate Risk: 30% (74 employees)
- High Risk: 8% (20 employees)
- Severe Risk: 2% (6 employees)

### Department Breakdown

| Department  | Avg Score | Risk Level | Trend   |
| ----------- | --------- | ---------- | ------- |
| Engineering | 6.2/10    | Moderate   | ↗️ +5%  |
| Sales       | 4.1/10    | Low        | ↘️ -2%  |
| Marketing   | 7.8/10    | High       | ↗️ +12% |

### Early Warning System

Automated alerts for:

- **Sudden score increases** (>20% in 1 week)
- **Team-wide risk elevation**
- **Survey completion drops** (<50% response rate)
- **High-risk individuals** (score >75%)

## System Configuration

### Global Settings

```typescript
// Admin configuration
export const adminConfig = {
  // Survey settings
  survey: {
    defaultFrequency: 'weekly',
    reminderEnabled: true,
    anonymousResponses: true,
  },

  // Security settings
  security: {
    sessionTimeout: 3600000, // 1 hour
    passwordPolicy: 'strong',
    mfaRequired: false,
  },

  // System settings
  system: {
    offlineMode: true,
    dataRetention: 2555, // days
    backupFrequency: 'daily',
  },
};
```

### Environment Management

Control deployment settings:

- **Feature Flags**: Enable/disable features
- **Maintenance Mode**: System-wide maintenance
- **API Rate Limits**: Request throttling
- **Cache Settings**: Performance optimization

## Reporting

### Available Reports

**Wellness Reports:**

- Weekly burnout summaries
- Department risk assessments
- Individual intervention tracking
- Compliance documentation

**Usage Reports:**

- User activity logs
- Feature adoption rates
- Performance benchmarks
- Error analysis

### Export Formats

- **PDF**: Executive summaries
- **CSV**: Raw data exports
- **JSON**: API integrations
- **Excel**: Detailed analytics

## Security Management

### Access Control

- **Role-based permissions**
- **IP allowlisting**
- **Session management**
- **Audit logging**

### Data Protection

- **GDPR compliance**
- **Data anonymization**
- **Backup management**
- **Incident response**

## API Administration

### System API Endpoints

```bash
# Admin endpoints
GET /api/admin/users          # All users
GET /api/admin/analytics      # System metrics
GET /api/admin/reports        # Generate reports
POST /api/admin/maintenance   # System maintenance

# User management
POST /api/admin/users         # Create user
PUT /api/admin/users/:id      # Update user
DELETE /api/admin/users/:id   # Delete user
```

### Rate Limiting

Configure API limits:

```env
ADMIN_RATE_LIMIT=1000
USER_RATE_LIMIT=100
GUEST_RATE_LIMIT=10
```

## Troubleshooting

### Common Issues

**High Burnout Scores:**

1. Review team workloads
2. Check task distribution
3. Analyze survey feedback
4. Implement interventions

**Low Survey Participation:**

1. Check notification settings
2. Review survey frequency
3. Improve communication
4. Incentivize participation

**System Performance:**

1. Monitor database queries
2. Check server resources
3. Review API response times
4. Optimize caching

### Support Contacts

- **Technical Issues**: `tech-support@worksight.com`
- **User Management**: `admin@worksight.com`
- **Emergency**: `emergency@worksight.com`
