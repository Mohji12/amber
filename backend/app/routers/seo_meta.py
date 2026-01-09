"""
SEO Meta Tags API Router
Generates pre-rendered HTML meta tags for server-side injection
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import HTMLResponse
from typing import Optional
from app.seo_service import SEOService
from app.database import get_db
from sqlalchemy.orm import Session
from app import models
from app.seo_service import slugify

router = APIRouter()
seo_service = SEOService()
SITE_URL = "https://www.amberglobaltrade.com"


def create_product_slug(name: str, id: int) -> str:
    """Create product slug with ID"""
    base_slug = slugify(name)
    return f"{base_slug}-{id}" if base_slug else f"product-{id}"


def create_subcategory_slug(name: str, id: int) -> str:
    """Create subcategory slug with ID"""
    base_slug = slugify(name)
    return f"{base_slug}-{id}" if base_slug else f"subcategory-{id}"


def create_blog_slug(title: str, id: int) -> str:
    """Create blog slug with ID"""
    base_slug = slugify(title)
    return f"{base_slug}-{id}" if base_slug else f"blog-{id}"


@router.get("/meta-tags", response_class=HTMLResponse)
async def get_meta_tags(
    path: str = Query(..., description="Page path (e.g., /products/, /products/basmati-rice-123/)"),
    db: Session = Depends(get_db)
):
    """
    Generate pre-rendered HTML meta tags for server-side injection
    
    Returns HTML string containing:
    - Title tag
    - Meta description
    - Canonical URL
    - Open Graph tags
    - Twitter Card tags
    - JSON-LD structured data
    """
    try:
        # Normalize path
        path = path.strip()
        if not path.startswith('/'):
            path = f'/{path}'
        
        # Add trailing slash if needed (except homepage)
        if path != '/' and not path.endswith('/'):
            # Check if it's a file extension
            has_file_extension = any(path.endswith(ext) for ext in ['.xml', '.txt', '.jpg', '.png', '.ico', '.json'])
            if not has_file_extension:
                path = f'{path}/'
        
        # Determine page type and fetch data
        seo_data = None
        canonical_url = f"{SITE_URL}{path}"
        
        # Homepage
        if path == '/':
            seo_data = seo_service.generate_complete_seo(
                url="/",
                page_type="homepage",
                primary_keyword="Premium Agricultural Products Export",
                secondary_keywords=[
                    "Basmati rice export",
                    "organic spices",
                    "dry fruits",
                    "pulses",
                    "FSSAI certified",
                    "APEDA registered"
                ],
                short_description="Premium agricultural export company specializing in Basmati rice, organic spices, dry fruits, and pulses. FSSAI certified, APEDA registered."
            )
        
        # Products listing
        elif path == '/products/':
            seo_data = seo_service.generate_complete_seo(
                url="/products/",
                page_type="static",
                primary_keyword="Premium Agricultural Products Export",
                secondary_keywords=[
                    "Basmati rice export",
                    "organic spices",
                    "dry fruits",
                    "pulses"
                ],
                short_description="Explore our comprehensive range of premium agricultural products including Basmati rice, organic spices, dry fruits, and pulses."
            )
        
        # Product detail page
        elif path.startswith('/products/'):
            # Extract slug from path
            slug_part = path.replace('/products/', '').rstrip('/')
            # Try to find product by slug
            products = db.query(models.Product).filter(
                models.Product.status != "Discontinued"
            ).all()
            
            product = None
            for p in products:
                if p.id and p.name:
                    slug = create_product_slug(p.name, p.id)
                    if slug == slug_part:
                        product = p
                        break
            
            if product:
                subcategory = db.query(models.Subcategory).filter(
                    models.Subcategory.id == product.subcategory_id
                ).first()
                category = None
                if subcategory and subcategory.category_id:
                    category = db.query(models.Category).filter(
                        models.Category.id == subcategory.category_id
                    ).first()
                
                seo_data = seo_service.generate_complete_seo(
                    url=path,
                    page_type="product",
                    primary_keyword=f"{product.name} Export",
                    secondary_keywords=[product.name, "export", "India export"],
                    product_name=product.name,
                    short_description=product.details or product.name,
                    long_description=product.description,
                    price=None,
                    availability="InStock" if product.status != "Discontinued" else "OutOfStock",
                    moq=product.moq,
                    certifications=product.certifications,
                    image_urls=[product.image_url] if product.image_url else None,
                    category_name=category.name if category else None
                )
        
        # Subcategory page
        elif path.startswith('/subcategories/'):
            slug_part = path.replace('/subcategories/', '').rstrip('/')
            subcategories = db.query(models.Subcategory).all()
            
            subcategory = None
            for s in subcategories:
                if s.id and s.name:
                    slug = create_subcategory_slug(s.name, s.id)
                    if slug == slug_part:
                        subcategory = s
                        break
            
            if subcategory:
                category = None
                if subcategory.category_id:
                    category = db.query(models.Category).filter(
                        models.Category.id == subcategory.category_id
                    ).first()
                
                seo_data = seo_service.generate_complete_seo(
                    url=path,
                    page_type="category",
                    primary_keyword=f"{subcategory.name} Export",
                    secondary_keywords=[subcategory.name, "export"],
                    category_name=category.name if category else subcategory.name,
                    short_description=subcategory.description or subcategory.name
                )
        
        # Blogs listing
        elif path == '/blogs/':
            seo_data = seo_service.generate_complete_seo(
                url="/blogs/",
                page_type="static",
                primary_keyword="Agricultural Export Blog",
                secondary_keywords=["export guide", "agricultural products"],
                short_description="Read our comprehensive guides on agricultural export, sourcing, and trade."
            )
        
        # Blog detail page
        elif path.startswith('/blogs/'):
            slug_part = path.replace('/blogs/', '').rstrip('/')
            blogs = db.query(models.Blog).all()
            
            blog = None
            for b in blogs:
                if b.id and b.title:
                    slug = create_blog_slug(b.title, b.id)
                    if slug == slug_part:
                        blog = b
                        break
            
            if blog:
                seo_data = seo_service.generate_complete_seo(
                    url=path,
                    page_type="blog",
                    primary_keyword=blog.title,
                    secondary_keywords=[],
                    short_description=blog.content[:160] if blog.content else blog.title
                )
        
        # Contact page
        elif path == '/contact/':
            seo_data = seo_service.generate_complete_seo(
                url="/contact/",
                page_type="static",
                primary_keyword="Contact Amber Global Trade",
                secondary_keywords=["contact", "inquiry"],
                short_description="Get in touch with Amber Global Trade for export inquiries and product information."
            )
        
        # Quote page
        elif path == '/quote/':
            seo_data = seo_service.generate_complete_seo(
                url="/quote/",
                page_type="static",
                primary_keyword="Get Export Quote",
                secondary_keywords=["quote", "pricing"],
                short_description="Request a quote for premium agricultural products export from India."
            )
        
        # Default fallback
        if not seo_data:
            seo_data = seo_service.generate_complete_seo(
                url=path,
                page_type="static",
                primary_keyword="Amber Global Trade",
                secondary_keywords=[],
                short_description="Premium agricultural export company from India."
            )
        
        # Generate HTML meta tags
        meta = seo_data.get('meta', {})
        schema = seo_data.get('schema', {})
        social_meta = seo_data.get('social_meta', {})
        images = seo_data.get('images', [])
        
        main_image = images[0]['original_url'] if images and len(images) > 0 else f"{SITE_URL}/assets/og-default.jpg"
        
        # Build HTML meta tags
        html_parts = []
        
        # Title
        html_parts.append(f'<title>{meta.get("title", "Amber Global Trade")}</title>')
        
        # Meta description
        html_parts.append(f'<meta name="description" content="{meta.get("description", "")}" />')
        
        # Canonical
        html_parts.append(f'<link rel="canonical" href="{canonical_url}" />')
        
        # Open Graph
        html_parts.append(f'<meta property="og:title" content="{social_meta.get("og:title", meta.get("title", ""))}" />')
        html_parts.append(f'<meta property="og:description" content="{social_meta.get("og:description", meta.get("description", ""))}" />')
        html_parts.append(f'<meta property="og:image" content="{social_meta.get("og:image", main_image)}" />')
        html_parts.append(f'<meta property="og:url" content="{canonical_url}" />')
        html_parts.append(f'<meta property="og:type" content="{social_meta.get("og:type", "website")}" />')
        html_parts.append(f'<meta property="og:site_name" content="Amber Global Trade" />')
        
        # Twitter Card
        html_parts.append(f'<meta name="twitter:card" content="summary_large_image" />')
        html_parts.append(f'<meta name="twitter:title" content="{social_meta.get("twitter:title", meta.get("title", ""))}" />')
        html_parts.append(f'<meta name="twitter:description" content="{social_meta.get("twitter:description", meta.get("description", ""))}" />')
        html_parts.append(f'<meta name="twitter:image" content="{social_meta.get("twitter:image", main_image)}" />')
        
        # JSON-LD
        if schema:
            import json
            html_parts.append(f'<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>')
        
        return '\n'.join(html_parts)
    
    except Exception as e:
        # Return minimal meta tags on error
        return f'<title>Amber Global Trade</title><link rel="canonical" href="{SITE_URL}{path}" />'
