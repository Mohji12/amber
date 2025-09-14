#!/usr/bin/env python3
"""
Update Millet Images Script
This script updates all millet products with images from the Organic Millets – UN Superfood Spotlight folder.
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

def get_millet_s3_urls(bucket_name):
    """Fetch all S3 URLs from the Organic Millets folder"""
    prefix = "Amber/products/Organic Millets – UN Superfood Spotlight/"
    print(f"🔍 Fetching millet S3 URLs from bucket: {bucket_name}")
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
        
        print(f"✅ Found {total_files} millet files in S3")
        print(f"📋 Sample URLs:")
        for i, (name, url) in enumerate(list(s3_urls.items())[:5]):
            print(f"   - {name}: {url}")
        
        return s3_urls
        
    except Exception as e:
        print(f"❌ Error fetching millet S3 URLs: {e}")
        return {}

def update_millet_products(engine, s3_urls):
    """Update millet products with S3 image URLs"""
    print("\n🔄 Updating millet products with S3 image URLs...")
    
    # List of millet products to update
    millet_products = [
        "Finger Millet (Ragi / Nachni)",
        "Foxtail Millet (Kangni / Thinai)",
        "Little Millet (Kutki / Sama)",
        "Barnyard Millet (Sanwa / Kuthiraivali)",
        "Kodo Millet (Kodra / Arikelu)",
        "Pearl Millet (Bajra / Sajje)",
        "Browntop Millet (Korale / Andu Korralu)"
    ]
    
    try:
        with engine.connect() as connection:
            updates = []
            matched_count = 0
            
            for millet_name in millet_products:
                # Get the product from database
                result = connection.execute(text("SELECT id, name FROM products WHERE name = :name"), {"name": millet_name})
                product = result.fetchone()
                
                if not product:
                    print(f"⚠️ Product not found: {millet_name}")
                    continue
                
                # Try to find matching S3 file
                matched_url = None
                
                # Try exact match first
                if millet_name in s3_urls:
                    matched_url = s3_urls[millet_name]
                else:
                    # Try partial matches
                    for s3_name, s3_url in s3_urls.items():
                        # Check if any word from millet name is in S3 name
                        millet_words = millet_name.lower().split()
                        s3_words = s3_name.lower().split()
                        
                        # Check for common words like "Millet", "Ragi", "Bajra", etc.
                        if any(word in s3_words for word in millet_words) or any(word in millet_words for word in s3_words):
                            matched_url = s3_url
                            break
                
                if matched_url:
                    updates.append((product.id, matched_url))
                    matched_count += 1
                    print(f"✅ Matched: {millet_name} → {os.path.basename(matched_url)}")
                else:
                    print(f"❌ No match found for: {millet_name}")
            
            print(f"\n📊 Found {matched_count} matches out of {len(millet_products)} millet products")
            
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
    print("🚀 Starting Millet Product Image Update...")
    
    # Configuration
    BUCKET_NAME = "jgi-menteetracker"
    
    # Create database engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Fetch millet S3 URLs
    s3_urls = get_millet_s3_urls(BUCKET_NAME)
    
    if not s3_urls:
        print("❌ No millet S3 URLs found. Please check your bucket configuration.")
        return False
    
    # Update millet products
    millet_success = update_millet_products(engine, s3_urls)
    
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
