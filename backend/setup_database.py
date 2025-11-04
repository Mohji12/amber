#!/usr/bin/env python3
"""
Database Setup Script for Amber Global Backend
This script handles database migration and sample data population.
"""

import sys
import os
from app.database import engine
from app import models, crud
from app.schemas import CategoryBase, SubcategoryCreate, ProductCreate
from sqlalchemy import text

def check_database_connection():
    """Check if database connection is working"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def migrate_database():
    """Add missing columns to existing tables"""
    print("\n🔄 Starting database migration...")
    
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
    ]
    
    try:
        with engine.connect() as connection:
            for i, command in enumerate(migration_commands, 1):
                try:
                    print(f"  Executing migration {i}/{len(migration_commands)}...")
                    connection.execute(text(command))
                    connection.commit()
                    print(f"  ✓ Migration {i} completed")
                except Exception as e:
                    print(f"  ⚠ Migration {i} failed (might already exist): {str(e)[:80]}")
                    connection.rollback()
            
            print("✅ Database migration completed!")
            return True
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

def create_tables():
    """Create all tables if they don't exist"""
    print("\n🔄 Creating database tables...")
    try:
        models.Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return False

def populate_sample_data():
    """Populate database with sample data"""
    print("\n🔄 Populating sample data...")
    
    db = None
    try:
        from app.database import SessionLocal
        db = SessionLocal()
        
        # Check if data already exists
        existing_categories = db.query(models.Category).count()
        if existing_categories > 0:
            print("⚠ Sample data already exists. Skipping data population.")
            return True
        
        # Create Categories
        print("  Creating categories...")
        spices_category = crud.create_category(db, "Spices")
        rice_category = crud.create_category(db, "Rice")
        pulses_category = crud.create_category(db, "Pulses")
        dry_fruits_category = crud.create_category(db, "Dry Fruits")
        
        # Create Subcategories for Spices
        print("  Creating subcategories...")
        chili_subcategory = crud.create_subcategory(db, SubcategoryCreate(
            name="Chili",
            description="Various types of chili peppers and powders",
            category_id=spices_category.id
        ))
        
        turmeric_subcategory = crud.create_subcategory(db, SubcategoryCreate(
            name="Turmeric",
            description="Premium turmeric varieties",
            category_id=spices_category.id
        ))
        
        black_pepper_subcategory = crud.create_subcategory(db, SubcategoryCreate(
            name="Black Pepper",
            description="High-quality black pepper varieties",
            category_id=spices_category.id
        ))
        
        # Create Subcategories for Rice
        basmati_subcategory = crud.create_subcategory(db, SubcategoryCreate(
            name="Basmati",
            description="Premium basmati rice varieties",
            category_id=rice_category.id
        ))
        
        # Create Products for Chili Subcategory
        print("  Creating products...")
        
        # Product 1: Whole Stemless Red Chili (Teja/Sannam)
        chili_product_1 = crud.create_product(db, ProductCreate(
            name="Whole Stemless Red Chili (Teja/Sannam)",
            grade="Premium",
            moq="1000 KG",
            origin="Andhra Pradesh, Telangana",
            image_url="/images/chili-teja.jpg",
            certifications="ISO 22000, HACCP, Organic",
            details="Premium quality whole stemless red chili with excellent color and heat profile",
            category_id=spices_category.id,
            subcategory_id=chili_subcategory.id,
            specs={
                "size": "4-6 cm",
                "moisture": "≤12%",
                "shu": "30,000-90,000",
                "color": "Bright red",
                "ash_content": "Low",
                "cleaning": "Machine-cleaned"
            },
            highlights="De-stemmed, machine-cleaned, low-ash content, bright red color, consistent heat profile",
            private_label_options="Vacuum packs, printed pouches, foodservice bags, bulk containers",
            use_cases="Whole spice blends, oil infusions, grinding, pickling, marinades"
        ))
        
        # Product 2: Kashmiri Red Chili Powder
        chili_product_2 = crud.create_product(db, ProductCreate(
            name="Kashmiri Red Chili Powder",
            grade="Premium",
            moq="500 KG",
            origin="Kashmir, India",
            image_url="/images/chili-kashmiri.jpg",
            certifications="ISO 22000, HACCP",
            details="Mild and aromatic chili powder with deep red color",
            category_id=spices_category.id,
            subcategory_id=chili_subcategory.id,
            specs={
                "mesh_size": "60-80",
                "moisture": "≤10%",
                "shu": "1,000-2,000",
                "color": "Deep red",
                "astaxanthin": "High"
            },
            highlights="Mild heat, deep red color, high astaxanthin content, perfect for color and mild flavor",
            private_label_options="Retail pouches, bulk bags, foodservice containers",
            use_cases="Curries, gravies, tandoori dishes, color enhancement, mild seasoning"
        ))
        
        # Product 3: Bird's Eye Chili (Thai Chili)
        chili_product_3 = crud.create_product(db, ProductCreate(
            name="Bird's Eye Chili (Thai Chili)",
            grade="Premium",
            moq="500 KG",
            origin="Northeast India",
            image_url="/images/chili-birdseye.jpg",
            certifications="ISO 22000, HACCP, Organic",
            details="Small but extremely hot chili variety",
            category_id=spices_category.id,
            subcategory_id=chili_subcategory.id,
            specs={
                "size": "2-3 cm",
                "moisture": "≤12%",
                "shu": "50,000-100,000",
                "color": "Bright red to orange",
                "shape": "Small and pointed"
            },
            highlights="Extremely hot, small size, intense flavor, perfect for hot sauces",
            private_label_options="Small pouches, hot sauce bottles, spice blends",
            use_cases="Hot sauces, spicy dishes, marinades, pickling, extreme heat applications"
        ))
        
        # Create Products for Turmeric Subcategory
        turmeric_product_1 = crud.create_product(db, ProductCreate(
            name="Alleppey Finger Turmeric",
            grade="Premium",
            moq="1000 KG",
            origin="Kerala, India",
            image_url="/images/turmeric-alleppey.jpg",
            certifications="ISO 22000, HACCP, Organic",
            details="Premium finger turmeric with high curcumin content",
            category_id=spices_category.id,
            subcategory_id=turmeric_subcategory.id,
            specs={
                "curcumin_content": "≥5%",
                "moisture": "≤12%",
                "color": "Deep yellow-orange",
                "form": "Finger/rhizome"
            },
            highlights="High curcumin content, deep color, premium quality, organic certified",
            private_label_options="Whole fingers, powder, extracts, supplements",
            use_cases="Cooking, traditional medicine, supplements, natural colorant"
        ))
        
        # Create Products for Basmati Rice
        basmati_product_1 = crud.create_product(db, ProductCreate(
            name="Premium Aged Basmati Rice",
            grade="Premium",
            moq="5000 KG",
            origin="Punjab, India",
            image_url="/images/basmati-aged.jpg",
            certifications="ISO 22000, HACCP, GI Tag",
            details="Aged basmati rice with long, aromatic grains",
            category_id=rice_category.id,
            subcategory_id=basmati_subcategory.id,
            specs={
                "grain_length": "7-8 mm",
                "aging": "2+ years",
                "moisture": "≤14%",
                "broken_grains": "≤5%"
            },
            highlights="Long aromatic grains, aged for enhanced flavor, premium quality",
            private_label_options="Retail bags, bulk sacks, foodservice packs",
            use_cases="Biryani, pulao, steamed rice, premium rice dishes"
        ))
        
        print("✅ Sample data created successfully!")
        print(f"  Created {db.query(models.Category).count()} categories")
        print(f"  Created {db.query(models.Subcategory).count()} subcategories")
        print(f"  Created {db.query(models.Product).count()} products")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        if db:
            db.rollback()
        return False
    finally:
        if db:
            db.close()

