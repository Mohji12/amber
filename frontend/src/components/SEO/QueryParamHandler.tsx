/**
 * QueryParamHandler Component
 * Prevents indexing of URLs with query parameters by adding noindex meta tag
 * and ensuring canonical points to base URL without query params
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface QueryParamHandlerProps {
  /**
   * List of allowed query parameters that should NOT trigger noindex
   * Example: ['utm_source', 'utm_medium', 'utm_campaign'] for tracking params
   */
  allowedParams?: string[];
  
  /**
   * Whether to apply noindex to filtered URLs
   * Default: true
   */
  enableNoIndex?: boolean;
}

const QueryParamHandler: React.FC<QueryParamHandlerProps> = ({ 
  allowedParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'],
  enableNoIndex = true 
}) => {
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.amberglobaltrade.com';
  
  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const hasQueryParams = searchParams.toString().length > 0;
  
  // Check if there are any non-allowed query parameters
  const hasFilterParams = Array.from(searchParams.keys()).some(
    key => !allowedParams.includes(key)
  );
  
  // Determine if we should add noindex
  const shouldNoIndex = enableNoIndex && hasQueryParams && hasFilterParams;
  
  // Get base URL without query parameters for canonical
  let basePath = location.pathname;
  
  // Add trailing slash if needed (except homepage)
  if (basePath !== '/' && !basePath.endsWith('/')) {
    const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(basePath);
    if (!hasFileExtension) {
      basePath = `${basePath}/`;
    }
  }
  
  const canonicalUrl = `${siteUrl}${basePath}`;
  
  return (
    <Helmet>
      {shouldNoIndex && (
        <meta name="robots" content="noindex, follow" />
      )}
      {/* Ensure canonical always points to base URL without query params */}
      {hasQueryParams && (
        <link rel="canonical" href={canonicalUrl} />
      )}
    </Helmet>
  );
};

export default QueryParamHandler;
