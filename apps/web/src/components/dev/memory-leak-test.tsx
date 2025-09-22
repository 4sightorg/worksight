'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  useAsyncOperation, 
  useInterval, 
  useTimeout, 
  useEventListener,
  useSafeState 
} from '@/hooks';
import { PageErrorBoundary } from '@/components/core';

// Test component for memory leaks
function MemoryLeakTestComponent() {
  const [mounted, setMounted] = useState(true);
  const [timerCount, setTimerCount] = useState(0);
  const [intervalCount, setIntervalCount] = useState(0);
  const [asyncState, setAsyncState] = useSafeState('idle');
  const [eventCount, setEventCount] = useState(0);
  const [abortCount, setAbortCount] = useState(0);
  
  const { executeAsync, abort } = useAsyncOperation();
  const componentRef = useRef<HTMLDivElement>(null);

  // Test useInterval with proper cleanup
  useInterval(() => {
    if (mounted) {
      setIntervalCount(prev => prev + 1);
    }
  }, 1000);

  // Test useTimeout with proper cleanup
  useTimeout(() => {
    if (mounted) {
      setTimerCount(prev => prev + 1);
    }
  }, 2000);

  // Test event listener with proper cleanup
  useEventListener('keydown', (event) => {
    if (event.key === 'Space' && mounted) {
      setEventCount(prev => prev + 1);
    }
  });

  // Test async operation with AbortController
  const testAsyncOperation = () => {
    executeAsync(
      async (signal) => {
        setAsyncState('loading');
        // Simulate long running operation
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        if (signal.aborted) {
          throw new Error('Operation aborted');
        }
        
        return 'Success!';
      },
      (result) => {
        setAsyncState(result);
      },
      (error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setAsyncState('error: ' + errorMessage);
      }
    );
  };

  const testAbortOperation = () => {
    abort();
    setAbortCount(prev => prev + 1);
  };

  // Component unmount handler
  const handleUnmount = () => {
    setMounted(false);
  };

  return (
    <div ref={componentRef} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Timer Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Badge variant="outline">Interval Count: {intervalCount}</Badge>
            </div>
            <div>
              <Badge variant="outline">Timeout Count: {timerCount}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Listener Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Press spacebar to test</p>
            <Badge variant="outline">Space Key Presses: {eventCount}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Async Operation Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Button size="sm" onClick={testAsyncOperation}>
                Start Async Op
              </Button>
              <Button size="sm" variant="destructive" onClick={testAbortOperation}>
                Abort
              </Button>
            </div>
            <Badge variant="outline">State: {asyncState}</Badge>
            <Badge variant="outline">Aborts: {abortCount}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant={mounted ? "default" : "destructive"}>
              {mounted ? "Mounted" : "Unmounted"}
            </Badge>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleUnmount}
              disabled={!mounted}
            >
              Simulate Unmount
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main test component with mount/unmount controls
export function MemoryLeakTest() {
  const [showTestComponent, setShowTestComponent] = useState(false);
  const [componentKey, setComponentKey] = useState(0);

  const remountComponent = () => {
    setComponentKey(prev => prev + 1);
    setShowTestComponent(true);
  };

  const unmountComponent = () => {
    setShowTestComponent(false);
  };

  return (
    <PageErrorBoundary>
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Memory Leak Prevention Testing</CardTitle>
            <p className="text-sm text-muted-foreground">
              This component tests various memory leak scenarios and their prevention mechanisms:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>useInterval with automatic cleanup</li>
              <li>useTimeout with automatic cleanup</li>
              <li>Event listeners with proper removal</li>
              <li>Async operations with AbortController</li>
              <li>State updates on unmounted components</li>
            </ul>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={remountComponent}>
                {showTestComponent ? 'Remount' : 'Mount'} Test Component
              </Button>
              <Button 
                variant="destructive" 
                onClick={unmountComponent}
                disabled={!showTestComponent}
              >
                Unmount Test Component
              </Button>
            </div>

            {showTestComponent && (
              <div className="border rounded-lg p-4 bg-card">
                <MemoryLeakTestComponent key={componentKey} />
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-2">
              <h4 className="font-semibold">Test Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Mount the test component</li>
                <li>Watch the counters increment (shows timers are working)</li>
                <li>Press spacebar to test event listeners</li>
                <li>Start async operations and try aborting them</li>
                <li>Unmount the component - all timers and listeners should stop</li>
                <li>Check browser dev tools for any console warnings about memory leaks</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageErrorBoundary>
  );
}