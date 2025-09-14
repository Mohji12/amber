#!/usr/bin/env python3
"""
Verify All Mappings Script
This script verifies all product and subcategory image mappings to ensure they are correct.
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def verify_product_mappings():
    """Verify product image mappings"""
    print("🔍 Verifying Product Image Mappings...")
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Get all products with their image URLs
            result = connection.execute(text("""
                SELECT id, name, subcategory_id, image_url 
                FROM products 
                WHERE image_url IS NOT NULL AND image_url != '' AND image_url != 'null'
                ORDER BY name
            """))
            products = result.fetchall()
            
            print(f"\n📊 Total products with images: {len(products)}")
            
            # Check for potential mismatches
            mismatches = []
            
            for product in products:
                image_url = product.image_url
                product_name = product.name.lower()
                
                # Check if image URL matches product type
                if "millet" in product_name and "millet" not in image_url.lower():
                    mismatches.append((product.name, image_url, "Millet product but non-millet image"))
                elif "rice" in product_name and "rice" not in image_url.lower():
                    mismatches.append((product.name, image_url, "Rice product but non-rice image"))
                elif "spice" in product_name or "cardamom" in product_name or "pepper" in product_name or "cinnamon" in product_name:
                    if "spice" not in image_url.lower() and "cardamom" not in image_url.lower() and "pepper" not in image_url.lower() and "cinnamon" not in image_url.lower():
                        mismatches.append((product.name, image_url, "Spice product but non-spice image"))
                elif "pulse" in product_name or "dal" in product_name or "chana" in product_name or "lentil" in product_name:
                    if "pulse" not in image_url.lower() and "dal" not in image_url.lower() and "chana" not in image_url.lower() and "lentil" not in image_url.lower():
                        mismatches.append((product.name, image_url, "Pulse product but non-pulse image"))
            
            if mismatches:
                print(f"\n⚠️ Found {len(mismatches)} potential mismatches:")
                for product_name, image_url, reason in mismatches:
                    print(f"   - {product_name}")
                    print(f"     Image: {image_url}")
                    print(f"     Issue: {reason}")
                    print()
            else:
                print("✅ All product mappings appear correct!")
            
            return products, mismatches
            
    except Exception as e:
        print(f"❌ Error verifying product mappings: {e}")
        return [], []

def verify_subcategory_mappings():
    """Verify subcategory image mappings"""
    print("\n🔍 Verifying Subcategory Image Mappings...")
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Get all subcategories with their image URLs
            result = connection.execute(text("""
                SELECT id, name, category_id, image_url 
                FROM subcategories 
                WHERE image_url IS NOT NULL AND image_url != '' AND image_url != 'null'
                ORDER BY name
            """))
            subcategories = result.fetchall()
            
            print(f"\n📊 Total subcategories with images: {len(subcategories)}")
            
            # Check for potential mismatches
            mismatches = []
            
            for subcategory in subcategories:
                image_url = subcategory.image_url
                subcategory_name = subcategory.name.lower()
                
                # Check if image URL matches subcategory type
                if "hinge" in subcategory_name and "industrial shoes" in image_url.lower():
                    mismatches.append((subcategory.name, image_url, "Hinges showing industrial shoes image"))
                elif "door handle" in subcategory_name and "industrial shoes" in image_url.lower():
                    mismatches.append((subcategory.name, image_url, "Door handles showing industrial shoes image"))
                elif "bathroom fitting" in subcategory_name and "industrial shoes" in image_url.lower():
                    mismatches.append((subcategory.name, image_url, "Bathroom fittings showing industrial shoes image"))
                elif "pipe" in subcategory_name and "industrial shoes" in image_url.lower():
                    mismatches.append((subcategory.name, image_url, "Pipes showing industrial shoes image"))
                elif "millet" in subcategory_name and "millet" not in image_url.lower():
                    mismatches.append((subcategory.name, image_url, "Millet subcategory but non-millet image"))
            
            if mismatches:
                print(f"\n⚠️ Found {len(mismatches)} potential mismatches:")
                for subcategory_name, image_url, reason in mismatches:
                    print(f"   - {subcategory_name}")
                    print(f"     Image: {image_url}")
                    print(f"     Issue: {reason}")
                    print()
            else:
                print("✅ All subcategory mappings appear correct!")
            
            return subcategories, mismatches
            
    except Exception as e:
        print(f"❌ Error verifying subcategory mappings: {e}")
        return [], []

def get_category_info():
    """Get category information for context"""
    print("\n🔍 Getting Category Information...")
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT id, name 
                FROM categories 
                ORDER BY name
            """))
            categories = result.fetchall()
            
            print(f"\n📊 Categories:")
            for category in categories:
                print(f"   - ID {category.id}: {category.name}")
            
            return categories
            
    except Exception as e:
        print(f"❌ Error getting category info: {e}")
        return []

def main():
    """Main function to verify all mappings"""
    print("🚀 Starting Complete Mapping Verification...")
    
    # Verify product mappings
    products, product_mismatches = verify_product_mappings()
    
    # Verify subcategory mappings
    subcategories, subcategory_mismatches = verify_subcategory_mappings()
    
    # Get category info
    categories = get_category_info()
    
    # Summary
    total_mismatches = len(product_mismatches) + len(subcategory_mismatches)
    
    print(f"\n📊 Verification Summary:")
    print(f"✅ Products with images: {len(products)}")
    print(f"✅ Subcategories with images: {len(subcategories)}")
    print(f"⚠️ Total potential mismatches: {total_mismatches}")
    
    if total_mismatches > 0:
        print(f"\n🔧 Recommendations:")
        print(f"1. Review the mismatched items above")
        print(f"2. Update image URLs to match the correct products/subcategories")
        print(f"3. Consider uploading proper images for hardware items")
        return False
    else:
        print(f"\n🎉 All mappings appear to be correct!")
        return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
