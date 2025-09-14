from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, crud
from app.database import get_db
from app.auth import require_admin

router = APIRouter()

@router.get("/", response_model=List[schemas.BlogOut])
def list_blogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_blogs(db, skip=skip, limit=limit)

@router.get("/{blog_id}", response_model=schemas.BlogOut)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = crud.get_blog(db, blog_id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.post("/", response_model=schemas.BlogOut)
def create_blog(blog: schemas.BlogCreate, db: Session = Depends(get_db)):
    db_blog = crud.create_blog(db, blog)
    crud.log_activity(db, "blog_created", f'Blog "{db_blog.title}" added.')
    return db_blog

@router.put("/{blog_id}", response_model=schemas.BlogOut)
def update_blog_endpoint(blog_id: int, blog: schemas.BlogCreate, db: Session = Depends(get_db)):
    updated_blog = crud.update_blog(db, blog_id, blog)
    if not updated_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return updated_blog

@router.delete("/{blog_id}")
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    crud.delete_blog(db, blog_id)
    return {"ok": True} 