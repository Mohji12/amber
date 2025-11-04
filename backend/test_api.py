#!/usr/bin/env python3
"""
Simple API Test Script for Amber Global Backend
This script tests the main API endpoints to ensure everything is working.
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint, method="GET", data=None):
    """Test a single endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        
        print(f"✅ {method} {endpoint} - Status: {response.status_code}")
        if response.status_code in [200, 201]:
            return response.json()
        else:
            print(f"   Response: {response.text[:100]}")
            return None
            
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {e}")
        return None

def main():
    """Test all main endpoints"""
    print("🚀 Testing Amber Global API Endpoints")
    print("=" * 50)
    
    # Test root endpoint
    test_endpoint("/")
    
    # Test categories
    print("\n📂 Testing Categories:")
    categories = test_endpoint("/categories/")
    
    # Test subcategories
    print("\n📁 Testing Subcategories:")
    subcategories = test_endpoint("/subcategories/")
    
    # Test products
    print("\n🛍️ Testing Products:")
    products = test_endpoint("/products/")
    featured_products = test_endpoint("/products/featured/")
    
    # Test blogs
    print("\n📝 Testing Blogs:")
    blogs = test_endpoint("/blogs/")
    
    # Test enquiries
    print("\n📧 Testing Enquiries:")
    enquiries = test_endpoint("/enquiries/")
    
    # Test analytics
    print("\n📊 Testing Analytics:")
    test_endpoint("/analytics/users")
    
    # Test creating a category
    print("\n➕ Testing Category Creation:")
    category_data = {"name": "Test Category"}
    new_category = test_endpoint("/categories/", "POST", category_data)
    
    if new_category:
        category_id = new_category.get("id")
        
        # Test creating a subcategory
        print("\n➕ Testing Subcategory Creation:")
        subcategory_data = {
            "name": "Test Subcategory",
            "description": "A test subcategory",
            "category_id": category_id
        }
        new_subcategory = test_endpoint("/subcategories/", "POST", subcategory_data)
        
        if new_subcategory:
            subcategory_id = new_subcategory.get("id")
            
            # Test creating a product
            print("\n➕ Testing Product Creation:")
            product_data = {
                "name": "Test Product",
                "grade": "Premium",
                "moq": "100 KG",
                "origin": "Test Origin",
                "category_id": category_id,
                "subcategory_id": subcategory_id,
                "specs": {
                    "size": "Test size",
                    "moisture": "≤10%"
                },
                "highlights": "Test highlights",
                "use_cases": "Test use cases"
            }
            new_product = test_endpoint("/products/", "POST", product_data)
            
            if new_product:
                product_id = new_product.get("id")
                
                # Test getting products by subcategory
                print("\n🔍 Testing Products by Subcategory:")
                test_endpoint(f"/products/subcategory/{subcategory_id}")
                
                # Test getting subcategories by category
                print("\n🔍 Testing Subcategories by Category:")
                test_endpoint(f"/subcategories/category/{category_id}")
    
    print("\n🎉 API Testing Completed!")
    print("\nIf all tests passed, your backend is working correctly!")
    print(f"API Documentation: {BASE_URL}/docs")

if __name__ == "__main__":
    main() 