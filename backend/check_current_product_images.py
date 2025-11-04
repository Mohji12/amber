#!/usr/bin/env python3
"""
Check Current Product Images Script
This script checks what image URLs are currently stored in the products table.
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def check_current_product_images():
    """Check current image URLs in products table"""
    print("🔍 Checking current product image URLs...")
    
    try:
        # Create database engine
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Get all products with their image URLs
            result = connection.execute(text("SELECT id, name, image_url FROM products ORDER BY id"))
            products = result.fetchall()
            
            print(f"\n📊 Total products: {len(products)}")
            
            # Count products with images
            products_with_images = [p for p in products if p.image_url is not None]
            products_without_images = [p for p in products if p.image_url is None]
            
            print(f"📊 Products with images: {len(products_with_images)}")
            print(f"📊 Products without images: {len(products_without_images)}")
            
            # Check which S3 path is being used
            new_path_count = 0
            old_path_count = 0
            other_path_count = 0
            
            print(f"\n🔍 Analyzing S3 paths:")
            
            for product in products_with_images:
                if product.image_url:
                    if "Amber/products/" in product.image_url:
                        new_path_count += 1
                    elif "Amber/New folder/" in product.image_url:
                        old_path_count += 1
                    else:
                        other_path_count += 1
            
            print(f"📁 Using 'Amber/products/' path: {new_path_count}")
            print(f"📁 Using 'Amber/New folder/' path: {old_path_count}")
            print(f"📁 Using other paths: {other_path_count}")
            
            # Show sample products with new path
            print(f"\n📋 Sample products with 'Amber/products/' path:")
            new_path_products = [p for p in products_with_images if p.image_url and "Amber/products/" in p.image_url]
            for i, product in enumerate(new_path_products[:5], 1):
                print(f"   {i}. {product.name}")
                print(f"      URL: {product.image_url}")
            
            # Show sample products with old path
            print(f"\n📋 Sample products with 'Amber/New folder/' path:")
            old_path_products = [p for p in products_with_images if p.image_url and "Amber/New folder/" in p.image_url]
            for i, product in enumerate(old_path_products[:5], 1):
                print(f"   {i}. {product.name}")
                print(f"      URL: {product.image_url}")
            
            # Show products without images
            if products_without_images:
                print(f"\n❌ Products without images:")
                for i, product in enumerate(products_without_images[:10], 1):
                    print(f"   {i}. {product.name}")
                if len(products_without_images) > 10:
                    print(f"   ... and {len(products_without_images) - 10} more")
            
    except Exception as e:
        print(f"❌ Error checking products: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print("🔍 Checking Current Product Images...")
    success = check_current_product_images()
    
    if success:
        print("\n✅ Analysis completed!")
    else:
        print("\n💥 Analysis failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
