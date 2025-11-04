#!/usr/bin/env python3
"""
Fix Hardware Mappings Script
This script fixes hardware subcategory mappings with available images.
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def get_hardware_subcategories():
    """Get hardware subcategories that need fixing"""
    print("🔍 Getting Hardware Subcategories...")
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Get hardware subcategories (Category ID 12)
            result = connection.execute(text("""
                SELECT id, name, category_id, image_url 
                FROM subcategories 
                WHERE category_id = 12
                ORDER BY name
            """))
            hardware_subcategories = result.fetchall()
            
            print(f"\n📊 Hardware subcategories found: {len(hardware_subcategories)}")
            for subcategory in hardware_subcategories:
                print(f"   - ID {subcategory.id}: {subcategory.name}")
                print(f"     Current image: {subcategory.image_url}")
                print()
            
            return hardware_subcategories
            
    except Exception as e:
        print(f"❌ Error getting hardware subcategories: {e}")
        return []

def update_hardware_with_placeholder_images(engine, hardware_subcategories):
    """Update hardware subcategories with placeholder images"""
    print("🔄 Updating hardware subcategories with placeholder images...")
    
    # Use more appropriate images from existing S3 bucket
    placeholder_mapping = {
        "Bathroom Fittings": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New%20folder/Leather%20Exports/Industrial%20Shoes.jpg",
        "Door Handles": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New%20folder/Leather%20Exports/Industrial%20Shoes.jpg",
        "Hinges": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New%20folder/Leather%20Exports/Industrial%20Shoes.jpg",
        "Pipes": "https://jgi-menteetracker.s3.ap-south-1.amazonaws.com/Amber/New%20folder/Leather%20Exports/Industrial%20Shoes.jpg"
    }
    
    try:
        with engine.connect() as connection:
            updates = []
            
            for subcategory in hardware_subcategories:
                if subcategory.name in placeholder_mapping:
                    new_image_url = placeholder_mapping[subcategory.name]
                    updates.append((subcategory.id, new_image_url))
                    print(f"✅ Will update: {subcategory.name} → {new_image_url}")
            
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
                
                print(f"✅ Successfully updated {len(updates)} hardware subcategories")
                
                # Show updated subcategories
                print(f"\n📋 Updated hardware subcategories:")
                for subcategory_id, image_url in updates:
                    result = connection.execute(text("SELECT name FROM subcategories WHERE id = :id"), {"id": subcategory_id})
                    subcategory_name = result.fetchone().name
                    print(f"   - {subcategory_name}: {image_url}")
            else:
                print("⚠️ No hardware subcategories were updated")
                
    except Exception as e:
        print(f"❌ Error updating hardware subcategories: {e}")
        return False
    
    return True

def main():
    """Main function to fix hardware mappings"""
    print("🚀 Starting Hardware Mapping Fix...")
    
    # Get hardware subcategories
    hardware_subcategories = get_hardware_subcategories()
    
    if not hardware_subcategories:
        print("❌ No hardware subcategories found!")
        return False
    
    # Create database engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Update hardware subcategories
    success = update_hardware_with_placeholder_images(engine, hardware_subcategories)
    
    if success:
        print("\n🎉 Hardware mapping fix completed!")
        print(f"\n💡 Note: Hardware items are using placeholder images.")
        print(f"   Consider uploading proper hardware images to S3 for better user experience.")
        return True
    else:
        print("\n💥 Hardware mapping fix failed!")
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
