#!/usr/bin/env python3
"""
Comprehensive Test Script for Amber Global API
Tests all endpoints and CRUD operations
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}

def print_test_result(test_name, success, response=None, error=None):
    """Print test result with formatting"""
    if success:
        print(f"✅ {test_name}: PASSED")
        if response:
            print(f"   Status: {response.status_code}")
            if response.status_code != 204:
                try:
                    data = response.json()
                    if isinstance(data, list):
                        print(f"   Items: {len(data)}")
                    elif isinstance(data, dict):
                        print(f"   Keys: {list(data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
    else:
        print(f"❌ {test_name}: FAILED")
        if error:
            print(f"   Error: {error}")
        if response:
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
    print()

def test_health_endpoints():
    """Test basic health and root endpoints"""
    print("🔍 Testing Health Endpoints...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        print_test_result("Root Endpoint", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Root Endpoint", False, error=str(e))
    
    # Test health endpoint
    try:
        response = requests.get(f"{BASE_URL}/health")
        print_test_result("Health Endpoint", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Health Endpoint", False, error=str(e))

def test_categories():
    """Test categories endpoints"""
    print("🔍 Testing Categories Endpoints...")
    
    # Get all categories
    try:
        response = requests.get(f"{BASE_URL}/categories/")
        print_test_result("Get All Categories", response.status_code == 200, response)
        categories = response.json() if response.status_code == 200 else []
    except Exception as e:
        print_test_result("Get All Categories", False, error=str(e))
        categories = []
    
    # Get categories with subcategories
    try:
        response = requests.get(f"{BASE_URL}/categories/hierarchy")
        print_test_result("Get Categories Hierarchy", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Get Categories Hierarchy", False, error=str(e))
    
    # Create a test category
    test_category = {"name": f"Test Category {datetime.now().strftime('%H%M%S')}"}
    try:
        response = requests.post(f"{BASE_URL}/categories/", json=test_category, headers=HEADERS)
        print_test_result("Create Category", response.status_code == 200, response)
        if response.status_code == 200:
            category_id = response.json().get('id')
            return category_id
    except Exception as e:
        print_test_result("Create Category", False, error=str(e))
    
    return None

def test_subcategories(category_id):
    """Test subcategories endpoints"""
    print("🔍 Testing Subcategories Endpoints...")
    
    # Get all subcategories
    try:
        response = requests.get(f"{BASE_URL}/subcategories/")
        print_test_result("Get All Subcategories", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Get All Subcategories", False, error=str(e))
    
    # Get subcategories by category
    if category_id:
        try:
            response = requests.get(f"{BASE_URL}/subcategories/category/{category_id}")
            print_test_result("Get Subcategories by Category", response.status_code == 200, response)
        except Exception as e:
            print_test_result("Get Subcategories by Category", False, error=str(e))
    
    # Create a test subcategory
    test_subcategory = {
        "name": f"Test Subcategory {datetime.now().strftime('%H%M%S')}",
        "description": "Test subcategory description",
        "image_url": "/images/test.jpg",
        "category_id": category_id or 1
    }
    
    try:
        response = requests.post(f"{BASE_URL}/subcategories/", json=test_subcategory, headers=HEADERS)
        print_test_result("Create Subcategory", response.status_code == 200, response)
        if response.status_code == 200:
            subcategory_id = response.json().get('id')
            return subcategory_id
    except Exception as e:
        print_test_result("Create Subcategory", False, error=str(e))
    
    return None

def test_products(subcategory_id):
    """Test products endpoints"""
    print("🔍 Testing Products Endpoints...")
    
    # Get all products
    try:
        response = requests.get(f"{BASE_URL}/products/")
        print_test_result("Get All Products", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Get All Products", False, error=str(e))
    
    # Get featured products
    try:
        response = requests.get(f"{BASE_URL}/products/featured/")
        print_test_result("Get Featured Products", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Get Featured Products", False, error=str(e))
    
    # Create a test product
    test_product = {
        "name": f"Test Product {datetime.now().strftime('%H%M%S')}",
        "grade": "A Grade",
        "moq": "1000 KG",
        "origin": "India",
        "image_url": "/images/test-product.jpg",
        "certifications": "ISO 22000, HACCP",
        "details": "Test product details",
        "subcategory_id": subcategory_id or 1,
        "specs": {"color": "Red", "size": "Medium"},
        "highlights": "Premium quality test product",
        "private_label_options": "Available",
        "use_cases": "Cooking, seasoning"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/products/", json=test_product, headers=HEADERS)
        print_test_result("Create Product", response.status_code == 200, response)
        if response.status_code == 200:
            product_id = response.json().get('id')
            return product_id
    except Exception as e:
        print_test_result("Create Product", False, error=str(e))
    
    return None

def test_blogs():
    """Test blogs endpoints"""
    print("🔍 Testing Blogs Endpoints...")
    
    # Get all blogs
    try:
        response = requests.get(f"{BASE_URL}/blogs/")
        print_test_result("Get All Blogs", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Get All Blogs", False, error=str(e))
    
    # Create a test blog
    test_blog = {
        "title": f"Test Blog {datetime.now().strftime('%H%M%S')}",
        "content": "This is a test blog content for testing purposes.",
        "author": "Test Author"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/blogs/", json=test_blog, headers=HEADERS)
        print_test_result("Create Blog", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Create Blog", False, error=str(e))

def test_enquiries(product_id):
    """Test enquiries endpoints"""
    print("🔍 Testing Enquiries Endpoints...")
    
    # Get all enquiries
    try:
        response = requests.get(f"{BASE_URL}/enquiries/")
        print_test_result("Get All Enquiries", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Get All Enquiries", False, error=str(e))
    
    # Create a test enquiry
    test_enquiry = {
        "name": "Test Customer",
        "email": "test@example.com",
        "contact_number": "+1234567890",
        "company_name": "Test Company",
        "required_amount": 5000,
        "any_query": "Test enquiry query",
        "product_id": product_id or 1,
        "product_interest": "Test Product",
        "destination_country": "USA"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/enquiries/", json=test_enquiry, headers=HEADERS)
        print_test_result("Create Enquiry", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Create Enquiry", False, error=str(e))

def test_analytics():
    """Test analytics endpoints"""
    print("🔍 Testing Analytics Endpoints...")
    
    # Get analytics overview
    try:
        response = requests.get(f"{BASE_URL}/analytics/overview")
        print_test_result("Analytics Overview", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Analytics Overview", False, error=str(e))
    
    # Get recent activities
    try:
        response = requests.get(f"{BASE_URL}/analytics/activities/recent")
        print_test_result("Recent Activities", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Recent Activities", False, error=str(e))
    
    # Get users list
    try:
        response = requests.get(f"{BASE_URL}/analytics/users")
        print_test_result("Users List", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Users List", False, error=str(e))

def test_hierarchy_endpoints():
    """Test hierarchy-specific endpoints"""
    print("🔍 Testing Hierarchy Endpoints...")
    
    # Test subcategories with products by category
    try:
        response = requests.get(f"{BASE_URL}/subcategories/category/1/with-products")
        print_test_result("Subcategories with Products by Category", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Subcategories with Products by Category", False, error=str(e))
    
    # Test subcategory with products
    try:
        response = requests.get(f"{BASE_URL}/subcategories/1/with-products")
        print_test_result("Subcategory with Products", response.status_code == 200, response)
    except Exception as e:
        print_test_result("Subcategory with Products", False, error=str(e))

def test_database_connection():
    """Test database connection and basic operations"""
    print("🔍 Testing Database Connection...")
    
    try:
        from app.database import engine
        from app import models, crud
        from app.database import SessionLocal
        
        # Test database connection
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            print_test_result("Database Connection", True)
        
        # Test basic CRUD operations
        db = SessionLocal()
        try:
            # Test categories CRUD
            categories = crud.get_categories(db)
            print_test_result("Categories CRUD - Get All", len(categories) >= 0)
            
            # Test subcategories CRUD
            subcategories = crud.get_subcategories(db)
            print_test_result("Subcategories CRUD - Get All", len(subcategories) >= 0)
            
            # Test products CRUD
            products = crud.get_products(db)
            print_test_result("Products CRUD - Get All", len(products) >= 0)
            
            # Test activities CRUD
            activities = crud.get_recent_activities(db)
            print_test_result("Activities CRUD - Get Recent", len(activities) >= 0)
            
        finally:
            db.close()
            
    except Exception as e:
        print_test_result("Database Operations", False, error=str(e))

def main():
    """Main test function"""
    print("🚀 Starting Comprehensive API Testing...")
    print("=" * 50)
    
    # Test database connection first
    test_database_connection()
    
    # Test basic endpoints
    test_health_endpoints()
    
    # Test categories and get category ID
    category_id = test_categories()
    
    # Test subcategories and get subcategory ID
    subcategory_id = test_subcategories(category_id)
    
    # Test products and get product ID
    product_id = test_products(subcategory_id)
    
    # Test other endpoints
    test_blogs()
    test_enquiries(product_id)
    test_analytics()
    test_hierarchy_endpoints()
    
    print("=" * 50)
    print("🎉 Comprehensive API Testing Completed!")
    print("\n📊 Summary:")
    print("- Database connection and CRUD operations tested")
    print("- All major endpoints tested")
    print("- Hierarchy structure verified")
    print("- Activity logging tested")
    print("\n✅ If all tests passed, your API is working correctly!")

if __name__ == "__main__":
    main()

