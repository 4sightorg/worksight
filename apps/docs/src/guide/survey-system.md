# Survey System

The WorkSight Survey System is the core component that provides comprehensive burnout assessment capabilities.

## Overview

The survey system implements a scientifically validated 25-question assessment tool designed to measure four key dimensions of workplace well-being:

1. **Workload & Job Demands** - Emotional exhaustion and work pressure
2. **Work-Life Balance & Recovery** - Ability to disconnect and recharge
3. **Social Support & Autonomy** - Team dynamics and job control
4. **Personal Accomplishment & Engagement** - Sense of purpose and achievement

## Survey Features

### 🎯 1-5 Likert Scale

All assessment questions use a standardized 1-5 Likert scale:

- **1** - Strongly Disagree
- **2** - Disagree  
- **3** - Neutral
- **4** - Agree
- **5** - Strongly Agree

### ⚡ Auto-Advance Functionality

The survey includes intelligent auto-advance features:

- **Scale Questions**: Automatically advance after selection (750ms delay)
- **Radio Questions**: Automatically advance after selection (750ms delay)
- **Visual Feedback**: Clear indication of auto-advance behavior
- **Manual Override**: Users can still navigate manually using Previous/Next buttons

### 📱 Responsive Design

- **Single-Row Layout**: Question on left, answer on right (desktop)
- **Mobile Optimized**: Stacked layout for smaller screens
- **Touch-Friendly**: Optimized button sizes and spacing
- **Keyboard Navigation**: Full keyboard support (1-5 keys, arrow keys)

### 🎨 User Experience

- **Progress Tracking**: Visual progress bar with completion percentage
- **Data Persistence**: Automatic save of responses (localStorage)
- **Resume Capability**: Return to survey where you left off
- **Default Values**: Pre-filled test credentials for development

## Assessment Dimensions

### Workload & Job Demands (6 questions, max 30 points)

Measures emotional exhaustion and work pressure:

- Emotional drain after workday
- Workload manageability
- Time pressure and deadlines
- Mental and emotional effort required
- Task overwhelm
- Meeting interference with core work

**Risk Levels:**

- **Low (6-15)**: Manageable workload, no significant exhaustion
- **Moderate (16-20)**: Some pressure, occasional fatigue
- **High (21-25)**: Significant stress and exhaustion
- **Severe (26-30)**: Overwhelming workload, severe exhaustion

### Work-Life Balance & Recovery (5 questions, max 25 points)

Assesses ability to disconnect and recharge:

- Energy for personal life (reverse scored)
- Difficulty switching off from work
- Unease about taking leave
- Weekend/day-off recovery (reverse scored)
- Work interference with home responsibilities

**Risk Levels:**

- **Low (5-12)**: Healthy work-life balance, effective disconnection
- **Moderate (13-17)**: Some difficulty relaxing, occasional intrusion
- **High (18-21)**: Significant interference, difficulty switching off
- **Severe (22-25)**: Unable to disconnect, severe life interference

### Social Support & Autonomy (5 questions, max 25 points)

Evaluates team dynamics and job control:

- Team support (reverse scored)
- Supervisor concern for well-being (reverse scored)
- Control over work planning (reverse scored)
- Workplace isolation
- Constructive feedback (reverse scored)

**Risk Levels:**

- **Low (5-12)**: Strong support, high autonomy
- **Moderate (13-17)**: Some support/autonomy issues
- **High (18-21)**: Limited support or control
- **Severe (22-25)**: Isolated, no control or support

### Personal Accomplishment & Engagement (9 questions, max 45 points)

Measures sense of purpose and achievement:

- Pride in work accomplishments (reverse scored)
- Job enthusiasm (reverse scored)
- Meaningful contributions (reverse scored)
- Making positive difference (reverse scored)
- Detachment/indifference
- Clear sense of purpose (reverse scored)
- Zoning out during work hours
- Work appreciation by others (reverse scored)
- Inspiration from job/colleagues (reverse scored)

**Risk Levels:**

- **Low (9-22)**: High engagement, strong sense of purpose
- **Moderate (23-31)**: Wavering engagement, questioning value
- **High (32-38)**: Loss of purpose, detachment
- **Severe (39-45)**: Complete detachment, no sense of purpose

## Scoring Algorithm

### Reverse Scoring

Certain questions are reverse-scored to account for positive statements:

```javascript
const reverseScore = (value) => 6 - value; // Convert 1-5 to 5-1
```

### Dimensional Calculations

Each dimension is calculated by summing individual question scores:

```javascript
// Example: Workload dimension
const workloadScore = workloadItems.reduce((sum, item) => {
  const response = responses.find(r => r.questionId === item);
  return sum + (Number(response?.value) || 1);
}, 0);
```

### Overall Risk Score

The overall risk score is calculated as a weighted percentage:

```javascript
const totalMaxScore = 30 + 25 + 25 + 45; // 125 total points
const totalScore = workloadScore + balanceScore + supportScore + engagementScore;
const overallRiskScore = Math.round((totalScore / totalMaxScore) * 100);
```

## Technical Implementation

### Component Architecture

```sh
SurveyForm
├── Question Rendering
│   ├── Text Input
│   ├── Number Input  
│   ├── Radio Selection (with auto-advance)
│   └── Scale Selection (with auto-advance)
├── Navigation Controls
├── Progress Tracking
└── Data Persistence
```

### Key Functions

- `updateScaleResponse()` - Handles scale selections with auto-advance
- `updateRadioResponse()` - Handles radio selections with auto-advance  
- `loadSavedData()` - Restores progress from localStorage
- `saveProgress()` - Persists current responses

### State Management

- Survey responses stored in component state
- Progress saved to localStorage automatically
- Results passed to results page via URL parameters

## Integration

The survey system integrates seamlessly with:

- **Results Page**: Dimensional scoring and risk categorization
- **Admin Dashboard**: Aggregated analytics and reporting
- **Database**: Secure storage of anonymized responses
- **Authentication**: User session management

## Best Practices

### For Administrators

- Regular review of risk level thresholds
- Monitor completion rates and drop-off points
- Analyze dimensional patterns across teams
- Ensure user privacy and data protection

### For Users

- Complete survey in quiet, private environment
- Answer honestly for accurate assessment
- Take time to reflect on each question
- Use results as starting point for well-being discussion

## Customization

The survey system supports customization:

- **Question Content**: Modify question text and subtitles
- **Scoring Thresholds**: Adjust risk level boundaries
- **Visual Design**: Customize colors and layouts
- **Auto-advance Timing**: Configure delay periods
