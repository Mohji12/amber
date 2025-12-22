"""
SEO API Router - Generate complete SEO data for all page types
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.seo_service import SEOService
from app.database import get_db
from sqlalchemy.orm import Session
from app import models

router = APIRouter()
seo_service = SEOService()


class SEORequest(BaseModel):
    """Request model for SEO generation"""
    url: str = Field(..., description="Page URL")
    page_type: str = Field(..., description="Page type: homepage, category, product, blog, static")
    primary_keyword: str = Field(..., description="Primary SEO keyword")
    secondary_keywords: List[str] = Field(default_factory=list, description="Secondary keywords")
    brand_name: Optional[str] = None
    product_name: Optional[str] = None
    sku: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    availability: str = Field(default="InStock", description="InStock, OutOfStock, PreOrder")
    moq: Optional[str] = None
    certifications: Optional[str] = None
    country_of_origin: Optional[str] = None
    target_markets: Optional[List[str]] = None
    image_urls: Optional[List[str]] = None
    category_name: Optional[str] = None
    related_products: Optional[List[str]] = None
    specs: Optional[Dict[str, Any]] = None


@router.post("/generate", response_model=Dict[str, Any])
async def generate_seo(request: SEORequest):
    """
    Generate complete SEO data for any page type
    
    Returns complete SEO implementation including:
    - Meta tags (title, description, keywords)
    - Canonical URLs
    - Headings structure
    - On-page content
    - Product data (if applicable)
    - FAQ section
    - Image SEO
    - Internal linking
    - Structured data (JSON-LD)
    - Social meta tags
    - Technical SEO notes
    """
    try:
        seo_data = seo_service.generate_complete_seo(
            url=request.url,
            page_type=request.page_type,
            primary_keyword=request.primary_keyword,
            secondary_keywords=request.secondary_keywords,
            brand_name=request.brand_name,
            product_name=request.product_name,
            sku=request.sku,
            short_description=request.short_description,
            long_description=request.long_description,
            price=request.price,
            currency=request.currency,
            availability=request.availability,
            moq=request.moq,
            certifications=request.certifications,
            country_of_origin=request.country_of_origin,
            target_markets=request.target_markets,
            image_urls=request.image_urls,
            category_name=request.category_name,
            related_products=request.related_products,
            specs=request.specs
        )
        return seo_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating SEO data: {str(e)}")


@router.get("/product/{product_id}", response_model=Dict[str, Any])
async def get_product_seo(product_id: int, db: Session = Depends(get_db)):
    """
    Generate SEO data for a product page from database
    """
    try:
        product = db.query(models.Product).filter(models.Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get subcategory and category info
        subcategory = db.query(models.Subcategory).filter(models.Subcategory.id == product.subcategory_id).first()
        category = None
        if subcategory and subcategory.category_id:
            category = db.query(models.Category).filter(models.Category.id == subcategory.category_id).first()
        
        # Get related products (same subcategory)
        related_products = db.query(models.Product).filter(
            models.Product.subcategory_id == product.subcategory_id,
            models.Product.id != product.id
        ).limit(5).all()
        
        # Build image URLs
        image_urls = []
        if product.image_url:
            image_urls.append(product.image_url)
        
        # Build related product URLs
        related_urls = [f"/products/{p.id}" for p in related_products]
        
        # Determine availability
        availability = "InStock"
        if product.status:
            status_lower = product.status.lower()
            if "out" in status_lower or "unavailable" in status_lower:
                availability = "OutOfStock"
            elif "soon" in status_lower or "pre" in status_lower:
                availability = "PreOrder"
        
        # Generate SEO
        seo_data = seo_service.generate_complete_seo(
            url=f"/products/{product_id}",
            page_type="product",
            primary_keyword=f"{product.name} export",
            secondary_keywords=[
                f"{product.name} wholesale",
                f"{product.name} bulk",
                f"{product.name} export quality",
                f"{subcategory.name if subcategory else 'product'} export",
                "FSSAI certified",
                "APEDA registered"
            ],
            product_name=product.name,
            sku=None,  # Add SKU field to product model if needed
            short_description=product.details or product.highlights,
            long_description=product.details,
            moq=product.moq,
            certifications=product.certifications,
            country_of_origin=product.origin,
            image_urls=image_urls,
            category_name=category.name if category else None,
            related_products=related_urls,
            specs=product.specs if hasattr(product, 'specs') and product.specs else None,
            availability=availability
        )
        
        return seo_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating product SEO: {str(e)}")


@router.get("/subcategory/{subcategory_id}", response_model=Dict[str, Any])
async def get_subcategory_seo(subcategory_id: int, db: Session = Depends(get_db)):
    """
    Generate SEO data for a subcategory page from database
    """
    try:
        subcategory = db.query(models.Subcategory).filter(models.Subcategory.id == subcategory_id).first()
        if not subcategory:
            raise HTTPException(status_code=404, detail="Subcategory not found")
        
        category = None
        if subcategory.category_id:
            category = db.query(models.Category).filter(models.Category.id == subcategory.category_id).first()
        
        # Get products in this subcategory
        products = db.query(models.Product).filter(models.Product.subcategory_id == subcategory_id).limit(10).all()
        related_urls = [f"/products/{p.id}" for p in products]
        
        # Build image URLs
        image_urls = []
        if subcategory.image_url:
            image_urls.append(subcategory.image_url)
        
        # Generate SEO
        seo_data = seo_service.generate_complete_seo(
            url=f"/subcategories/{subcategory_id}",
            page_type="category",
            primary_keyword=f"{subcategory.name} export",
            secondary_keywords=[
                f"{subcategory.name} wholesale",
                f"{subcategory.name} bulk",
                f"{category.name if category else 'products'} export",
                "FSSAI certified",
                "APEDA registered",
                "export quality"
            ],
            category_name=subcategory.name,
            short_description=subcategory.description,
            image_urls=image_urls,
            related_products=related_urls
        )
        
        return seo_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating subcategory SEO: {str(e)}")


@router.get("/homepage", response_model=Dict[str, Any])
async def get_homepage_seo():
    """
    Generate SEO data for homepage
    """
    try:
        seo_data = seo_service.generate_complete_seo(
            url="/",
            page_type="homepage",
            primary_keyword="Agricultural Export Company India",
            secondary_keywords=[
                "Basmati rice export",
                "spices export",
                "dry fruits export",
                "FSSAI certified",
                "APEDA registered",
                "B2B export",
                "agricultural products export"
            ]
        )
        return seo_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating homepage SEO: {str(e)}")


@router.get("/blog/{blog_id}", response_model=Dict[str, Any])
async def get_blog_seo(blog_id: int, db: Session = Depends(get_db)):
    """
    Generate SEO data for a blog page from database
    """
    try:
        blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        # Extract primary keyword from title
        primary_keyword = blog.title.split('-')[0].split('|')[0].strip()
        
        # Generate SEO
        seo_data = seo_service.generate_complete_seo(
            url=f"/blogs/{blog_id}",
            page_type="blog",
            primary_keyword=primary_keyword,
            secondary_keywords=[
                "export guide",
                "sourcing guide",
                "B2B export",
                "agricultural export"
            ],
            short_description=blog.content[:200] if blog.content else None,
            long_description=blog.content
        )
        
        return seo_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating blog SEO: {str(e)}")

