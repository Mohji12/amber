import requests
import json

# Test the deployed API endpoint
base_url = 'https://pq13kceala.execute-api.ap-south-1.amazonaws.com'

try:
    # Get all subcategories to see current state
    print('1. Getting all subcategories from deployed API...')
    response = requests.get(f'{base_url}/subcategories/')
    if response.status_code == 200:
        subcategories = response.json()
        print(f'Found {len(subcategories)} subcategories')
        
        # Find a subcategory to test with
        test_sub = None
        for sub in subcategories:
            if 'Basmati' in sub['name']:
                test_sub = sub
                break
        
        if test_sub:
            print(f'\\n2. Testing with subcategory ID {test_sub["id"]}: {test_sub["name"]}')
            print(f'Current badge_type: {test_sub.get("badge_type", "NOT FOUND")}')
            
            # Check if badge_type field exists in the response
            if 'badge_type' in test_sub:
                print('✅ badge_type field exists in API response')
            else:
                print('❌ badge_type field MISSING from API response')
                print('Available fields:', list(test_sub.keys()))
        else:
            print('No Basmati subcategory found!')
    else:
        print(f'Failed to get subcategories: {response.status_code} - {response.text}')
        
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()


