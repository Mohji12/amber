#!/usr/bin/env python3
"""
Remove Empty Subcategories Script
This script removes subcategories that don't have any products.
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def get_empty_subcategories():
    """Get subcategories that don't have any products"""
    print("🔍 Finding empty subcategories...")
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Query to find subcategories without products
            result = connection.execute(text("""
                SELECT 
                    s.id,
                    s.name,
                    s.category_id,
                    c.name as category_name,
                    s.image_url,
                    COUNT(p.id) as product_count
                FROM subcategories s
                LEFT JOIN categories c ON s.category_id = c.id
                LEFT JOIN products p ON s.id = p.subcategory_id
                GROUP BY s.id, s.name, s.category_id, c.name, s.image_url
                HAVING COUNT(p.id) = 0
                ORDER BY c.name, s.name
            """))
            
            empty_subcategories = result.fetchall()
            
            if not empty_subcategories:
                print("✅ No empty subcategories found!")
                return []
            
            print(f"\n📋 Found {len(empty_subcategories)} empty subcategories:")
            print(f"{'ID':<5} {'Category':<25} {'Subcategory Name':<50}")
            print("-" * 80)
            
            for subcategory in empty_subcategories:
                print(f"{subcategory.id:<5} {subcategory.category_name:<25} {subcategory.name:<50}")
            
            return empty_subcategories
            
    except Exception as e:
        print(f"❌ Error finding empty subcategories: {e}")
        return []

def confirm_removal(empty_subcategories):
    """Ask for confirmation before removal"""
    print(f"\n⚠️  WARNING: This will permanently delete {len(empty_subcategories)} subcategories!")
    print("These subcategories have no products and will be completely removed from the database.")
    
    print(f"\n📋 Subcategories to be removed:")
    for subcategory in empty_subcategories:
        print(f"   - {subcategory.name} (ID: {subcategory.id}) from {subcategory.category_name}")
    
    print(f"\n💡 Impact:")
    print(f"   • {len(empty_subcategories)} subcategories will be deleted")
    print(f"   • All associated images and metadata will be lost")
    print(f"   • This action cannot be undone")
    
    while True:
        response = input(f"\n❓ Are you sure you want to proceed? (yes/no): ").lower().strip()
        if response in ['yes', 'y']:
            return True
        elif response in ['no', 'n']:
            return False
        else:
            print("Please enter 'yes' or 'no'")

def remove_empty_subcategories(empty_subcategories):
    """Remove the empty subcategories from the database"""
    print(f"\n🗑️  Removing {len(empty_subcategories)} empty subcategories...")
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            removed_count = 0
            
            for subcategory in empty_subcategories:
                try:
                    # Delete the subcategory
                    delete_result = connection.execute(
                        text("DELETE FROM subcategories WHERE id = :id"),
                        {"id": subcategory.id}
                    )
                    
                    if delete_result.rowcount > 0:
                        print(f"✅ Removed: {subcategory.name} (ID: {subcategory.id})")
                        removed_count += 1
                    else:
                        print(f"⚠️  No rows affected for: {subcategory.name} (ID: {subcategory.id})")
                        
                except Exception as e:
                    print(f"❌ Error removing {subcategory.name}: {e}")
            
            # Commit the changes
            connection.commit()
            
            print(f"\n🎉 Successfully removed {removed_count} out of {len(empty_subcategories)} subcategories")
            return removed_count
            
    except Exception as e:
        print(f"❌ Error removing subcategories: {e}")
        return 0

def verify_removal():
    """Verify that the empty subcategories were removed"""
    print(f"\n🔍 Verifying removal...")
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Check remaining subcategories
            result = connection.execute(text("""
                SELECT COUNT(*) as total_subcategories
                FROM subcategories
            """))
            total_subcategories = result.fetchone().total_subcategories
            
            # Check for any remaining empty subcategories
            result = connection.execute(text("""
                SELECT COUNT(*) as empty_count
                FROM subcategories s
                LEFT JOIN products p ON s.id = p.subcategory_id
                GROUP BY s.id
                HAVING COUNT(p.id) = 0
            """))
            empty_count = len(result.fetchall())
            
            print(f"📊 Verification Results:")
            print(f"   • Total subcategories remaining: {total_subcategories}")
            print(f"   • Empty subcategories remaining: {empty_count}")
            
            if empty_count == 0:
                print("✅ All empty subcategories have been successfully removed!")
                return True
            else:
                print(f"⚠️  {empty_count} empty subcategories still remain")
                return False
                
    except Exception as e:
        print(f"❌ Error verifying removal: {e}")
        return False

def main():
    """Main function to remove empty subcategories"""
    print("🚀 Starting Empty Subcategory Removal Process...")
    
    # Get empty subcategories
    empty_subcategories = get_empty_subcategories()
    
    if not empty_subcategories:
        print("✅ No action needed - all subcategories have products!")
        return True
    
    # Confirm removal
    if not confirm_removal(empty_subcategories):
        print("❌ Operation cancelled by user")
        return False
    
    # Remove subcategories
    removed_count = remove_empty_subcategories(empty_subcategories)
    
    if removed_count == 0:
        print("❌ No subcategories were removed")
        return False
    
    # Verify removal
    success = verify_removal()
    
    if success:
        print(f"\n🎉 Successfully completed! Removed {removed_count} empty subcategories.")
        print(f"💡 Your database is now cleaner and more organized.")
    else:
        print(f"\n⚠️  Removal completed but verification failed.")
        print(f"💡 Please check the database manually to ensure all empty subcategories were removed.")
    
    return success

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)

