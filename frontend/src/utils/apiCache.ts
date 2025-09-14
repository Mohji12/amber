// API Cache Utility for Performance Optimization
// Implements in-memory caching with TTL (Time To Live)

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class APICache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default

  // Set cache item
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  // Get cache item
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) return false;
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Delete specific key
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Clean expired items
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Generate cache key from URL and options
  generateKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }
}

// Create singleton instance
export const apiCache = new APICache();

// Cache configuration for different endpoints
export const CACHE_CONFIG = {
  // Static data - cache for longer
  categories: { ttl: 30 * 60 * 1000 }, // 30 minutes
  subcategories: { ttl: 30 * 60 * 1000 }, // 30 minutes
  staticBlogs: { ttl: 60 * 60 * 1000 }, // 1 hour
  
  // Dynamic data - shorter cache
  products: { ttl: 5 * 60 * 1000 }, // 5 minutes
  blogs: { ttl: 10 * 60 * 1000 }, // 10 minutes
  enquiries: { ttl: 2 * 60 * 1000 }, // 2 minutes
  users: { ttl: 5 * 60 * 1000 }, // 5 minutes
  
  // Real-time data - very short cache
  analytics: { ttl: 30 * 1000 }, // 30 seconds
  realtime: { ttl: 10 * 1000 }, // 10 seconds
};

// Enhanced fetch with caching
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  ttl?: number
): Promise<T> {
  const key = cacheKey || apiCache.generateKey(url, options);
  
  // Check cache first
  if (options.method === 'GET' || !options.method) {
    const cached = apiCache.get<T>(key);
    if (cached) {
      console.log(`Cache hit: ${key}`);
      return cached;
    }
  }

  // Make API call
  console.log(`Cache miss: ${key}`);
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Cache successful GET requests
  if (options.method === 'GET' || !options.method) {
    apiCache.set(key, data, ttl);
  }
  
  return data;
}

// Preload critical data
export async function preloadCriticalData() {
  const criticalEndpoints = [
    { url: '/categories/', key: 'categories' },
    { url: '/subcategories/', key: 'subcategories' }
  ];

  try {
    await Promise.all(
      criticalEndpoints.map(async ({ url, key }) => {
        const config = CACHE_CONFIG[key as keyof typeof CACHE_CONFIG];
        await cachedFetch(url, {}, key, config?.ttl);
      })
    );
    console.log('Critical data preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload critical data:', error);
  }
}

// Clean expired cache periodically
setInterval(() => {
  apiCache.cleanExpired();
}, 60 * 1000); // Clean every minute

export default apiCache;
