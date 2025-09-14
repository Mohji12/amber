#!/usr/bin/env python3
"""Test API routes without database"""
import requests

def test_routes():
    base_url = "http://127.0.0.1:8000"
    
    print("Testing API Routes...")
    
    # Test basic routes
    routes = [
        "/",
        "/health", 
        "/docs",
        "/openapi.json"
    ]
    
    for route in routes:
        try:
            response = requests.get(f"{base_url}{route}")
            status = "✅" if response.status_code == 200 else "❌"
            print(f"{status} {route} - {response.status_code}")
        except Exception as e:
            print(f"❌ {route} - Connection failed: {e}")

if __name__ == "__main__":
    test_routes()
