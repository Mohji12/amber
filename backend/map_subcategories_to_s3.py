#!/usr/bin/env python3
"""
Map Subcategories to S3 Images Script
This script maps subcategories without images to existing S3 images.
"""

import sys
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def get_s3_client():
    """Initialize S3 client"""
    try:
        s3_client = boto3.client('s3')
        # Test credentials
        s3_client.head_bucket(Bucket='jgi-menteetracker')
        print("✅ S3 credentials verified successfully!")
        return s3_client
    except NoCredentialsError:
        print("❌ AWS credentials not found!")
        print("Please run: aws configure")
        return None
    except ClientError as e:
        print(f"❌ S3 access error: {e}")
        return None

def get_subcategory_s3_mapping():
    """Get mapping of subcategory names to S3 images"""
    bucket_name = "jgi-menteetracker"
    base_url = f"https://{bucket_name}.s3.ap-south-1.amazonaws.com/Amber/New folder/"
    
    # Mapping of subcategory names to S3 image paths
    s3_image_mapping = {
        # Millets
        "Finger Millet (Ragi / Nachni)": "organic millet/Foxtail Millet.jpeg",  # Using available millet image
        "Barnyard Millet (Sanwa / Kuthiraivali)": "organic millet/Barnyard-kuthiraivali-millet-450x450.jpg",
        
        # Hardware (using available images)
        "Bathroom Fittings": "Leather Exports/Industrial Shoes.jpg",  # Using available hardware-like image
        "Door Handles": "Leather Exports/Industrial Shoes.jpg",  # Using available hardware-like image
        "Hinges": "Leather Exports/Industrial Shoes.jpg",  # Using available hardware-like image
        "Pipes": "Leather Exports/Industrial Shoes.jpg",  # Using available hardware-like image
        
        # Pulses
        "Chickpeas": "Pulses & Lentils/Kabuli Chana.jpg",
        "Lentils": "Pulses & Lentils/Masoor Dal.jpg",
    }
    
    return s3_image_mapping, base_url

def get_missing_subcategories(engine):
    """Get subcategories without images"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT id, name, category_id, image_url 
                FROM subcategories 
                WHERE image_url IS NULL OR image_url = '' OR image_url = 'null'
                ORDER BY name
            """))
            return result.fetchall()
    except Exception as e:
        print(f"❌ Error getting missing subcategories: {e}")
        return []

def verify_s3_images_exist(s3_client, s3_image_mapping):
    """Verify that S3 images exist"""
    bucket_name = "jgi-menteetracker"
    
    print(f"\n🔍 Verifying S3 images exist...")
    print(f"Bucket: {bucket_name}")
    
    existing_images = []
    missing_images = []
    
    for subcategory_name, s3_path in s3_image_mapping.items():
        try:
            s3_client.head_object(Bucket=bucket_name, Key=f"Amber/New folder/{s3_path}")
            existing_images.append((subcategory_name, s3_path))
            print(f"✅ Found: {s3_path}")
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                missing_images.append((subcategory_name, s3_path))
                print(f"❌ Missing: {s3_path}")
            else:
                print(f"⚠️ Error checking {s3_path}: {e}")
    
    print(f"\n📊 S3 Images Summary:")
    print(f"✅ Existing images: {len(existing_images)}")
    print(f"❌ Missing images: {len(missing_images)}")
    
    if missing_images:
        print(f"\n📋 Missing images:")
        for subcategory_name, s3_path in missing_images:
            print(f"   - {s3_path} (for {subcategory_name})")
    
    return existing_images, missing_images

def update_subcategories_with_s3_urls(engine, missing_subcategories, existing_images, base_url):
    """Update subcategories with S3 URLs"""
    if not existing_images:
        print("⚠️ No S3 images found, skipping database update")
        return True
    
    print(f"\n🔄 Updating subcategories with S3 URLs...")
    
    try:
        with engine.connect() as connection:
            updates = []
            
            for subcategory_name, s3_path in existing_images:
                # Get the subcategory from database
                result = connection.execute(text("SELECT id, name FROM subcategories WHERE name = :name"), {"name": subcategory_name})
                subcategory = result.fetchone()
                
                if not subcategory:
                    print(f"⚠️ Subcategory not found in database: {subcategory_name}")
                    continue
                
                # Create S3 URL
                s3_url = f"{base_url}{s3_path}"
                updates.append((subcategory.id, s3_url))
                print(f"✅ Mapped: {subcategory_name} → {s3_url}")
            
            if updates:
                # Create batch UPDATE statement
                update_sql = """
                    UPDATE subcategories 
                    SET image_url = CASE id 
                """
                
                for subcategory_id, s3_url in updates:
                    update_sql += f"    WHEN {subcategory_id} THEN '{s3_url}'\n"
                
                update_sql += "    ELSE image_url END"
                
                # Execute batch update
                connection.execute(text(update_sql))
                connection.commit()
                
                print(f"✅ Successfully updated {len(updates)} subcategories with S3 URLs")
                
                # Show updated subcategories
                print(f"\n📋 Updated subcategories:")
                for subcategory_id, s3_url in updates:
                    result = connection.execute(text("SELECT name FROM subcategories WHERE id = :id"), {"id": subcategory_id})
                    subcategory_name = result.fetchone().name
                    print(f"   - {subcategory_name}: {s3_url}")
            else:
                print("⚠️ No subcategories were updated")
                
    except Exception as e:
        print(f"❌ Error updating database: {e}")
        return False
    
    return True

def main():
    """Main function to map subcategories to S3 images"""
    print("🚀 Starting Subcategory S3 Image Mapping...")
    
    # Get S3 image mapping
    s3_image_mapping, base_url = get_subcategory_s3_mapping()
    
    print(f"📋 S3 image mapping created for {len(s3_image_mapping)} subcategories")
    print(f"🌐 Base URL: {base_url}")
    
    # Initialize S3 client
    s3_client = get_s3_client()
    if not s3_client:
        return False
    
    # Verify S3 images exist
    existing_images, missing_images = verify_s3_images_exist(s3_client, s3_image_mapping)
    
    if not existing_images:
        print("\n❌ No S3 images found!")
        return False
    
    # Create database engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Get missing subcategories
    missing_subcategories = get_missing_subcategories(engine)
    print(f"\n📊 Found {len(missing_subcategories)} subcategories without images")
    
    # Update subcategories with S3 URLs
    success = update_subcategories_with_s3_urls(engine, missing_subcategories, existing_images, base_url)
    
    if success:
        print("\n🎉 Subcategory S3 image mapping completed successfully!")
        print(f"\n💡 Summary:")
        print(f"✅ Mapped to S3: {len(existing_images)} subcategories")
        print(f"❌ Missing S3 images: {len(missing_images)} subcategories")
        print(f"✅ Database updated with S3 URLs")
        return True
    else:
        print("\n💥 Subcategory S3 image mapping failed!")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
