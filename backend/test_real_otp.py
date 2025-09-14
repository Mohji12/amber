import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_real_otp():
    test_email = "biogredvideo@gmail.com"
    real_otp = "132405"  # The actual OTP from the database
    
    print("🧪 Testing Password Reset with Real OTP")
    print("=" * 50)

    print(f"Using OTP: {real_otp}")
    print(f"Email: {test_email}")
    
    try:
        reset_data = {
            "email": test_email,
            "otp_code": real_otp,
            "new_password": "NewPassword123!",
            "confirm_password": "NewPassword123!"
        }
        response = requests.post(f"{BASE_URL}/auth/reset-password", json=reset_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Password reset successful!")
            print(f"Access Token: {response.json().get('access_token', 'N/A')[:20]}...")
        else:
            print("❌ Password reset failed")
            
    except Exception as e:
        print(f"❌ Error during password reset: {str(e)}")

if __name__ == "__main__":
    test_real_otp() 