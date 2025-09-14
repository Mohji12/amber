from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, crud
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.SubcategoryOut])
def list_subcategories(db: Session = Depends(get_db)):
    """Get all subcategories"""
    return crud.get_subcategories(db)

@router.get("/{subcategory_id}", response_model=schemas.SubcategoryOut)
def get_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    """Get a specific subcategory by ID"""
    subcategory = crud.get_subcategory(db, subcategory_id)
    if not subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return subcategory

# Temporarily commented out due to schema compatibility issues
# @router.get("/{subcategory_id}/with-products", response_model=schemas.SubcategoryWithProducts)
# def get_subcategory_with_products(subcategory_id: int, db: Session = Depends(get_db)):
#     """Get a specific subcategory with all its products"""
#     subcategory = crud.get_subcategory_with_products(db, subcategory_id)
#     if not subcategory:
#         raise HTTPException(status_code=404, detail="Subcategory not found")
#     return subcategory

@router.get("/category/{category_id}", response_model=List[schemas.SubcategoryOut])
def get_subcategories_by_category(category_id: int, db: Session = Depends(get_db)):
    """Get all subcategories for a specific category"""
    return crud.get_subcategories_by_category(db, category_id)

# Temporarily commented out due to schema compatibility issues
# @router.get("/category/{category_id}/with-products", response_model=List[schemas.SubcategoryWithProducts])
# def get_subcategories_with_products_by_category(category_id: int, db: Session = Depends(get_db)):
#     """Get all subcategories for a specific category with their products"""
#     return crud.get_subcategories_with_products_by_category(db, category_id)

@router.post("/", response_model=schemas.SubcategoryOut)
def create_subcategory(subcategory: schemas.SubcategoryCreate, db: Session = Depends(get_db)):
    """Create a new subcategory"""
    db_subcategory = crud.create_subcategory(db, subcategory)
    try:
        crud.log_activity(db, "subcategory_created", f'Subcategory "{db_subcategory.name}" added.')
    except Exception as e:
        print(f"Warning: Could not log activity: {e}")
    return db_subcategory

@router.put("/{subcategory_id}", response_model=schemas.SubcategoryOut)
def update_subcategory(subcategory_id: int, subcategory: schemas.SubcategoryCreate, db: Session = Depends(get_db)):
    """Update a subcategory"""
    updated_subcategory = crud.update_subcategory(db, subcategory_id, subcategory)
    if not updated_subcategory:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    return updated_subcategory

@router.delete("/{subcategory_id}")
def delete_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    """Delete a subcategory"""
    crud.delete_subcategory(db, subcategory_id)
    return {"ok": True} 