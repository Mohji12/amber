from app.database import engine
from sqlalchemy import text
import os

def migrate_database():
    """Add missing columns to existing tables"""
    
    # SQL commands to add missing columns
    migration_commands = [
        # Add missing columns to categories table
        "ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT",
        "ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)",
        
        # Add missing columns to products table
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS specs JSON",
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS highlights TEXT",
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS private_label_options TEXT",
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS use_cases TEXT",
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id INT",
        
        # Add foreign key constraint for subcategory_id
        "ALTER TABLE products ADD CONSTRAINT IF NOT EXISTS fk_products_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)"
    ]
    
    try:
        with engine.connect() as connection:
            print("Starting database migration...")
            
            # Execute each migration command
            for i, command in enumerate(migration_commands, 1):
                try:
                    print(f"Executing migration {i}/{len(migration_commands)}: {command[:50]}...")
                    connection.execute(text(command))
                    connection.commit()
                    print(f"✓ Migration {i} completed successfully")
                except Exception as e:
                    print(f"⚠ Migration {i} failed (might already exist): {str(e)[:100]}")
                    connection.rollback()
            
            print("\n✅ Database migration completed!")
            
            # Verify the tables exist and have the right structure
            print("\nVerifying table structure...")
            
            # Check categories table
            result = connection.execute(text("DESCRIBE categories"))
            categories_columns = [row[0] for row in result.fetchall()]
            print(f"Categories table columns: {categories_columns}")
            
            # Check products table
            result = connection.execute(text("DESCRIBE products"))
            products_columns = [row[0] for row in result.fetchall()]
            print(f"Products table columns: {products_columns}")
            
            # Check if subcategories table exists
            result = connection.execute(text("SHOW TABLES LIKE 'subcategories'"))
            if result.fetchone():
                result = connection.execute(text("DESCRIBE subcategories"))
                subcategories_columns = [row[0] for row in result.fetchall()]
                print(f"Subcategories table columns: {subcategories_columns}")
            else:
                print("Subcategories table does not exist - will be created when models are loaded")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise

if __name__ == "__main__":
    migrate_database() 