#!/usr/bin/env python3
"""
List All Image URLs Script
This script lists all image URLs present in the products and subcategories tables.
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def list_all_image_urls():
    """List all image URLs from products and subcategories tables"""
    print("🔍 Listing all image URLs from database...")
    
    try:
        # Create database engine
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Get all subcategories with image URLs
            print("\n" + "="*80)
            print("📁 SUBCATEGORIES TABLE - Image URLs")
            print("="*80)
            result = connection.execute(text("""
                SELECT id, name, image_url 
                FROM subcategories 
                WHERE image_url IS NOT NULL AND image_url != '' AND image_url != 'null'
                ORDER BY id
            """))
            subcategories = result.fetchall()
            
            print(f"\n📊 Total subcategories with image URLs: {len(subcategories)}\n")
            
            if subcategories:
                for subcategory in subcategories:
                    print(f"ID {subcategory.id}: {subcategory.name}")
                    print(f"   Image URL: {subcategory.image_url}")
                    print()
            else:
                print("   No subcategories with image URLs found.")
            
            # Get all products with image URLs
            print("\n" + "="*80)
            print("📦 PRODUCTS TABLE - Image URLs")
            print("="*80)
            result = connection.execute(text("""
                SELECT id, name, image_url 
                FROM products 
                WHERE image_url IS NOT NULL AND image_url != '' AND image_url != 'null'
                ORDER BY id
            """))
            products = result.fetchall()
            
            print(f"\n📊 Total products with image URLs: {len(products)}\n")
            
            if products:
                for product in products:
                    print(f"ID {product.id}: {product.name}")
                    print(f"   Image URL: {product.image_url}")
                    print()
            else:
                print("   No products with image URLs found.")
            
            # Summary
            print("\n" + "="*80)
            print("📊 SUMMARY")
            print("="*80)
            
            # Count subcategories without images
            result = connection.execute(text("""
                SELECT COUNT(*) as count 
                FROM subcategories 
                WHERE image_url IS NULL OR image_url = '' OR image_url = 'null'
            """))
            subcategories_without = result.fetchone().count
            
            # Count products without images
            result = connection.execute(text("""
                SELECT COUNT(*) as count 
                FROM products 
                WHERE image_url IS NULL OR image_url = '' OR image_url = 'null'
            """))
            products_without = result.fetchone().count
            
            print(f"\nSubcategories:")
            print(f"  ✅ With image URLs: {len(subcategories)}")
            print(f"  ❌ Without image URLs: {subcategories_without}")
            
            print(f"\nProducts:")
            print(f"  ✅ With image URLs: {len(products)}")
            print(f"  ❌ Without image URLs: {products_without}")
            
    except Exception as e:
        print(f"❌ Error listing image URLs: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

def main():
    """Main function"""
    print("🚀 Starting Image URL Listing...")
    success = list_all_image_urls()
    
    if success:
        print("\n✅ Listing completed!")
        return True
    else:
        print("\n💥 Listing failed!")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)




