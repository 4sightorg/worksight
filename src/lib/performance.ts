import React from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();

  static startTimer(label: string): () => void {
    const start = performance.now();

    return () => {
      const end = performance.now();
      const duration = end - start;
      this.metrics.set(label, duration);

      if (process.env.NODE_ENV === 'development') {
        console.warn(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      }

      return duration;
    };
  }

  static measureComponent<P = Record<string, unknown>>(
    Component: React.ComponentType<P>, 
    name: string
  ): React.ComponentType<P> {
    const MeasuredComponent = (props: P) => {
      const endTimer = this.startTimer(`Component: ${name}`);

      React.useEffect(() => {
        endTimer();
      });

      return React.createElement(Component, props);
    };

    MeasuredComponent.displayName = `Measured(${name})`;
    return MeasuredComponent;
  }

  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}

// React hook for performance measurement
export function usePerformanceMetric(name: string, dependencies: React.DependencyList = []) {
  const dependenciesRef = React.useRef(dependencies);
  dependenciesRef.current = dependencies;

  React.useEffect(() => {
    const endTimer = PerformanceMonitor.startTimer(name);
    return endTimer;
  }, [name, dependenciesRef.current]); // eslint-disable-line react-hooks/exhaustive-deps
}

// Web Vitals measurement
export function measureWebVitals() {
  if (typeof window !== 'undefined') {
    import('web-vitals')
      .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        onCLS(console.warn);
        onFCP(console.warn);
        onINP(console.warn);
        onLCP(console.warn);
        onTTFB(console.warn);
      })
      .catch(() => {
        // Gracefully handle if web-vitals fails to load
        console.warn('Web Vitals monitoring not available');
      });
  }
}
