'use client';

import { useState } from 'react';
import { SurveyBuilder } from '@/components/survey/builder';
import { SurveyQuestion } from '@/components/survey/form';
import { isApiDataMode, worksightApi } from '@/lib/worksight-api';
import { useSurveyStore } from '@/store/survey-store';

export default function SurveyBuilderPage() {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveSurvey = async (questions: SurveyQuestion[]) => {
    try {
      setSaveStatus('Saving survey...');
      if (isApiDataMode()) {
        const apiQuestions = questions.map((q, idx) => ({
          id: idx,
          question_text: q.title,
          question_subtext: q.subtitle,
          dimension: 'general',
          type: q.type,
          required: q.required ?? false,
          options: q.options,
          min_value: q.min,
          max_value: q.max,
        }));
        await worksightApi.createSurvey({ questions: apiQuestions });
      } else {
        const store = useSurveyStore.getState();
        store.resetSurvey();
      }
      setSaveStatus(`Survey saved successfully with ${questions.length} questions!`);
    } catch (err) {
      console.error('Failed to save survey:', err);
      setSaveStatus('Failed to save survey. Please try again.');
    }
  };

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br p-4">
      {saveStatus && (
        <div className="mx-auto mb-4 max-w-4xl rounded-lg bg-blue-500/10 p-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400">
          {saveStatus}
        </div>
      )}
      <SurveyBuilder onSave={handleSaveSurvey} />
    </div>
  );
}

