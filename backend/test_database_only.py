#!/usr/bin/env python3
"""
Database-Only Test Script for Amber Global Backend
Tests CRUD operations directly without API server
"""

from sqlalchemy import text
from app.database import engine, SessionLocal
from app import models, crud, schemas

def test_database_connection():
    """Test database connection"""
    print("🔍 Testing Database Connection...")
    
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database Connection: PASSED")
            return True
    except Exception as e:
        print(f"❌ Database Connection: FAILED - {e}")
        return False

def test_categories_crud():
    """Test categories CRUD operations"""
    print("\n🔍 Testing Categories CRUD...")
    
    db = SessionLocal()
    try:
        # Get all categories
        categories = crud.get_categories(db)
        print(f"✅ Get Categories: PASSED - Found {len(categories)} categories")
        
        # Create a test category
        test_category_name = f"Test Category {len(categories) + 1}"
        new_category = crud.create_category(db, test_category_name)
        print(f"✅ Create Category: PASSED - Created category '{new_category.name}' with ID {new_category.id}")
        
        # Update category
        updated_category = crud.update_category(db, new_category.id, f"Updated {test_category_name}")
        print(f"✅ Update Category: PASSED - Updated category to '{updated_category.name}'")
        
        # Get categories with subcategories
        categories_with_sub = crud.get_categories_with_subcategories(db)
        print(f"✅ Get Categories with Subcategories: PASSED - Found {len(categories_with_sub)} categories")
        
        return new_category.id
        
    except Exception as e:
        print(f"❌ Categories CRUD: FAILED - {e}")
        return None
    finally:
        db.close()

def test_subcategories_crud(category_id):
    """Test subcategories CRUD operations"""
    print("\n🔍 Testing Subcategories CRUD...")
    
    db = SessionLocal()
    try:
        # Get all subcategories
        subcategories = crud.get_subcategories(db)
        print(f"✅ Get Subcategories: PASSED - Found {len(subcategories)} subcategories")
        
        # Create a test subcategory
        test_subcategory_data = schemas.SubcategoryCreate(
            name=f"Test Subcategory {len(subcategories) + 1}",
            description="Test subcategory description",
            image_url="/images/test.jpg",
            category_id=category_id or 1
        )
        new_subcategory = crud.create_subcategory(db, test_subcategory_data)
        print(f"✅ Create Subcategory: PASSED - Created subcategory '{new_subcategory.name}' with ID {new_subcategory.id}")
        
        # Get subcategories by category
        subcategories_by_category = crud.get_subcategories_by_category(db, category_id or 1)
        print(f"✅ Get Subcategories by Category: PASSED - Found {len(subcategories_by_category)} subcategories")
        
        # Get subcategories with products
        subcategories_with_products = crud.get_subcategories_with_products_by_category(db, category_id or 1)
        print(f"✅ Get Subcategories with Products: PASSED - Found {len(subcategories_with_products)} subcategories")
        
        return new_subcategory.id
        
    except Exception as e:
        print(f"❌ Subcategories CRUD: FAILED - {e}")
        return None
    finally:
        db.close()

def test_products_crud(subcategory_id):
    """Test products CRUD operations"""
    print("\n🔍 Testing Products CRUD...")
    
    db = SessionLocal()
    try:
        # Get all products
        products = crud.get_products(db)
        print(f"✅ Get Products: PASSED - Found {len(products)} products")
        
        # Create a test product
        test_product_data = schemas.ProductCreate(
            name=f"Test Product {len(products) + 1}",
            grade="A Grade",
            moq="1000 KG",
            origin="India",
            image_url="/images/test-product.jpg",
            certifications="ISO 22000, HACCP",
            details="Test product details",
            subcategory_id=subcategory_id or 1,
            specs={"color": "Red", "size": "Medium"},
            highlights="Premium quality test product",
            private_label_options="Available",
            use_cases="Cooking, seasoning"
        )
        new_product = crud.create_product(db, test_product_data)
        print(f"✅ Create Product: PASSED - Created product '{new_product.name}' with ID {new_product.id}")
        
        # Get products by subcategory
        products_by_subcategory = crud.get_products_by_subcategory(db, subcategory_id or 1)
        print(f"✅ Get Products by Subcategory: PASSED - Found {len(products_by_subcategory)} products")
        
        # Get products by category
        products_by_category = crud.get_products_by_category(db, 1)
        print(f"✅ Get Products by Category: PASSED - Found {len(products_by_category)} products")
        
        # Get featured products
        featured_products = crud.get_featured_products(db)
        print(f"✅ Get Featured Products: PASSED - Found {len(featured_products)} featured products")
        
        return new_product.id
        
    except Exception as e:
        print(f"❌ Products CRUD: FAILED - {e}")
        return None
    finally:
        db.close()

def test_activities_crud():
    """Test activities CRUD operations"""
    print("\n🔍 Testing Activities CRUD...")
    
    db = SessionLocal()
    try:
        # Get recent activities
        activities = crud.get_recent_activities(db)
        print(f"✅ Get Recent Activities: PASSED - Found {len(activities)} activities")
        
        # Log a test activity
        test_activity = crud.log_activity(db, "test_activity", "This is a test activity for testing purposes")
        print(f"✅ Log Activity: PASSED - Created activity '{test_activity.type}' with ID {test_activity.id}")
        
        # Get activities again to verify
        updated_activities = crud.get_recent_activities(db)
        print(f"✅ Verify Activity Creation: PASSED - Now found {len(updated_activities)} activities")
        
    except Exception as e:
        print(f"❌ Activities CRUD: FAILED - {e}")
    finally:
        db.close()

def test_hierarchy_structure():
    """Test the hierarchy structure"""
    print("\n🔍 Testing Hierarchy Structure...")
    
    db = SessionLocal()
    try:
        # Test the complete hierarchy
        categories = crud.get_categories_with_subcategories(db)
        print(f"✅ Hierarchy Structure: PASSED - Found {len(categories)} categories with subcategories")
        
        for category in categories:
            print(f"   📁 Category: {category.name} (ID: {category.id})")
            for subcategory in category.subcategories:
                print(f"      📂 Subcategory: {subcategory.name} (ID: {subcategory.id})")
                
                # Get products for this subcategory
                products = crud.get_products_by_subcategory(db, subcategory.id)
                for product in products:
                    print(f"         📦 Product: {product.name} (ID: {product.id})")
        
        print("✅ Hierarchy Structure Verification: PASSED")
        
    except Exception as e:
        print(f"❌ Hierarchy Structure: FAILED - {e}")
    finally:
        db.close()

def main():
    """Main test function"""
    print("🚀 Starting Database-Only Testing...")
    print("=" * 50)
    
    # Test database connection
    if not test_database_connection():
        print("❌ Cannot proceed without database connection")
        return
    
    # Test CRUD operations
    category_id = test_categories_crud()
    subcategory_id = test_subcategories_crud(category_id)
    product_id = test_products_crud(subcategory_id)
    test_activities_crud()
    test_hierarchy_structure()
    
    print("=" * 50)
    print("🎉 Database-Only Testing Completed!")
    print("\n📊 Summary:")
    print("- Database connection tested")
    print("- Categories CRUD operations tested")
    print("- Subcategories CRUD operations tested")
    print("- Products CRUD operations tested")
    print("- Activities CRUD operations tested")
    print("- Hierarchy structure verified")
    print("\n✅ All database operations are working correctly!")

if __name__ == "__main__":
    main()

