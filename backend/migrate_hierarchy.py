#!/usr/bin/env python3
"""
Migration script to fix the category-subcategory-product hierarchy
This script removes the category_id from products table and ensures proper relationships
"""

import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.database import SQLALCHEMY_DATABASE_URL

def migrate_hierarchy():
    """Migrate database to proper hierarchy structure"""
    print("🔄 Starting hierarchy migration...")
    
    # Create engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Check if category_id column exists in products table
            result = connection.execute(text("SHOW COLUMNS FROM products LIKE 'category_id'"))
            if result.fetchone():
                print("  Removing category_id column from products table...")
                connection.execute(text("ALTER TABLE products DROP COLUMN category_id"))
                print("  ✅ category_id column removed from products table")
            else:
                print("  ℹ️ category_id column doesn't exist in products table")
            
            # Make subcategory_id NOT NULL if it isn't already
            result = connection.execute(text("SHOW COLUMNS FROM products LIKE 'subcategory_id'"))
            column_info = result.fetchone()
            if column_info and column_info[2] == 'YES':  # IS_NULLABLE = YES
                print("  Making subcategory_id NOT NULL...")
                connection.execute(text("ALTER TABLE products MODIFY COLUMN subcategory_id INT NOT NULL"))
                print("  ✅ subcategory_id is now NOT NULL")
            else:
                print("  ℹ️ subcategory_id is already NOT NULL")
            
            # Add foreign key constraint if it doesn't exist
            result = connection.execute(text("""
                SELECT CONSTRAINT_NAME 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_NAME = 'products' 
                AND COLUMN_NAME = 'subcategory_id' 
                AND REFERENCED_TABLE_NAME = 'subcategories'
            """))
            if not result.fetchone():
                print("  Adding foreign key constraint for subcategory_id...")
                connection.execute(text("""
                    ALTER TABLE products 
                    ADD CONSTRAINT fk_products_subcategory 
                    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
                """))
                print("  ✅ Foreign key constraint added")
            else:
                print("  ℹ️ Foreign key constraint already exists")
            
            connection.commit()
            print("✅ Hierarchy migration completed successfully!")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    migrate_hierarchy()

