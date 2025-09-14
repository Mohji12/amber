#!/usr/bin/env python3
"""
Database migration script to add status column to products table.
Run this script to update existing databases with the new status field.
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# Add the parent directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def add_status_column():
    """Add status column to products table if it doesn't exist."""
    
    # Get database URL from environment or use default
    database_url = os.getenv('DATABASE_URL', 'sqlite:///./test.db')
    
    try:
        # Create engine
        engine = create_engine(database_url)
        
        with engine.connect() as conn:
            # Check if status column already exists
            result = conn.execute(text("""
                SELECT COUNT(*) 
                FROM information_schema.columns 
                WHERE table_name = 'products' 
                AND column_name = 'status'
            """))
            
            column_exists = result.scalar() > 0
            
            if not column_exists:
                print("Adding status column to products table...")
                
                # Add the status column with default value
                conn.execute(text("""
                    ALTER TABLE products 
                    ADD COLUMN status VARCHAR(50) DEFAULT 'In Stock'
                """))
                
                # Update existing products to have 'In Stock' status
                conn.execute(text("""
                    UPDATE products 
                    SET status = 'In Stock' 
                    WHERE status IS NULL
                """))
                
                conn.commit()
                print("✅ Status column added successfully!")
                print("✅ All existing products set to 'In Stock' status")
            else:
                print("✅ Status column already exists in products table")
                
    except OperationalError as e:
        print(f"❌ Database error: {e}")
        print("Make sure the database is running and accessible")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🔄 Starting database migration...")
    add_status_column()
    print("✅ Migration completed!")
