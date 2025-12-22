// Performance test utilities for development
import { performanceMonitor } from './performance';

// Check if backend is available
const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    const API_BASE_URL = "http://127.0.0.1:8000";
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Test API caching performance
export const testAPICaching = async () => {
  console.log('🧪 Testing API Caching Performance...');
  
  // Check if backend is available first
  const backendAvailable = await checkBackendAvailability();
  if (!backendAvailable) {
    console.warn('⚠️ Backend server is not available. Skipping API caching tests.');
    console.warn('   Make sure the backend server is running on http://127.0.0.1:8000');
    return;
  }
  
  const testAPI = async (name: string, apiCall: () => Promise<any>) => {
    try {
      const start = performance.now();
      await apiCall();
      const end = performance.now();
      const duration = end - start;
      
      console.log(`${name}: ${duration.toFixed(2)}ms`);
      return duration;
    } catch (error: any) {
      console.warn(`⚠️ ${name} failed:`, error.message || error);
      return -1;
    }
  };

  // Test with caching
  console.log('First call (cache miss):');
  const firstCall = await testAPI('Categories API', () => import('../api').then(m => m.getCategories()));
  
  if (firstCall === -1) {
    console.warn('⚠️ API test failed, skipping cache hit test');
    return;
  }
  
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
    // Test API caching (will skip if backend unavailable)
    await testAPICaching();
    console.log('');
    
    // Test component render
    try {
      testComponentRender('Test Component', () => {
        // Simulate component render
        const div = document.createElement('div');
        div.innerHTML = 'Test content';
        document.body.appendChild(div);
        document.body.removeChild(div);
      });
      console.log('');
    } catch (error: any) {
      console.warn('⚠️ Component render test failed:', error.message || error);
    }
    
    // Test image loading
    try {
      await testImageLoading('https://via.placeholder.com/400x400?text=Test');
      console.log('');
    } catch (error: any) {
      console.warn('⚠️ Image loading test failed:', error.message || error);
    }
    
    // Report overall performance
    try {
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
    } catch (error: any) {
      console.warn('⚠️ Performance metrics collection failed:', error.message || error);
    }
    
  } catch (error: any) {
    console.warn('⚠️ Some performance tests failed:', error.message || error);
    console.log('   This is normal if the backend server is not running.');
  }
};


