/**
 * Example: How to use the Complete SEO System
 * 
 * This file demonstrates how to integrate the SEO system into your pages
 */

import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import CompleteSEO from './CompleteSEO';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Example 1: Product Page with Auto-Generated SEO
 */
export const ProductPageWithSEO: React.FC<{ productId: number }> = ({ productId }) => {
  const { seoData, loading, error } = useSEO('product', productId);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !seoData) {
    return <div>Error loading SEO data</div>;
  }

  return (
    <CompleteSEO seoData={seoData}>
      <div>
        {/* Your page content */}
        <h1>{seoData.headings.h1}</h1>
        <p>{seoData.content.short_intro}</p>
        
        {/* Use SEO-generated content */}
        <div>
          <h2>{seoData.headings.h2_sections[0]}</h2>
          <p>{seoData.content.long_description}</p>
        </div>

        {/* FAQ Section */}
        <section>
          <h2>Frequently Asked Questions</h2>
          {seoData.faq.map((faq, idx) => (
            <div key={idx}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>

        {/* Internal Links */}
        <nav>
          {seoData.internal_links.map((link, idx) => (
            <a key={idx} href={link.target_url}>
              {link.anchor_text}
            </a>
          ))}
        </nav>
      </div>
    </CompleteSEO>
  );
};

/**
 * Example 2: Custom SEO Generation
 */
import { useCustomSEO } from '../../hooks/useSEO';
import { SEORequest } from '../../api';

export const CustomPageWithSEO: React.FC = () => {
  const seoRequest: SEORequest = {
    url: '/custom-page',
    page_type: 'static',
    primary_keyword: 'Custom Page Title',
    secondary_keywords: ['keyword1', 'keyword2'],
    short_description: 'Description of the page',
    long_description: 'Longer description...'
  };

  const { seoData, loading } = useCustomSEO(seoRequest);

  if (loading || !seoData) {
    return <LoadingSpinner />;
  }

  return (
    <CompleteSEO seoData={seoData}>
      <div>
        <h1>{seoData.headings.h1}</h1>
        <p>{seoData.content.hero_tagline}</p>
      </div>
    </CompleteSEO>
  );
};

/**
 * Example 3: Homepage with SEO
 */
export const HomepageWithSEO: React.FC = () => {
  const { seoData, loading } = useSEO('homepage');

  if (loading || !seoData) {
    return <LoadingSpinner />;
  }

  return (
    <CompleteSEO seoData={seoData}>
      <div>
        <h1>{seoData.headings.h1}</h1>
        <p>{seoData.content.hero_tagline}</p>
        {/* Rest of homepage content */}
      </div>
    </CompleteSEO>
  );
};

