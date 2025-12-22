# Complete SEO Implementation Guide

This document describes the comprehensive SEO system implemented for Amber Global Trade.

## Overview

The SEO system provides **complete, production-ready SEO data** for every URL on the website, including:
- Homepage
- Category/Subcategory pages
- Product pages
- Blog pages
- Static pages

## Architecture

### Backend Components

1. **`backend/app/seo_service.py`** - Core SEO generation service
   - Generates all SEO elements (meta tags, structured data, content, etc.)
   - Handles all page types
   - Ensures no duplicate content

2. **`backend/app/routers/seo.py`** - API endpoints
   - `/seo/generate` - Generate SEO for any page type
   - `/seo/product/{id}` - Get SEO for product
   - `/seo/subcategory/{id}` - Get SEO for subcategory
   - `/seo/homepage` - Get homepage SEO
   - `/seo/blog/{id}` - Get blog SEO

### Frontend Components

1. **`frontend/src/hooks/useSEO.ts`** - React hooks for SEO data
   - `useSEO()` - Fetch SEO by page type
   - `useCustomSEO()` - Generate custom SEO

2. **`frontend/src/components/SEO/CompleteSEO.tsx`** - SEO component
   - Applies all meta tags, structured data, social tags

3. **`frontend/src/utils/seo.ts`** - SEO utilities
   - Validation, URL formatting, helpers

## Usage Examples

### 1. Product Page

```tsx
import { useSEO } from '../hooks/useSEO';
import CompleteSEO from '../components/SEO/CompleteSEO';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { seoData, loading } = useSEO('product', Number(id));

  if (loading || !seoData) return <LoadingSpinner />;

  return (
    <CompleteSEO seoData={seoData}>
      <div>
        <h1>{seoData.headings.h1}</h1>
        <p>{seoData.content.short_intro}</p>
        {/* Use seoData.content.long_description */}
        {/* Use seoData.faq for FAQ section */}
      </div>
    </CompleteSEO>
  );
};
```

### 2. Subcategory Page

```tsx
const SubcategoryPage = () => {
  const { id } = useParams();
  const { seoData } = useSEO('subcategory', Number(id));

  return (
    <CompleteSEO seoData={seoData}>
      {/* Page content */}
    </CompleteSEO>
  );
};
```

### 3. Homepage

```tsx
const Homepage = () => {
  const { seoData } = useSEO('homepage');

  return (
    <CompleteSEO seoData={seoData}>
      {/* Homepage content */}
    </CompleteSEO>
  );
};
```

### 4. Custom SEO Generation

```tsx
import { useCustomSEO } from '../hooks/useSEO';
import { SEORequest } from '../api';

const CustomPage = () => {
  const request: SEORequest = {
    url: '/custom-page',
    page_type: 'static',
    primary_keyword: 'Custom Keyword',
    secondary_keywords: ['keyword1', 'keyword2'],
    short_description: 'Page description',
    // ... other fields
  };

  const { seoData } = useCustomSEO(request);

  return (
    <CompleteSEO seoData={seoData}>
      {/* Page content */}
    </CompleteSEO>
  );
};
```

## SEO Data Structure

Each SEO response includes:

```typescript
{
  url: string;                    // SEO-friendly URL
  meta: {
    title: string;                // 50-60 chars
    description: string;           // 140-160 chars
    keywords: string;
  };
  canonical: {
    url: string;                  // Absolute canonical URL
    pagination_rules?: string;
  };
  headings: {
    h1: string;                   // Single H1
    h2_sections: string[];        // H2 headings
    h3_subsections: string[];     // H3 headings
  };
  content: {
    hero_tagline: string;
    short_intro: string;           // 40-60 words
    long_description: string;     // 300-500 words
    bullet_features: string[];    // 6-10 points
  };
  product_data: {                 // Only for product pages
    product_specifications: {};
    packaging_details: string;
    shelf_life: string;
    storage_conditions: string;
    hs_code: string;
    incoterms_supported: string[];
  };
  faq: Array<{                    // 4-6 FAQs
    question: string;
    answer: string;
  }>;
  images: Array<{
    original_url: string;
    seo_filename: string;
    alt_text: string;             // Max 12 words
    image_title: string;
  }>;
  internal_links: Array<{         // 5-8 links
    anchor_text: string;
    target_url: string;
    placement_hint: string;
  }>;
  schema: {};                     // JSON-LD structured data
  social_meta: {
    "og:title": string;
    "og:description": string;
    "og:image": string;
    "og:url": string;
    "twitter:card": string;
    // ... etc
  };
  technical_notes: {
    core_web_vitals: {};
    image_optimization: {};
    performance: {};
    accessibility: {};
  };
}
```

