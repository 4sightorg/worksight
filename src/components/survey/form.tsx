'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// Survey question types
export type QuestionType = 'text' | 'number' | 'radio' | 'scale' | 'email';

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  title: string;
  subtitle?: string;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface SurveyResponse {
  questionId: string;
  value: string | number;
}

interface SurveyFormProps {
  questions: SurveyQuestion[];
  onComplete: (responses: SurveyResponse[]) => void;
  onProgress?: (current: number, total: number) => void;
}

export function SurveyForm({ questions, onComplete, onProgress }: SurveyFormProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentResponse = responses[currentQuestion?.id];

  // Storage keys
  const STORAGE_KEY_RESPONSES = 'survey_responses';
  const STORAGE_KEY_INDEX = 'survey_current_index';

  // Storage management functions
  const loadSavedData = useCallback(() => {
    try {
      const savedResponses = localStorage.getItem(STORAGE_KEY_RESPONSES);
      const savedIndex = localStorage.getItem(STORAGE_KEY_INDEX);

      if (savedResponses) {
        setResponses(JSON.parse(savedResponses));
      }

      if (savedIndex) {
        setCurrentIndex(parseInt(savedIndex, 10));
      }
    } catch (error) {
      console.warn('Failed to load saved survey data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveResponsesToStorage = useCallback(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(responses));
    } catch (error) {
      console.warn('Failed to save survey responses:', error);
    }
  }, [isLoaded, responses]);

  const saveIndexToStorage = useCallback(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY_INDEX, currentIndex.toString());
    } catch (error) {
      console.warn('Failed to save survey progress:', error);
    }
  }, [isLoaded, currentIndex]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  // Save responses to localStorage whenever they change
  useEffect(() => {
    saveResponsesToStorage();
  }, [responses, isLoaded, saveResponsesToStorage]);

  // Save current index to localStorage whenever it changes
  useEffect(() => {
    saveIndexToStorage();
  }, [currentIndex, isLoaded, saveIndexToStorage]);

  // Clear localStorage when survey is completed
  const clearSurveyData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_RESPONSES);
      localStorage.removeItem(STORAGE_KEY_INDEX);
    } catch (error) {
      console.warn('Failed to clear survey data:', error);
    }
  }, []);

  // Manual clear progress function
  const clearProgress = useCallback(() => {
    if (confirm('Are you sure you want to clear all progress and start over?')) {
      clearSurveyData();
      setResponses({});
      setCurrentIndex(0);
    }
  }, [clearSurveyData]);

  // Navigation function - go back or to homepage
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      // Go back to previous page if there's history
      router.back();
    } else {
      // Go to homepage if no history (e.g., direct link access)
      router.push('/');
    }
  }, [router]);

  // Auto-focus input when question changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        inputRef.current &&
        currentQuestion?.type !== 'radio' &&
        currentQuestion?.type !== 'scale'
      ) {
        inputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, currentQuestion?.type]);

  // Progress tracking
  useEffect(() => {
    onProgress?.(currentIndex + 1, questions.length);
  }, [currentIndex, questions.length, onProgress]);

  const updateResponse = useCallback((questionId: string, value: string | number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const canProceed = useCallback(() => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    return currentResponse !== undefined && currentResponse !== '';
  }, [currentQuestion, currentResponse]);

  const nextQuestion = useCallback(() => {
    if (!canProceed() || isAnimating) return;

    setIsAnimating(true);

    if (isLastQuestion) {
      // Convert responses to array format
      const responseArray: SurveyResponse[] = Object.entries(responses).map(
        ([questionId, value]) => ({
          questionId,
          value,
        })
      );

      // Clear saved data before completing
      clearSurveyData();

      // Set completion state
      setIsCompleted(true);

      // Call the completion handler
      onComplete(responseArray);

      // Start countdown
      let countdown = 5;
      const countdownInterval = setInterval(() => {
        countdown--;
        setRedirectCountdown(countdown);

        if (countdown <= 0) {
          clearInterval(countdownInterval);
          handleGoBack();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(false);
      }, 150);
    }
  }, [
    canProceed,
    isAnimating,
    isLastQuestion,
    responses,
    onComplete,
    clearSurveyData,
    handleGoBack,
  ]);

  const previousQuestion = useCallback(() => {
    if (currentIndex === 0 || isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev - 1);
      setIsAnimating(false);
    }, 150);
  }, [currentIndex, isAnimating]);

  // Keyboard handling for different question types
  const handleQuestionTypeKeydown = useCallback(
    (e: KeyboardEvent, question: SurveyQuestion) => {
      switch (question.type) {
        case 'number':
          if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            const newValue = (currentResponse?.toString() || '') + e.key;
            updateResponse(question.id, newValue);
          }
          break;

        case 'radio':
          const radioIndex = parseInt(e.key) - 1;
          if (radioIndex >= 0 && radioIndex < (question.options?.length || 0)) {
            e.preventDefault();
            updateResponse(question.id, question.options![radioIndex]);
          }
          break;

        case 'scale':
          let scaleValue = parseInt(e.key);
          const minValue = question.min || 0;
          const maxValue = question.max || 9;

          if (e.key === '0') {
            scaleValue = maxValue;
          }

          if (scaleValue >= minValue && scaleValue <= maxValue) {
            e.preventDefault();
            updateResponse(question.id, scaleValue);
          }
          break;
      }
    },
    [currentResponse, updateResponse]
  );

  // Navigation keyboard handling
  const handleNavigationKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (canProceed()) {
          nextQuestion();
        }
      } else if (e.key === 'ArrowUp' || (e.key === 'Backspace' && !currentResponse)) {
        e.preventDefault();
        previousQuestion();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (canProceed()) {
          nextQuestion();
        }
      }
    },
    [currentResponse, canProceed, nextQuestion, previousQuestion]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating || isCompleted) return;

      const question = currentQuestion;
      if (!question) return;

      handleQuestionTypeKeydown(e, question);
      handleNavigationKeydown(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentQuestion,
    currentResponse,
    isAnimating,
    isCompleted,
    handleQuestionTypeKeydown,
    handleNavigationKeydown,
  ]);

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'text':
      case 'email':
        return (
          <Input
            ref={inputRef}
            type={currentQuestion.type}
            value={currentResponse?.toString() || ''}
            onChange={(e) => updateResponse(currentQuestion.id, e.target.value)}
            placeholder={currentQuestion.placeholder || 'Type your answer...'}
            className="focus:border-primary hover:border-primary/50 h-14 transform border-2 p-4 text-lg transition-all duration-300 focus:scale-[1.02]"
            autoComplete="off"
          />
        );

      case 'number':
        return (
          <Input
            ref={inputRef}
            type="number"
            value={currentResponse?.toString() || ''}
            onChange={(e) => updateResponse(currentQuestion.id, e.target.value)}
            placeholder={currentQuestion.placeholder || 'Enter a number...'}
            className="focus:border-primary hover:border-primary/50 h-14 transform border-2 p-4 text-lg transition-all duration-300 focus:scale-[1.02]"
            min={currentQuestion.min}
            max={currentQuestion.max}
          />
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div
                key={option}
                className={`hover:border-primary transform cursor-pointer rounded-lg border-2 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                  currentResponse === option
                    ? 'border-primary bg-primary/5 scale-[1.02] shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => updateResponse(currentQuestion.id, option)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground bg-muted rounded px-2 py-1 font-mono text-sm transition-all duration-200">
                    {index + 1}
                  </span>
                  <span className="text-lg transition-all duration-200">{option}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'scale':
        const min = currentQuestion.min || 1;
        const max = currentQuestion.max || 10;
        const scaleOptions = Array.from({ length: max - min + 1 }, (_, i) => min + i);

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              {scaleOptions.map((value, index) => (
                <button
                  key={value}
                  onClick={() => updateResponse(currentQuestion.id, value)}
                  className={`hover:border-primary h-12 w-12 transform rounded-full border-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
                    currentResponse === value
                      ? 'border-primary bg-primary text-primary-foreground scale-110 shadow-lg'
                      : 'border-border hover:border-primary/50 hover:shadow-md'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="text-muted-foreground animate-in fade-in text-center text-sm delay-300 duration-500">
              Press {min}-{max} on your keyboard to select
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading state while restoring data
  if (!isLoaded) {
    return (
      <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4 transition-all duration-500 ease-in-out">
        <div className="animate-in fade-in slide-in-from-bottom-4 text-center duration-700">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground animate-in fade-in delay-300 duration-1000">
            Loading survey...
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion || isCompleted) {
    return (
      <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4 transition-all duration-500 ease-in-out">
        <Card className="animate-in fade-in slide-in-from-bottom-6 w-full max-w-md duration-700">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="animate-in zoom-in mb-4 text-6xl delay-200 duration-1000">🎉</div>
              <h2 className="text-primary animate-in fade-in slide-in-from-bottom-4 text-2xl font-bold delay-300 duration-700">
                Survey Completed!
              </h2>
              <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-4 delay-500 duration-700">
                Thank you for taking the time to complete our burnout assessment survey.
              </p>
              <div className="bg-muted animate-in fade-in slide-in-from-bottom-4 rounded-lg p-4 delay-700 duration-700">
                <p className="text-muted-foreground text-sm">
                  Redirecting you back in{' '}
                  <span className="text-primary transform font-bold transition-all duration-300">
                    {redirectCountdown}
                  </span>{' '}
                  seconds...
                </p>
              </div>
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="animate-in fade-in slide-in-from-bottom-4 w-full transition-all delay-900 duration-700 hover:scale-105"
              >
                Go Back Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if we have restored data to show notification
  const hasRestoredData = Object.keys(responses).length > 0 || currentIndex > 0;

  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4 pb-24 transition-all duration-500 ease-in-out">
      <div className="animate-in fade-in slide-in-from-bottom-8 w-full max-w-2xl duration-700">
        {/* Restored data notification */}
        {hasRestoredData && currentIndex === 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 duration-500 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-center text-sm text-blue-600 dark:text-blue-300">
              📋 Your previous progress has been restored
            </p>
          </div>
        )}

        {/* Question card */}
        <Card
          className={`transform transition-all duration-500 ease-in-out ${
            isAnimating
              ? 'translate-y-2 scale-95 opacity-50'
              : 'translate-y-0 scale-100 opacity-100'
          } hover:shadow-lg`}
        >
          <CardContent className="p-8" ref={containerRef}>
            <div className="space-y-6">
              {/* Question header */}
              <div className="animate-in fade-in slide-in-from-left-4 space-y-2 duration-500">
                <h2 className="text-2xl leading-tight font-semibold">
                  {currentQuestion.title}
                  {currentQuestion.required && <span className="text-destructive ml-1">*</span>}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-muted-foreground animate-in fade-in delay-200 duration-300">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>

              {/* Question input */}
              <div className="animate-in fade-in slide-in-from-right-4 space-y-4 delay-100 duration-500">
                {renderQuestion()}
              </div>

              {/* Navigation */}
              <div className="animate-in fade-in slide-in-from-bottom-4 flex items-center justify-between pt-4 delay-300 duration-500">
                <Button
                  variant="ghost"
                  onClick={currentIndex === 0 ? handleGoBack : previousQuestion}
                  className="gap-2 transition-all duration-200 hover:scale-105"
                >
                  {currentIndex === 0 ? (
                    <>
                      <Home className="h-4 w-4" />
                      Back
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </>
                  )}
                </Button>

                <div className="text-muted-foreground animate-pulse text-sm">
                  Press <Kbd>Enter</Kbd> to continue
                </div>

                <Button
                  onClick={nextQuestion}
                  disabled={!canProceed()}
                  className="gap-2 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  {isLastQuestion ? 'Complete' : 'Next'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard hints */}
        <div className="text-muted-foreground animate-in fade-in mt-4 text-center text-sm delay-500 duration-700">
          {currentQuestion.type === 'radio' && (
            <p className="animate-in slide-in-from-bottom-2 duration-500">
              Press 1-{currentQuestion.options?.length} to select an option
            </p>
          )}
          {currentQuestion.type === 'scale' && (
            <p className="animate-in slide-in-from-bottom-2 duration-500">
              Press {currentQuestion.min || 1}-{currentQuestion.max || 10} to rate (0 ={' '}
              {currentQuestion.max || 10})
            </p>
          )}
          {currentQuestion.type === 'number' && (
            <p className="animate-in slide-in-from-bottom-2 duration-500">
              Press 0-9 to enter numbers
            </p>
          )}
          <p className="animate-in slide-in-from-bottom-2 mt-1 delay-200 duration-500">
            Use ↑↓ arrow keys or Enter to navigate
          </p>

          {/* Clear progress button (only show if there's progress to clear) */}
          {(Object.keys(responses).length > 0 || currentIndex > 0) && (
            <button
              onClick={clearProgress}
              className="animate-in fade-in mt-2 text-xs text-red-500 underline transition-colors delay-700 duration-200 hover:text-red-600"
            >
              Clear all progress
            </button>
          )}
        </div>
      </div>

      {/* Sticky Progress bar at bottom */}
      <div className="bg-background/95 border-border animate-in slide-in-from-bottom-4 fixed right-0 bottom-0 left-0 z-50 border-t p-4 backdrop-blur-sm delay-300 duration-700">
        <div className="mx-auto max-w-2xl">
          <div className="text-muted-foreground mb-2 flex justify-between text-sm">
            <span className="transition-all duration-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="transition-all duration-300">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary relative h-2 overflow-hidden rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            >
              <div className="absolute inset-0 -skew-x-12 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
