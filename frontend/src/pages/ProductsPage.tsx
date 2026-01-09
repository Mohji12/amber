import React from 'react';
import Products from '../components/Products';
import CompleteSEO from '../components/SEO/CompleteSEO';
import QueryParamHandler from '../components/SEO/QueryParamHandler';
import { useCustomSEO } from '../hooks/useSEO';
import { SEORequest } from '../api';

const ProductsPage = () => {
  // Generate SEO for products listing page
  const seoRequest: SEORequest = {
    url: '/products/',
    page_type: 'static',
    primary_keyword: 'Premium Agricultural Products Export',
    secondary_keywords: [
      'Basmati rice export',
      'organic spices',
      'dry fruits',
      'pulses',
      'FSSAI certified',
      'APEDA registered',
      'export quality',
      'India export'
    ],
    short_description: 'Explore our comprehensive range of premium agricultural products including Basmati rice, organic spices, dry fruits, and pulses. Certified for export with FSSAI, APEDA, and ISO compliance.'
  };

  const { seoData } = useCustomSEO(seoRequest);

  return (
    <CompleteSEO seoData={seoData}>
      <QueryParamHandler />
      <div className="pt-32">
        <Products 
          showProducts={false}
          pageTitle={seoData?.headings?.h1 || "Our Product Categories"}
          pageDescription={seoData?.content?.short_intro || "Browse through our comprehensive range of product categories and subcategories"}
        />
      </div>
    </CompleteSEO>
  );
};

export default ProductsPage;