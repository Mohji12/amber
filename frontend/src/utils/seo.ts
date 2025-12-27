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

/**
 * Google Ads-optimized meta description generator
 * Creates conversion-focused meta descriptions (150-160 characters) for lead generation
 */
export interface LeadGenMetaDescriptionOptions {
  primaryKeyword: string;
  valueProposition?: string;
  callToAction?: string;
  urgency?: string;
  benefits?: string[];
  maxLength?: number;
}

/**
 * Generate a Google Ads-optimized meta description for lead generation
 */
export function generateLeadGenMetaDescription(
  options: LeadGenMetaDescriptionOptions
): string {
  const {
    primaryKeyword,
    valueProposition,
    callToAction = 'Get Quote',
    urgency,
    benefits = [],
    maxLength = 160
  } = options;

  // Build description components
  const parts: string[] = [];

  // Start with value proposition or primary keyword
  if (valueProposition) {
    parts.push(valueProposition);
  } else {
    parts.push(`Premium ${primaryKeyword}`);
  }

  // Add benefits if available
  if (benefits.length > 0) {
    const benefitText = benefits.slice(0, 2).join(', ');
    parts.push(benefitText);
  }

  // Add urgency if provided
  if (urgency) {
    parts.push(urgency);
  }

  // Always end with call-to-action
  parts.push(`${callToAction} today!`);

  // Join and trim to max length
  let description = parts.join('. ');
  
  // Ensure it's within Google's recommended length (150-160 chars)
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }

  // Ensure minimum length for effectiveness
  if (description.length < 120) {
    description += ' Contact us for competitive pricing and fast delivery.';
  }

  return description.trim();
}

/**
 * Page-specific meta descriptions for Google Ads campaigns
 */
export const PAGE_META_DESCRIPTIONS = {
  homepage: generateLeadGenMetaDescription({
    primaryKeyword: 'Agricultural Export',
    valueProposition: 'Premium FSSAI & APEDA certified agricultural exports from India',
    benefits: ['Certified quality', 'Competitive pricing', 'Global shipping'],
    callToAction: 'Request Quote'
  }),
  
  products: generateLeadGenMetaDescription({
    primaryKeyword: 'Premium Agricultural Products',
    valueProposition: 'Browse our certified export-quality products',
    benefits: ['Basmati rice', 'Organic spices', 'Dry fruits', 'Pulses'],
    callToAction: 'Get Quote'
  }),
  
  contact: generateLeadGenMetaDescription({
    primaryKeyword: 'Export Consultation',
    valueProposition: 'Expert export guidance and support',
    benefits: ['Free consultation', 'Competitive quotes', 'Fast response'],
    callToAction: 'Contact Us'
  }),
  
  quote: generateLeadGenMetaDescription({
    primaryKeyword: 'Export Quote',
    valueProposition: 'Get personalized pricing for your export needs',
    benefits: ['Custom pricing', 'MOQ options', 'Delivery estimates'],
    urgency: 'Limited time offers available',
    callToAction: 'Request Quote'
  }),
  
  login: generateLeadGenMetaDescription({
    primaryKeyword: 'Export Platform',
    valueProposition: 'Access your export dashboard',
    benefits: ['Track orders', 'Manage quotes', 'View analytics'],
    callToAction: 'Sign In'
  }),
  
  signup: generateLeadGenMetaDescription({
    primaryKeyword: 'Export Account',
    valueProposition: 'Create your free export account',
    benefits: ['Access quotes', 'Track orders', 'Expert support'],
    callToAction: 'Sign Up Free'
  }),
  
  blogs: generateLeadGenMetaDescription({
    primaryKeyword: 'Export Guides',
    valueProposition: 'Expert insights on agricultural exports',
    benefits: ['Industry knowledge', 'Export tips', 'Compliance guides'],
    callToAction: 'Read More'
  })
};

/**
 * Get fallback meta description for a page
 */
export function getFallbackMetaDescription(pageType: keyof typeof PAGE_META_DESCRIPTIONS): string {
  return PAGE_META_DESCRIPTIONS[pageType] || PAGE_META_DESCRIPTIONS.homepage;
}

/**
 * Enhance existing meta description for Google Ads
 * Adds conversion-focused elements if missing
 */
export function enhanceMetaDescriptionForAds(
  description: string,
  callToAction?: string
): string {
  // If already has CTA, return as is
  if (description.match(/(get quote|contact|request|call|sign up|buy now)/i)) {
    return description;
  }

  // Add CTA if missing
  const cta = callToAction || 'Get Quote';
  const enhanced = `${description} ${cta} today for competitive pricing!`;
  
  // Trim to 160 chars
  return enhanced.length > 160 ? enhanced.substring(0, 157) + '...' : enhanced;
}

