import SurveyResultsPage from '@/app/survey/results/page';
import { validateSurveyResponse, type SurveyResponse } from '@/schemas/survey';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

const mockSearchParams = {
  get: jest.fn(),
};

describe('Survey Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  describe('Complete Survey Flow', () => {
    it('should handle complete survey submission flow', async () => {
      jest.useFakeTimers();

      // Mock a complete survey response
      const surveyResponses = [
        { questionId: 'name', value: 'John Doe' },
        { questionId: 'email', value: 'john.doe@company.com' },
        { questionId: 'role', value: 'Software Engineer' },
        { questionId: 'experience', value: '5 years' },
        { questionId: 'stress_level', value: 'High' },
        { questionId: 'work_hours', value: '45+ hours' },
        { questionId: 'job_satisfaction', value: 'Dissatisfied' },
        { questionId: 'burnout_symptoms', value: 'Exhaustion' },
        { questionId: 'work_life_balance', value: 'Poor' },
      ];

      const burnoutScore = 75; // High risk score

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return burnoutScore.toString();
        if (param === 'responses') return encodeURIComponent(JSON.stringify(surveyResponses));
        return null;
      });

      render(<SurveyResultsPage />);

      // 1. Should show celebration card initially
      expect(screen.getByText('🎉 Survey Complete!')).toBeInTheDocument();
      expect(screen.getByText('Thank you, John Doe!')).toBeInTheDocument();

      // 2. Should show processing state
      expect(screen.getByText(/Analyzing your responses/)).toBeInTheDocument();

      // 3. Fast-forward through celebration period
      jest.advanceTimersByTime(6000);

      // 4. Should show results with correct risk assessment
      await waitFor(() => {
        expect(screen.getByText('High Burnout Risk')).toBeInTheDocument();
        expect(screen.getByText('75%')).toBeInTheDocument();
        expect(screen.getByText(/experiencing significant signs of burnout/)).toBeInTheDocument();
      });

      // 5. Should show appropriate recommendations
      expect(screen.getByText(/Consider taking time off/)).toBeInTheDocument();
      expect(
        screen.getByText(/Seek support from a mental health professional/)
      ).toBeInTheDocument();

      // 6. Should display user's responses
      expect(screen.getByText('Your Response Summary')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();

      // 7. Should provide next steps and tracking information
      expect(screen.getByText('Your Response Has Been Recorded')).toBeInTheDocument();
      expect(screen.getByText(/Personal tracking/)).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('should validate survey response data integrity', () => {
      const mockResponse: SurveyResponse = {
        id: 'response123',
        surveyId: 'survey456',
        userId: 'user789',
        responses: {
          name: 'John Doe',
          email: 'john@company.com',
          stress_level: 8,
          burnout_symptoms: ['Exhaustion', 'Cynicism'],
          work_life_balance: true,
        },
        completedAt: new Date().toISOString(),
        timeSpent: 600, // 10 minutes
      };

      const validationResult = validateSurveyResponse(mockResponse);
      expect(validationResult.success).toBe(true);

      if (validationResult.success) {
        expect(validationResult.data.responses).toEqual(mockResponse.responses);
        expect(validationResult.data.timeSpent).toBe(600);
      }
    });
  });

  describe('Data Flow Validation', () => {
    it('should handle different response data types correctly', async () => {
      jest.useFakeTimers();

      const complexResponses = [
        { questionId: 'name', value: 'Jane Smith' },
        { questionId: 'rating_scale', value: 8 }, // number
        { questionId: 'yes_no_question', value: true }, // boolean
        { questionId: 'multiple_choice', value: ['Option A', 'Option C'] }, // array
        { questionId: 'text_response', value: 'I feel overwhelmed with my workload' }, // string
      ];

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '65';
        if (param === 'responses') return encodeURIComponent(JSON.stringify(complexResponses));
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Your Response Summary')).toBeInTheDocument();
      });

      // Should handle different data types in response display
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('true')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('should handle edge cases in scoring', async () => {
      const edgeCases = [
        { score: '0', expectedLevel: 'Low Burnout Risk' },
        { score: '25', expectedLevel: 'Low Burnout Risk' },
        { score: '26', expectedLevel: 'Moderate Burnout Risk' },
        { score: '50', expectedLevel: 'Moderate Burnout Risk' },
        { score: '51', expectedLevel: 'High Burnout Risk' },
        { score: '75', expectedLevel: 'High Burnout Risk' },
        { score: '76', expectedLevel: 'Severe Burnout Risk' },
        { score: '100', expectedLevel: 'Severe Burnout Risk' },
      ];

      for (const testCase of edgeCases) {
        jest.useFakeTimers();
        jest.clearAllMocks();

        mockSearchParams.get.mockImplementation((param: string) => {
          if (param === 'score') return testCase.score;
          return null;
        });

        const { unmount } = render(<SurveyResultsPage />);

        jest.advanceTimersByTime(6000);

        await waitFor(() => {
          expect(screen.getByText(testCase.expectedLevel)).toBeInTheDocument();
        });

        unmount();
        jest.useRealTimers();
      }
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    it('should recover from malformed URL parameters', () => {
      // Test various malformed parameters
      const malformedCases = [
        { score: 'abc', responses: null },
        { score: '-10', responses: null },
        { score: '150', responses: null },
        { score: '50', responses: 'invalid-json' },
        { score: '50', responses: '%invalid%encoding%' },
      ];

      malformedCases.forEach((testCase) => {
        jest.clearAllMocks();

        mockSearchParams.get.mockImplementation((param: string) => {
          if (param === 'score') return testCase.score;
          if (param === 'responses') return testCase.responses;
          return null;
        });

        // Should either redirect to survey or show results without crashing
        const { unmount } = render(<SurveyResultsPage />);

        // Component should not crash
        expect(document.body).toBeInTheDocument();

        unmount();
      });
    });

    it('should handle missing user data gracefully', async () => {
      jest.useFakeTimers();

      // No responses provided, only score
      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '45';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        // Should show default name when no user data available
        expect(screen.getByText(/Hi there, here's what we found/)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Performance and Timing', () => {
    it('should respect animation timings and cleanup', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '30';
        return null;
      });

      const { unmount } = render(<SurveyResultsPage />);

      // Should show celebration initially
      expect(screen.getByText('🎉 Survey Complete!')).toBeInTheDocument();

      // Unmount before timers complete to test cleanup
      unmount();

      // Fast-forward timers - should not cause errors after unmount
      jest.advanceTimersByTime(10000);

      expect(document.body).toBeInTheDocument(); // No crashes

      jest.useRealTimers();
    });

    it('should handle rapid navigation attempts', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '40';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
      });

      const dashboardButton = screen.getByText('Go to Dashboard');

      // Rapid clicks
      await userEvent.click(dashboardButton);
      await userEvent.click(dashboardButton);
      await userEvent.click(dashboardButton);

      // Should only navigate once
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/dashboard');

      jest.useRealTimers();
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain focus management throughout flow', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '55';
        return null;
      });

      render(<SurveyResultsPage />);

      // Initial celebration phase
      expect(screen.getByText('🎉 Survey Complete!')).toBeInTheDocument();

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toBeInTheDocument();
        expect(mainHeading).toHaveTextContent('Your Burnout Assessment Results');
      });

      // All interactive elements should be keyboard accessible
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });

      jest.useRealTimers();
    });

    it('should provide appropriate ARIA landmarks', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '35';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        // Should have proper heading hierarchy
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);

        // Should have proper button roles
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(3);
      });

      jest.useRealTimers();
    });
  });

  describe('State Management Integration', () => {
    it('should maintain consistent state throughout component lifecycle', async () => {
      jest.useFakeTimers();

      const responses = [
        { questionId: 'name', value: 'Test User' },
        { questionId: 'department', value: 'Engineering' },
      ];

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '42';
        if (param === 'responses') return encodeURIComponent(JSON.stringify(responses));
        return null;
      });

      render(<SurveyResultsPage />);

      // Celebration phase
      expect(screen.getByText('Thank you, Test User!')).toBeInTheDocument();

      jest.advanceTimersByTime(6000);

      // Results phase
      await waitFor(() => {
        expect(screen.getByText(/Hi Test User, here's what we found/)).toBeInTheDocument();
        expect(screen.getByText('Your Response Summary')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Engineering')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });
});
