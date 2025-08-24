'use client';

import { SurveyForm, SurveyQuestion, SurveyResponse } from '@/components/survey/form';
import { useRouter } from 'next/navigation';

// Sample burnout assessment survey
const burnoutSurveyQuestions: SurveyQuestion[] = [
  {
    id: 'name',
    type: 'text',
    title: "What's your name?",
    subtitle: 'This helps us personalize your experience',
    required: true,
    placeholder: 'Enter your full name',
  },
  {
    id: 'email',
    type: 'email',
    title: "What's your email address?",
    subtitle: "We'll use this to save your progress and send you insights",
    required: true,
    placeholder: 'you@company.com',
  },
  {
    id: 'role',
    type: 'radio',
    title: "What's your role?",
    subtitle: 'Select the option that best describes your current position',
    required: true,
    options: ['Employee', 'Team Lead', 'Manager', 'Executive'],
  },
  {
    id: 'experience',
    type: 'number',
    title: 'How many years of work experience do you have?',
    subtitle: 'Include all professional experience',
    required: true,
    min: 0,
    max: 50,
    placeholder: 'Years of experience',
  },
  {
    id: 'stress_level',
    type: 'scale',
    title: 'How would you rate your current stress level?',
    subtitle: 'Think about your overall stress in the past week',
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: 'work_hours',
    type: 'number',
    title: 'How many hours do you typically work per week?',
    subtitle: 'Include overtime and work you do outside office hours',
    required: true,
    min: 1,
    max: 100,
    placeholder: 'Hours per week',
  },
  {
    id: 'job_satisfaction',
    type: 'scale',
    title: 'How satisfied are you with your current job?',
    subtitle: 'Consider all aspects: work, colleagues, compensation, growth',
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: 'burnout_symptoms',
    type: 'radio',
    title: 'Which burnout symptom affects you most?',
    subtitle: 'Select the one that resonates most with your current experience',
    required: true,
    options: [
      'Emotional exhaustion',
      'Cynicism about work',
      'Feeling ineffective',
      'Physical fatigue',
    ],
  },
  {
    id: 'work_life_balance',
    type: 'scale',
    title: 'Rate your work-life balance',
    subtitle: 'How well do you manage your personal and professional life?',
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: 'additional_thoughts',
    type: 'text',
    title: 'Any additional thoughts about your work experience?',
    subtitle: 'Share anything else that might help us understand your situation (optional)',
    required: false,
    placeholder: 'Your thoughts...',
  },
];

export default function SurveyPage() {
  const router = useRouter();

  const handleSurveyComplete = (responses: SurveyResponse[]) => {
    // Calculate burnout risk score
    const stressLevel = Number(responses.find((r) => r.questionId === 'stress_level')?.value) || 0;
    const jobSatisfaction =
      Number(responses.find((r) => r.questionId === 'job_satisfaction')?.value) || 10;
    const workLifeBalance =
      Number(responses.find((r) => r.questionId === 'work_life_balance')?.value) || 10;
    const workHours = Number(responses.find((r) => r.questionId === 'work_hours')?.value) || 40;

    // Enhanced burnout risk calculation with more sophisticated weighting
    const riskScore = Math.round(
      ((stressLevel * 0.3 +
        (10 - jobSatisfaction) * 0.25 +
        (10 - workLifeBalance) * 0.25 +
        Math.min(workHours / 40, 2) * 0.2) /
        10) *
        100
    );

    // Save responses to localStorage for persistence
    localStorage.setItem(
      'survey_results',
      JSON.stringify({
        score: riskScore,
        responses,
        completedAt: new Date().toISOString(),
      })
    );

    // Clear the survey progress since it's completed
    localStorage.removeItem('survey_progress');

    // Redirect to results page with score and responses
    const responsesParam = encodeURIComponent(JSON.stringify(responses));
    router.push(`/survey/results?score=${riskScore}&responses=${responsesParam}`);
  };

  const handleProgress = (_current: number, _total: number) => {
    // Progress tracking can be used for analytics
  };

  return (
    <div>
      <SurveyForm
        questions={burnoutSurveyQuestions}
        onComplete={handleSurveyComplete}
        onProgress={handleProgress}
      />
    </div>
  );
}
