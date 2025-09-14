#!/usr/bin/env python3
"""
Upload Local Images to S3 Script
This script uploads local product images to S3 bucket and updates the database.
"""

import sys
import os
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

def get_local_image_mapping():
    """Get mapping for local images"""
    # Define the local images folder path
    local_images_folder = "images/products"
    
    # Mapping of product names to local image files
    local_image_mapping = {
        # Millets
        "Finger Millet (Ragi / Nachni)": "finger-millet.jpg",
        "Foxtail Millet (Kangni / Thinai)": "foxtail-millet.jpg",
        "Little Millet (Kutki / Sama)": "little-millet.jpg",
        "Barnyard Millet (Sanwa / Kuthiraivali)": "barnyard-millet.jpg",
        "Kodo Millet (Kodra / Arikelu)": "kodo-millet.jpg",
        "Pearl Millet (Bajra / Sajje)": "pearl-millet.jpg",
        "Browntop Millet (Korale / Andu Korralu)": "browntop-millet.jpg",
        
        # Spices
        "Jumbo Green Cardamom (8 mm+)": "jumbo-cardamom.jpg",
        "Crushed / Grade-B Cardamom": "crushed-cardamom.jpg",
        "Ceylon Cinnamon Sticks (Alba Grade)": "cinnamon-alba.jpg",
        "Ceylon Cinnamon Sticks (C5 Special)": "cinnamon-c5.jpg",
        "Black Pepper Whole (Malabar)": "black-pepper-malabar.jpg",
        "Black Pepper Whole (Tellicherry)": "black-pepper-tellicherry.jpg",
        "Cumin Seeds (Europe Quality)": "cumin-seeds.jpg",
        "Turmeric Fingers (Double Polished)": "turmeric-fingers.jpg",
        "Whole Cloves": "whole-cloves.jpg",
        "Whole Red Chilli (Sannam / 334)": "red-chilli.jpg",
        "Premium Black Pepper": "premium-black-pepper.jpg",
        
        # Rice
        "Basmati Rice (1121 Steam)": "basmati-1121.jpg",
        "Basmati Rice (Pusa / Traditional)": "basmati-pusa.jpg",
        "Basmati Rice (Golden Sella)": "basmati-golden-sella.jpg",
        "IR64 Long Grain Rice": "ir64-rice.jpg",
        
        # Pulses & Lentils
        "Toor Dal Split": "toor-dal-split.jpg",
        "Green Gram Split": "green-gram-split.jpg",
        "Green Gram Whole": "green-gram-whole.jpg",
        "Rajma Jammu": "rajma-jammu.jpg",
        "Rajma Red": "rajma-red.jpg",
        "Rajma Chitra": "rajma-chitra.jpg",
        "Desi Chana Split": "desi-chana-split.jpg",
        "Desi Chana Whole": "desi-chana-whole.jpg",
        "Kabuli Chana Large": "kabuli-chana-large.jpg",
        "Kabuli Chana Medium": "kabuli-chana-medium.jpg",
        "Kabuli Chana Small": "kabuli-chana-small.jpg",
        "Toor Dal Polished": "toor-dal-polished.jpg",
        "Toor Dal Whole": "toor-dal-whole.jpg",
        "Premium Chickpeas": "premium-chickpeas.jpg",
        "Red Lentils": "red-lentils.jpg",
        
        # Dry Fruits & Nuts
        "Walnut Kernels": "walnut-kernels.jpg",
        "Cashew W180": "cashew-w180.jpg",
        "Cashew W240": "cashew-w240.jpg",
        "Cashew W320": "cashew-w320.jpg",
        "Premium Cashews": "premium-cashews.jpg",
        
        # Vegetables & Oils
        "Red Onion": "red-onion.jpg",
        "White Onion": "white-onion.jpg",
        "Pure Olive Oil": "pure-olive-oil.jpg",
        "Extra Virgin Olive Oil": "extra-virgin-olive-oil.jpg",
        
        # Beverages
        "Darjeeling Tea": "darjeeling-tea.jpg",
        "Assam Tea": "assam-tea.jpg",
        "Coffee Beans (Robusta)": "coffee-robusta.jpg",
        
        # Wellness
        "Moringa Leaf Powder": "moringa-powder.jpg",
        
        # Leather Products
        "Leather Industrial Safety Shoes": "leather-safety-shoes.jpg"
    }
    
    return local_image_mapping, local_images_folder

