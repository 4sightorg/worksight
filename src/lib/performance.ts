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
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      }

      return duration;
    };
  }

  static measureComponent<T extends React.ComponentType<any>>(Component: T, name: string): T {
    const MeasuredComponent = (props: any) => {
      const endTimer = this.startTimer(`Component: ${name}`);

      React.useEffect(() => {
        endTimer();
      });

      return React.createElement(Component, props);
    };

    MeasuredComponent.displayName = `Measured(${name})`;
    return MeasuredComponent as T;
  }

  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}

// React hook for performance measurement
export function usePerformanceMetric(name: string, dependencies: any[] = []) {
  React.useEffect(() => {
    const endTimer = PerformanceMonitor.startTimer(name);
    return endTimer;
  }, dependencies);
}

// Web Vitals measurement
export function measureWebVitals() {
  if (typeof window !== 'undefined') {
    import('web-vitals')
      .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        onCLS(console.log);
        onFCP(console.log);
        onINP(console.log);
        onLCP(console.log);
        onTTFB(console.log);
      })
      .catch(() => {
        // Gracefully handle if web-vitals fails to load
        console.log('Web Vitals monitoring not available');
      });
  }
}
