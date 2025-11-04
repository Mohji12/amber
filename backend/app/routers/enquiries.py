from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, crud
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.EnquiryOut])
def list_enquiries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_enquiries(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.EnquiryOut)
def create_enquiry(enquiry: schemas.EnquiryCreate, db: Session = Depends(get_db)):
    db_enquiry = crud.create_enquiry(db, enquiry)
    crud.log_activity(db, "enquiry", f"User {db_enquiry.email} submitted an enquiry.", db_enquiry.email)
    return db_enquiry

@router.delete("/{enquiry_id}")
def delete_enquiry(enquiry_id: int, db: Session = Depends(get_db)):
    crud.delete_enquiry(db, enquiry_id)
    return {"ok": True} 