#!/usr/bin/env python3
"""
Check Unmatched Items Script
This script identifies which products and subcategories didn't get matched with S3 images.
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

def get_s3_urls(bucket_name, prefix="Amber/New folder/"):
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
        return s3_urls
        
    except Exception as e:
        print(f"❌ Error fetching S3 URLs: {e}")
        return {}

def check_unmatched_subcategories(engine, s3_urls):
    """Check which subcategories didn't get matched"""
    print("\n🔍 Checking unmatched subcategories...")
    
    try:
        with engine.connect() as connection:
            # Get all subcategories
            result = connection.execute(text("SELECT id, name, image_url FROM subcategories"))
            subcategories = result.fetchall()
            
            unmatched = []
            matched_count = 0
            
            for subcategory in subcategories:
                subcategory_name = subcategory.name
                has_image = subcategory.image_url is not None
                
                # Check if it has an image URL
                if has_image:
                    matched_count += 1
                else:
                    unmatched.append(subcategory_name)
            
            print(f"📊 Subcategories with images: {matched_count}/{len(subcategories)}")
            print(f"📊 Unmatched subcategories: {len(unmatched)}")
            
            if unmatched:
                print("\n❌ Unmatched subcategories:")
                for i, name in enumerate(unmatched, 1):
                    print(f"   {i:2d}. {name}")
            else:
                print("\n✅ All subcategories have images!")
                
    except Exception as e:
        print(f"❌ Error checking subcategories: {e}")

def check_unmatched_products(engine, s3_urls):
    """Check which products didn't get matched"""
    print("\n🔍 Checking unmatched products...")
    
    try:
        with engine.connect() as connection:
            # Get all products
            result = connection.execute(text("SELECT id, name, image_url FROM products"))
            products = result.fetchall()
            
            unmatched = []
            matched_count = 0
            
            for product in products:
                product_name = product.name
                has_image = product.image_url is not None
                
                # Check if it has an image URL
                if has_image:
                    matched_count += 1
                else:
                    unmatched.append(product_name)
            
            print(f"📊 Products with images: {matched_count}/{len(products)}")
            print(f"📊 Unmatched products: {len(unmatched)}")
            
            if unmatched:
                print("\n❌ Unmatched products:")
                for i, name in enumerate(unmatched, 1):
                    print(f"   {i:2d}. {name}")
            else:
                print("\n✅ All products have images!")
                
    except Exception as e:
        print(f"❌ Error checking products: {e}")

def suggest_s3_matches(engine, s3_urls):
    """Suggest potential S3 matches for unmatched items"""
    print("\n💡 Suggesting potential S3 matches...")
    
    try:
        with engine.connect() as connection:
            # Get unmatched subcategories
            result = connection.execute(text("SELECT name FROM subcategories WHERE image_url IS NULL"))
            unmatched_subcategories = [row.name for row in result.fetchall()]
            
            # Get unmatched products
            result = connection.execute(text("SELECT name FROM products WHERE image_url IS NULL"))
            unmatched_products = [row.name for row in result.fetchall()]
            
            print(f"\n🔍 Potential matches for unmatched subcategories:")
            for subcategory in unmatched_subcategories[:10]:  # Show first 10
                suggestions = []
                for s3_name in s3_urls.keys():
                    if any(word in s3_name.lower() for word in subcategory.lower().split()):
                        suggestions.append(s3_name)
                
                if suggestions:
                    print(f"\n   📦 {subcategory}:")
                    for suggestion in suggestions[:3]:  # Show top 3 suggestions
                        print(f"      → {suggestion}")
            
            print(f"\n🔍 Potential matches for unmatched products:")
            for product in unmatched_products[:10]:  # Show first 10
                suggestions = []
                for s3_name in s3_urls.keys():
                    if any(word in s3_name.lower() for word in product.lower().split()):
                        suggestions.append(s3_name)
                
                if suggestions:
                    print(f"\n   📦 {product}:")
                    for suggestion in suggestions[:3]:  # Show top 3 suggestions
                        print(f"      → {suggestion}")
                        
    except Exception as e:
        print(f"❌ Error suggesting matches: {e}")

def main():
    """Main function to check unmatched items"""
    print("🔍 Checking Unmatched Items...")
    
    # Configuration
    BUCKET_NAME = "jgi-menteetracker"
    S3_PREFIX = "Amber/New folder/"
    
    # Create database engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Fetch S3 URLs
    s3_urls = get_s3_urls(BUCKET_NAME, S3_PREFIX)
    
    if not s3_urls:
        print("❌ No S3 URLs found. Please check your bucket configuration.")
        return False
    
    # Check unmatched items
    check_unmatched_subcategories(engine, s3_urls)
    check_unmatched_products(engine, s3_urls)
    
    # Suggest potential matches
    suggest_s3_matches(engine, s3_urls)
    
    print("\n✅ Analysis completed!")
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