def upload_images_to_s3(s3_client, local_images_folder, local_image_mapping):
    """Upload local images to S3 bucket"""
    bucket_name = "jgi-menteetracker"
    s3_prefix = "Amber/products/"
    
    print(f"\n📤 Uploading images to S3...")
    print(f"Bucket: {bucket_name}")
    print(f"Prefix: {s3_prefix}")
    
    uploaded_files = []
    failed_uploads = []
    
    for product_name, image_filename in local_image_mapping.items():
        local_file_path = os.path.join(local_images_folder, image_filename)
        s3_key = f"{s3_prefix}{image_filename}"
        
        # Check if local file exists
        if not os.path.exists(local_file_path):
            print(f"⚠️ Local file not found: {local_file_path}")
            failed_uploads.append((product_name, image_filename, "File not found"))
            continue
        
        try:
            # Upload to S3
            s3_client.upload_file(
                local_file_path,
                bucket_name,
                s3_key,
                ExtraArgs={'ContentType': 'image/jpeg'}
            )
            
            # Generate S3 URL
            s3_url = f"https://{bucket_name}.s3.ap-south-1.amazonaws.com/{s3_key}"
            uploaded_files.append((product_name, image_filename, s3_url))
            print(f"✅ Uploaded: {image_filename} → {s3_url}")
            
        except ClientError as e:
            error_msg = str(e)
            print(f"❌ Failed to upload {image_filename}: {error_msg}")
            failed_uploads.append((product_name, image_filename, error_msg))
    
    print(f"\n📊 Upload Summary:")
    print(f"✅ Successfully uploaded: {len(uploaded_files)} files")
    print(f"❌ Failed uploads: {len(failed_uploads)} files")
    
    if failed_uploads:
        print(f"\n❌ Failed uploads:")
        for product_name, filename, error in failed_uploads:
            print(f"   - {filename} ({product_name}): {error}")
    
    return uploaded_files, failed_uploads

def update_database_with_s3_urls(engine, uploaded_files):
    """Update database with S3 URLs"""
    if not uploaded_files:
        print("⚠️ No files uploaded, skipping database update")
        return True
    
    print(f"\n🔄 Updating database with S3 URLs...")
    
    try:
        with engine.connect() as connection:
            updates = []
            
            for product_name, image_filename, s3_url in uploaded_files:
                # Get the product from database
                result = connection.execute(text("SELECT id, name FROM products WHERE name = :name"), {"name": product_name})
                product = result.fetchone()
                
                if not product:
                    print(f"⚠️ Product not found in database: {product_name}")
                    continue
                
                updates.append((product.id, s3_url))
                print(f"✅ Mapped: {product_name} → {s3_url}")
            
            if updates:
                # Create batch UPDATE statement
                update_sql = """
                    UPDATE products 
                    SET image_url = CASE id 
                """
                
                for product_id, s3_url in updates:
                    update_sql += f"    WHEN {product_id} THEN '{s3_url}'\n"
                
                update_sql += "    ELSE image_url END"
                
                # Execute batch update
                connection.execute(text(update_sql))
                connection.commit()
                
                print(f"✅ Successfully updated {len(updates)} products with S3 URLs")
                
                # Show updated products
                print(f"\n📋 Updated products:")
                for product_id, s3_url in updates:
                    result = connection.execute(text("SELECT name FROM products WHERE id = :id"), {"id": product_id})
                    product_name = result.fetchone().name
                    print(f"   - {product_name}: {s3_url}")
            else:
                print("⚠️ No products were updated")
                
    except Exception as e:
        print(f"❌ Error updating database: {e}")
        return False
    
    return True

def check_local_images_exist(local_images_folder, local_image_mapping):
    """Check which local images exist"""
    print(f"\n🔍 Checking local images...")
    print(f"Local folder: {os.path.abspath(local_images_folder)}")
    
    existing_files = []
    missing_files = []
    
    for product_name, image_filename in local_image_mapping.items():
        local_file_path = os.path.join(local_images_folder, image_filename)
        
        if os.path.exists(local_file_path):
            file_size = os.path.getsize(local_file_path)
            existing_files.append((product_name, image_filename, file_size))
            print(f"✅ Found: {image_filename} ({file_size} bytes)")
        else:
            missing_files.append((product_name, image_filename))
            print(f"❌ Missing: {image_filename}")
    
    print(f"\n📊 Local Files Summary:")
    print(f"✅ Existing files: {len(existing_files)}")
    print(f"❌ Missing files: {len(missing_files)}")
    
    if missing_files:
        print(f"\n📋 Missing files:")
        for product_name, filename in missing_files:
            print(f"   - {filename} (for {product_name})")
    
    return existing_files, missing_files

def main():
    """Main function to upload local images to S3"""
    print("🚀 Starting Local to S3 Image Upload...")
    
    # Get local image mapping
    local_image_mapping, local_images_folder = get_local_image_mapping()
    
    print(f"📋 Local image mapping created for {len(local_image_mapping)} products")
    print(f"📁 Local images folder: {local_images_folder}")
    
    # Check if local images exist
    existing_files, missing_files = check_local_images_exist(local_images_folder, local_image_mapping)
    
    if not existing_files:
        print("\n❌ No local images found!")
        print(f"Please add your product images to: {os.path.abspath(local_images_folder)}")
        return False
    
    # Initialize S3 client
    s3_client = get_s3_client()
    if not s3_client:
        return False
    
    # Upload images to S3
    uploaded_files, failed_uploads = upload_images_to_s3(s3_client, local_images_folder, local_image_mapping)
    
    if not uploaded_files:
        print("\n❌ No images were uploaded to S3!")
        return False
    
    # Create database engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Update database with S3 URLs
    success = update_database_with_s3_urls(engine, uploaded_files)
    
    if success:
        print("\n🎉 Local to S3 upload completed successfully!")
        print(f"\n💡 Summary:")
        print(f"✅ Uploaded to S3: {len(uploaded_files)} images")
        print(f"❌ Failed uploads: {len(failed_uploads)} images")
        print(f"✅ Database updated with S3 URLs")
        return True
    else:
        print("\n💥 Local to S3 upload failed!")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
