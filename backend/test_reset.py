import requests
import json

def test_reset_password():
    base_url = "http://127.0.0.1:8000"
    
    # Test case that might be causing 400 error
    test_data = {
        "email": "test@example.com",
        "otp_code": "123456",
        "new_password": "StrongPass123!",
        "confirm_password": "StrongPass123!"
    }
    
    print("Testing /auth/reset-password...")
    print(f"Data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(
            f"{base_url}/auth/reset-password",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status: {response.status_code}")
        if response.status_code == 400:
            error_detail = response.json().get('detail', 'Unknown error')
            print(f"Error: {error_detail}")
        else:
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_reset_password()
