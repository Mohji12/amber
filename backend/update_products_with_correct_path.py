#!/usr/bin/env python3
"""
Update Products with Correct S3 Path Script
This script updates products using the correct S3 path (Amber/products/) 
while keeping subcategories from the original path (Amber/New folder/).
"""

import sys
import os
import boto3
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL
import re

def clean_name_for_s3(name):
    """Clean product/subcategory name to match S3 file naming convention"""
    # Remove special characters and replace spaces with +
    cleaned = re.sub(r'[^\w\s]', '', name)
    cleaned = cleaned.replace(' ', '+')
    return cleaned

def get_s3_urls(bucket_name, prefix):
    """Fetch all S3 URLs from the specified bucket and prefix"""
    print(f"🔍 Fetching S3 URLs from bucket: {bucket_name}")
    print(f"📁 Prefix: {prefix}")
    
    try:
        # Initialize S3 client
        s3_client = boto3.client('s3')
        
        # List all objects in the bucket with the specified prefix
        paginator = s3_client.get_paginator('list_objects_v2')
        pages = paginator.paginate(Bucket=bucket_name, Prefix=prefix)
        
        s3_urls = {}
        total_files = 0
        
        for page in pages:
            if 'Contents' in page:
                for obj in page['Contents']:
                    key = obj['Key']
                    # Extract filename without path
                    filename = os.path.basename(key)
                    # Remove file extension
                    name_without_ext = os.path.splitext(filename)[0]
                    # Decode URL encoding
                    decoded_name = name_without_ext.replace('+', ' ')
                    
                    # Create full S3 URL
                    s3_url = f"https://{bucket_name}.s3.ap-south-1.amazonaws.com/{key}"
                    s3_urls[decoded_name] = s3_url
                    total_files += 1
        
        print(f"✅ Found {total_files} files in S3")
        print(f"📋 Sample URLs:")
        for i, (name, url) in enumerate(list(s3_urls.items())[:3]):
            print(f"   - {name}: {url}")
        
        return s3_urls
        
    except Exception as e:
        print(f"❌ Error fetching S3 URLs: {e}")
        return {}

def bulk_update_products(engine, s3_urls):
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
                if product_name in s3_urls:
                    updates.append((product.id, s3_urls[product_name]))
                    matched_count += 1
                    continue
                
                # Try cleaned name match
                cleaned_name = clean_name_for_s3(product_name)
                if cleaned_name in s3_urls:
                    updates.append((product.id, s3_urls[cleaned_name]))
                    matched_count += 1
                    continue
                
                # Try partial matches
                for s3_name, s3_url in s3_urls.items():
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
    """Main function to update products with correct S3 path"""
    print("🚀 Starting Product Update with Correct S3 Path...")
    
    # Configuration
    BUCKET_NAME = "jgi-menteetracker"
    PRODUCTS_PREFIX = "Amber/products/"  # Correct path for products
    
    # Create database engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Fetch S3 URLs for products
    s3_urls = get_s3_urls(BUCKET_NAME, PRODUCTS_PREFIX)
    
    if not s3_urls:
        print("❌ No S3 URLs found for products. Please check your bucket configuration.")
        return False
    
    # Update products
    products_success = bulk_update_products(engine, s3_urls)
    
    if products_success:
        print("\n🎉 Product update with correct S3 path completed successfully!")
        return True
    else:
        print("\n💥 Product update failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
