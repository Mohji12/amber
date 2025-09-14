#!/usr/bin/env python3
"""
Bulk Update S3 Images Script (Manual Version)
This script allows manual mapping of S3 URLs to products/subcategories for fast bulk updates.
"""

import sys
import os
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL
import re

def clean_name_for_s3(name):
    """Clean product/subcategory name to match S3 file naming convention"""
    # Remove special characters and replace spaces with +
    cleaned = re.sub(r'[^\w\s]', '', name)
    cleaned = cleaned.replace(' ', '+')
    return cleaned

def get_manual_s3_mapping():
    """Manual S3 URL mapping - you can add your S3 URLs here"""
    s3_mapping = {
        # Add your S3 URLs here
        # Format: "Product/Subcategory Name": "Full S3 URL"
        
        # Example mappings (replace with your actual URLs):
        "Beetroot Powder": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Dehydrated+Foods/Beetroot+Powder.jpg",
        "Black Pepper": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Spices/Black+Pepper.jpg",
        "Green Cardamom": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Spices/Green+Cardamom.jpg",
        "Turmeric": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Spices/Turmeric.jpg",
        "Chickpeas": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Pulses/Chickpeas.jpg",
        "Lentils": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Pulses/Lentils.jpg",
        "Almonds": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Dry+Fruits/Almonds.jpg",
        "Cashews": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Dry+Fruits/Cashews.jpg",
        "Basmati Rice": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New+folder/Grains/Basmati+Rice.jpg",
        
        # Add more mappings here...
    }
    
    print(f"📋 Manual S3 mapping loaded with {len(s3_mapping)} entries")
    print("📋 Sample mappings:")
    for i, (name, url) in enumerate(list(s3_mapping.items())[:3]):
        print(f"   - {name}: {url}")
    
    return s3_mapping

def bulk_update_subcategories(engine, s3_mapping):
    """Bulk update subcategories with S3 image URLs"""
    print("\n🔄 Updating subcategories with S3 image URLs...")
    
    try:
        with engine.connect() as connection:
            # Get all subcategories
            result = connection.execute(text("SELECT id, name FROM subcategories"))
            subcategories = result.fetchall()
            
            updates = []
            matched_count = 0
            
            for subcategory in subcategories:
                subcategory_name = subcategory.name
                
                # Try exact match first
                if subcategory_name in s3_mapping:
                    updates.append((subcategory.id, s3_mapping[subcategory_name]))
                    matched_count += 1
                    continue
                
                # Try cleaned name match
                cleaned_name = clean_name_for_s3(subcategory_name)
                if cleaned_name in s3_mapping:
                    updates.append((subcategory.id, s3_mapping[cleaned_name]))
                    matched_count += 1
                    continue
                
                # Try partial matches
                for s3_name, s3_url in s3_mapping.items():
                    if subcategory_name.lower() in s3_name.lower() or s3_name.lower() in subcategory_name.lower():
                        updates.append((subcategory.id, s3_url))
                        matched_count += 1
                        break
            
            print(f"📊 Found {matched_count} matches out of {len(subcategories)} subcategories")
            
            if updates:
                # Create batch UPDATE statement
                update_sql = """
                    UPDATE subcategories 
                    SET image_url = CASE id 
                """
                
                for subcategory_id, image_url in updates:
                    update_sql += f"    WHEN {subcategory_id} THEN '{image_url}'\n"
                
                update_sql += "    ELSE image_url END"
                
                # Execute batch update
                connection.execute(text(update_sql))
                connection.commit()
                
                print(f"✅ Successfully updated {len(updates)} subcategories")
                
                # Show some examples
                print("\n📋 Sample updated subcategories:")
                result = connection.execute(text("SELECT name, image_url FROM subcategories WHERE image_url IS NOT NULL LIMIT 5"))
                updated = result.fetchall()
                for item in updated:
                    print(f"   - {item.name}: {item.image_url}")
            else:
                print("⚠️ No matches found for subcategories")
                
    except Exception as e:
        print(f"❌ Error updating subcategories: {e}")
        return False
    
    return True

def bulk_update_products(engine, s3_mapping):
    """Bulk update products with S3 image URLs"""
    print("\n🔄 Updating products with S3 image URLs...")
    
    try:
        with engine.connect() as connection:
            # Get all products
            result = connection.execute(text("SELECT id, name FROM products"))
            products = result.fetchall()
            
            updates = []
            matched_count = 0
            
            for product in products:
                product_name = product.name
                
                # Try exact match first
                if product_name in s3_mapping:
                    updates.append((product.id, s3_mapping[product_name]))
                    matched_count += 1
                    continue
                
                # Try cleaned name match
                cleaned_name = clean_name_for_s3(product_name)
                if cleaned_name in s3_mapping:
                    updates.append((product.id, s3_mapping[cleaned_name]))
                    matched_count += 1
                    continue
                
                # Try partial matches
                for s3_name, s3_url in s3_mapping.items():
                    if product_name.lower() in s3_name.lower() or s3_name.lower() in product_name.lower():
                        updates.append((product.id, s3_url))
                        matched_count += 1
                        break
            
            print(f"📊 Found {matched_count} matches out of {len(products)} products")
            
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
                
                print(f"✅ Successfully updated {len(updates)} products")
                
                # Show some examples
                print("\n📋 Sample updated products:")
                result = connection.execute(text("SELECT name, image_url FROM products WHERE image_url IS NOT NULL LIMIT 5"))
                updated = result.fetchall()
                for item in updated:
                    print(f"   - {item.name}: {item.image_url}")
            else:
                print("⚠️ No matches found for products")
                
    except Exception as e:
        print(f"❌ Error updating products: {e}")
        return False
    
    return True

def main():
    """Main function to execute bulk S3 image URL updates"""
    print("🚀 Starting Bulk S3 Image URL Update (Manual Version)...")
    
    # Create database engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Get manual S3 mapping
    s3_mapping = get_manual_s3_mapping()
    
    if not s3_mapping:
        print("❌ No S3 mappings found. Please add your S3 URLs to the mapping.")
        return False
    
    # Update subcategories
    subcategories_success = bulk_update_subcategories(engine, s3_mapping)
    
    # Update products
    products_success = bulk_update_products(engine, s3_mapping)
    
    if subcategories_success and products_success:
        print("\n🎉 Bulk S3 image URL update completed successfully!")
        return True
    else:
        print("\n💥 Some updates failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
