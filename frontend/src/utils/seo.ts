/**
 * SEO Utility Functions
 * Helper functions for SEO data processing and validation
 */

export interface SEOData {
  url: string;
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  canonical: {
    url: string;
    pagination_rules?: string | null;
  };
  headings: {
    h1: string;
    h2_sections: string[];
    h3_subsections: string[];
  };
  content: {
    hero_tagline: string;
    short_intro: string;
    long_description: string;
    bullet_features: string[];
  };
  product_data: Record<string, any>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  images: Array<{
    original_url: string;
    seo_filename: string;
    alt_text: string;
    image_title: string;
  }>;
  internal_links: Array<{
    anchor_text: string;
    target_url: string;
    placement_hint: string;
  }>;
  schema: Record<string, any>;
  social_meta: Record<string, string>;
  technical_notes: Record<string, any>;
}

/**
 * Validate SEO data structure
 */
export function validateSEOData(data: any): data is SEOData {
  return (
    data &&
    typeof data.url === 'string' &&
    data.meta &&
    typeof data.meta.title === 'string' &&
    typeof data.meta.description === 'string' &&
    data.canonical &&
    typeof data.canonical.url === 'string' &&
    data.headings &&
    typeof data.headings.h1 === 'string' &&
    Array.isArray(data.headings.h2_sections) &&
    data.content &&
    typeof data.content.hero_tagline === 'string' &&
    Array.isArray(data.faq) &&
    Array.isArray(data.images) &&
    Array.isArray(data.internal_links) &&
    data.schema &&
    data.social_meta
  );
}

/**
 * Get site URL from environment or default
 */
export function getSiteUrl(): string {
  return import.meta.env.VITE_SITE_URL || 'https://amberglobaltrade.com';
}

/**
 * Ensure absolute URL
 */
export function ensureAbsoluteUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const siteUrl = getSiteUrl();
  if (url.startsWith('/')) {
    return `${siteUrl}${url}`;
  }
  return `${siteUrl}/${url}`;
}

/**
 * Format image URL for SEO
 */
export function formatImageUrl(url: string): string {
  if (!url) return `${getSiteUrl()}/assets/default-product.jpg`;
  return ensureAbsoluteUrl(url);
}

