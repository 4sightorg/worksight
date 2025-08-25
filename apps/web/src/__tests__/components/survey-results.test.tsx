import SurveyResultsPage from '@/app/survey/results/page';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Mock Next.js navigation hooks
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

describe('SurveyResultsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  describe('Celebration Card Flow', () => {
    it('should show celebration card initially when score is provided', async () => {
      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '25';
        if (param === 'responses')
          return encodeURIComponent(JSON.stringify([{ questionId: 'name', value: 'John Doe' }]));
        return null;
      });

      render(<SurveyResultsPage />);

      // Should show celebration card initially
      expect(screen.getByText('🎉 Survey Complete!')).toBeInTheDocument();
      expect(screen.getByText(/Thank you,.*John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/Your responses have been recorded/)).toBeInTheDocument();
    });

    it('should show progress bar during processing', async () => {
      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '25';
        return null;
      });

      render(<SurveyResultsPage />);

      // Should show progress bar
      expect(screen.getByText(/Analyzing your responses/)).toBeInTheDocument();

      // Check for progress bar element
      const progressBar = document.querySelector('.progress-bar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should transition to results after celebration period', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '25';
        return null;
      });

      render(<SurveyResultsPage />);

      // Initially shows celebration
      expect(screen.getByText('🎉 Survey Complete!')).toBeInTheDocument();

      // Fast-forward time to after celebration period
      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Your Burnout Assessment Results')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Score Parameter Validation', () => {
    it('should redirect to survey page when no score is provided', () => {
      mockSearchParams.get.mockReturnValue(null);

      render(<SurveyResultsPage />);

      // Should redirect since no score provided - check that router.push was called
      expect(mockPush).toHaveBeenCalledWith('/survey');
    });

    it('should handle invalid score parameter gracefully', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return 'invalid';
        return null;
      });

      render(<SurveyResultsPage />);

      // Should show celebration card initially even with invalid score
      expect(screen.getByText('🎉 Survey Complete!')).toBeInTheDocument();

      // Fast-forward to see what happens with NaN score
      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        // With NaN score, it will likely fall into the severe category or error
        expect(screen.getByText('Your Burnout Assessment Results')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Burnout Level Classification', () => {
    it('should display low burnout risk for score <= 25', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '20';
        return null;
      });

      render(<SurveyResultsPage />);

      // Fast-forward past celebration period
      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Low Burnout Risk')).toBeInTheDocument();
        expect(screen.getByText('20%')).toBeInTheDocument();
        expect(screen.getByText(/managing stress well/)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should display moderate burnout risk for score 26-50', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '40';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Moderate Burnout Risk')).toBeInTheDocument();
        expect(screen.getByText('40%')).toBeInTheDocument();
        expect(screen.getByText(/showing some signs of stress/)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should display high burnout risk for score 51-75', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '65';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('High Burnout Risk')).toBeInTheDocument();
        expect(screen.getByText('65%')).toBeInTheDocument();
        expect(screen.getByText(/experiencing significant signs/)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should display severe burnout risk for score > 75', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '85';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Severe Burnout Risk')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument();
        expect(screen.getByText(/serious signs of burnout/)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Recommendations Display', () => {
    it('should display appropriate recommendations for low risk', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '15';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Personalized Recommendations')).toBeInTheDocument();
        expect(
          screen.getByText(/Continue maintaining your current healthy habits/)
        ).toBeInTheDocument();
        expect(screen.getByText(/Stay aware of early warning signs/)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should display appropriate recommendations for high risk', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '70';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText(/Consider taking time off/)).toBeInTheDocument();
        expect(
          screen.getByText(/Seek support from a mental health professional/)
        ).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Response Summary Display', () => {
    it('should display user responses when provided', async () => {
      jest.useFakeTimers();

      const responses = [
        { questionId: 'name', value: 'John Doe' },
        { questionId: 'email', value: 'john@example.com' },
        { questionId: 'role', value: 'Developer' },
        { questionId: 'stress_level', value: 'High' },
      ];

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '60';
        if (param === 'responses') return encodeURIComponent(JSON.stringify(responses));
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Your Response Summary')).toBeInTheDocument();
        expect(screen.getByText('Name:')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Role:')).toBeInTheDocument();
        expect(screen.getByText('Developer')).toBeInTheDocument();
        expect(screen.getByText('Stress Level:')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should handle malformed responses parameter gracefully', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '30';
        if (param === 'responses') return 'invalid-json';
        return null;
      });

      // Spy on console.warn to check if error is logged
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
        // Mock implementation to suppress console warnings during tests
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Your Burnout Assessment Results')).toBeInTheDocument();
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse responses:', expect.any(Error));

      consoleSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe('Navigation Actions', () => {
    beforeEach(async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '50';
        return null;
      });

      render(<SurveyResultsPage />);

      // Fast-forward to results view
      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText('Your Burnout Assessment Results')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should navigate to survey page when "Take Survey Again" is clicked', async () => {
      const takeAgainButton = screen.getByText('Take Survey Again');

      await userEvent.click(takeAgainButton);

      expect(mockPush).toHaveBeenCalledWith('/survey');
    });

    it('should navigate to dashboard when "Go to Dashboard" is clicked', async () => {
      const dashboardButton = screen.getByText('Go to Dashboard');

      await userEvent.click(dashboardButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('should navigate to home when "Back to Home" is clicked', async () => {
      const homeButton = screen.getByText('Back to Home');

      await userEvent.click(homeButton);

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Progress Bar Styling', () => {
    it('should apply correct color class for different risk levels', async () => {
      const testCases = [
        { score: '20', expectedClass: 'bg-green-500' },
        { score: '40', expectedClass: 'bg-yellow-500' },
        { score: '65', expectedClass: 'bg-orange-500' },
        { score: '85', expectedClass: 'bg-red-500' },
      ];

      for (const testCase of testCases) {
        jest.useFakeTimers();
        jest.clearAllMocks();

        mockSearchParams.get.mockImplementation((param: string) => {
          if (param === 'score') return testCase.score;
          return null;
        });

        const { unmount } = render(<SurveyResultsPage />);

        jest.advanceTimersByTime(6000);

        await waitFor(() => {
          const progressBar = document.querySelector(`[style*="width: ${testCase.score}%"]`);
          expect(progressBar).toHaveClass(testCase.expectedClass);
        });

        unmount();
        jest.useRealTimers();
      }
    });
  });

  describe('Privacy and Support Information', () => {
    it('should display privacy notice', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '45';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText(/Your individual responses are confidential/)).toBeInTheDocument();
        expect(screen.getByText(/Only aggregated, anonymous data/)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should display support information', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '45';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(screen.getByText(/This assessment helps identify patterns/)).toBeInTheDocument();
        expect(screen.getByText(/should not replace professional medical/)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Loading States', () => {
    it('should show fallback loading state in Suspense boundary', () => {
      // Mock to simulate a slow component load
      const SlowComponent = () => {
        throw new Promise(() => {
          // Never resolves to keep in Suspense
        });
      };

      render(
        <Suspense fallback={<div>Loading your results...</div>}>
          <SlowComponent />
        </Suspense>
      );

      expect(screen.getByText('Loading your results...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '30';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toHaveTextContent('Your Burnout Assessment Results');
      });

      jest.useRealTimers();
    });

    it('should have accessible buttons with proper labels', async () => {
      jest.useFakeTimers();

      mockSearchParams.get.mockImplementation((param: string) => {
        if (param === 'score') return '30';
        return null;
      });

      render(<SurveyResultsPage />);

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);

        expect(screen.getByRole('button', { name: 'Take Survey Again' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go to Dashboard' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back to Home' })).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });
});
