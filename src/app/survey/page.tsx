'use client';

import { SurveyForm, SurveyQuestion, SurveyResponse } from '@/components/survey/form';
import { useRouter } from 'next/navigation';

// Employee Burnout and Work Engagement Assessment Tool
const burnoutSurveyQuestions: SurveyQuestion[] = [
  // Basic Information
  {
    id: 'name',
    type: 'text',
    title: "What's your name?",
    subtitle: 'This helps us personalize your experience',
    required: true,
    placeholder: 'Enter your full name',
    defaultValue: 'Test User',
  },
  {
    id: 'email',
    type: 'email',
    title: "What's your email address?",
    subtitle: "We'll use this to save your progress and send you insights",
    required: true,
    placeholder: 'testuser@worksight.app',
    defaultValue: 'testuser@worksight.app',
  },
  {
    id: 'role',
    type: 'radio',
    title: "What's your role?",
    subtitle: 'Select the option that best describes your current position',
    required: true,
    options: ['Employee', 'Team Lead', 'Manager', 'Executive'],
  },

  // Part 1: Workload & Job Demands (6 items; total 6–30)
  {
    id: 'workload_1',
    type: 'scale',
    title: 'I often feel emotionally drained after a typical workday.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'workload_2',
    type: 'scale',
    title: 'My workload feels unmanageable in most weeks.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'workload_3',
    type: 'scale',
    title: "I feel pressured to work faster than I'm comfortable with to meet targets.",
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'workload_4',
    type: 'scale',
    title: 'My job demands a lot of sustained mental and emotional effort.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'workload_5',
    type: 'scale',
    title: "Some days I have so much to do that I don't know where to start.",
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'workload_6',
    type: 'scale',
    title: 'The number of meetings in a typical week prevents me from completing core tasks.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },

  // Part 2: Work–Life Balance & Recovery (5 items; total 5–25)
  {
    id: 'balance_1',
    type: 'scale',
    title: 'I have enough energy for my personal life after work.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'balance_2',
    type: 'scale',
    title: 'I find it hard to switch off from work during my time off.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'balance_3',
    type: 'scale',
    title: 'I feel uneasy about using my leaves or holidays.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'balance_4',
    type: 'scale',
    title: 'Weekends or days off leave me feeling recharged.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'balance_5',
    type: 'scale',
    title: 'My job interferes with responsibilities at home.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },

  // Part 3: Social Support & Autonomy (5 items; total 5–25)
  {
    id: 'support_1',
    type: 'scale',
    title: 'I feel supported by my teammates.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'support_2',
    type: 'scale',
    title: 'My immediate supervisor shows genuine concern for my well-being.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'support_3',
    type: 'scale',
    title: 'I have a say in how I plan and do my work.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'support_4',
    type: 'scale',
    title: 'I often feel isolated at work, even with my team around.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'support_5',
    type: 'scale',
    title: 'I receive regular, constructive feedback that helps me improve.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },

  // Part 4: Personal Accomplishment & Engagement (9 items; total 9–45)
  {
    id: 'engagement_1',
    type: 'scale',
    title: 'I feel proud of the work I accomplish.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'engagement_2',
    type: 'scale',
    title: 'I am enthusiastic about my job.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'engagement_3',
    type: 'scale',
    title: 'My contributions feel meaningful.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'engagement_4',
    type: 'scale',
    title: "I feel I'm making a positive difference for customers or the bank.",
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'engagement_5',
    type: 'scale',
    title: 'I feel detached or indifferent toward my work.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'engagement_6',
    type: 'scale',
    title: 'I have a clear sense of purpose in my role.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'engagement_7',
    type: 'scale',
    title: 'I frequently zone out during work hours.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'engagement_8',
    type: 'scale',
    title: 'My work is appreciated by others.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
  {
    id: 'engagement_9',
    type: 'scale',
    title: 'I feel inspired by my job or colleagues.',
    subtitle:
      'Rate how much you agree with this statement based on your feelings over the past month',
    required: true,
    min: 1,
    max: 5,
  },
];

export default function SurveyPage() {
  const router = useRouter();

  const handleSurveyComplete = (responses: SurveyResponse[]) => {
    // Calculate scores for each dimension according to the Employee Burnout Assessment Tool

    // Helper function to handle reverse scoring
    const reverseScore = (value: number) => 6 - value; // Convert 1-5 to 5-1

    // Part 1: Workload & Job Demands (6 items; total 6–30)
    const workloadItems = [
      'workload_1',
      'workload_2',
      'workload_3',
      'workload_4',
      'workload_5',
      'workload_6',
    ];
    const workloadScore = workloadItems.reduce((sum, item) => {
      const response = responses.find((r) => r.questionId === item);
      return sum + (Number(response?.value) || 1);
    }, 0);

    // Part 2: Work–Life Balance & Recovery (5 items; total 5–50)
    // Items 1 and 4 are reverse-scored
    const balanceItems = [
      { id: 'balance_1', reverse: true },
      { id: 'balance_2', reverse: false },
      { id: 'balance_3', reverse: false },
      { id: 'balance_4', reverse: true },
      { id: 'balance_5', reverse: false },
    ];
    const balanceScore = balanceItems.reduce((sum, item) => {
      const response = responses.find((r) => r.questionId === item.id);
      const value = Number(response?.value) || 1;
      return sum + (item.reverse ? reverseScore(value) : value);
    }, 0);

    // Part 3: Social Support & Autonomy (5 items; total 5–50)
    // Items 1, 2, 3, and 5 are reverse-scored
    const supportItems = [
      { id: 'support_1', reverse: true },
      { id: 'support_2', reverse: true },
      { id: 'support_3', reverse: true },
      { id: 'support_4', reverse: false },
      { id: 'support_5', reverse: true },
    ];
    const supportScore = supportItems.reduce((sum, item) => {
      const response = responses.find((r) => r.questionId === item.id);
      const value = Number(response?.value) || 1;
      return sum + (item.reverse ? reverseScore(value) : value);
    }, 0);

    // Part 4: Personal Accomplishment & Engagement (9 items; total 9–90)
    // Items 1, 2, 3, 4, 6, 8, and 9 are reverse-scored
    const engagementItems = [
      { id: 'engagement_1', reverse: true },
      { id: 'engagement_2', reverse: true },
      { id: 'engagement_3', reverse: true },
      { id: 'engagement_4', reverse: true },
      { id: 'engagement_5', reverse: false },
      { id: 'engagement_6', reverse: true },
      { id: 'engagement_7', reverse: false },
      { id: 'engagement_8', reverse: true },
      { id: 'engagement_9', reverse: true },
    ];
    const engagementScore = engagementItems.reduce((sum, item) => {
      const response = responses.find((r) => r.questionId === item.id);
      const value = Number(response?.value) || 1;
      return sum + (item.reverse ? reverseScore(value) : value);
    }, 0);

    // Calculate overall risk score (weighted average of all dimensions)
    // Higher scores indicate higher risk
    const totalMaxScore = 30 + 25 + 25 + 45; // Maximum possible scores for each dimension (1-5 scale)
    const totalScore = workloadScore + balanceScore + supportScore + engagementScore;
    const overallRiskScore = Math.round((totalScore / totalMaxScore) * 100);

    // Save detailed results to localStorage
    localStorage.setItem(
      'survey_results',
      JSON.stringify({
        overallScore: overallRiskScore,
        workloadScore,
        balanceScore,
        supportScore,
        engagementScore,
        responses,
        completedAt: new Date().toISOString(),
      })
    );

    // Clear the survey progress since it's completed
    localStorage.removeItem('survey_progress');

    // Redirect to results page with detailed scores
    const detailedResults = {
      overall: overallRiskScore,
      workload: workloadScore,
      balance: balanceScore,
      support: supportScore,
      engagement: engagementScore,
    };

    const responsesParam = encodeURIComponent(JSON.stringify(responses));
    const scoresParam = encodeURIComponent(JSON.stringify(detailedResults));
    router.push(`/survey/results?scores=${scoresParam}&responses=${responsesParam}`);
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
