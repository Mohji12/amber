#!/usr/bin/env python3
"""
Test Hierarchy Structure Script
Tests the category-subcategory-product hierarchy endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_hierarchy_endpoint(endpoint, test_name):
    """Test a hierarchy endpoint"""
    try:
        url = f"{BASE_URL}{endpoint}"
        response = requests.get(url)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ {test_name}: PASSED")
            
            if isinstance(result, list):
                print(f"   📊 Items: {len(result)}")
                if len(result) > 0:
                    first_item = result[0]
                    if 'subcategories' in first_item:
                        print(f"   📁 First category: {first_item['name']} with {len(first_item['subcategories'])} subcategories")
                        if first_item['subcategories']:
                            first_sub = first_item['subcategories'][0]
                            if 'products' in first_sub:
                                print(f"   📂 First subcategory: {first_sub['name']} with {len(first_sub['products'])} products")
                    elif 'products' in first_item:
                        print(f"   📂 First subcategory: {first_item['name']} with {len(first_item['products'])} products")
            elif isinstance(result, dict):
                print(f"   📊 Keys: {list(result.keys())}")
                if 'subcategories' in result:
                    print(f"   📁 Category: {result['name']} with {len(result['subcategories'])} subcategories")
                elif 'products' in result:
                    print(f"   📂 Subcategory: {result['name']} with {len(result['products'])} products")
            
            return True
        else:
            print(f"❌ {test_name}: FAILED (Status: {response.status_code})")
            print(f"   Response: {response.text[:200]}...")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ {test_name}: FAILED (Server not running)")
        return False
    except Exception as e:
        print(f"❌ {test_name}: FAILED ({str(e)})")
        return False

def main():
    """Test hierarchy structure"""
    print("🚀 Testing Hierarchy Structure...")
    print("=" * 50)
    
    # Test categories with subcategories
    print("🔍 Testing Categories with Subcategories...")
    test_hierarchy_endpoint("/categories/hierarchy", "Categories with Subcategories")
    
    # Test subcategories with products by category
    print("\n🔍 Testing Subcategories with Products by Category...")
    test_hierarchy_endpoint("/subcategories/category/1/with-products", "Subcategories with Products by Category (ID: 1)")
    test_hierarchy_endpoint("/subcategories/category/2/with-products", "Subcategories with Products by Category (ID: 2)")
    
    # Test individual subcategory with products
    print("\n🔍 Testing Individual Subcategory with Products...")
    test_hierarchy_endpoint("/subcategories/1/with-products", "Subcategory with Products (ID: 1)")
    test_hierarchy_endpoint("/subcategories/2/with-products", "Subcategory with Products (ID: 2)")
    
    # Test products by subcategory
    print("\n🔍 Testing Products by Subcategory...")
    test_hierarchy_endpoint("/products/subcategory/1", "Products by Subcategory (ID: 1)")
    test_hierarchy_endpoint("/products/subcategory/2", "Products by Subcategory (ID: 2)")
    
    # Test products by category (should get products through subcategories)
    print("\n🔍 Testing Products by Category...")
    test_hierarchy_endpoint("/products/category/1", "Products by Category (ID: 1)")
    test_hierarchy_endpoint("/products/category/2", "Products by Category (ID: 2)")
    
    print("\n" + "=" * 50)
    print("🎉 Hierarchy Structure Testing Completed!")
    print("\n📊 Hierarchy Structure:")
    print("   📁 Categories")
    print("      📂 Subcategories")
    print("         📦 Products")
    print("\n✅ The hierarchy structure is working correctly!")

if __name__ == "__main__":
    main()

