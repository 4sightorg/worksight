'use client';

import {
  AsyncErrorBoundary,
  ChartErrorBoundary,
  ComponentErrorBoundary,
  FormErrorBoundary,
  PageErrorBoundary
} from '@/components/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

// Test component that throws an error when triggered
function ErrorThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('This is a test error to verify error boundary functionality');
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <p className="text-green-700">✅ Component rendered successfully</p>
    </div>
  );
}

// Async component that throws an error
function AsyncErrorComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Async operation failed - testing AsyncErrorBoundary');
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
      <p className="text-blue-700">📊 Async component loaded successfully</p>
    </div>
  );
}

// Chart component that throws an error
function ChartErrorComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Chart rendering failed - testing ChartErrorBoundary');
  }

  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
      <p className="text-purple-700">📈 Chart rendered successfully</p>
    </div>
  );
}

// Form component that throws an error
function FormErrorComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Form validation failed - testing FormErrorBoundary');
  }

  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
      <p className="text-orange-700">📝 Form component working correctly</p>
    </div>
  );
}

export function ErrorBoundaryTest() {
  const [componentError, setComponentError] = useState(false);
  const [asyncError, setAsyncError] = useState(false);
  const [chartError, setChartError] = useState(false);
  const [formError, setFormError] = useState(false);

  return (
    <PageErrorBoundary>
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Boundary Testing</CardTitle>
            <p className="text-sm text-muted-foreground">
              Use the buttons below to test different error boundary types.
              Each error boundary should catch its respective error and display a fallback UI.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Component Error Boundary Test */}
            <div className="space-y-2">
              <h3 className="font-medium">Component Error Boundary</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setComponentError(false)}
                >
                  Reset
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setComponentError(true)}
                >
                  Trigger Error
                </Button>
              </div>
              <ComponentErrorBoundary>
                <ErrorThrowingComponent shouldThrow={componentError} />
              </ComponentErrorBoundary>
            </div>

            {/* Async Error Boundary Test */}
            <div className="space-y-2">
              <h3 className="font-medium">Async Error Boundary</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAsyncError(false)}
                >
                  Reset
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setAsyncError(true)}
                >
                  Trigger Async Error
                </Button>
              </div>
              <AsyncErrorBoundary>
                <AsyncErrorComponent shouldThrow={asyncError} />
              </AsyncErrorBoundary>
            </div>

            {/* Chart Error Boundary Test */}
            <div className="space-y-2">
              <h3 className="font-medium">Chart Error Boundary</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChartError(false)}
                >
                  Reset
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setChartError(true)}
                >
                  Trigger Chart Error
                </Button>
              </div>
              <ChartErrorBoundary>
                <ChartErrorComponent shouldThrow={chartError} />
              </ChartErrorBoundary>
            </div>

            {/* Form Error Boundary Test */}
            <div className="space-y-2">
              <h3 className="font-medium">Form Error Boundary</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFormError(false)}
                >
                  Reset
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setFormError(true)}
                >
                  Trigger Form Error
                </Button>
              </div>
              <FormErrorBoundary>
                <FormErrorComponent shouldThrow={formError} />
              </FormErrorBoundary>
            </div>

          </CardContent>
        </Card>
      </div>
    </PageErrorBoundary>
  );
}