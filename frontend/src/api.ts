// Centralized API utility for frontend-backend connection
// Force local backend for development
const API_BASE_URL = "http://127.0.0.1:8000";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
//const API_BASE_URL = "https://6hgfjwmhx4.execute-api.ap-south-1.amazonaws.com";

// console.log('🚀 API_BASE_URL initialized to:', API_BASE_URL);


import { cachedFetch, CACHE_CONFIG } from './utils/apiCache';

// API configuration for better performance
const API_CONFIG = {
  timeout: 15000, // 15 seconds timeout
  retries: 3,
  retryDelay: 1000, // 1 second delay between retries
};

// Utility function to create fetch with timeout
function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_CONFIG.timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
}

// Retry wrapper for API calls
async function withRetry<T>(
  apiCall: () => Promise<T>,
  retries = API_CONFIG.retries,
  delay = API_CONFIG.retryDelay
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (retries > 0 && (error instanceof Error && error.name === 'AbortError')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(apiCall, retries - 1, delay * 1.5);
    }
    throw error;
  }
}

// Loading state management
let isLoading = false;
const loadingCallbacks: Array<(loading: boolean) => void> = [];

export const setLoadingState = (loading: boolean) => {
  isLoading = loading;
  loadingCallbacks.forEach(callback => callback(loading));
};

export const onLoadingStateChange = (callback: (loading: boolean) => void) => {
  loadingCallbacks.push(callback);
  return () => {
    const index = loadingCallbacks.indexOf(callback);
    if (index > -1) loadingCallbacks.splice(index, 1);
  };
};

export const getLoadingState = () => isLoading;

export async function login(email: string, password: string) {
  setLoadingState(true);
  try {
    // Try admin login first
    try {
      const adminRes = await withRetry(() => 
        fetchWithTimeout(`${API_BASE_URL}/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
      );
      
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        return { ...adminData, user_type: 'admin' };
      }
    } catch (error) {
      // Continue to regular user login if admin login fails
      console.log("Admin login failed, trying regular login");
    }
    
    // Fallback to regular user login
    const res = await withRetry(() => 
      fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
    );
    return res.json();
  } finally {
    setLoadingState(false);
  }
}

export async function signup(user_name: string, email: string, password: string, confirm_password: string) {
  setLoadingState(true);
  try {
    const res = await withRetry(() => 
      fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name, email, password, confirm_password }),
      })
    );
    return res.json();
  } finally {
    setLoadingState(false);
  }
}

export async function verifyOtp(email: string, otp_code: string) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp_code }),
  });
  return res.json();
}

export async function resendOtp(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function getProducts(token?: string) {
  setLoadingState(true);
  try {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    const cacheKey = `products${token ? `_${token}` : ''}`;
    const data = await cachedFetch(
      `${API_BASE_URL}/products/`,
      { headers },
      cacheKey,
      CACHE_CONFIG.products.ttl
    );
    return data;
  } finally {
    setLoadingState(false);
  }
}

export async function getBlogs() {
  return await cachedFetch(
    `${API_BASE_URL}/blogs/`,
    {},
    'blogs',
    CACHE_CONFIG.blogs.ttl
  );
}

export async function getBlog(blogId: string | number) {
  const res = await fetch(`${API_BASE_URL}/blogs/${blogId}`);
  if (!res.ok) {
    throw new Error('Blog not found');
  }
  return res.json();
}

export async function createEnquiry(data: any) {
  const res = await fetch(`${API_BASE_URL}/enquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createProduct(productData: any) {
  const res = await fetch(`${API_BASE_URL}/products/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return res.json();
}

export async function deleteProduct(productId: number) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
  });
  // DELETE might not return a JSON body, so we check for a successful status
  if (res.ok) {
    return { success: true };
  }
  return res.json();
}

export async function updateProduct(productId: number, productData: any) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return res.json();
}

export async function getCategories() {
  // Add cache-busting parameter to ensure fresh data
  const cacheBuster = Date.now();
  const url = `${API_BASE_URL}/categories/?cb=${cacheBuster}`;
  
  // Clear cache to ensure fresh data
  const { apiCache } = await import('./utils/apiCache');
  apiCache.delete('categories');
  apiCache.clear(); // Clear all cache
  
  // Use a unique cache key to bypass any cached data
  const uniqueCacheKey = `categories_${cacheBuster}`;
  
  return await cachedFetch(
    url,
    {},
    uniqueCacheKey,
    CACHE_CONFIG.categories.ttl
  );
}

export async function createCategory(data: any) {
  const res = await fetch(`${API_BASE_URL}/categories/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCategory(categoryId: number, data: any) {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCategory(categoryId: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
    });
    
    if (res.ok) {
      const result = await res.json();
      return result;
    } else {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Failed to delete category');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while deleting the category');
  }
}

export async function deleteCategoryWithDependencies(categoryId: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${categoryId}/delete-with-dependencies`, {
      method: 'DELETE',
    });
    
    if (res.ok) {
      const result = await res.json();
      return result;
    } else {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Failed to delete category with dependencies');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while deleting the category with dependencies');
  }
}

export async function createBlog(blogData: any) {
  const res = await fetch(`${API_BASE_URL}/blogs/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });
  return res.json();
}

export async function updateBlog(blogId: number, blogData: any) {
  const res = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });
  return res.json();
}

export async function deleteBlog(blogId: number) {
  const res = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    return { success: true };
  }
  return res.json();
}

