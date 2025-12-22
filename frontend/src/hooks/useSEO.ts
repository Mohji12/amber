/**
 * useSEO Hook
 * Custom hook for fetching and managing SEO data
 */
import { useState, useEffect } from 'react';
import { 
  getProductSEO, 
  getSubcategorySEO, 
  getHomepageSEO, 
  getBlogSEO,
  generateSEO,
  SEORequest,
  SEOData 
} from '../api';
import { validateSEOData } from '../utils/seo';

interface UseSEOResult {
  seoData: SEOData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for fetching SEO data by page type
 */
export function useSEO(
  pageType: 'product' | 'subcategory' | 'homepage' | 'blog',
  id?: number
): UseSEOResult {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSEO = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: SEOData;
      
      switch (pageType) {
        case 'product':
          if (!id) throw new Error('Product ID is required');
          data = await getProductSEO(id);
          break;
        case 'subcategory':
          if (!id) throw new Error('Subcategory ID is required');
          data = await getSubcategorySEO(id);
          break;
        case 'homepage':
          data = await getHomepageSEO();
          break;
        case 'blog':
          if (!id) throw new Error('Blog ID is required');
          data = await getBlogSEO(id);
          break;
        default:
          throw new Error(`Unsupported page type: ${pageType}`);
      }
      
      if (validateSEOData(data)) {
        setSeoData(data);
      } else {
        throw new Error('Invalid SEO data structure');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch SEO data');
      setError(error);
      console.error('SEO fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEO();
  }, [pageType, id]);

  return {
    seoData,
    loading,
    error,
    refetch: fetchSEO
  };
}

/**
 * Hook for generating custom SEO data
 */
export function useCustomSEO(request: SEORequest | null): UseSEOResult {
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!request) {
      setSeoData(null);
      return;
    }

    const fetchSEO = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await generateSEO(request);
        
        if (validateSEOData(data)) {
          setSeoData(data);
        } else {
          throw new Error('Invalid SEO data structure');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to generate SEO data');
        setError(error);
        console.error('SEO generation error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSEO();
  }, [JSON.stringify(request)]);

  return {
    seoData,
    loading,
    error,
    refetch: async () => {
      if (request) {
        const data = await generateSEO(request);
        if (validateSEOData(data)) {
          setSeoData(data);
        }
      }
    }
  };
}

