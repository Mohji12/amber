from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, crud
from app.database import get_db
from app.auth import require_admin

router = APIRouter()

@router.get("/", response_model=List[schemas.ProductOut])
def list_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_products(db, skip=skip, limit=limit)

@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/subcategory/{subcategory_id}", response_model=List[schemas.ProductOut])
def get_products_by_subcategory(subcategory_id: int, db: Session = Depends(get_db)):
    """Get all products for a specific subcategory"""
    products = crud.get_products_by_subcategory(db, subcategory_id)
    return products  # Return empty list if no products found

@router.get("/category/{category_id}", response_model=List[schemas.ProductOut])
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    """Get all products for a specific category"""
    products = crud.get_products_by_category(db, category_id)
    if not products:
        raise HTTPException(status_code=404, detail="No products found for this category")
    return products

@router.get("/featured/", response_model=List[schemas.ProductOut])
def list_featured_products(db: Session = Depends(get_db)):
    return crud.get_featured_products(db, limit=4)

@router.post("/", response_model=schemas.ProductOut)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = crud.create_product(db, product)
    try:
        crud.log_activity(db, "product_created", f'Product "{db_product.name}" added.')
    except Exception as e:
        print(f"Warning: Could not log activity: {e}")
    return db_product

@router.put("/{product_id}", response_model=schemas.ProductOut)
def update_product_endpoint(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    updated_product = crud.update_product(db, product_id, product)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    crud.delete_product(db, product_id)
    return {"ok": True} 