export async function getAnalyticsOverview() {
  const res = await fetch(`${API_BASE_URL}/analytics/overview`);
  return res.json();
}

export async function getRecentActivities() {
  const res = await fetch(`${API_BASE_URL}/analytics/activities/recent`);
  return res.json();
}

export async function getEnquiries() {
  const res = await fetch(`${API_BASE_URL}/enquiries/`);
  return res.json();
}

export async function deleteEnquiry(enquiryId: number) {
  const res = await fetch(`${API_BASE_URL}/enquiries/${enquiryId}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    return { success: true };
  }
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${API_BASE_URL}/analytics/users`);
  return res.json();
}

export async function getFeaturedProducts() {
  const res = await fetch(`${API_BASE_URL}/products/featured/`);
  return res.json();
}

export async function getSubcategories() {
  const cacheBuster = Date.now();
  const url = `${API_BASE_URL}/subcategories/?cb=${cacheBuster}`;
  
  // Clear cache to ensure fresh data
  const { apiCache } = await import('./utils/apiCache');
  apiCache.delete('subcategories');
  apiCache.clear(); // Clear all cache
  
  // Use a unique cache key to bypass any cached data
  const uniqueCacheKey = `subcategories_${cacheBuster}`;
  
  return await cachedFetch(
    url,
    {},
    uniqueCacheKey,
    CACHE_CONFIG.subcategories.ttl
  );
}

export async function getSubcategory(id: number) {
  const res = await fetch(`${API_BASE_URL}/subcategories/${id}`);
  return res.json();
}

