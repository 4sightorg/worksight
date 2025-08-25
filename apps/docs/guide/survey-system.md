# Survey System

WorkSight's survey system is designed to track employee wellness and identify burnout risk factors.

## Overview

The survey system consists of:

- **Wellness Assessments**: Regular surveys to gauge employee well-being
- **Burnout Scoring**: Algorithmic assessment of burnout risk levels
- **Personalized Recommendations**: Actionable advice based on results
- **Historical Tracking**: Long-term wellness trend analysis

## How It Works

### 1. Survey Questions

The system includes validated questions covering:

- **Workload**: Volume and complexity of work
- **Work-Life Balance**: Time management and personal life
- **Support**: Team and organizational support
- **Engagement**: Job satisfaction and motivation

### 2. Scoring Algorithm

Each response is weighted and contributes to:

- **Individual dimension scores** (0-100 scale)
- **Overall burnout score** (0-100 scale)
- **Risk level classification**:
  - Low Risk (0-25%)
  - Moderate Risk (26-50%)  
  - High Risk (51-75%)
  - Severe Risk (76-100%)

### 3. Recommendations

Based on scores, the system provides:

- **Immediate actions** for high-risk individuals
- **Preventive measures** for moderate risk
- **Maintenance strategies** for low risk

## Taking a Survey

### For Employees

1. Navigate to `/survey` or click "Take Survey" from dashboard
2. Complete all required questions honestly
3. Submit when finished
4. View results immediately at `/survey/results`

### Survey Frequency

- **Default**: Weekly reminders
- **Configurable**: Daily, weekly, or monthly in settings
- **On-demand**: Available anytime from dashboard

## Viewing Results

### Individual Results

Accessible at `/dashboard/wellness`:

- Current burnout level with visual indicators
- Breakdown by dimension (workload, balance, support, engagement)
- Historical trends over time
- Personalized recommendations

### Manager View

Managers can see:

- Team average scores
- High-risk team members
- Department comparisons
- Trend analysis

## Privacy & Confidentiality

- **Individual responses** are confidential
- **Only aggregated data** is shared with managers
- **No personal details** in team reports
- **GDPR compliant** data handling

## API Integration

For custom integrations:

```javascript
// Submit survey response
const response = await surveyApi.submit(userId, responses, burnoutScore);

// Get user's survey history
const history = await surveyApi.getByUserId(userId);
```

## Configuration

### Admin Settings

Administrators can configure:

- Survey frequency defaults
- Question sets and weights
- Risk level thresholds
- Notification settings

### Environment Variables

```env
# Survey configuration
NEXT_PUBLIC_SURVEY_ENABLED=true
NEXT_PUBLIC_MIN_SURVEY_INTERVAL=86400000
```
