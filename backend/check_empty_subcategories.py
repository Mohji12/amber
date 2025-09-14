#!/usr/bin/env python3
"""
Check Empty Subcategories Script
This script identifies subcategories that don't have any products.
"""

import sys
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def get_empty_subcategories():
    """Get subcategories that don't have any products"""
    print("🔍 Checking for empty subcategories...")
    
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
            
            print(f"\n📊 Analysis Results:")
            print(f"✅ Total subcategories: {len(empty_subcategories)} without products")
            
            if empty_subcategories:
                print(f"\n📋 Empty Subcategories List:")
                print(f"{'ID':<5} {'Category':<25} {'Subcategory Name':<50} {'Image Status'}")
                print("-" * 90)
                
                for subcategory in empty_subcategories:
                    image_status = "✅ Has Image" if subcategory.image_url else "❌ No Image"
                    print(f"{subcategory.id:<5} {subcategory.category_name:<25} {subcategory.name:<50} {image_status}")
                
                # Group by category for better organization
                print(f"\n📂 Empty Subcategories by Category:")
                categories = {}
                for subcategory in empty_subcategories:
                    cat_name = subcategory.category_name
                    if cat_name not in categories:
                        categories[cat_name] = []
                    categories[cat_name].append(subcategory)
                
                for category_name, subcats in categories.items():
                    print(f"\n🏷️  {category_name} ({len(subcats)} empty):")
                    for subcat in subcats:
                        print(f"   - {subcat.name}")
                
                # Summary statistics
                print(f"\n📈 Summary:")
                print(f"   • Total empty subcategories: {len(empty_subcategories)}")
                print(f"   • Categories affected: {len(categories)}")
                print(f"   • Subcategories with images: {len([s for s in empty_subcategories if s.image_url])}")
                print(f"   • Subcategories without images: {len([s for s in empty_subcategories if not s.image_url])}")
                
            else:
                print("🎉 All subcategories have products!")
            
            return empty_subcategories
            
    except Exception as e:
        print(f"❌ Error checking empty subcategories: {e}")
        return []

def get_subcategory_product_counts():
    """Get a complete overview of all subcategories and their product counts"""
    print("\n🔍 Getting complete subcategory product count overview...")
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        with engine.connect() as connection:
            # Query to get all subcategories with their product counts
            result = connection.execute(text("""
                SELECT 
                    s.id,
                    s.name,
                    s.category_id,
                    c.name as category_name,
                    COUNT(p.id) as product_count
                FROM subcategories s
                LEFT JOIN categories c ON s.category_id = c.id
                LEFT JOIN products p ON s.id = p.subcategory_id
                GROUP BY s.id, s.name, s.category_id, c.name
                ORDER BY c.name, s.name
            """))
            
            all_subcategories = result.fetchall()
            
            print(f"\n📊 Complete Subcategory Overview:")
            print(f"{'ID':<5} {'Category':<25} {'Subcategory Name':<50} {'Products'}")
            print("-" * 90)
            
            total_products = 0
            for subcategory in all_subcategories:
                product_count = subcategory.product_count
                total_products += product_count
                status_icon = "✅" if product_count > 0 else "❌"
                print(f"{subcategory.id:<5} {subcategory.category_name:<25} {subcategory.name:<50} {status_icon} {product_count}")
            
            print(f"\n📈 Total Statistics:")
            print(f"   • Total subcategories: {len(all_subcategories)}")
            print(f"   • Total products: {total_products}")
            print(f"   • Subcategories with products: {len([s for s in all_subcategories if s.product_count > 0])}")
            print(f"   • Empty subcategories: {len([s for s in all_subcategories if s.product_count == 0])}")
            
            return all_subcategories
            
    except Exception as e:
        print(f"❌ Error getting subcategory overview: {e}")
        return []

def main():
    """Main function to check empty subcategories"""
    print("🚀 Starting Empty Subcategory Analysis...")
    
    # Check for empty subcategories
    empty_subcategories = get_empty_subcategories()
    
    # Get complete overview
    all_subcategories = get_subcategory_product_counts()
    
    if empty_subcategories:
        print(f"\n💡 Recommendations:")
        print(f"1. Consider adding products to empty subcategories")
        print(f"2. Review if empty subcategories are still needed")
        print(f"3. Check if products are assigned to wrong subcategories")
        print(f"4. Consider merging empty subcategories with similar ones")
        return False
    else:
        print(f"\n🎉 All subcategories have products!")
        return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)

