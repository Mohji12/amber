#!/usr/bin/env python3
"""
List Subcategories Without Images Script
This script lists all subcategories that don't have images in the database.
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def list_subcategories_without_images():
    """List subcategories without images"""
    print("🔍 Listing Subcategories Without Images...")
    
    try:
        # Create database engine
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Get total subcategories count
            result = connection.execute(text("SELECT COUNT(*) as total FROM subcategories"))
            total_subcategories = result.fetchone().total
            
            # Get subcategories without images
            result = connection.execute(text("""
                SELECT id, name, category_id, image_url 
                FROM subcategories 
                WHERE image_url IS NULL OR image_url = '' OR image_url = 'null'
                ORDER BY name
            """))
            subcategories_without_images = result.fetchall()
            
            print(f"\n📊 Total subcategories: {total_subcategories}")
            print(f"📊 Subcategories without images: {len(subcategories_without_images)}")
            print(f"📊 Subcategories with images: {total_subcategories - len(subcategories_without_images)}")
            
            if subcategories_without_images:
                print(f"\n📋 Subcategories without images:")
                for subcategory in subcategories_without_images:
                    print(f"   - ID {subcategory.id}: {subcategory.name}")
                    print(f"     Category ID: {subcategory.category_id}")
                    print(f"     Image URL: {subcategory.image_url}")
                    print()
            else:
                print("\n✅ All subcategories have images!")
            
            # Get subcategories with images for comparison
            result = connection.execute(text("""
                SELECT id, name, category_id, image_url 
                FROM subcategories 
                WHERE image_url IS NOT NULL AND image_url != '' AND image_url != 'null'
                ORDER BY name
                LIMIT 5
            """))
            subcategories_with_images = result.fetchall()
            
            if subcategories_with_images:
                print(f"📋 Sample subcategories with images (showing first 5):")
                for subcategory in subcategories_with_images:
                    print(f"   - ID {subcategory.id}: {subcategory.name}")
                    print(f"     Image URL: {subcategory.image_url}")
                    print()
            
    except Exception as e:
        print(f"❌ Error listing subcategories: {e}")
        return False
    
    return True

def main():
    """Main function to list subcategories without images"""
    print("🚀 Starting Subcategory Image Check...")
    
    success = list_subcategories_without_images()
    
    if success:
        print("\n✅ List completed!")
        return True
    else:
        print("\n💥 List failed!")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
