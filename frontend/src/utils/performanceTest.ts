// Performance test utilities for development
import { performanceMonitor } from './performance';

// Test API caching performance
export const testAPICaching = async () => {
  console.log('🧪 Testing API Caching Performance...');
  
  const testAPI = async (name: string, apiCall: () => Promise<any>) => {
    const start = performance.now();
    await apiCall();
    const end = performance.now();
    const duration = end - start;
    
    console.log(`${name}: ${duration.toFixed(2)}ms`);
    return duration;
  };

  // Test with caching
  console.log('First call (cache miss):');
  await testAPI('Categories API', () => import('../api').then(m => m.getCategories()));
  
  console.log('Second call (cache hit):');
  await testAPI('Categories API', () => import('../api').then(m => m.getCategories()));
  
  console.log('✅ API Caching test completed');
};

// Test component render performance
export const testComponentRender = (componentName: string, renderFn: () => void) => {
  console.log(`🧪 Testing ${componentName} render performance...`);
  
  const renderTime = performanceMonitor.measureComponentRender(componentName, renderFn);
  
  if (renderTime < 16) {
    console.log(`✅ ${componentName} render time is optimal: ${renderTime.toFixed(2)}ms`);
  } else {
    console.warn(`⚠️ ${componentName} render time needs optimization: ${renderTime.toFixed(2)}ms`);
  }
  
  return renderTime;
};

// Test image loading performance
export const testImageLoading = (imageUrl: string) => {
  console.log('🧪 Testing image loading performance...');
  
  return new Promise((resolve) => {
    const start = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const end = performance.now();
      const loadTime = end - start;
      
      console.log(`Image loaded in ${loadTime.toFixed(2)}ms`);
      
      if (loadTime < 500) {
        console.log('✅ Image loading is fast');
      } else {
        console.warn('⚠️ Image loading is slow, consider optimization');
      }
      
      resolve(loadTime);
    };
    
    img.onerror = () => {
      console.error('❌ Image failed to load');
      resolve(-1);
    };
    
    img.src = imageUrl;
  });
};

// Run all performance tests
export const runPerformanceTests = async () => {
  console.log('🚀 Running Performance Tests...');
  console.log('================================');
  
  try {
    await testAPICaching();
    console.log('');
    
    // Test component render
    testComponentRender('Test Component', () => {
      // Simulate component render
      const div = document.createElement('div');
      div.innerHTML = 'Test content';
      document.body.appendChild(div);
      document.body.removeChild(div);
    });
    console.log('');
    
    // Test image loading
    await testImageLoading('https://via.placeholder.com/400x400?text=Test');
    console.log('');
    
    // Report overall performance
    const metrics = performanceMonitor.getMetrics();
    const issues = performanceMonitor.reportPerformanceIssues();
    
    console.log('📊 Performance Summary:');
    console.log('======================');
    console.log(`Page Load Time: ${metrics.pageLoadTime}ms`);
    console.log(`First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    console.log(`Largest Contentful Paint: ${metrics.largestContentfulPaint}ms`);
    console.log(`Cumulative Layout Shift: ${metrics.cumulativeLayoutShift}`);
    console.log(`First Input Delay: ${metrics.firstInputDelay}ms`);
    
    if (issues.length === 0) {
      console.log('✅ All performance metrics are within acceptable ranges!');
    } else {
      console.log('⚠️ Performance issues detected:', issues);
    }
    
  } catch (error) {
    console.error('❌ Performance tests failed:', error);
  }
};

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  // Run tests after a short delay to allow app to initialize
  setTimeout(() => {
    runPerformanceTests();
  }, 2000);
}