## Features

### ✅ Complete Coverage
- Meta tags (title, description, keywords)
- Canonical URLs
- Heading structure (H1, H2, H3)
- On-page content
- Product-specific data
- FAQ sections
- Image SEO
- Internal linking
- Structured data (JSON-LD)
- Social media tags (OG, Twitter)
- Technical SEO notes

### ✅ SEO Best Practices
- No duplicate meta titles/descriptions
- Primary keyword first in titles
- Brand name at end of titles
- 50-60 character titles
- 140-160 character descriptions
- Single H1 per page
- Proper heading hierarchy
- Export-focused buyer intent
- B2B commercial language

### ✅ Scalability
- Works for hundreds/thousands of pages
- Database-driven for products/categories
- API-based generation
- Caching support (via existing API cache)

### ✅ Compliance
- Google SEO guidelines
- Schema.org structured data
- Core Web Vitals recommendations
- Accessibility considerations

## API Endpoints

### Generate Custom SEO
```
POST /seo/generate
Body: SEORequest
Response: SEOData
```

### Get Product SEO
```
GET /seo/product/{product_id}
Response: SEOData
```

### Get Subcategory SEO
```
GET /seo/subcategory/{subcategory_id}
Response: SEOData
```

### Get Homepage SEO
```
GET /seo/homepage
Response: SEOData
```

### Get Blog SEO
```
GET /seo/blog/{blog_id}
Response: SEOData
```

## Migration Guide

To migrate existing pages to use the new SEO system:

1. **Replace manual Helmet tags** with `CompleteSEO` component
2. **Use `useSEO` hook** to fetch SEO data
3. **Use SEO-generated content** for headings and descriptions
4. **Remove hardcoded SEO strings**

### Before:
```tsx
<Helmet>
  <title>Product Name - Export Quality</title>
  <meta name="description" content="..." />
  {/* ... many more tags ... */}
</Helmet>
```

### After:
```tsx
const { seoData } = useSEO('product', productId);
return (
  <CompleteSEO seoData={seoData}>
    {/* Page content */}
  </CompleteSEO>
);
```

## Configuration

### Brand Settings
Edit `backend/app/seo_service.py`:
```python
BRAND_NAME = "Amber Global Trade"
SITE_URL = "https://amberglobaltrade.com"
DEFAULT_COUNTRY_OF_ORIGIN = "India"
DEFAULT_TARGET_MARKETS = ["USA", "UAE", "EU", "Singapore", ...]
```

### Frontend Site URL
Set in `.env` or `vite.config.ts`:
```
VITE_SITE_URL=https://amberglobaltrade.com
```

## Testing

### Validate Structured Data
Use Google's Rich Results Test:
https://search.google.com/test/rich-results

### Check Meta Tags
- View page source
- Use browser dev tools
- Use SEO tools (Screaming Frog, etc.)

### Test API Endpoints
```bash
# Test homepage SEO
curl http://localhost:8000/seo/homepage

# Test product SEO
curl http://localhost:8000/seo/product/1

# Generate custom SEO
curl -X POST http://localhost:8000/seo/generate \
  -H "Content-Type: application/json" \
  -d '{
    "url": "/test-page",
    "page_type": "static",
    "primary_keyword": "Test Keyword"
  }'
```

## Best Practices

1. **Always use `CompleteSEO` component** - Don't manually add meta tags
2. **Use SEO-generated content** - Don't hardcode headings/descriptions
3. **Implement internal links** - Use `seoData.internal_links`
4. **Optimize images** - Use `seoData.images` for alt text
5. **Include FAQ sections** - Use `seoData.faq` for featured snippets
6. **Follow technical notes** - Implement Core Web Vitals optimizations

## Support

For questions or issues:
1. Check this documentation
2. Review example implementations in `frontend/src/components/SEO/SEOExample.tsx`
3. Test API endpoints directly
4. Validate structured data with Google's tools

