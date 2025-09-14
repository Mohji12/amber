import os
import sys
sys.path.append('.')
from app.database import SQLALCHEMY_DATABASE_URL
from app import models, schemas, crud
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import json

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # Get a subcategory to test with
    subcategory = db.query(models.Subcategory).first()
    if not subcategory:
        print("No subcategories found!")
        exit()
    
    print(f"Testing with subcategory: ID={subcategory.id}, Name={subcategory.name}")
    print(f"Current badge_type: {subcategory.badge_type}")
    
    # Create update data
    update_data = {
        "name": subcategory.name,
        "description": subcategory.description,
        "image_url": subcategory.image_url,
        "category_id": subcategory.category_id,
        "badge_type": "most_favorite"  # Try to update to most_favorite
    }
    
    print(f"\\nUpdate data: {json.dumps(update_data, indent=2)}")
    
    # Create schema object
    subcategory_schema = schemas.SubcategoryCreate(**update_data)
    print(f"\\nSchema object: {subcategory_schema}")
    print(f"Schema model_dump: {subcategory_schema.model_dump()}")
    
    # Test CRUD update
    print("\\nTesting CRUD update...")
    updated_subcategory = crud.update_subcategory(db, subcategory.id, subcategory_schema)
    
    if updated_subcategory:
        print(f"Update successful!")
        print(f"Updated badge_type: {updated_subcategory.badge_type}")
        
        # Verify in database
        db.refresh(updated_subcategory)
        print(f"Database badge_type: {updated_subcategory.badge_type}")
    else:
        print("Update failed - subcategory not found")
        
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
finally:
    db.close()
