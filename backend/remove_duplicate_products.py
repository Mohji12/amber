#!/usr/bin/env python3
"""
Remove Duplicate Products Script
This script identifies and removes duplicate products from the database.
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def find_duplicate_products():
    """Find duplicate products in the database"""
    print("🔍 Finding duplicate products...")
    
    try:
        # Create database engine
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Find duplicates by name
            result = connection.execute(text("""
                SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids
                FROM products 
                GROUP BY name 
                HAVING COUNT(*) > 1
                ORDER BY name
            """))
            duplicates = result.fetchall()
            
            print(f"\n📊 Found {len(duplicates)} products with duplicates:")
            
            all_duplicate_ids = []
            
            for duplicate in duplicates:
                name = duplicate.name
                count = duplicate.count
                ids = [int(id_str) for id_str in duplicate.ids.split(',')]
                
                print(f"\n📦 {name} (appears {count} times):")
                print(f"   IDs: {ids}")
                
                # Get details for each duplicate
                for product_id in ids:
                    result = connection.execute(text("""
                        SELECT id, name, subcategory_id, image_url, created_at 
                        FROM products WHERE id = :id
                    """), {"id": product_id})
                    product = result.fetchone()
                    
                    has_image = "✅" if product.image_url else "❌"
                    print(f"   - ID {product.id}: {has_image} image, created: {product.created_at}")
                
                # Keep the first one (lowest ID), remove the rest
                ids_to_remove = ids[1:]  # Remove all except the first
                all_duplicate_ids.extend(ids_to_remove)
            
            return all_duplicate_ids
            
    except Exception as e:
        print(f"❌ Error finding duplicates: {e}")
        return []

def remove_duplicate_products(duplicate_ids):
    """Remove duplicate products by their IDs"""
    if not duplicate_ids:
        print("✅ No duplicates to remove!")
        return True
    
    print(f"\n🗑️ Removing {len(duplicate_ids)} duplicate products...")
    
    try:
        # Create database engine
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Get product details before deletion
            print("\n📋 Products to be removed:")
            for product_id in duplicate_ids:
                result = connection.execute(text("SELECT id, name, image_url FROM products WHERE id = :id"), {"id": product_id})
                product = result.fetchone()
                has_image = "✅" if product.image_url else "❌"
                print(f"   - ID {product.id}: {product.name} {has_image}")
            
            # Delete duplicates
            for product_id in duplicate_ids:
                connection.execute(text("DELETE FROM products WHERE id = :id"), {"id": product_id})
            
            connection.commit()
            
            print(f"\n✅ Successfully removed {len(duplicate_ids)} duplicate products!")
            
    except Exception as e:
        print(f"❌ Error removing duplicates: {e}")
        return False
    
    return True

def verify_duplicates_removed():
    """Verify that duplicates have been removed"""
    print("\n🔍 Verifying duplicates have been removed...")
    
    try:
        # Create database engine
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Check for remaining duplicates
            result = connection.execute(text("""
                SELECT name, COUNT(*) as count
                FROM products 
                GROUP BY name 
                HAVING COUNT(*) > 1
                ORDER BY name
            """))
            remaining_duplicates = result.fetchall()
            
            if remaining_duplicates:
                print(f"⚠️ Found {len(remaining_duplicates)} products still with duplicates:")
                for duplicate in remaining_duplicates:
                    print(f"   - {duplicate.name} (appears {duplicate.count} times)")
            else:
                print("✅ No duplicates found! All duplicates have been removed.")
            
            # Get total product count
            result = connection.execute(text("SELECT COUNT(*) as total FROM products"))
            total_products = result.fetchone().total
            print(f"\n📊 Total products after cleanup: {total_products}")
            
    except Exception as e:
        print(f"❌ Error verifying duplicates: {e}")
        return False
    
    return True

def main():
    """Main function to remove duplicate products"""
    print("🚀 Starting Duplicate Product Removal...")
    
    # Find duplicates
    duplicate_ids = find_duplicate_products()
    
    if not duplicate_ids:
        print("✅ No duplicates found!")
        return True
    
    # Ask for confirmation
    print(f"\n⚠️ Found {len(duplicate_ids)} duplicate products to remove.")
    print("This will keep the product with the lowest ID and remove the rest.")
    
    # Remove duplicates
    success = remove_duplicate_products(duplicate_ids)
    
    if success:
        # Verify removal
        verify_duplicates_removed()
        print("\n🎉 Duplicate product removal completed successfully!")
        return True
    else:
        print("\n💥 Duplicate removal failed!")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
