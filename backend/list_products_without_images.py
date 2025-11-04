#!/usr/bin/env python3
"""
List Products Without Images Script
This script lists all products that don't have image URLs.
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def list_products_without_images():
    """List all products without images"""
    print("🔍 Listing products without images...")
    
    try:
        # Create database engine
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Get all products without images
            result = connection.execute(text("SELECT id, name, subcategory_id FROM products WHERE image_url IS NULL ORDER BY id"))
            products_without_images = result.fetchall()
            
            print(f"\n📊 Total products without images: {len(products_without_images)}")
            
            if products_without_images:
                print(f"\n❌ Products without images:")
                print("=" * 60)
                for i, product in enumerate(products_without_images, 1):
                    print(f"{i:3d}. {product.name}")
                
                print("=" * 60)
                print(f"Total: {len(products_without_images)} products")
            else:
                print("\n✅ All products have images!")
            
    except Exception as e:
        print(f"❌ Error listing products: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print("🔍 Listing Products Without Images...")
    success = list_products_without_images()
    
    if success:
        print("\n✅ List completed!")
    else:
        print("\n💥 Failed to get list!")
        sys.exit(1)

if __name__ == "__main__":
    main()
