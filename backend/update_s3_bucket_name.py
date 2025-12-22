#!/usr/bin/env python3
"""
Update S3 Bucket Name Script
This script updates all image URLs in the database to change 'menteetracker' to 'menteetrackers'
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def update_s3_bucket_name():
    """Update S3 bucket name from 'menteetracker' to 'menteetrackers' in all image URLs"""
    print("🔄 Updating S3 bucket name in image URLs...")
    print("   Changing: jgi-menteetracker → jgi-menteetrackers")
    
    try:
        # Create database engine
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Start a transaction
            trans = connection.begin()
            
            try:
                # Update subcategories table
                print("\n📁 Updating subcategories table...")
                result = connection.execute(text("""
                    UPDATE subcategories 
                    SET image_url = REPLACE(image_url, 'jgi-menteetracker', 'jgi-menteetrackers')
                    WHERE image_url LIKE '%jgi-menteetracker%'
                """))
                subcategories_updated = result.rowcount
                print(f"   ✅ Updated {subcategories_updated} subcategory image URLs")
                
                # Update products table
                print("\n📦 Updating products table...")
                result = connection.execute(text("""
                    UPDATE products 
                    SET image_url = REPLACE(image_url, 'jgi-menteetracker', 'jgi-menteetrackers')
                    WHERE image_url LIKE '%jgi-menteetracker%'
                """))
                products_updated = result.rowcount
                print(f"   ✅ Updated {products_updated} product image URLs")
                
                # Commit the transaction
                trans.commit()
                
                print(f"\n✅ Successfully updated {subcategories_updated + products_updated} image URLs!")
                
                # Verify the changes
                print("\n🔍 Verifying changes...")
                
                # Check subcategories
                result = connection.execute(text("""
                    SELECT COUNT(*) as count 
                    FROM subcategories 
                    WHERE image_url LIKE '%jgi-menteetrackers%'
                """))
                subcategories_with_new_url = result.fetchone().count
                
                result = connection.execute(text("""
                    SELECT COUNT(*) as count 
                    FROM subcategories 
                    WHERE image_url LIKE '%jgi-menteetracker%' AND image_url NOT LIKE '%jgi-menteetrackers%'
                """))
                subcategories_with_old_url = result.fetchone().count
                
                # Check products
                result = connection.execute(text("""
                    SELECT COUNT(*) as count 
                    FROM products 
                    WHERE image_url LIKE '%jgi-menteetrackers%'
                """))
                products_with_new_url = result.fetchone().count
                
                result = connection.execute(text("""
                    SELECT COUNT(*) as count 
                    FROM products 
                    WHERE image_url LIKE '%jgi-menteetracker%' AND image_url NOT LIKE '%jgi-menteetrackers%'
                """))
                products_with_old_url = result.fetchone().count
                
                print(f"\n📊 Verification Results:")
                print(f"   Subcategories with new URL (menteetrackers): {subcategories_with_new_url}")
                print(f"   Subcategories with old URL (menteetracker): {subcategories_with_old_url}")
                print(f"   Products with new URL (menteetrackers): {products_with_new_url}")
                print(f"   Products with old URL (menteetracker): {products_with_old_url}")
                
                # Show sample updated URLs
                print(f"\n📋 Sample updated URLs (Subcategories):")
                result = connection.execute(text("""
                    SELECT id, name, image_url 
                    FROM subcategories 
                    WHERE image_url LIKE '%jgi-menteetrackers%'
                    LIMIT 3
                """))
                for row in result:
                    print(f"   ID {row.id}: {row.name}")
                    print(f"      URL: {row.image_url}")
                
                print(f"\n📋 Sample updated URLs (Products):")
                result = connection.execute(text("""
                    SELECT id, name, image_url 
                    FROM products 
                    WHERE image_url LIKE '%jgi-menteetrackers%'
                    LIMIT 3
                """))
                for row in result:
                    print(f"   ID {row.id}: {row.name}")
                    print(f"      URL: {row.image_url}")
                
                if subcategories_with_old_url > 0 or products_with_old_url > 0:
                    print(f"\n⚠️  Warning: Some URLs still contain the old bucket name!")
                else:
                    print(f"\n✅ All URLs have been successfully updated!")
                
            except Exception as e:
                trans.rollback()
                raise e
                
    except Exception as e:
        print(f"❌ Error updating image URLs: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

def main():
    """Main function"""
    print("🚀 Starting S3 Bucket Name Update...")
    print("⚠️  This will update all image URLs in the database.")
    
    # Ask for confirmation (in production, you might want to add a prompt)
    # For now, we'll proceed with the update
    
    success = update_s3_bucket_name()
    
    if success:
        print("\n✅ Update completed successfully!")
        return True
    else:
        print("\n💥 Update failed!")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)