export async function createSubcategory(data: any) {
  const res = await fetch(`${API_BASE_URL}/subcategories/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateSubcategory(id: number, data: any) {
  const res = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteSubcategory(id: number) {
  const res = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export const forgotPassword = async (email: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.detail || 'Failed to send password reset email';
    
    // Provide more specific error messages
    if (response.status === 404) {
      throw new Error('No account found with this email address. Please check your email or create a new account.');
    } else if (response.status === 500) {
      throw new Error('Unable to send password reset email. Please try again later.');
    } else {
      throw new Error(errorMessage);
    }
  }
  
  return response.json();
};

export const resetPassword = async (email: string, otp_code: string, new_password: string, confirm_password: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      email, 
      otp_code, 
      new_password, 
      confirm_password 
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.detail || 'Failed to reset password';
    
    // Provide more specific error messages
    if (response.status === 400) {
      if (errorMessage.includes('Invalid or expired OTP')) {
        throw new Error('The verification code is invalid or has expired. Please request a new code.');
      } else if (errorMessage.includes('Passwords do not match')) {
        throw new Error('Passwords do not match. Please make sure both passwords are identical.');
      } else if (errorMessage.includes('Password requirements')) {
        throw new Error(errorMessage);
      } else {
        throw new Error(errorMessage);
      }
    } else if (response.status === 404) {
      throw new Error('User account not found. Please try the password reset process again.');
    } else {
      throw new Error('Failed to reset password. Please try again.');
    }
  }
  
  return response.json();
};
// Add more functions as needed for categories, analytics, etc. 

export async function getProductViewStats() {
  const res = await fetch(`${API_BASE_URL}/analytics/product-views/stats`);
  return res.json();
}

export async function trackProductView(productId: number, viewType: string = 'page_view') {
  const res = await fetch(`${API_BASE_URL}/analytics/track-product-view?product_id=${productId}&view_type=${viewType}`, {
    method: 'POST',
  });
  return res.json();
}

export async function getProductViews(productId: number) {
  const res = await fetch(`${API_BASE_URL}/analytics/product-views/${productId}`);
  return res.json();
} 

export async function getBlogViewStats() {
  const res = await fetch(`${API_BASE_URL}/analytics/blog-views/stats`);
  return res.json();
}

export async function trackBlogView(blogId: number, viewType: string = 'page_view', timeSpentSeconds?: number, scrollDepth?: number) {
  const params = new URLSearchParams({
    blog_id: blogId.toString(),
    view_type: viewType
  });
  
  if (timeSpentSeconds !== undefined) {
    params.append('time_spent_seconds', timeSpentSeconds.toString());
  }
  
  if (scrollDepth !== undefined) {
    params.append('scroll_depth', scrollDepth.toString());
  }
  
  const res = await fetch(`${API_BASE_URL}/analytics/track-blog-view?${params}`, {
    method: 'POST',
  });
  return res.json();
} 

export async function trackUserEngagement(
  sessionId: string,
  pageUrl: string,
  pageType: string,
  pageTitle?: string,
  timeSpentSeconds?: number,
  scrollDepth?: number,
  clicksCount: number = 0,
  interactionsCount: number = 0
) {
  const params = new URLSearchParams({
    session_id: sessionId,
    page_url: pageUrl,
    page_type: pageType
  });
  
  if (pageTitle) params.append('page_title', pageTitle);
  if (timeSpentSeconds !== undefined) params.append('time_spent_seconds', timeSpentSeconds.toString());
  if (scrollDepth !== undefined) params.append('scroll_depth', scrollDepth.toString());
  if (clicksCount > 0) params.append('clicks_count', clicksCount.toString());
  if (interactionsCount > 0) params.append('interactions_count', interactionsCount.toString());
  
  const res = await fetch(`${API_BASE_URL}/analytics/track-user-engagement?${params}`, {
    method: 'POST',
  });
  return res.json();
}

export async function endUserSession(sessionId: string, totalSessionTime: number) {
  const params = new URLSearchParams({
    session_id: sessionId,
    total_session_time: totalSessionTime.toString()
  });
  
  const res = await fetch(`${API_BASE_URL}/analytics/end-user-session?${params}`, {
    method: 'POST',
  });
  return res.json();
}

export async function getUserEngagementStats() {
  const res = await fetch(`${API_BASE_URL}/analytics/user-engagement/stats`);
  return res.json();
}

export async function getRealtimeUserEngagement() {
  const res = await fetch(`${API_BASE_URL}/analytics/user-engagement/realtime`);
  return res.json();
} 

export async function getProductsBySubcategory(subcategoryId: number, token?: string) {
  setLoadingState(true);
  try {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await withRetry(() => 
      fetchWithTimeout(`${API_BASE_URL}/products/subcategory/${subcategoryId}`, { headers })
    );
    return res.json();
  } finally {
    setLoadingState(false);
  }
} 