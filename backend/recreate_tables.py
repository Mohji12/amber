from app.database import engine
from app import models
from sqlalchemy import text

def recreate_tables():
    """Drop and recreate all tables with the correct schema"""
    
    try:
        with engine.connect() as connection:
            print("Dropping existing tables...")
            
            # Drop tables in reverse order (due to foreign key constraints)
            drop_commands = [
                "DROP TABLE IF EXISTS activities",
                "DROP TABLE IF EXISTS enquiries", 
                "DROP TABLE IF EXISTS products",
                "DROP TABLE IF EXISTS subcategories",
                "DROP TABLE IF EXISTS categories",
                "DROP TABLE IF EXISTS blogs",
                "DROP TABLE IF EXISTS users"
            ]
            
            for command in drop_commands:
                connection.execute(text(command))
                print(f"✓ Dropped table: {command}")
            
            connection.commit()
            print("✅ All existing tables dropped successfully!")
            
    except Exception as e:
        print(f"❌ Error dropping tables: {e}")
        raise
    
    # Create tables using SQLAlchemy models
    print("\nCreating new tables with updated schema...")
    models.Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")
    
    # Verify table structure
    try:
        with engine.connect() as connection:
            print("\nVerifying new table structure...")
            
            tables = ["users", "categories", "subcategories", "products", "blogs", "enquiries", "activities"]
            
            for table in tables:
                result = connection.execute(text(f"DESCRIBE {table}"))
                columns = [row[0] for row in result.fetchall()]
                print(f"{table} table columns: {columns}")
                
    except Exception as e:
        print(f"❌ Error verifying tables: {e}")

if __name__ == "__main__":
    recreate_tables() 