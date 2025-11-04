#!/usr/bin/env python3
"""
Quick API Test Script
Tests key endpoints to verify API functionality
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}

def test_endpoint(endpoint, method="GET", data=None):
    """Test a single endpoint"""
    try:
        url = f"{BASE_URL}{endpoint}"
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data, headers=HEADERS)
        
        if response.status_code == 200:
            print(f"✅ {method} {endpoint}: PASSED")
            try:
                result = response.json()
                if isinstance(result, list):
                    print(f"   📊 Items: {len(result)}")
                elif isinstance(result, dict):
                    print(f"   📊 Keys: {list(result.keys())}")
            except:
                pass
        else:
            print(f"❌ {method} {endpoint}: FAILED (Status: {response.status_code})")
            print(f"   Response: {response.text[:100]}...")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ {method} {endpoint}: FAILED (Server not running)")
    except Exception as e:
        print(f"❌ {method} {endpoint}: FAILED ({str(e)})")

def main():
    """Test key endpoints"""
    print("🚀 Quick API Testing...")
    print("=" * 40)
    
    # Test basic endpoints
    print("🔍 Testing Basic Endpoints...")
    test_endpoint("/")
    test_endpoint("/health")
    
    # Test categories
    print("\n🔍 Testing Categories...")
    test_endpoint("/categories/")
    test_endpoint("/categories/hierarchy")
    
    # Test subcategories
    print("\n🔍 Testing Subcategories...")
    test_endpoint("/subcategories/")
    test_endpoint("/subcategories/category/1")
    test_endpoint("/subcategories/category/1/with-products")
    
    # Test products
    print("\n🔍 Testing Products...")
    test_endpoint("/products/")
    test_endpoint("/products/featured/")
    test_endpoint("/products/subcategory/1")
    test_endpoint("/products/category/1")
    
    # Test other endpoints
    print("\n🔍 Testing Other Endpoints...")
    test_endpoint("/blogs/")
    test_endpoint("/enquiries/")
    test_endpoint("/analytics/overview")
    test_endpoint("/analytics/activities/recent")
    
    print("\n" + "=" * 40)
    print("🎉 Quick API Testing Completed!")
    print("\n💡 If you see 'Server not running' errors:")
    print("   Start the server with: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload")

if __name__ == "__main__":
    main()

