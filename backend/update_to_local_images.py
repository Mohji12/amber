#!/usr/bin/env python3
"""
Update to Local Images Script
This script updates products to use local images stored in the project folder.
"""

import sys
import os
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def get_local_image_mapping():
    """Get mapping for local images"""
    # Define the local images folder path (relative to your project)
    local_images_folder = "images/products"  # You can change this path
    
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

def update_to_local_images(engine, local_image_mapping, local_images_folder):
    """Update products to use local images"""
    print("\n🔄 Updating products to use local images...")
    
    try:
        with engine.connect() as connection:
            updates = []
            matched_count = 0
            
            for product_name, image_filename in local_image_mapping.items():
                # Get the product from database
                result = connection.execute(text("SELECT id, name FROM products WHERE name = :name"), {"name": product_name})
                product = result.fetchone()
                
                if not product:
                    print(f"⚠️ Product not found: {product_name}")
                    continue
                
                # Create local image URL
                local_image_url = f"/{local_images_folder}/{image_filename}"
                
                updates.append((product.id, local_image_url))
                matched_count += 1
                print(f"✅ Mapped: {product_name} → {image_filename}")
            
            print(f"\n📊 Found {matched_count} matches out of {len(local_image_mapping)} products")
            
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
                
                print(f"✅ Successfully updated {len(updates)} products to use local images")
                
                # Show updated products
                print("\n📋 Updated products:")
                for product_id, image_url in updates:
                    result = connection.execute(text("SELECT name FROM products WHERE id = :id"), {"id": product_id})
                    product_name = result.fetchone().name
                    print(f"   - {product_name}: {image_url}")
            else:
                print("⚠️ No products were updated")
                
    except Exception as e:
        print(f"❌ Error updating products: {e}")
        return False
    
    return True

def create_images_folder_structure(local_images_folder):
    """Create the images folder structure and provide instructions"""
    print(f"\n📁 Creating images folder structure...")
    
    # Create the folder path
    folder_path = os.path.join(os.getcwd(), local_images_folder)
    
    try:
        os.makedirs(folder_path, exist_ok=True)
        print(f"✅ Created folder: {folder_path}")
        
        print(f"\n📋 Instructions:")
        print(f"1. Place your product images in: {folder_path}")
        print(f"2. Use the following filenames:")
        
        local_image_mapping, _ = get_local_image_mapping()
        for product_name, image_filename in local_image_mapping.items():
            print(f"   - {image_filename} (for {product_name})")
        
        print(f"\n3. Supported image formats: .jpg, .jpeg, .png, .webp")
        print(f"4. Make sure image files are readable by your web server")
        
    except Exception as e:
        print(f"❌ Error creating folder: {e}")
        return False
    
    return True

def main():
    """Main function to update products to local images"""
    print("🚀 Starting Local Image Update...")
    
    # Create database engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Get local image mapping
    local_image_mapping, local_images_folder = get_local_image_mapping()
    
    print(f"📋 Local image mapping created for {len(local_image_mapping)} products")
    print(f"📁 Images folder: {local_images_folder}")
    
    # Create folder structure
    create_images_folder_structure(local_images_folder)
    
    # Update products to use local images
    success = update_to_local_images(engine, local_image_mapping, local_images_folder)
    
    if success:
        print("\n🎉 Local image update completed successfully!")
        print(f"\n💡 Next steps:")
        print(f"1. Add your product images to the {local_images_folder} folder")
        print(f"2. Make sure the frontend can serve static files from this folder")
        print(f"3. Test the product images on your frontend")
        return True
    else:
        print("\n💥 Local image update failed!")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
