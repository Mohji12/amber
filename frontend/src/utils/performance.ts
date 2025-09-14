// Performance monitoring utilities

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: 0
  };

  // Measure page load performance
  measurePageLoad() {
    if (typeof window === 'undefined') return;

    // Page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      console.log(`Page Load Time: ${this.metrics.pageLoadTime}ms`);
    });

    // Web Vitals
    this.measureWebVitals();
  }

  // Measure Core Web Vitals
  private measureWebVitals() {
    // First Contentful Paint (FCP)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
          console.log(`First Contentful Paint: ${entry.startTime}ms`);
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.largestContentfulPaint = lastEntry.startTime;
      console.log(`Largest Contentful Paint: ${lastEntry.startTime}ms`);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.metrics.cumulativeLayoutShift = clsValue;
      console.log(`Cumulative Layout Shift: ${clsValue}`);
    }).observe({ entryTypes: ['layout-shift'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        console.log(`First Input Delay: ${this.metrics.firstInputDelay}ms`);
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  // Measure component render time
  measureComponentRender(componentName: string, renderFn: () => void) {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    const renderTime = end - start;
    
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    
    // Warn if render time is too high
    if (renderTime > 16) { // 60fps threshold
      console.warn(`⚠️ ${componentName} render time is high: ${renderTime.toFixed(2)}ms`);
    }
    
    return renderTime;
  }

  // Measure API call performance
  measureAPICall(apiName: string, apiCall: () => Promise<any>) {
    const start = performance.now();
    
    return apiCall().then((result) => {
      const end = performance.now();
      const duration = end - start;
      
      console.log(`${apiName} API call: ${duration.toFixed(2)}ms`);
      
      // Warn if API call is too slow
      if (duration > 1000) {
        console.warn(`⚠️ ${apiName} API call is slow: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    });
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Report performance issues
  reportPerformanceIssues() {
    const issues: string[] = [];
    
    if (this.metrics.pageLoadTime > 3000) {
      issues.push(`Page load time is slow: ${this.metrics.pageLoadTime}ms`);
    }
    
    if (this.metrics.firstContentfulPaint > 1800) {
      issues.push(`First Contentful Paint is slow: ${this.metrics.firstContentfulPaint}ms`);
    }
    
    if (this.metrics.largestContentfulPaint > 2500) {
      issues.push(`Largest Contentful Paint is slow: ${this.metrics.largestContentfulPaint}ms`);
    }
    
    if (this.metrics.cumulativeLayoutShift > 0.1) {
      issues.push(`Cumulative Layout Shift is high: ${this.metrics.cumulativeLayoutShift}`);
    }
    
    if (this.metrics.firstInputDelay > 100) {
      issues.push(`First Input Delay is high: ${this.metrics.firstInputDelay}ms`);
    }
    
    if (issues.length > 0) {
      console.warn('Performance Issues Detected:', issues);
    }
    
    return issues;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    performanceMonitor.measurePageLoad();
    
    // Report issues after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor.reportPerformanceIssues();
      }, 2000);
    });
  }
};

// Performance optimization helpers
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default performanceMonitor;
