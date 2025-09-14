import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_forgot_password_flow():
    test_email = "biogredvideo@gmail.com"  # Use an email that exists in your database
    
    print("🧪 Testing Forgot Password Flow")
    print("=" * 50)

    print("1. Testing forgot password request...")
    try:
        response = requests.post(f"{BASE_URL}/auth/forgot-password", json={"email": test_email})
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        if response.status_code == 200:
            print("   ✅ Forgot password request successful - OTP should be sent to email")
        else:
            print("   ❌ Forgot password request failed")
            return
    except Exception as e:
        print(f"   ❌ Error during forgot password request: {str(e)}")
        return

    print("\n2. Testing password reset with dummy OTP...")
    try:
        reset_data = {
            "email": test_email,
            "otp_code": "123456",  # This will fail, but tests the endpoint
            "new_password": "NewPassword123!",
            "confirm_password": "NewPassword123!"
        }
        response = requests.post(f"{BASE_URL}/auth/reset-password", json=reset_data)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        if response.status_code == 400:
            print("   ✅ Password reset endpoint working (expected failure with dummy OTP)")
        else:
            print("   ⚠️ Unexpected response from password reset")
    except Exception as e:
        print(f"   ❌ Error during password reset: {str(e)}")

    print("\n" + "=" * 50)
    print("🎉 Forgot password functionality test completed!")
    print("\n📝 Notes:")
    print("- Check your email for the actual OTP code")
    print("- Use the real OTP code to test password reset")
    print("- The OTP expires in 5 minutes")

if __name__ == "__main__":
    test_forgot_password_flow() 