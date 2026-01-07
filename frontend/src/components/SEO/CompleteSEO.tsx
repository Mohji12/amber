/**
 * Complete SEO Component
 * Applies all SEO meta tags, structured data, and social media tags
 * Ensures self-referencing canonical URLs for SEO compliance
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SEOData } from '../../utils/seo';
import { ensureAbsoluteUrl, formatImageUrl } from '../../utils/seo';

interface CompleteSEOProps {
  seoData?: SEOData | null;
  children?: React.ReactNode;
}

const CompleteSEO: React.FC<CompleteSEOProps> = ({ seoData, children }) => {
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.amberglobaltrade.com';
  
  // If no SEO data, just render children without SEO tags
  if (!seoData) {
    return <>{children}</>;
  }
  
  const { meta, canonical, schema, social_meta, images } = seoData;
  
  // CRITICAL: Ensure canonical URL is self-referencing (matches current page URL)
  // This prevents "Alternative page with canonical" errors in Google Search Console
  // Canonical URLs should NOT include query parameters - use pathname only
  const currentPath = location.pathname;
  const selfReferencingCanonical = `${siteUrl}${currentPath}`;
  
  // Use self-referencing canonical (current page URL) instead of backend-provided canonical
  // This ensures no canonical loops or conflicts
  const finalCanonicalUrl = selfReferencingCanonical;
  
  // Get main image for social sharing
  const mainImage = images && images.length > 0 
    ? formatImageUrl(images[0].original_url)
    : formatImageUrl('/assets/og-default.jpg');

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <html lang="en" />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        {/* Self-referencing canonical - CRITICAL for SEO compliance */}
        <link rel="canonical" href={finalCanonicalUrl} />
        
        {/* Language and Locale */}
        <meta httpEquiv="content-language" content="en" />
        <meta property="og:locale" content="en_US" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Amber Global Trade" />
        <meta name="copyright" content="Amber Global Trade" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={social_meta['og:title'] || meta.title} />
        <meta property="og:description" content={social_meta['og:description'] || meta.description} />
        <meta property="og:image" content={social_meta['og:image'] || mainImage} />
        <meta property="og:url" content={social_meta['og:url'] || finalCanonicalUrl} />
        <meta property="og:type" content={social_meta['og:type'] || 'website'} />
        <meta property="og:site_name" content={social_meta['og:site_name'] || 'Amber Global Trade'} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={meta.title} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={social_meta['twitter:card'] || 'summary_large_image'} />
        <meta name="twitter:title" content={social_meta['twitter:title'] || meta.title} />
        <meta name="twitter:description" content={social_meta['twitter:description'] || meta.description} />
        <meta name="twitter:image" content={social_meta['twitter:image'] || mainImage} />
        <meta name="twitter:image:alt" content={meta.title} />
        <meta name="twitter:site" content="@amberglobaltrade" />
        <meta name="twitter:creator" content="@amberglobaltrade" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#22c55e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Structured Data (JSON-LD) */}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
      </Helmet>
      {children}
    </>
  );
};

export default CompleteSEO;
