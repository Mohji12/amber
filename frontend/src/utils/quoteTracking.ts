/**
 * Utility functions for quote tracking and URL generation
 * Used for ad tracking and analytics
 */

export interface QuoteTrackingParams {
  product?: string;
  subcategory?: string;
  category?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Generate a quote URL with tracking parameters
 * @param params - Tracking parameters
 * @returns URL string with query parameters
 */
export function generateQuoteUrl(params: QuoteTrackingParams = {}): string {
  const baseUrl = '/quote';
  const queryParams = new URLSearchParams();
  
  // Add product information
  if (params.product) {
    queryParams.append('product', params.product);
  }
  if (params.subcategory) {
    queryParams.append('subcategory', params.subcategory);
  }
  if (params.category) {
    queryParams.append('category', params.category);
  }
  
  // Add source tracking
  if (params.source) {
    queryParams.append('source', params.source);
  }
  
  // Add UTM parameters for ad tracking
  if (params.utm_source) {
    queryParams.append('utm_source', params.utm_source);
  }
  if (params.utm_medium) {
    queryParams.append('utm_medium', params.utm_medium);
  }
  if (params.utm_campaign) {
    queryParams.append('utm_campaign', params.utm_campaign);
  }
  if (params.utm_term) {
    queryParams.append('utm_term', params.utm_term);
  }
  if (params.utm_content) {
    queryParams.append('utm_content', params.utm_content);
  }
  
  // Preserve existing UTM parameters from URL if not provided
  if (typeof window !== 'undefined' && !params.utm_source) {
    const currentParams = new URLSearchParams(window.location.search);
    const existingUtmSource = currentParams.get('utm_source');
    const existingUtmMedium = currentParams.get('utm_medium');
    const existingUtmCampaign = currentParams.get('utm_campaign');
    const existingUtmTerm = currentParams.get('utm_term');
    const existingUtmContent = currentParams.get('utm_content');
    
    if (existingUtmSource) queryParams.append('utm_source', existingUtmSource);
    if (existingUtmMedium) queryParams.append('utm_medium', existingUtmMedium);
    if (existingUtmCampaign) queryParams.append('utm_campaign', existingUtmCampaign);
    if (existingUtmTerm) queryParams.append('utm_term', existingUtmTerm);
    if (existingUtmContent) queryParams.append('utm_content', existingUtmContent);
  }
  
  const queryString = queryParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Track quote button click for analytics
 * @param params - Tracking parameters
 */
export function trackQuoteClick(params: QuoteTrackingParams = {}): void {
  // Note: Tracking is handled via GTM dataLayer
  
  // Store in localStorage for analytics
  try {
    const quoteClicks = JSON.parse(localStorage.getItem('quote_clicks') || '[]');
    quoteClicks.push({
      ...params,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer
    });
    
    // Keep only last 100 clicks
    if (quoteClicks.length > 100) {
      quoteClicks.shift();
    }
    
    localStorage.setItem('quote_clicks', JSON.stringify(quoteClicks));
  } catch (error) {
    console.error('Error tracking quote click:', error);
  }
}

/**
 * Get tracking parameters from current URL
 * @returns QuoteTrackingParams object
 */
export function getTrackingParamsFromUrl(): QuoteTrackingParams {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
    source: params.get('source') || undefined
  };
}

