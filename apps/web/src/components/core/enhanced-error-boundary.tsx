'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface BaseErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  description?: string;
  showRetry?: boolean;
  showReload?: boolean;
  showNavigation?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolateComponent?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

// Enhanced base error boundary with more features
export class BaseErrorBoundary extends Component<BaseErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;
  private prevResetKeys: Array<string | number> = [];

  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Report to error monitoring service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      this.reportError(error, errorInfo);
    }
  }

  public componentDidUpdate(prevProps: BaseErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys) {
        const hasResetKeyChanged = resetKeys.some((key, idx) => 
          this.prevResetKeys[idx] !== key
        );
        if (hasResetKeyChanged) {
          this.prevResetKeys = resetKeys;
          this.resetErrorBoundary();
        }
      }
    }
    
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Enhanced error reporting
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
    };
    
    // Here you would send to your error monitoring service
    console.warn('Error report:', errorReport);
  };

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: undefined,
    });
  };

  private handleRetry = () => {
    this.resetErrorBoundary();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const {
        title = "Something went wrong",
        description = "An unexpected error occurred. Please try again or reload the page.",
        showRetry = true,
        showReload = true,
        showNavigation = false,
        isolateComponent = false,
      } = this.props;

      const errorContent = (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-muted rounded-md p-3 text-sm">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 whitespace-pre-wrap text-xs">{this.state.error.message}</pre>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap text-xs">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorId && (
                    <div>
                      <strong>Error ID:</strong>
                      <code className="text-xs">{this.state.errorId}</code>
                    </div>
                  )}
                </div>
              </details>
            )}
            <div className="space-y-2">
              {(showRetry || showReload || showNavigation) && (
                <div className="flex gap-2">
                  {showRetry && (
                    <Button onClick={this.handleRetry} className="flex-1">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  )}
                  {showReload && (
                    <Button variant="outline" onClick={this.handleReload} className="flex-1">
                      Reload Page
                    </Button>
                  )}
                </div>
              )}
              {showNavigation && (
                <div className="flex gap-2">
                  <NavigationButton href="/dashboard" icon={Home} label="Dashboard" />
                  <NavigationButton href="/" icon={ArrowLeft} label="Home" variant="outline" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      );

      if (isolateComponent) {
        return (
          <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
            {errorContent}
          </div>
        );
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          {errorContent}
        </div>
      );
    }

    return this.props.children;
  }
}

// Navigation button component for error boundaries
function NavigationButton({ 
  href, 
  icon: Icon, 
  label, 
  variant = "default" 
}: {
  href: string;
  icon: any;
  label: string;
  variant?: "default" | "outline";
}) {
  return (
    <Button 
      variant={variant} 
      className="flex-1"
      onClick={() => window.location.href = href}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

// Page-level error boundary for critical pages
export function PageErrorBoundary({ children, ...props }: BaseErrorBoundaryProps) {
  return (
    <BaseErrorBoundary
      title="Page Error"
      description="This page encountered an error. You can try refreshing or navigate to another page."
      showNavigation={true}
      {...props}
    >
      {children}
    </BaseErrorBoundary>
  );
}

// Component-level error boundary for isolated components
export function ComponentErrorBoundary({ children, ...props }: BaseErrorBoundaryProps) {
  return (
    <BaseErrorBoundary
      title="Component Error"
      description="This component failed to load properly."
      isolateComponent={true}
      showReload={false}
      showNavigation={false}
      {...props}
    >
      {children}
    </BaseErrorBoundary>
  );
}

// Async operation error boundary
export function AsyncErrorBoundary({ children, ...props }: BaseErrorBoundaryProps) {
  return (
    <BaseErrorBoundary
      title="Loading Error"
      description="Failed to load data. Please check your connection and try again."
      showReload={false}
      resetOnPropsChange={true}
      {...props}
    >
      {children}
    </BaseErrorBoundary>
  );
}

// Chart/visualization error boundary
export function ChartErrorBoundary({ children, ...props }: BaseErrorBoundaryProps) {
  return (
    <BaseErrorBoundary
      title="Chart Error"
      description="Unable to display chart data."
      isolateComponent={true}
      showReload={false}
      showNavigation={false}
      fallback={
        <div className="bg-muted/50 flex h-64 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <AlertTriangle className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm">Chart unavailable</p>
          </div>
        </div>
      }
      {...props}
    >
      {children}
    </BaseErrorBoundary>
  );
}

// Form error boundary
export function FormErrorBoundary({ children, ...props }: BaseErrorBoundaryProps) {
  return (
    <BaseErrorBoundary
      title="Form Error"
      description="There was an error with the form. Please try again."
      isolateComponent={true}
      showReload={false}
      showNavigation={false}
      {...props}
    >
      {children}
    </BaseErrorBoundary>
  );
}

// Legacy compatibility - keep existing ErrorBoundary as alias
export { BaseErrorBoundary as EnhancedErrorBoundary };