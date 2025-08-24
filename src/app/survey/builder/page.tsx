'use client';

import { SurveyBuilder } from '@/components/survey/builder';
import { SurveyQuestion } from '@/components/survey/form';

export default function SurveyBuilderPage() {
  const handleSaveSurvey = (questions: SurveyQuestion[]) => {
    // Here you would typically:
    // 1. Save to database
    // 2. Generate survey URL
    // 3. Show success message

    alert(`Survey saved with ${questions.length} questions!`);
  };

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <SurveyBuilder onSave={handleSaveSurvey} />
    </div>
  );
}
