import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook for handling async operations with proper cleanup
 * Prevents memory leaks by canceling operations when component unmounts
 */
export function useAsyncOperation() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const executeAsync = useCallback(async <T>(
    asyncOperation: (signal: AbortSignal) => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: unknown) => void,
    onFinally?: () => void
  ) => {
    // Create new abort controller for this operation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await asyncOperation(controller.signal);

      // Only execute callbacks if component is still mounted
      if (isMountedRef.current && !controller.signal.aborted) {
        onSuccess?.(result);
      }
    } catch (error) {
      // Only handle error if not aborted and component is still mounted
      if (isMountedRef.current && !controller.signal.aborted) {
        onError?.(error);
      }
    } finally {
      // Only execute finally if component is still mounted
      if (isMountedRef.current && !controller.signal.aborted) {
        onFinally?.();
      }
    }
  }, []);

  const isMounted = useCallback(() => isMountedRef.current, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return { executeAsync, isMounted, abort };
}

/**
 * Hook for safely updating state only when component is mounted
 * Prevents "setState on unmounted component" warnings
 */
export function useSafeState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void] {
  const isMountedRef = useRef(true);
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const setSafeState = useCallback((value: T | ((prev: T) => T)) => {
    if (isMountedRef.current) {
      setState(value);
    }
  }, []);

  return [state, setSafeState];
}

/**
 * Hook for managing intervals with automatic cleanup
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      intervalRef.current = setInterval(tick, delay);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [delay]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}

/**
 * Hook for managing timeouts with automatic cleanup
 */
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      timeoutRef.current = setTimeout(tick, delay);
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [delay]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}

/**
 * Hook for managing event listeners with automatic cleanup
 */
export function useEventListener<T extends keyof WindowEventMap>(
  eventType: T,
  handler: (event: WindowEventMap[T]) => void,
  element: EventTarget = window,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: Event) => savedHandler.current(event as WindowEventMap[T]);

    element.addEventListener(eventType, eventListener, options);

    return () => {
      element.removeEventListener(eventType, eventListener, options);
    };
  }, [eventType, element, options]);
}