import requests
import json

# Test the API endpoint directly
base_url = "http://localhost:8000"

try:
    # First, get all subcategories to see current state
    print("1. Getting all subcategories...")
    response = requests.get(f"{base_url}/subcategories/")
    if response.status_code == 200:
        subcategories = response.json()
        print(f"Found {len(subcategories)} subcategories")
        
        # Find a subcategory to test with
        test_sub = None
        for sub in subcategories:
            if sub['name'] == 'Finger Millet (Ragi / Nachni)':
                test_sub = sub
                break
        
        if test_sub:
            print(f"\\n2. Testing with subcategory ID {test_sub['id']}: {test_sub['name']}")
            print(f"Current badge_type: {test_sub['badge_type']}")
            
            # Prepare update data
            update_data = {
                "name": test_sub['name'],
                "description": test_sub['description'],
                "image_url": test_sub['image_url'],
                "category_id": test_sub['category_id'],
                "badge_type": "best_seller"  # Try to update to best_seller
            }
            
            print(f"\\n3. Sending update request...")
            print(f"Update data: {json.dumps(update_data, indent=2)}")
            
            # Send PUT request
            response = requests.put(
                f"{base_url}/subcategories/{test_sub['id']}",
                json=update_data,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"\\n4. Response status: {response.status_code}")
            if response.status_code == 200:
                updated_sub = response.json()
                print(f"Updated subcategory: {json.dumps(updated_sub, indent=2)}")
                print(f"New badge_type: {updated_sub['badge_type']}")
            else:
                print(f"Error response: {response.text}")
        else:
            print("Test subcategory not found!")
    else:
        print(f"Failed to get subcategories: {response.status_code} - {response.text}")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
