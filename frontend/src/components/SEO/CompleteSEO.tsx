/**
 * Complete SEO Component
 * Applies all SEO meta tags, structured data, and social media tags
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOData, enhanceMetaDescriptionForAds, formatImageUrl, getFallbackMetaDescription } from '../../utils/seo';

interface CompleteSEOProps {
  seoData?: SEOData | null;
  children?: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  pageType?: 'homepage' | 'products' | 'contact' | 'quote' | 'login' | 'signup' | 'blogs';
}

const CompleteSEO: React.FC<CompleteSEOProps> = ({ 
  seoData, 
  children, 
  fallbackTitle,
  fallbackDescription,
  pageType
}) => {
  // If no SEO data, use fallbacks or render children without SEO tags
  if (!seoData) {
    if (fallbackTitle || fallbackDescription || pageType) {
      const defaultDescription = fallbackDescription || 
        (pageType ? getFallbackMetaDescription(pageType) : 
        'Premium agricultural export company specializing in Basmati rice, organic spices, dry fruits, and pulses. FSSAI certified, APEDA registered.');
      const defaultTitle = fallbackTitle || 'Amber Global Trade - Premium Agricultural Export Company';
      
      return (
        <>
          <Helmet>
            <html lang="en" />
            <title>{defaultTitle}</title>
            <meta name="description" content={enhanceMetaDescriptionForAds(defaultDescription)} />
            <meta name="keywords" content="agricultural export, Basmati rice export, organic spices, dry fruits export, pulses export, FSSAI certified, APEDA registered" />
            <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
            
            {/* Open Graph Tags */}
            <meta property="og:title" content={defaultTitle} />
            <meta property="og:description" content={enhanceMetaDescriptionForAds(defaultDescription)} />
            <meta property="og:image" content={formatImageUrl('/assets/og-default.jpg')} />
            <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Amber Global Trade" />
            
            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={defaultTitle} />
            <meta name="twitter:description" content={enhanceMetaDescriptionForAds(defaultDescription)} />
            <meta name="twitter:image" content={formatImageUrl('/assets/og-default.jpg')} />
          </Helmet>
          {children}
        </>
      );
    }
    return <>{children}</>;
  }
  
  const { meta, canonical, schema, social_meta, images } = seoData;
  
  // Get main image for social sharing
  const mainImage = images && images.length > 0 
    ? formatImageUrl(images[0].original_url)
    : formatImageUrl('/assets/og-default.jpg');

  // Enhance meta description for Google Ads lead generation
  // Ensure it's optimized for conversions (150-160 characters)
  const enhancedDescription = enhanceMetaDescriptionForAds(
    meta.description,
    'Get Quote'
  );

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <html lang="en" />
        <title>{meta.title}</title>
        <meta name="description" content={enhancedDescription} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={canonical.url} />
        
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
        <meta property="og:description" content={social_meta['og:description'] || enhancedDescription} />
        <meta property="og:image" content={social_meta['og:image'] || mainImage} />
        <meta property="og:url" content={social_meta['og:url'] || canonical.url} />
        <meta property="og:type" content={social_meta['og:type'] || 'website'} />
        <meta property="og:site_name" content={social_meta['og:site_name'] || 'Amber Global Trade'} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={meta.title} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={social_meta['twitter:card'] || 'summary_large_image'} />
        <meta name="twitter:title" content={social_meta['twitter:title'] || meta.title} />
        <meta name="twitter:description" content={social_meta['twitter:description'] || enhancedDescription} />
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
