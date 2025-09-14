#!/usr/bin/env python3
"""
Map Existing S3 Images to Products Script
This script maps existing S3 images to products and updates the database.
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

def get_s3_image_mapping():
    """Get mapping of product names to S3 images"""
    bucket_name = "jgi-menteetracker"
    base_url = f"https://{bucket_name}.s3.ap-south-1.amazonaws.com/Amber/products/"
    
    # Mapping of product names to S3 image paths
    s3_image_mapping = {
        # Millets
        "Finger Millet (Ragi / Nachni)": "Organic Millets – UN Superfood Spotlight/Finger Millet (Ragi).jpg",
        "Foxtail Millet (Kangni / Thinai)": "Organic Millets – UN Superfood Spotlight/Foxtail Millet (Kangni).webp",
        "Little Millet (Kutki / Sama)": "Organic Millets – UN Superfood Spotlight/Little Millet (Kutki).jpg",
        "Barnyard Millet (Sanwa / Kuthiraivali)": "Organic Millets – UN Superfood Spotlight/Barnyard Millet (Sanwa).jpg",
        "Kodo Millet (Kodra / Arikelu)": "Organic Millets – UN Superfood Spotlight/Kodo Millet (Kodra).webp",
        "Pearl Millet (Bajra / Sajje)": "Organic Millets – UN Superfood Spotlight/Pearl Millet (Bajra).webp",
        "Browntop Millet (Korale / Andu Korralu)": "Organic Millets – UN Superfood Spotlight/Browntop Millet (Korale).jpg",
        
        # Spices
        "Jumbo Green Cardamom (8 mm+)": "Cardamom – Indian Export Grades/Jumbo Green Cardamom (8 mm+).webp",
        "Crushed / Grade-B Cardamom": "Cardamom – Indian Export Grades/Crushed-Grade-B Cardamom.webp",
        "Ceylon Cinnamon Sticks (Alba Grade)": "Cinnamon – Export Varieties/Ceylon Cinnamon Sticks (Sweet Cinnamon).webp",
        "Ceylon Cinnamon Sticks (C5 Special)": "Cinnamon – Export Varieties/Ceylon Cinnamon Sticks (Sweet Cinnamon).webp",
        "Black Pepper Whole (Malabar)": "Black Pepper – Global Export Grades/Malabar Garbled (MG1) Black Pepper.webp",
        "Black Pepper Whole (Tellicherry)": "Black Pepper – Global Export Grades/Tellicherry Garbled Extra Bold (TGSEB) Pepper.webp",
        "Cumin Seeds (Europe Quality)": "Cumin – Export Grades/Whole Cumin Seeds.webp",
        "Turmeric Fingers (Double Polished)": "Turmeric – Export Varieties/Turmeric Finger (Polished).webp",
        "Whole Cloves": "Clove – Export Grades/Hand-Picked Cloves.jpg",
        "Whole Red Chilli (Sannam / 334)": "Chilli – Indian Varieties/Sannam - Teja Chilli (Whole).jpg",
        "Premium Black Pepper": "Black Pepper – Global Export Grades/Black Pepper Powder.jpg",
        
        # Rice
        "Basmati Rice (1121 Steam)": "Basmati Rice – Export Varieties/1121 Basmati Rice.jpg",
        "Basmati Rice (Pusa / Traditional)": "Basmati Rice – Export Varieties/Pusa Basmati Rice.webp",
        "Basmati Rice (Golden Sella)": "Basmati Rice – Export Varieties/Traditional Basmati.jpeg",
        "IR64 Long Grain Rice": "Non-Basmati Rice – Export Varieties/IR 64 Rice.webp",
        
        # Pulses & Lentils
        "Toor Dal Split": "Pulses & Lentils/Toor Dal (Arhar Dal).png",
        "Green Gram Split": "Pulses & Lentils/Moong Dal.jpg",
        "Green Gram Whole": "Pulses & Lentils/Green Gram (Whole Moong).jpg",
        "Rajma Jammu": "Pulses & Lentils/Rajma (Kidney Beans).png",
        "Rajma Red": "Pulses & Lentils/Rajma (Kidney Beans).png",
        "Rajma Chitra": "Pulses & Lentils/Rajma (Kidney Beans).png",
        "Desi Chana Split": "Pulses & Lentils/Chana Dal.png",
        "Desi Chana Whole": "Pulses & Lentils/Desi Chana (Brown Chickpea).webp",
        "Kabuli Chana Large": "Pulses & Lentils/Kabuli Chana (White Chickpea).jpg",
        "Kabuli Chana Medium": "Pulses & Lentils/Kabuli Chana (White Chickpea).jpg",
        "Kabuli Chana Small": "Pulses & Lentils/Kabuli Chana (White Chickpea).jpg",
        "Toor Dal Polished": "Pulses & Lentils/Toor Dal (Arhar Dal).png",
        "Toor Dal Whole": "Pulses & Lentils/Toor Dal (Arhar Dal).png",
        "Premium Chickpeas": "Pulses & Lentils/Kabuli Chana (White Chickpea).jpg",
        "Red Lentils": "Pulses & Lentils/Masoor Dal.webp",
        
        # Dry Fruits & Nuts
        "Walnut Kernels": "Dry Fruits – Export Varieties/Walnuts.webp",
        "Cashew W180": "Dry Fruits – Export Varieties/Cashew Nuts (W180 Grades).jpg",
        "Cashew W240": "Dry Fruits – Export Varieties/Cashew Nuts (W240 Grades).webp",
        "Cashew W320": "Dry Fruits – Export Varieties/Cashew Nuts (W320 Grades).webp",
        "Premium Cashews": "Dry Fruits – Export Varieties/Cashew Nuts (W180 Grades).jpg",
        
        # Vegetables & Oils
        "Red Onion": "Perishables – Fresh Exports/Onion (Red).jpg",
        "White Onion": "Perishables – Fresh Exports/Onion (White).jpg",
        "Pure Olive Oil": "Gourmet – Export Varieties/Olive Oil (Extra Virgin).jpg",
        "Extra Virgin Olive Oil": "Gourmet – Export Varieties/Olive Oil (Extra Virgin).jpg",
        
        # Beverages
        "Darjeeling Tea": "Gourmet – Export Varieties/Tea (Darjeeling).webp",
        "Assam Tea": "Gourmet – Export Varieties/Tea (Assam).jpg",
        "Coffee Beans (Robusta)": "Gourmet – Export Varieties/Coffee Beans ( Robusta).jpg",
        
        # Wellness
        "Moringa Leaf Powder": "Wellness & Medicinals/Moringa Powder.webp",
        
        # Leather Products
        "Leather Industrial Safety Shoes": "Leather Exports/Industrial Shoes.webp"
    }
    
    return s3_image_mapping, base_url

def verify_s3_images_exist(s3_client, s3_image_mapping):
    """Verify that S3 images exist"""
    bucket_name = "jgi-menteetracker"
    
    print(f"\n🔍 Verifying S3 images exist...")
    print(f"Bucket: {bucket_name}")
    
    existing_images = []
    missing_images = []
    
    for product_name, s3_path in s3_image_mapping.items():
        try:
            s3_client.head_object(Bucket=bucket_name, Key=f"Amber/products/{s3_path}")
            existing_images.append((product_name, s3_path))
            print(f"✅ Found: {s3_path}")
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                missing_images.append((product_name, s3_path))
                print(f"❌ Missing: {s3_path}")
            else:
                print(f"⚠️ Error checking {s3_path}: {e}")
    
    print(f"\n📊 S3 Images Summary:")
    print(f"✅ Existing images: {len(existing_images)}")
    print(f"❌ Missing images: {len(missing_images)}")
    
    if missing_images:
        print(f"\n📋 Missing images:")
        for product_name, s3_path in missing_images:
            print(f"   - {s3_path} (for {product_name})")
    
    return existing_images, missing_images

def update_database_with_s3_urls(engine, existing_images, base_url):
    """Update database with S3 URLs"""
    if not existing_images:
        print("⚠️ No S3 images found, skipping database update")
        return True
    
    print(f"\n🔄 Updating database with S3 URLs...")
    
    try:
        with engine.connect() as connection:
            updates = []
            
            for product_name, s3_path in existing_images:
                # Get the product from database
                result = connection.execute(text("SELECT id, name FROM products WHERE name = :name"), {"name": product_name})
                product = result.fetchone()
                
                if not product:
                    print(f"⚠️ Product not found in database: {product_name}")
                    continue
                
                # Create S3 URL
                s3_url = f"{base_url}{s3_path}"
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

def main():
    """Main function to map existing S3 images to products"""
    print("🚀 Starting S3 Image Mapping...")
    
    # Get S3 image mapping
    s3_image_mapping, base_url = get_s3_image_mapping()
    
    print(f"📋 S3 image mapping created for {len(s3_image_mapping)} products")
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
    
    # Update database with S3 URLs
    success = update_database_with_s3_urls(engine, existing_images, base_url)
    
    if success:
        print("\n🎉 S3 image mapping completed successfully!")
        print(f"\n💡 Summary:")
        print(f"✅ Mapped to S3: {len(existing_images)} products")
        print(f"❌ Missing S3 images: {len(missing_images)} products")
        print(f"✅ Database updated with S3 URLs")
        return True
    else:
        print("\n💥 S3 image mapping failed!")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
