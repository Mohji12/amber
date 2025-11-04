import requests
import json
from datetime import datetime

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_signup_flow():
    """Test the complete signup and OTP verification flow"""
    
    # Test data
    signup_data = {
        "user_name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "confirm_password": "testpassword123",
        "business_name": "Test Business",
        "address": "Test Address"
    }
    
    print("🧪 Testing OTP Signup Flow")
    print("=" * 50)
    
    # Step 1: Signup
    print("1. Testing signup...")
    try:
        response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 200:
            print("   ✅ Signup successful - OTP should be sent to email")
        else:
            print("   ❌ Signup failed")
            return
            
    except Exception as e:
        print(f"   ❌ Error during signup: {str(e)}")
        return
    
    # Step 2: Test resend OTP
    print("\n2. Testing resend OTP...")
    try:
        resend_data = {"email": "test@example.com"}
        response = requests.post(f"{BASE_URL}/auth/resend-otp", json=resend_data)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 200:
            print("   ✅ Resend OTP successful")
        else:
            print("   ❌ Resend OTP failed")
            
    except Exception as e:
        print(f"   ❌ Error during resend OTP: {str(e)}")
    
    # Step 3: Test OTP verification (with dummy OTP)
    print("\n3. Testing OTP verification...")
    try:
        verify_data = {
            "email": "test@example.com",
            "otp_code": "123456"  # This will fail, but tests the endpoint
        }
        response = requests.post(f"{BASE_URL}/auth/verify-otp", json=verify_data)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 400:
            print("   ✅ OTP verification endpoint working (expected failure with dummy OTP)")
        else:
            print("   ⚠️ Unexpected response from OTP verification")
            
    except Exception as e:
        print(f"   ❌ Error during OTP verification: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎉 OTP functionality test completed!")
    print("\n📝 Notes:")
    print("- Check your email for the actual OTP code")
    print("- Use the real OTP code to test verification")
    print("- The OTP expires in 5 minutes")

if __name__ == "__main__":
    test_signup_flow() 