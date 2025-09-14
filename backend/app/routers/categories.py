from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, crud
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)

# Temporarily commented out due to schema compatibility issues
# @router.get("/hierarchy", response_model=List[schemas.CategoryWithSubcategories])
# def list_categories_with_subcategories(db: Session = Depends(get_db)):
#     """Get all categories with their subcategories"""
#     return crud.get_categories_with_subcategories(db)

@router.post("/", response_model=schemas.CategoryOut)
def create_category(category: schemas.CategoryBase, db: Session = Depends(get_db)):
    return crud.create_category(db, category.name)

@router.put("/{category_id}", response_model=schemas.CategoryOut)
def update_category(category_id: int, category: schemas.CategoryBase, db: Session = Depends(get_db)):
    """Update a category"""
    updated_category = crud.update_category(db, category_id, category.name)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated_category

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    """Delete a category"""
    try:
        result = crud.delete_category(db, category_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/{category_id}/delete-with-dependencies")
def delete_category_with_dependencies(category_id: int, db: Session = Depends(get_db)):
    """Delete a category and all its subcategories and products"""
    try:
        result = crud.delete_category_with_dependencies(db, category_id)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 