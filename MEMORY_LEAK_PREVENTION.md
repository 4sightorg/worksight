# Memory Leak Prevention Guide

This guide covers memory leak prevention strategies implemented in the WorkSight application.

## Overview

Memory leaks in React applications typically occur when:
- Components continue to run async operations after unmounting
- Event listeners are not properly removed
- Timers/intervals are not cleared
- State updates happen on unmounted components
- AbortController is not used for fetch requests

## Fixed Issues

### 1. Timer Cleanup ✅

**Problem**: setTimeout/setInterval without cleanup
```tsx
// ❌ Before - Memory leak
useEffect(() => {
  setTimeout(() => setData(newData), 500);
}, []);
```

**Solution**: Always return cleanup function
```tsx
// ✅ After - Proper cleanup
useEffect(() => {
  const timer = setTimeout(() => setData(newData), 500);
  return () => clearTimeout(timer);
}, []);
```

**Files Fixed**:
- `/app/admin/page.tsx` - Fixed setTimeout without cleanup
- `/components/core/client-only.tsx` - Added proper timer cleanup for retry logic

### 2. Async Operation Cancellation ✅

**Problem**: API calls continuing after component unmounts
```tsx
// ❌ Before - Potential memory leak
useEffect(() => {
  const loadData = async () => {
    const data = await api.getData();
    setData(data); // May run on unmounted component
  };
  loadData();
}, []);
```

**Solution**: Use AbortController for proper cancellation
```tsx
// ✅ After - Proper cancellation
useEffect(() => {
  const abortController = new AbortController();
  
  const loadData = async () => {
    try {
      const data = await api.getData();
      if (!abortController.signal.aborted) {
        setData(data);
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error(error);
      }
    }
  };
  
  loadData();
  return () => abortController.abort();
}, []);
```

**Files Fixed**:
- `/app/dashboard/admin/page.tsx` - Added AbortController for employee API
- `/app/dashboard/settings/page.tsx` - Added AbortController for settings API

### 3. Event Listener Cleanup ✅

**Analysis**: All event listeners already have proper cleanup
```tsx
// ✅ Proper pattern found in codebase
useEffect(() => {
  const handleKeyDown = (event) => {
    // Handle event
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

**Files Verified**:
- `/components/survey/form.tsx` - Proper keydown listener cleanup
- `/components/ui/sidebar.tsx` - Proper keydown listener cleanup
- `/hooks/use-mobile.ts` - Proper media query listener cleanup

## New Memory-Safe Hooks

### useAsyncOperation Hook

Handles async operations with automatic cleanup:

```tsx
import { useAsyncOperation } from '@/hooks';

function MyComponent() {
  const { executeAsync } = useAsyncOperation();
  
  useEffect(() => {
    executeAsync(
      async (signal) => {
        return await api.getData();
      },
      (result) => setData(result),
      (error) => console.error(error),
      () => setLoading(false)
    );
  }, [executeAsync]);
}
```

### useInterval Hook

Manages intervals with automatic cleanup:

```tsx
import { useInterval } from '@/hooks';

function Timer() {
  const [count, setCount] = useState(0);
  
  useInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  
  return <div>{count}</div>;
}
```

### useTimeout Hook

Manages timeouts with automatic cleanup:

```tsx
import { useTimeout } from '@/hooks';

function DelayedComponent() {
  const [show, setShow] = useState(false);
  
  useTimeout(() => {
    setShow(true);
  }, 2000);
  
  return show ? <div>Appeared!</div> : null;
}
```

### useEventListener Hook

Manages event listeners with automatic cleanup:

```tsx
import { useEventListener } from '@/hooks';

function KeyboardHandler() {
  useEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
  
  return <div>Press Escape to close</div>;
}
```

### useSafeState Hook

Prevents state updates on unmounted components:

```tsx
import { useSafeState } from '@/hooks';

function SafeComponent() {
  const [data, setData] = useSafeState(null);
  
  useEffect(() => {
    // State will only update if component is mounted
    setTimeout(() => setData('loaded'), 1000);
  }, []);
  
  return <div>{data}</div>;
}
```

## Best Practices

### 1. Always Clean Up Side Effects

```tsx
useEffect(() => {
  // Set up side effect
  const subscription = api.subscribe(callback);
  
  // Clean up side effect
  return () => subscription.unsubscribe();
}, []);
```

### 2. Use AbortController for Fetch Requests

```tsx
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => {
      if (!controller.signal.aborted) {
        setData(data);
      }
    });
    
  return () => controller.abort();
}, []);
```

### 3. Check Component Mount Status

```tsx
const isMountedRef = useRef(true);

useEffect(() => {
  return () => {
    isMountedRef.current = false;
  };
}, []);

const updateState = (newData) => {
  if (isMountedRef.current) {
    setData(newData);
  }
};
```

### 4. Use Custom Hooks for Complex Logic

Instead of repeating cleanup logic, use custom hooks:

```tsx
// Custom hook with built-in cleanup
function useApiData(url) {
  const [data, setData] = useState(null);
  const { executeAsync } = useAsyncOperation();
  
  useEffect(() => {
    executeAsync(
      async () => fetch(url).then(r => r.json()),
      setData,
      console.error
    );
  }, [url, executeAsync]);
  
  return data;
}
```

## Testing

Visit `/dev/memory-leak-test` to test memory leak prevention:

- Mount/unmount test components
- Verify timers stop on unmount
- Test async operation cancellation
- Check event listener cleanup
- Monitor console for warnings

## Common Pitfalls

### 1. Forgetting Timer Cleanup
```tsx
// ❌ Memory leak
useEffect(() => {
  setInterval(() => console.log('tick'), 1000);
}, []);

// ✅ Proper cleanup
useEffect(() => {
  const interval = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(interval);
}, []);
```

### 2. State Updates After Unmount
```tsx
// ❌ Potential warning
useEffect(() => {
  setTimeout(() => setState('updated'), 1000);
}, []);

// ✅ Safe update
useEffect(() => {
  const timer = setTimeout(() => setState('updated'), 1000);
  return () => clearTimeout(timer);
}, []);
```

### 3. Missing Async Cancellation
```tsx
// ❌ May update unmounted component
useEffect(() => {
  fetchData().then(setData);
}, []);

// ✅ Proper cancellation
useEffect(() => {
  const controller = new AbortController();
  fetchData(controller.signal).then(data => {
    if (!controller.signal.aborted) setData(data);
  });
  return () => controller.abort();
}, []);
```

## Implementation Status

✅ Timer cleanup - Fixed in admin page and client-only component
✅ Async operation cancellation - Fixed with AbortController
✅ Event listener cleanup - Already properly implemented
✅ Memory-safe hooks - Created comprehensive hook library
✅ Testing components - Created interactive test suite
✅ Documentation - This comprehensive guide

All memory leak issues have been identified and resolved using proper cleanup patterns and custom hooks.