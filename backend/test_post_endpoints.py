#!/usr/bin/env python3
"""
Test POST Endpoints Script
Tests creation endpoints to verify data creation functionality
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}

def test_post_endpoint(endpoint, data, test_name):
    """Test a POST endpoint"""
    try:
        url = f"{BASE_URL}{endpoint}"
        response = requests.post(url, json=data, headers=HEADERS)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ {test_name}: PASSED")
            print(f"   📊 Created ID: {result.get('id', 'N/A')}")
            print(f"   📊 Name: {result.get('name', result.get('title', 'N/A'))}")
            return result.get('id')
        else:
            print(f"❌ {test_name}: FAILED (Status: {response.status_code})")
            print(f"   Response: {response.text[:200]}...")
            return None
            
    except requests.exceptions.ConnectionError:
        print(f"❌ {test_name}: FAILED (Server not running)")
        return None
    except Exception as e:
        print(f"❌ {test_name}: FAILED ({str(e)})")
        return None

def main():
    """Test POST endpoints"""
    print("🚀 Testing POST Endpoints...")
    print("=" * 50)
    
    timestamp = datetime.now().strftime("%H%M%S")
    
    # Test creating a category
    print("🔍 Testing Category Creation...")
    category_data = {
        "name": f"Test Category {timestamp}"
    }
    category_id = test_post_endpoint("/categories/", category_data, "Create Category")
    
    # Test creating a subcategory
    print("\n🔍 Testing Subcategory Creation...")
    subcategory_data = {
        "name": f"Test Subcategory {timestamp}",
        "description": "Test subcategory description",
        "image_url": "/images/test.jpg",
        "category_id": category_id or 1
    }
    subcategory_id = test_post_endpoint("/subcategories/", subcategory_data, "Create Subcategory")
    
    # Test creating a product
    print("\n🔍 Testing Product Creation...")
    product_data = {
        "name": f"Test Product {timestamp}",
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
    product_id = test_post_endpoint("/products/", product_data, "Create Product")
    
    # Test creating a blog
    print("\n🔍 Testing Blog Creation...")
    blog_data = {
        "title": f"Test Blog {timestamp}",
        "content": "This is a test blog content for testing purposes.",
        "author": "Test Author"
    }
    blog_id = test_post_endpoint("/blogs/", blog_data, "Create Blog")
    
    # Test creating an enquiry
    print("\n🔍 Testing Enquiry Creation...")
    enquiry_data = {
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
    enquiry_id = test_post_endpoint("/enquiries/", enquiry_data, "Create Enquiry")
    
    print("\n" + "=" * 50)
    print("🎉 POST Endpoints Testing Completed!")
    print("\n📊 Summary:")
    print(f"- Category created: {'✅' if category_id else '❌'}")
    print(f"- Subcategory created: {'✅' if subcategory_id else '❌'}")
    print(f"- Product created: {'✅' if product_id else '❌'}")
    print(f"- Blog created: {'✅' if blog_id else '❌'}")
    print(f"- Enquiry created: {'✅' if enquiry_id else '❌'}")
    
    if all([category_id, subcategory_id, product_id, blog_id, enquiry_id]):
        print("\n✅ All POST endpoints are working correctly!")
    else:
        print("\n⚠️ Some POST endpoints failed. Check the errors above.")

if __name__ == "__main__":
    main()

