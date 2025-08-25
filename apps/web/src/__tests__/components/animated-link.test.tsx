import {
  AnimatedLink,
  BounceLink,
  FadeLink,
  InlineAnimatedLink,
  InlineBounceLink,
  InlineFadeLink,
  InlineScaleLink,
  InlineSlideLink,
  ScaleLink,
  SlideLink,
} from '@/components/animations/link';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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

describe('AnimatedLink Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('AnimatedLink', () => {
    it('should render with children', () => {
      render(
        <AnimatedLink href="/test">
          <span>Test Link</span>
        </AnimatedLink>
      );

      expect(screen.getByText('Test Link')).toBeInTheDocument();
    });

    it('should navigate to href when clicked', async () => {
      render(
        <AnimatedLink href="/test-page">
          <span>Navigate</span>
        </AnimatedLink>
      );

      const link = screen.getByRole('link');
      await userEvent.click(link);

      // Fast-forward the animation delay
      jest.advanceTimersByTime(200);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/test-page');
      });
    });

    it('should call custom onClick when provided', async () => {
      const mockOnClick = jest.fn();

      render(
        <AnimatedLink href="/test" onClick={mockOnClick}>
          <span>Custom Click</span>
        </AnimatedLink>
      );

      const link = screen.getByRole('link');
      await userEvent.click(link);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should apply custom className', () => {
      render(
        <AnimatedLink href="/test" className="custom-class">
          <span>Styled Link</span>
        </AnimatedLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-class');
    });

    it('should handle different animation types', () => {
      const animationTypes = ['slide', 'fade', 'scale', 'bounce'] as const;

      animationTypes.forEach((type) => {
        const { unmount } = render(
          <AnimatedLink href="/test" animationType={type}>
            <span>{type} animation</span>
          </AnimatedLink>
        );

        expect(screen.getByText(`${type} animation`)).toBeInTheDocument();
        unmount();
      });
    });

    it('should prevent default link navigation', async () => {
      render(
        <AnimatedLink href="/test">
          <span>Test Link</span>
        </AnimatedLink>
      );

      const link = screen.getByRole('link');
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
      fireEvent(link, clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('InlineAnimatedLink', () => {
    it('should render as inline element', () => {
      render(
        <p>
          Some text with <InlineAnimatedLink href="/inline">inline link</InlineAnimatedLink> in the
          middle.
        </p>
      );

      expect(screen.getByText('inline link')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('should navigate when clicked', async () => {
      render(<InlineAnimatedLink href="/inline-test">Inline Navigation</InlineAnimatedLink>);

      const link = screen.getByRole('link');
      await userEvent.click(link);

      jest.advanceTimersByTime(200);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/inline-test');
      });
    });

    it('should handle different inline animation types', () => {
      const animationTypes = ['slide', 'fade', 'scale', 'bounce'] as const;

      animationTypes.forEach((type) => {
        const { unmount } = render(
          <InlineAnimatedLink href="/test" animationType={type}>
            {type} inline
          </InlineAnimatedLink>
        );

        expect(screen.getByText(`${type} inline`)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Pre-configured Link Variants', () => {
    describe('Block-level variants', () => {
      it('should render SlideLink', () => {
        render(<SlideLink href="/slide">Slide Link</SlideLink>);

        expect(screen.getByText('Slide Link')).toBeInTheDocument();
      });

      it('should render FadeLink', () => {
        render(<FadeLink href="/fade">Fade Link</FadeLink>);

        expect(screen.getByText('Fade Link')).toBeInTheDocument();
      });

      it('should render ScaleLink', () => {
        render(<ScaleLink href="/scale">Scale Link</ScaleLink>);

        expect(screen.getByText('Scale Link')).toBeInTheDocument();
      });

      it('should render BounceLink', () => {
        render(<BounceLink href="/bounce">Bounce Link</BounceLink>);

        expect(screen.getByText('Bounce Link')).toBeInTheDocument();
      });
    });

    describe('Inline variants', () => {
      it('should render InlineSlideLink', () => {
        render(
          <p>
            Text with <InlineSlideLink href="/slide">slide link</InlineSlideLink>
          </p>
        );

        expect(screen.getByText('slide link')).toBeInTheDocument();
      });

      it('should render InlineFadeLink', () => {
        render(
          <p>
            Text with <InlineFadeLink href="/fade">fade link</InlineFadeLink>
          </p>
        );

        expect(screen.getByText('fade link')).toBeInTheDocument();
      });

      it('should render InlineScaleLink', () => {
        render(
          <p>
            Text with <InlineScaleLink href="/scale">scale link</InlineScaleLink>
          </p>
        );

        expect(screen.getByText('scale link')).toBeInTheDocument();
      });

      it('should render InlineBounceLink', () => {
        render(
          <p>
            Text with <InlineBounceLink href="/bounce">bounce link</InlineBounceLink>
          </p>
        );

        expect(screen.getByText('bounce link')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Behavior', () => {
    it('should handle navigation with prefetch enabled', async () => {
      render(
        <AnimatedLink href="/prefetch-test" prefetch={true}>
          Prefetch Link
        </AnimatedLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/prefetch-test');
    });

    it('should handle navigation with prefetch disabled', async () => {
      render(
        <AnimatedLink href="/no-prefetch-test" prefetch={false}>
          No Prefetch Link
        </AnimatedLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/no-prefetch-test');
    });

    it('should handle complex href paths', async () => {
      const complexHref = '/complex/path?param=value&other=123#section';

      render(<AnimatedLink href={complexHref}>Complex Link</AnimatedLink>);

      const link = screen.getByRole('link');
      await userEvent.click(link);

      jest.advanceTimersByTime(200);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(complexHref);
      });
    });
  });

  describe('Animation Timing', () => {
    it('should respect animation delay before navigation', async () => {
      render(<AnimatedLink href="/delayed">Delayed Navigation</AnimatedLink>);

      const link = screen.getByRole('link');
      await userEvent.click(link);

      // Navigation should not happen immediately
      expect(mockPush).not.toHaveBeenCalled();

      // Navigation should happen after the delay
      jest.advanceTimersByTime(150);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/delayed');
      });
    });

    it('should handle multiple rapid clicks gracefully', async () => {
      render(<AnimatedLink href="/rapid-click">Rapid Click Link</AnimatedLink>);

      const link = screen.getByRole('link');

      // Click multiple times rapidly
      await userEvent.click(link);
      await userEvent.click(link);
      await userEvent.click(link);

      jest.advanceTimersByTime(200);

      // Should only navigate once despite multiple clicks
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith('/rapid-click');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle router push errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        // Mock implementation to suppress console errors during tests
      });
      mockPush.mockRejectedValueOnce(new Error('Navigation failed'));

      render(<AnimatedLink href="/error-test">Error Link</AnimatedLink>);

      const link = screen.getByRole('link');
      await userEvent.click(link);

      jest.advanceTimersByTime(200);

      // Component should not crash despite navigation error
      expect(screen.getByText('Error Link')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should maintain link semantics', () => {
      render(<AnimatedLink href="/accessible">Accessible Link</AnimatedLink>);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/accessible');
      expect(link).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<AnimatedLink href="/keyboard">Keyboard Link</AnimatedLink>);

      const link = screen.getByRole('link');

      // Focus the link
      link.focus();
      expect(link).toHaveFocus();

      // Press Enter
      fireEvent.keyDown(link, { key: 'Enter' });
      fireEvent.click(link);

      jest.advanceTimersByTime(200);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/keyboard');
      });
    });

    it('should preserve aria attributes', () => {
      render(
        <AnimatedLink href="/aria" className="custom-class">
          <span aria-label="Custom Link Label">Link with ARIA</span>
        </AnimatedLink>
      );

      const linkContent = screen.getByLabelText('Custom Link Label');
      expect(linkContent).toBeInTheDocument();
    });
  });

  describe('Component Props', () => {
    it('should handle missing href gracefully', () => {
      // This should not crash the component
      const { container } = render(<AnimatedLink href="">Empty Href</AnimatedLink>);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      const { container } = render(<AnimatedLink href="/test">{undefined}</AnimatedLink>);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle complex children structure', () => {
      render(
        <AnimatedLink href="/complex">
          <div>
            <span>Complex</span>
            <strong>Children</strong>
          </div>
        </AnimatedLink>
      );

      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Children')).toBeInTheDocument();
    });
  });
});
