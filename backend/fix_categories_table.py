from app.database import engine
from sqlalchemy import text

def fix_categories_table():
    """Add missing columns to categories table"""
    
    try:
        with engine.connect() as connection:
            print("Adding missing columns to categories table...")
            
            # Add missing columns to categories table
            commands = [
                "ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT",
                "ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)"
            ]
            
            for command in commands:
                try:
                    connection.execute(text(command))
                    connection.commit()
                    print(f"✓ Added column: {command}")
                except Exception as e:
                    print(f"⚠ Column might already exist: {str(e)[:50]}")
                    connection.rollback()
            
            print("✅ Categories table fixed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fix_categories_table() 