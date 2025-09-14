#!/usr/bin/env python3
"""
Add Sample Products Script
This script adds sample products to the database for testing.
"""

import sys
import os
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def add_sample_products():
    """Add sample products to the database"""
    print("🔄 Adding sample products to database...")
    
    # Create engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # First, let's add some categories
            print("📁 Adding categories...")
            categories_data = [
                ("Spices", "Premium quality spices from India"),
                ("Pulses", "High-quality pulses and legumes"),
                ("Dry Fruits", "Premium dried fruits and nuts"),
                ("Grains", "Export quality grains and cereals")
            ]
            
            for name, description in categories_data:
                connection.execute(text("""
                    INSERT IGNORE INTO categories (name, description) 
                    VALUES (:name, :description)
                """), {"name": name, "description": description})
            
            # Get category IDs
            result = connection.execute(text("SELECT id, name FROM categories"))
            categories = {row.name: row.id for row in result}
            print(f"✅ Categories added: {list(categories.keys())}")
            
            # Add subcategories
            print("📂 Adding subcategories...")
            subcategories_data = [
                ("Black Pepper", "Premium black pepper", categories["Spices"]),
                ("Cardamom", "Green cardamom pods", categories["Spices"]),
                ("Turmeric", "Pure turmeric powder", categories["Spices"]),
                ("Chickpeas", "Premium chickpeas", categories["Pulses"]),
                ("Lentils", "High-quality lentils", categories["Pulses"]),
                ("Almonds", "Premium almonds", categories["Dry Fruits"]),
                ("Cashews", "Premium cashews", categories["Dry Fruits"]),
                ("Basmati Rice", "Premium basmati rice", categories["Grains"])
            ]
            
            for name, description, category_id in subcategories_data:
                connection.execute(text("""
                    INSERT IGNORE INTO subcategories (name, description, category_id) 
                    VALUES (:name, :description, :category_id)
                """), {"name": name, "description": description, "category_id": category_id})
            
            # Get subcategory IDs
            result = connection.execute(text("SELECT id, name FROM subcategories"))
            subcategories = {row.name: row.id for row in result}
            print(f"✅ Subcategories added: {list(subcategories.keys())}")
            
            # Add sample products
            print("🛍️ Adding sample products...")
            products_data = [
                {
                    "name": "Premium Black Pepper",
                    "grade": "A+",
                    "moq": "100 KG",
                    "origin": "Kerala, India",
                    "details": "Premium quality black pepper with intense aroma and flavor",
                    "highlights": "High piperine content, excellent aroma, premium grade",
                    "subcategory_id": subcategories["Black Pepper"]
                },
                {
                    "name": "Green Cardamom",
                    "grade": "Premium",
                    "moq": "50 KG",
                    "origin": "Karnataka, India",
                    "details": "Fresh green cardamom pods with intense flavor",
                    "highlights": "Fresh pods, intense aroma, premium quality",
                    "subcategory_id": subcategories["Cardamom"]
                },
                {
                    "name": "Pure Turmeric Powder",
                    "grade": "A Grade",
                    "moq": "200 KG",
                    "origin": "Tamil Nadu, India",
                    "details": "Pure turmeric powder with high curcumin content",
                    "highlights": "High curcumin content, pure powder, export quality",
                    "subcategory_id": subcategories["Turmeric"]
                },
                {
                    "name": "Premium Chickpeas",
                    "grade": "Export Quality",
                    "moq": "500 KG",
                    "origin": "Madhya Pradesh, India",
                    "details": "Large, uniform chickpeas perfect for export",
                    "highlights": "Large size, uniform color, export quality",
                    "subcategory_id": subcategories["Chickpeas"]
                },
                {
                    "name": "Red Lentils",
                    "grade": "Premium",
                    "moq": "300 KG",
                    "origin": "Rajasthan, India",
                    "details": "Premium red lentils with excellent cooking quality",
                    "highlights": "Quick cooking, uniform size, premium quality",
                    "subcategory_id": subcategories["Lentils"]
                },
                {
                    "name": "Premium Almonds",
                    "grade": "A+",
                    "moq": "100 KG",
                    "origin": "Kashmir, India",
                    "details": "Premium almonds with excellent taste and texture",
                    "highlights": "Large size, excellent taste, premium grade",
                    "subcategory_id": subcategories["Almonds"]
                },
                {
                    "name": "Premium Cashews",
                    "grade": "Export Quality",
                    "moq": "150 KG",
                    "origin": "Goa, India",
                    "details": "Premium cashews with perfect shape and taste",
                    "highlights": "Perfect shape, excellent taste, export quality",
                    "subcategory_id": subcategories["Cashews"]
                },
                {
                    "name": "Basmati Rice",
                    "grade": "Premium",
                    "moq": "1000 KG",
                    "origin": "Punjab, India",
                    "details": "Premium basmati rice with long grains and aroma",
                    "highlights": "Long grains, aromatic, premium quality",
                    "subcategory_id": subcategories["Basmati Rice"]
                }
            ]
            
            for product in products_data:
                connection.execute(text("""
                    INSERT IGNORE INTO products (
                        name, grade, moq, origin, details, highlights, subcategory_id
                    ) VALUES (
                        :name, :grade, :moq, :origin, :details, :highlights, :subcategory_id
                    )
                """), product)
            
            connection.commit()
            print(f"✅ {len(products_data)} sample products added successfully!")
            
            # Verify the data
            result = connection.execute(text("SELECT COUNT(*) as count FROM products"))
            product_count = result.fetchone().count
            print(f"📊 Total products in database: {product_count}")
            
    except Exception as e:
        print(f"❌ Error adding sample products: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = add_sample_products()
    if success:
        print("🎉 Sample products setup completed successfully!")
    else:
        print("💥 Sample products setup failed!")
        sys.exit(1)
