"""
Sitemap XML Generator - Dynamic sitemap generation from database
Generates valid XML sitemap with all indexable pages
"""
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from datetime import datetime
from typing import List
import re

router = APIRouter()

SITE_URL = "https://www.amberglobaltrade.com"


def slugify(text: str) -> str:
    """Convert text to SEO-friendly URL slug"""
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


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


@router.get("/sitemap.xml", response_class=Response)
async def generate_sitemap(db: Session = Depends(get_db)):
    """
    Generate dynamic XML sitemap from database
    Includes only indexable, canonical URLs with 200 status
    """
    current_date = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S+00:00")
    
    urls = []
    
    # 1. Homepage (highest priority)
    urls.append({
        "loc": f"{SITE_URL}/",
        "lastmod": current_date,
        "changefreq": "daily",
        "priority": "1.0"
    })
    
    # 2. Static pages
    static_pages = [
        {"path": "/products", "changefreq": "weekly", "priority": "0.9"},
        {"path": "/blogs", "changefreq": "daily", "priority": "0.8"},
        {"path": "/contact", "changefreq": "monthly", "priority": "0.7"},
        {"path": "/quote", "changefreq": "monthly", "priority": "0.7"},
    ]
    
    for page in static_pages:
        urls.append({
            "loc": f"{SITE_URL}{page['path']}",
            "lastmod": current_date,
            "changefreq": page["changefreq"],
            "priority": page["priority"]
        })
    
    # 3. Products (only active/indexable products)
    try:
        products = db.query(models.Product).filter(
            models.Product.status != "Discontinued"
        ).all()
        
        for product in products:
            if product.id and product.name:
                slug = create_product_slug(product.name, product.id)
                # Get last modified date from product
                lastmod = product.created_at.strftime("%Y-%m-%dT%H:%M:%S+00:00") if product.created_at else current_date
                
                urls.append({
                    "loc": f"{SITE_URL}/products/{slug}",
                    "lastmod": lastmod,
                    "changefreq": "weekly",
                    "priority": "0.8"
                })
    except Exception as e:
        print(f"Error fetching products for sitemap: {e}")
    
    # 4. Subcategories (only those with products)
    try:
        subcategories = db.query(models.Subcategory).all()
        
        for subcategory in subcategories:
            if subcategory.id and subcategory.name:
                # Check if subcategory has products
                product_count = db.query(models.Product).filter(
                    models.Product.subcategory_id == subcategory.id,
                    models.Product.status != "Discontinued"
                ).count()
                
                if product_count > 0:  # Only include if has products
                    slug = create_subcategory_slug(subcategory.name, subcategory.id)
                    
                    urls.append({
                        "loc": f"{SITE_URL}/subcategories/{slug}",
                        "lastmod": current_date,
                        "changefreq": "weekly",
                        "priority": "0.7"
                    })
    except Exception as e:
        print(f"Error fetching subcategories for sitemap: {e}")
    
    # 5. Blogs (only published blogs)
    try:
        blogs = db.query(models.Blog).all()
        
        for blog in blogs:
            if blog.id and blog.title:
                slug = create_blog_slug(blog.title, blog.id)
                lastmod = blog.created_at.strftime("%Y-%m-%dT%H:%M:%S+00:00") if blog.created_at else current_date
                
                urls.append({
                    "loc": f"{SITE_URL}/blogs/{slug}",
                    "lastmod": lastmod,
                    "changefreq": "monthly",
                    "priority": "0.6"
                })
    except Exception as e:
        print(f"Error fetching blogs for sitemap: {e}")
    
    # Generate XML
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    
    for url_data in urls:
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{url_data['loc']}</loc>")
        xml_lines.append(f"    <lastmod>{url_data['lastmod']}</lastmod>")
        xml_lines.append(f"    <changefreq>{url_data['changefreq']}</changefreq>")
        xml_lines.append(f"    <priority>{url_data['priority']}</priority>")
        xml_lines.append("  </url>")
    
    xml_lines.append("</urlset>")
    
    xml_content = "\n".join(xml_lines)
    
    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={
            "Cache-Control": "public, max-age=3600",  # Cache for 1 hour
            "Content-Type": "application/xml; charset=utf-8"
        }
    )