def verify_setup():
    """Verify that the setup was successful"""
    print("\n🔍 Verifying setup...")
    
    try:
        with engine.connect() as connection:
            # Check if all tables exist
            tables = ["users", "categories", "subcategories", "products", "blogs", "enquiries", "activities"]
            
            for table in tables:
                result = connection.execute(text(f"SHOW TABLES LIKE '{table}'"))
                if result.fetchone():
                    print(f"  ✓ {table} table exists")
                else:
                    print(f"  ❌ {table} table missing")
            
            # Check data counts
            result = connection.execute(text("SELECT COUNT(*) FROM categories"))
            categories_count = result.fetchone()[0]
            print(f"  📊 Categories: {categories_count}")
            
            result = connection.execute(text("SELECT COUNT(*) FROM subcategories"))
            subcategories_count = result.fetchone()[0]
            print(f"  📊 Subcategories: {subcategories_count}")
            
            result = connection.execute(text("SELECT COUNT(*) FROM products"))
            products_count = result.fetchone()[0]
            print(f"  📊 Products: {products_count}")
            
        print("✅ Setup verification completed!")
        return True
        
    except Exception as e:
        print(f"❌ Setup verification failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Amber Global Backend Database Setup")
    print("=" * 50)
    
    # Check database connection
    if not check_database_connection():
        print("❌ Cannot proceed without database connection")
        sys.exit(1)
    
    # Create tables
    if not create_tables():
        print("❌ Failed to create tables")
        sys.exit(1)
    
    # Migrate database (add missing columns)
    if not migrate_database():
        print("❌ Failed to migrate database")
        sys.exit(1)
    
    # Populate sample data
    if not populate_sample_data():
        print("❌ Failed to populate sample data")
        sys.exit(1)
    
    # Verify setup
    if not verify_setup():
        print("❌ Setup verification failed")
        sys.exit(1)
    
    print("\n🎉 Database setup completed successfully!")
    print("\nYou can now start the server with:")
    print("  python -m uvicorn app.main:app --reload")
    print("\nAPI will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")

if __name__ == "__main__":
    main() 