import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Products from '../components/Products';

const ProductsPage = () => {
  return (
    <>
      <Helmet>
        <title>Premium Agricultural Products & Export Categories | Amber Global Trade</title>
        <meta name="description" content="Explore our comprehensive range of premium agricultural products including Basmati rice, organic spices, dry fruits, and pulses. Certified for export with FSSAI, APEDA, and ISO compliance." />
        <meta name="keywords" content="agricultural products, Basmati rice export, organic spices, dry fruits, pulses, FSSAI certified, APEDA registered, export quality, premium products, India export" />
        <meta name="author" content="Amber Global Trade" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://amberglobaltrade.com/products" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Premium Agricultural Products & Export Categories | Amber Global Trade" />
        <meta property="og:description" content="Explore our comprehensive range of premium agricultural products including Basmati rice, organic spices, dry fruits, and pulses. Certified for export with FSSAI, APEDA, and ISO compliance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amberglobaltrade.com/products" />
        <meta property="og:image" content="https://amberglobaltrade.com/assets/products-og.jpg" />
        <meta property="og:site_name" content="Amber Global Trade" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Premium Agricultural Products & Export Categories | Amber Global Trade" />
        <meta name="twitter:description" content="Explore our comprehensive range of premium agricultural products including Basmati rice, organic spices, dry fruits, and pulses." />
        <meta name="twitter:image" content="https://amberglobaltrade.com/assets/products-og.jpg" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Premium Agricultural Products & Export Categories",
            "description": "Explore our comprehensive range of premium agricultural products including Basmati rice, organic spices, dry fruits, and pulses.",
            "url": "https://amberglobaltrade.com/products",
            "mainEntity": {
              "@type": "Organization",
              "name": "Amber Global Trade",
              "url": "https://amberglobaltrade.com",
              "logo": "https://amberglobaltrade.com/assets/logo.png",
              "description": "Premium agricultural export company specializing in Basmati rice, organic spices, and dry fruits with full compliance certification."
            }
          })}
        </script>
      </Helmet>
      
      <div className="pt-32">
        <Products 
          showProducts={false}
          pageTitle="Our Product Categories"
          pageDescription="Browse through our comprehensive range of product categories and subcategories"
        />
      </div>
    </>
  );
};

export default ProductsPage;