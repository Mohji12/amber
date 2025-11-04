import requests
import time

time.sleep(3)
try:
    response = requests.get('http://127.0.0.1:8000/subcategories/')
    if response.status_code == 200:
        subcategories = response.json()
        print(f'✅ Local backend is running! Found {len(subcategories)} subcategories')
        
        # Check if badge_type field exists
        if subcategories:
            first_sub = subcategories[0]
            if 'badge_type' in first_sub:
                print('✅ badge_type field exists in local API response')
                print(f'Sample badge_type: {first_sub.get("badge_type")}')
            else:
                print('❌ badge_type field missing from local API response')
    else:
        print(f'❌ Local backend returned status {response.status_code}')
except Exception as e:
    print(f'❌ Local backend not responding: {e}')


