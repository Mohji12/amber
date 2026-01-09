"""
Comprehensive SEO Service for Amber Global Trade
Generates complete, production-ready SEO data for all page types
"""
from typing import Dict, List, Optional, Any
from datetime import datetime
import re
from urllib.parse import quote


# Global SEO Configuration
BRAND_NAME = "Amber Global Trade"
SITE_URL = "https://www.amberglobaltrade.com"
DEFAULT_CURRENCY = "USD"
DEFAULT_COUNTRY_OF_ORIGIN = "India"
DEFAULT_TARGET_MARKETS = ["USA", "UAE", "EU", "Singapore", "UK", "Australia", "Canada"]


def slugify(text: str) -> str:
    """Convert text to SEO-friendly URL slug"""
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


def truncate_text(text: str, max_length: int) -> str:
    """Truncate text to max length, preserving word boundaries"""
    if not text or len(text) <= max_length:
        return text
    truncated = text[:max_length].rsplit(' ', 1)[0]
    return truncated.rstrip('.,!?;:') + '...' if len(text) > max_length else truncated


class SEOService:
    """Main SEO service class for generating complete SEO data"""
    
    def __init__(self):
        self.brand_name = BRAND_NAME
        self.site_url = SITE_URL
        self.currency = DEFAULT_CURRENCY
        self.country_of_origin = DEFAULT_COUNTRY_OF_ORIGIN
        self.target_markets = DEFAULT_TARGET_MARKETS
    
    def generate_meta_title(
        self,
        primary_keyword: str,
        page_type: str,
        product_name: Optional[str] = None,
        category_name: Optional[str] = None,
        brand_name: Optional[str] = None
    ) -> str:
        """Generate meta title (50-60 characters)"""
        brand = brand_name or self.brand_name
        
        if page_type == "homepage":
            title = f"{primary_keyword} | {brand}"
        elif page_type == "product":
            title = f"{primary_keyword} - {product_name or 'Product'} | {brand}"
        elif page_type == "category":
            title = f"{primary_keyword} - {category_name or 'Category'} | {brand}"
        elif page_type == "blog":
            title = f"{primary_keyword} | {brand}"
        else:  # static
            title = f"{primary_keyword} | {brand}"
        
        # Ensure 50-60 characters
        if len(title) > 60:
            title = title[:57] + "..."
        elif len(title) < 50:
            # Add more context if too short
            if page_type == "product":
                title = f"{primary_keyword} - Export Quality {product_name or 'Product'} | {brand}"
            title = title[:60]
        
        return title
    
    def generate_meta_description(
        self,
        primary_keyword: str,
        secondary_keywords: List[str],
        page_type: str,
        short_description: Optional[str] = None,
        moq: Optional[str] = None,
        certifications: Optional[str] = None,
        product_name: Optional[str] = None
    ) -> str:
        """Generate meta description (140-160 characters)"""
        parts = []
        
        if page_type == "product":
            if short_description:
                parts.append(short_description[:80])
            else:
                parts.append(f"Premium {product_name or 'product'} for export")
            
            if moq:
                parts.append(f"MOQ: {moq}")
            if certifications:
                certs = certifications.split(',')[:2]  # Max 2 certs
                parts.append(f"{', '.join(certs)} certified")
            
            parts.append("B2B export quality. Request quote.")
        elif page_type == "category":
            parts.append(f"Explore premium {primary_keyword.lower()} products")
            parts.append("FSSAI & APEDA certified. Export quality.")
        elif page_type == "homepage":
            parts.append("Leading agricultural export company")
            parts.append("Premium Basmati rice, spices, dry fruits")
            parts.append("FSSAI certified, APEDA registered")
        else:
            parts.append(short_description or f"Learn about {primary_keyword.lower()}")
        
        description = ". ".join(parts)
        
        # Ensure 140-160 characters
        if len(description) > 160:
            description = truncate_text(description, 157) + "..."
        elif len(description) < 140:
            description += ". Global compliance. Competitive pricing."
            description = description[:160]
        
        return description
    
    def generate_seo_url(self, url: str) -> str:
        """Generate SEO-friendly URL"""
        if url.startswith('http'):
            return url
        # Convert to slug if needed
        if '/' in url:
            parts = url.split('/')
            slugified_parts = [slugify(part) for part in parts if part]
            return '/' + '/'.join(slugified_parts)
        return '/' + slugify(url)
    
    def generate_canonical_url(self, url: str) -> str:
        """Generate absolute canonical URL"""
        if url.startswith('http'):
            return url
        if not url.startswith('/'):
            url = '/' + url
        return f"{self.site_url}{url}"
    
    def generate_h1(
        self,
        primary_keyword: str,
        page_type: str,
        product_name: Optional[str] = None,
        category_name: Optional[str] = None
    ) -> str:
        """Generate H1 heading"""
        if page_type == "homepage":
            return f"Premium {primary_keyword} Export Solutions"
        elif page_type == "product":
            return f"{product_name or primary_keyword} - Export Quality"
        elif page_type == "category":
            return f"Premium {category_name or primary_keyword} Products"
        else:
            return primary_keyword
    
    def generate_h2_sections(
        self,
        page_type: str,
        product_name: Optional[str] = None,
        category_name: Optional[str] = None
    ) -> List[str]:
        """Generate H2 section headings"""
        if page_type == "product":
            return [
                f"About {product_name or 'This Product'}",
                "Product Specifications",
                "Export Quality & Compliance",
                "Packaging & MOQ Details",
                "Shipping & Lead Times",
                "Why Choose Us"
            ]
        elif page_type == "category":
            return [
                f"Premium {category_name or 'Products'} Collection",
                "Quality Standards & Certifications",
                "Export Markets & Compliance",
                "Bulk Procurement Options"
            ]
        elif page_type == "homepage":
            return [
                "Our Premium Product Range",
                "Why Choose Amber Global Trade",
                "Global Export Capabilities",
                "Quality & Compliance"
            ]
        else:
            return [
                "Overview",
                "Key Features",
                "Additional Information"
            ]
    
    def generate_content(
        self,
        page_type: str,
        primary_keyword: str,
        secondary_keywords: List[str],
        product_name: Optional[str] = None,
        short_description: Optional[str] = None,
        long_description: Optional[str] = None,
        moq: Optional[str] = None,
        certifications: Optional[str] = None,
        country_of_origin: Optional[str] = None,
        target_markets: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Generate on-page content"""
        origin = country_of_origin or self.country_of_origin
        markets = target_markets or self.target_markets
        
        hero_tagline = ""
        short_intro = ""
        long_description_text = ""
        bullet_features = []
        
        if page_type == "product":
            hero_tagline = f"Premium {product_name or primary_keyword} for Global Export Markets"
            short_intro = f"Source premium {product_name or primary_keyword.lower()} directly from {origin}. Export-quality products with full compliance certification, competitive MOQ, and reliable shipping to {', '.join(markets[:3])} and beyond."
            
            if long_description:
                long_description_text = long_description
            else:
                long_description_text = f"""We specialize in exporting premium {product_name or primary_keyword.lower()} from {origin} to international markets. Our products meet the highest quality standards and are certified for global export.

Our {product_name or primary_keyword.lower()} is carefully sourced, processed, and packaged to maintain freshness and quality during transit. We offer flexible MOQ options to accommodate both small and large-scale buyers.

With certifications including {certifications or 'FSSAI, APEDA'}, we ensure full compliance with international food safety and export regulations. Our products are suitable for distribution in {', '.join(markets)} and other global markets.

We provide comprehensive export support including documentation, quality certificates, and logistics coordination. Our team ensures timely delivery and maintains transparent communication throughout the export process."""
            
            bullet_features = [
                f"Premium quality {product_name or primary_keyword.lower()} from {origin}",
                f"MOQ: {moq or 'Flexible options available'}",
                f"Certified: {certifications or 'FSSAI, APEDA, ISO'}",
                f"Export-ready packaging for {', '.join(markets[:3])} markets",
                "Full export documentation and compliance support",
                "Competitive pricing for bulk procurement",
                "Reliable shipping and logistics coordination",
                "Quality assurance and batch testing available"
            ]
        
        elif page_type == "category":
            hero_tagline = f"Premium {category_name or primary_keyword} Export Collection"
            short_intro = f"Explore our comprehensive range of premium {category_name or primary_keyword.lower()} products. All items are export-certified and ready for international markets including {', '.join(markets[:3])}."
            
            long_description_text = f"""Our {category_name or primary_keyword.lower()} collection features premium products sourced from {origin}, each meeting international quality standards. We offer a diverse range suitable for various export markets and buyer requirements.

All products in this category are certified for export and comply with international food safety regulations. We provide flexible MOQ options and comprehensive export support including documentation and logistics coordination.

Whether you're sourcing for retail, wholesale, or private labeling, our {category_name or primary_keyword.lower()} products are ideal for global distribution. We maintain strict quality control and offer competitive pricing for bulk orders."""
            
            bullet_features = [
                f"Premium {category_name or primary_keyword.lower()} from {origin}",
                "Export-certified products with full compliance",
                "Flexible MOQ options for all buyer types",
                f"Ready for {', '.join(markets)} markets",
                "Comprehensive export documentation support",
                "Quality assurance and batch testing",
                "Competitive bulk pricing available",
                "Reliable shipping and logistics"
            ]
        
        elif page_type == "homepage":
            hero_tagline = "Premium Agricultural Export Solutions from India"
            short_intro = "Leading B2B export platform for premium agricultural products including Basmati rice, organic spices, dry fruits, and pulses. FSSAI certified, APEDA registered with global compliance."
            
            long_description_text = """Amber Global Trade is a leading agricultural export company specializing in premium products from India. We serve international buyers across 13+ countries with high-quality Basmati rice, organic spices, dry fruits, pulses, and other agricultural commodities.

Our products are sourced directly from certified farms and processing facilities in India, ensuring quality and traceability. We maintain full compliance with international export regulations including FSSAI, APEDA, and ISO certifications.

We offer flexible MOQ options, competitive pricing, and comprehensive export support including documentation, quality certificates, and logistics coordination. Our team ensures timely delivery and maintains transparent communication throughout the export process.

Whether you're a distributor, retailer, or private label brand, we provide the products and support you need to succeed in international markets."""
            
            bullet_features = [
                "Premium agricultural products from India",
                "FSSAI, APEDA, and ISO certified",
                "Export to 13+ countries worldwide",
                "Flexible MOQ options for all buyers",
                "Full export documentation support",
                "Quality assurance and batch testing",
                "Competitive bulk pricing",
                "Reliable shipping and logistics"
            ]
        
        else:  # blog or static
            hero_tagline = primary_keyword
            short_intro = short_description or f"Learn about {primary_keyword.lower()} and export opportunities."
            long_description_text = long_description or f"""Comprehensive guide to {primary_keyword.lower()} for international buyers and exporters. Explore quality standards, export requirements, and sourcing strategies."""
            bullet_features = [
                "Expert insights and industry knowledge",
                "Export compliance and certification guidance",
                "Sourcing strategies and best practices",
                "Market trends and opportunities"
            ]
        
        return {
            "hero_tagline": hero_tagline,
            "short_intro": short_intro,
            "long_description": long_description_text,
            "bullet_features": bullet_features
        }
    
    def generate_product_data(
        self,
        product_name: str,
        sku: Optional[str],
        price: Optional[float],
        currency: Optional[str],
        availability: str,
        moq: Optional[str],
        certifications: Optional[str],
        country_of_origin: Optional[str],
        specs: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate product-specific data"""
        origin = country_of_origin or self.country_of_origin
        curr = currency or self.currency
        
        # Map availability
        availability_map = {
            "InStock": "https://schema.org/InStock",
            "OutOfStock": "https://schema.org/OutOfStock",
            "PreOrder": "https://schema.org/PreOrder"
        }
        schema_availability = availability_map.get(availability, "https://schema.org/InStock")
        
        product_specs = specs or {}
        if not product_specs:
            product_specs = {
                "Origin": origin,
                "Grade": "Premium",
                "Packaging": "Export-ready",
                "Shelf Life": "As per product specifications",
                "Storage": "Cool, dry place"
            }
        
        return {
            "product_specifications": product_specs,
            "packaging_details": f"Export-ready packaging suitable for international shipping. Custom packaging options available for bulk orders. MOQ: {moq or 'Contact for details'}.",
            "shelf_life": product_specs.get("Shelf Life", "As per product specifications"),
            "storage_conditions": product_specs.get("Storage", "Store in cool, dry place away from direct sunlight"),
            "hs_code": product_specs.get("HS Code", "Contact for HS code details"),
            "incoterms_supported": ["FOB", "CIF", "EXW", "DDP"],
            "price": price,
            "currency": curr,
            "availability": availability,
            "schema_availability": schema_availability,
            "sku": sku
        }
    
    def generate_faq(
        self,
        page_type: str,
        product_name: Optional[str] = None,
        moq: Optional[str] = None,
        certifications: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """Generate SEO-optimized FAQs"""
        faqs = []
        
        if page_type == "product":
            faqs = [
                {
                    "question": f"What is the minimum order quantity (MOQ) for {product_name or 'this product'}?",
                    "answer": f"The MOQ for {product_name or 'this product'} is {moq or 'flexible and can be customized based on your requirements'}. Contact us for specific MOQ details and bulk pricing."
                },
                {
                    "question": f"What certifications does {product_name or 'this product'} have?",
                    "answer": f"Our {product_name or 'product'} is certified with {certifications or 'FSSAI, APEDA, and ISO certifications'}, ensuring full compliance with international export standards."
                },
                {
                    "question": f"Can I get samples of {product_name or 'this product'} before placing a bulk order?",
                    "answer": f"Yes, we provide samples of {product_name or 'our products'} for quality evaluation. Sample requests are subject to availability and shipping terms. Contact us to request samples."
                },
                {
                    "question": f"What is the shipping lead time for {product_name or 'this product'}?",
                    "answer": f"Shipping lead times vary based on destination and order quantity. Typically, orders are processed within 7-15 business days, with shipping times depending on the destination country. Contact us for specific lead time estimates."
                },
                {
                    "question": f"Which countries do you export {product_name or 'this product'} to?",
                    "answer": f"We export {product_name or 'our products'} to multiple countries including USA, UAE, EU, Singapore, UK, Australia, and Canada. Contact us to confirm availability for your destination."
                },
                {
                    "question": f"What payment terms do you offer for bulk orders of {product_name or 'this product'}?",
                    "answer": f"We offer flexible payment terms for bulk orders including T/T, L/C, and other secure payment methods. Payment terms are discussed based on order value and buyer history."
                }
            ]
        elif page_type == "category":
            faqs = [
                {
                    "question": "What is the minimum order quantity for products in this category?",
                    "answer": "MOQ varies by product within this category. We offer flexible MOQ options to accommodate different buyer requirements. Contact us for specific MOQ details."
                },
                {
                    "question": "Are all products in this category export-certified?",
                    "answer": "Yes, all products in this category are certified for export with FSSAI, APEDA, and other relevant certifications ensuring full compliance with international standards."
                },
                {
                    "question": "Can I request samples before placing a bulk order?",
                    "answer": "Yes, we provide samples for quality evaluation. Sample availability and shipping terms can be discussed based on your requirements."
                },
                {
                    "question": "What export markets do you serve?",
                    "answer": "We export to multiple countries including USA, UAE, EU, Singapore, UK, Australia, and Canada. Contact us to confirm availability for your destination market."
                }
            ]
        else:  # homepage or static
            faqs = [
                {
                    "question": "What products do you export?",
                    "answer": "We export premium agricultural products including Basmati rice, organic spices, dry fruits, pulses, and other agricultural commodities from India to global markets."
                },
                {
                    "question": "What certifications do your products have?",
                    "answer": "Our products are certified with FSSAI, APEDA, and ISO certifications, ensuring full compliance with international export and food safety standards."
                },
                {
                    "question": "What is your minimum order quantity?",
                    "answer": "MOQ varies by product. We offer flexible MOQ options to accommodate both small and large-scale buyers. Contact us for specific MOQ details."
                },
                {
                    "question": "Which countries do you export to?",
                    "answer": "We export to multiple countries including USA, UAE, EU, Singapore, UK, Australia, and Canada. Contact us to confirm availability for your destination."
                }
            ]
        
        return faqs[:6]  # Max 6 FAQs
    
    def generate_image_seo(
        self,
        image_urls: List[str],
        product_name: Optional[str] = None,
        category_name: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """Generate SEO data for images"""
        image_seo = []
        
        for idx, img_url in enumerate(image_urls):
            # Extract filename
            filename = img_url.split('/')[-1].split('?')[0]
            # Generate SEO filename
            base_name = product_name or category_name or "product"
            seo_filename = f"{slugify(base_name)}-{idx + 1}.jpg"
            
            # Generate alt text (max 12 words)
            if product_name:
                alt_text = f"{product_name} export quality premium grade"
            elif category_name:
                alt_text = f"{category_name} premium export products"
            else:
                alt_text = "Premium agricultural export product"
            
            # Generate image title
            if product_name:
                image_title = f"{product_name} - Premium Export Quality"
            elif category_name:
                image_title = f"{category_name} - Export Products"
            else:
                image_title = "Premium Export Product"
            
            image_seo.append({
                "original_url": img_url,
                "seo_filename": seo_filename,
                "alt_text": alt_text,
                "image_title": image_title
            })
        
        return image_seo
    
    def generate_internal_links(
        self,
        page_type: str,
        related_products: List[str],
        category_name: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """Generate internal linking strategy"""
        links = []
        
        if page_type == "product":
            # Link to category/subcategory
            if category_name:
                links.append({
                    "anchor_text": f"Browse {category_name} Products",
                    "target_url": f"/categories/{slugify(category_name)}",
                    "placement_hint": "above fold"
                })
            
            # Link to related products
            for related_url in related_products[:3]:
                product_name = related_url.split('/')[-1]
                links.append({
                    "anchor_text": f"View {product_name}",
                    "target_url": related_url,
                    "placement_hint": "mid-content"
                })
            
            # Standard internal links
            links.extend([
                {
                    "anchor_text": "View All Products",
                    "target_url": "/products",
                    "placement_hint": "mid-content"
                },
                {
                    "anchor_text": "Export Services",
                    "target_url": "/contact",
                    "placement_hint": "FAQ"
                },
                {
                    "anchor_text": "Request Quote",
                    "target_url": "/contact",
                    "placement_hint": "above fold"
                }
            ])
        
        elif page_type == "category":
            links.extend([
                {
                    "anchor_text": "View All Categories",
                    "target_url": "/products",
                    "placement_hint": "above fold"
                },
                {
                    "anchor_text": "Contact for Bulk Orders",
                    "target_url": "/contact",
                    "placement_hint": "mid-content"
                },
                {
                    "anchor_text": "Export Certification Info",
                    "target_url": "/contact",
                    "placement_hint": "FAQ"
                }
            ])
        
        else:  # homepage
            links.extend([
                {
                    "anchor_text": "Browse Products",
                    "target_url": "/products",
                    "placement_hint": "above fold"
                },
                {
                    "anchor_text": "Contact Us",
                    "target_url": "/contact",
                    "placement_hint": "above fold"
                },
                {
                    "anchor_text": "Export Services",
                    "target_url": "/contact",
                    "placement_hint": "mid-content"
                }
            ])
        
        return links[:8]  # Max 8 links
    
    def generate_schema(
        self,
        page_type: str,
        url: str,
        title: str,
        description: str,
        product_name: Optional[str] = None,
        product_data: Optional[Dict[str, Any]] = None,
        image_urls: Optional[List[str]] = None,
        category_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate JSON-LD structured data"""
        canonical_url = self.generate_canonical_url(url)
        images = image_urls or []
        main_image = images[0] if images else f"{self.site_url}/assets/default-product.jpg"
        
        if page_type == "homepage":
            return {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "Organization",
                        "@id": f"{canonical_url}#organization",
                        "name": self.brand_name,
                        "alternateName": "Amber Global",
                        "url": self.site_url,
                        "logo": f"{self.site_url}/assets/logo.png",
                        "description": description,
                        "foundingDate": "2020",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Bengaluru",
                            "addressRegion": "Karnataka",
                            "addressCountry": "India"
                        },
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "customer service",
                            "email": "amberglobaltrade1@gmail.com",
                            "availableLanguage": "English"
                        },
                        "sameAs": [
                            f"{self.site_url}",
                            f"{self.site_url}/products",
                            f"{self.site_url}/contact"
                        ]
                    },
                    {
                        "@type": "WebSite",
                        "@id": f"{canonical_url}#website",
                        "url": self.site_url,
                        "name": self.brand_name,
                        "publisher": {
                            "@id": f"{canonical_url}#organization"
                        },
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": f"{self.site_url}/products/?search={{search_term_string}}"
                            },
                            "query-input": "required name=search_term_string"
                        }
                    }
                ]
            }
        
        elif page_type == "category":
            breadcrumb_items = [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": self.site_url
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Products",
                    "item": f"{self.site_url}/products"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": category_name or "Category",
                    "item": canonical_url
                }
            ]
            
            return {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "BreadcrumbList",
                        "@id": f"{canonical_url}#breadcrumb",
                        "itemListElement": breadcrumb_items
                    },
                    {
                        "@type": "ItemList",
                        "@id": f"{canonical_url}#itemlist",
                        "name": f"{category_name or 'Products'} Collection",
                        "description": description,
                        "url": canonical_url
                    }
                ]
            }
        
        elif page_type == "product":
            if not product_data:
                product_data = {}
            
            offer = {}
            if product_data.get("price"):
                offer = {
                    "@type": "Offer",
                    "price": str(product_data["price"]),
                    "priceCurrency": product_data.get("currency", self.currency),
                    "availability": product_data.get("schema_availability", "https://schema.org/InStock"),
                    "url": canonical_url,
                    "priceValidUntil": (datetime.now().year + 1).__str__()
                }
                if product_data.get("moq"):
                    offer["eligibleQuantity"] = {
                        "@type": "QuantitativeValue",
                        "value": product_data["moq"]
                    }
            
            breadcrumb_items = [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": self.site_url
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Products",
                    "item": f"{self.site_url}/products"
                }
            ]
            
            if category_name:
                breadcrumb_items.append({
                    "@type": "ListItem",
                    "position": 3,
                    "name": category_name,
                    "item": f"{self.site_url}/categories/{slugify(category_name)}"
                })
            
            breadcrumb_items.append({
                "@type": "ListItem",
                "position": len(breadcrumb_items) + 1,
                "name": product_name or "Product",
                "item": canonical_url
            })
            
            product_schema = {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "BreadcrumbList",
                        "@id": f"{canonical_url}#breadcrumb",
                        "itemListElement": breadcrumb_items
                    },
                    {
                        "@type": "Product",
                        "@id": f"{canonical_url}#product",
                        "name": product_name or title,
                        "description": description,
                        "image": images if images else [main_image],
                        "brand": {
                            "@type": "Brand",
                            "name": self.brand_name
                        },
                        "sku": product_data.get("sku", ""),
                        "category": category_name or "Agricultural Products",
                        "countryOfOrigin": product_data.get("country_of_origin", self.country_of_origin)
                    }
                ]
            }
            
            if offer:
                product_schema["@graph"][1]["offers"] = offer
            
            return product_schema
        
        else:  # blog or static
            return {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": title,
                "description": description,
                "image": images if images else [main_image],
                "author": {
                    "@type": "Organization",
                    "name": self.brand_name
                },
                "publisher": {
                    "@type": "Organization",
                    "name": self.brand_name,
                    "logo": {
                        "@type": "ImageObject",
                        "url": f"{self.site_url}/assets/logo.png"
                    }
                },
                "datePublished": datetime.now().isoformat(),
                "dateModified": datetime.now().isoformat()
            }
    
    def generate_faq_schema(self, faqs: List[Dict[str, str]]) -> Dict[str, Any]:
        """Generate FAQPage schema from FAQ list"""
        if not faqs or len(faqs) == 0:
            return {}
        
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": faq["question"],
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq["answer"]
                    }
                }
                for faq in faqs
            ]
        }
    
    def generate_social_meta(
        self,
        title: str,
        description: str,
        url: str,
        image_urls: Optional[List[str]] = None
    ) -> Dict[str, str]:
        """Generate social media meta tags"""
        canonical_url = self.generate_canonical_url(url)
        main_image = image_urls[0] if image_urls else f"{self.site_url}/assets/og-default.jpg"
        
        if not main_image.startswith('http'):
            main_image = f"{self.site_url}{main_image}" if main_image.startswith('/') else f"{self.site_url}/{main_image}"
        
        return {
            "og:title": title,
            "og:description": description,
            "og:image": main_image,
            "og:url": canonical_url,
            "og:type": "website",
            "og:site_name": self.brand_name,
            "twitter:card": "summary_large_image",
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": main_image
        }
    
    def generate_technical_notes(self, page_type: str) -> Dict[str, Any]:
        """Generate technical SEO recommendations"""
        return {
            "core_web_vitals": {
                "lcp_optimization": "Ensure main image is optimized (WebP format, < 200KB). Use lazy loading for below-fold images.",
                "fid_optimization": "Minimize JavaScript execution time. Defer non-critical scripts.",
                "cls_optimization": "Set explicit width/height for images. Avoid layout shifts."
            },
            "image_optimization": {
                "format": "Use WebP format with JPEG fallback. Compress images to 80-85% quality.",
                "sizing": "Serve responsive images with srcset. Use appropriate sizes for different viewports.",
                "lazy_loading": "Implement lazy loading for images below the fold using loading='lazy' attribute."
            },
            "performance": {
                "js_optimization": "Minify and bundle JavaScript. Use code splitting for route-based chunks.",
                "css_optimization": "Critical CSS inlined in <head>. Non-critical CSS loaded asynchronously.",
                "caching": "Implement proper cache headers. Use CDN for static assets."
            },
            "accessibility": {
                "alt_text": "Ensure all images have descriptive alt text (max 12 words).",
                "headings": "Maintain proper heading hierarchy (H1 → H2 → H3).",
                "aria_labels": "Add ARIA labels for interactive elements."
            }
        }
    
    def generate_complete_seo(
        self,
        url: str,
        page_type: str,
        primary_keyword: str,
        secondary_keywords: List[str],
        brand_name: Optional[str] = None,
        product_name: Optional[str] = None,
        sku: Optional[str] = None,
        short_description: Optional[str] = None,
        long_description: Optional[str] = None,
        price: Optional[float] = None,
        currency: Optional[str] = None,
        availability: str = "InStock",
        moq: Optional[str] = None,
        certifications: Optional[str] = None,
        country_of_origin: Optional[str] = None,
        target_markets: Optional[List[str]] = None,
        image_urls: Optional[List[str]] = None,
        category_name: Optional[str] = None,
        related_products: Optional[List[str]] = None,
        specs: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate complete SEO data for a page"""
        
        # Generate meta tags
        meta_title = self.generate_meta_title(
            primary_keyword, page_type, product_name, category_name, brand_name
        )
        meta_description = self.generate_meta_description(
            primary_keyword, secondary_keywords, page_type,
            short_description, moq, certifications, product_name
        )
        
        # Generate URLs
        seo_url = self.generate_seo_url(url)
        canonical_url = self.generate_canonical_url(url)
        
        # Generate headings
        h1 = self.generate_h1(primary_keyword, page_type, product_name, category_name)
        h2_sections = self.generate_h2_sections(page_type, product_name, category_name)
        
        # Generate content
        content = self.generate_content(
            page_type, primary_keyword, secondary_keywords,
            product_name, short_description, long_description,
            moq, certifications, country_of_origin, target_markets
        )
        
        # Generate product data (if product page)
        product_data = {}
        if page_type == "product":
            product_data = self.generate_product_data(
                product_name or primary_keyword, sku, price, currency,
                availability, moq, certifications, country_of_origin, specs
            )
        
        # Generate FAQ
        faqs = self.generate_faq(page_type, product_name, moq, certifications)
        
        # Generate image SEO
        images = self.generate_image_seo(
            image_urls or [], product_name, category_name
        )
        
        # Generate internal links
        internal_links = self.generate_internal_links(
            page_type, related_products or [], category_name
        )
        
        # Generate schema
        main_schema = self.generate_schema(
            page_type, url, meta_title, meta_description,
            product_name, product_data if page_type == "product" else None,
            image_urls, category_name
        )
        
        # Generate FAQ schema if FAQs exist
        faq_schema = self.generate_faq_schema(faqs) if faqs else {}
        
        # Merge schemas - if main schema has @graph, add FAQ to it, otherwise combine
        if faq_schema and "@type" in faq_schema:
            if "@graph" in main_schema:
                # Add FAQ schema to graph
                main_schema["@graph"].append(faq_schema)
                schema = main_schema
            else:
                # Combine schemas in a graph
                schema = {
                    "@context": "https://schema.org",
                    "@graph": [main_schema, faq_schema]
                }
        else:
            schema = main_schema
        
        # Generate social meta
        social_meta = self.generate_social_meta(
            meta_title, meta_description, url, image_urls
        )
        
        # Generate technical notes
        technical_notes = self.generate_technical_notes(page_type)
        
        return {
            "url": seo_url,
            "meta": {
                "title": meta_title,
                "description": meta_description,
                "keywords": ", ".join([primary_keyword] + secondary_keywords[:5])
            },
            "canonical": {
                "url": canonical_url,
                "pagination_rules": "Use rel='canonical' pointing to first page for paginated content" if page_type == "category" else None
            },
            "headings": {
                "h1": h1,
                "h2_sections": h2_sections,
                "h3_subsections": []  # Can be generated per section if needed
            },
            "content": content,
            "product_data": product_data if page_type == "product" else {},
            "faq": faqs,
            "images": images,
            "internal_links": internal_links,
            "schema": schema,
            "social_meta": social_meta,
            "technical_notes": technical_notes
        }

