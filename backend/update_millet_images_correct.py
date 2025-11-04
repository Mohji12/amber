#!/usr/bin/env python3
"""
Update Millet Images with Correct Mapping Script
This script updates all millet products with the correct specific images from the Organic Millets folder.
"""

import sys
import os
import boto3
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def get_millet_mapping():
    """Get the correct mapping for each millet product"""
    bucket_name = "jgi-menteetracker"
    base_url = f"https://{bucket_name}.s3.ap-south-1.amazonaws.com/Amber/products/Organic Millets – UN Superfood Spotlight/"
    
    # Specific mapping for each millet product
    millet_mapping = {
        "Finger Millet (Ragi / Nachni)": f"{base_url}Finger Millet (Ragi).jpg",
        "Foxtail Millet (Kangni / Thinai)": f"{base_url}Foxtail Millet (Kangni).webp",
        "Little Millet (Kutki / Sama)": f"{base_url}Little Millet (Kutki).jpg",
        "Barnyard Millet (Sanwa / Kuthiraivali)": f"{base_url}Barnyard Millet (Sanwa).jpg",
        "Kodo Millet (Kodra / Arikelu)": f"{base_url}Kodo Millet (Kodra).webp",
        "Pearl Millet (Bajra / Sajje)": f"{base_url}Pearl Millet (Bajra).webp",
        "Browntop Millet (Korale / Andu Korralu)": f"{base_url}Browntop Millet (Korale).jpg"
    }
    
    return millet_mapping

def update_millet_products(engine, millet_mapping):
    """Update millet products with correct S3 image URLs"""
    print("\n🔄 Updating millet products with correct S3 image URLs...")
    
    try:
        with engine.connect() as connection:
            updates = []
            matched_count = 0
            
            for product_name, image_url in millet_mapping.items():
                # Get the product from database
                result = connection.execute(text("SELECT id, name FROM products WHERE name = :name"), {"name": product_name})
                product = result.fetchone()
                
                if not product:
                    print(f"⚠️ Product not found: {product_name}")
                    continue
                
                updates.append((product.id, image_url))
                matched_count += 1
                print(f"✅ Mapped: {product_name} → {os.path.basename(image_url)}")
            
            print(f"\n📊 Found {matched_count} matches out of {len(millet_mapping)} millet products")
            
            if updates:
                # Create batch UPDATE statement
                update_sql = """
                    UPDATE products 
                    SET image_url = CASE id 
                """
                
                for product_id, image_url in updates:
                    update_sql += f"    WHEN {product_id} THEN '{image_url}'\n"
                
                update_sql += "    ELSE image_url END"
                
                # Execute batch update
                connection.execute(text(update_sql))
                connection.commit()
                
                print(f"✅ Successfully updated {len(updates)} millet products")
                
                # Show updated products
                print("\n📋 Updated millet products:")
                for product_id, image_url in updates:
                    result = connection.execute(text("SELECT name FROM products WHERE id = :id"), {"id": product_id})
                    product_name = result.fetchone().name
                    print(f"   - {product_name}: {os.path.basename(image_url)}")
            else:
                print("⚠️ No millet products were updated")
                
    except Exception as e:
        print(f"❌ Error updating millet products: {e}")
        return False
    
    return True

def main():
    """Main function to update millet products"""
    print("🚀 Starting Millet Product Image Update with Correct Mapping...")
    
    # Create database engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Get millet mapping
    millet_mapping = get_millet_mapping()
    
    print(f"📋 Millet mapping created for {len(millet_mapping)} products:")
    for product_name, image_url in millet_mapping.items():
        print(f"   - {product_name} → {os.path.basename(image_url)}")
    
    # Update millet products
    millet_success = update_millet_products(engine, millet_mapping)
    
    if millet_success:
        print("\n🎉 Millet product image update completed successfully!")
        return True
    else:
        print("\n💥 Millet product update failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
