from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, crud, schemas
from app.database import get_db
from app.auth import require_admin

router = APIRouter()

@router.get("/overview")
def analytics_overview(db: Session = Depends(get_db)):
    return {
        "users": db.query(models.User).count(),
        "products": db.query(models.Product).count(),
        "blogs": db.query(models.Blog).count(),
        "enquiries": db.query(models.Enquiry).count(),
    }

@router.get("/activities/recent", response_model=list[schemas.ActivityOut])
def recent_activities(db: Session = Depends(get_db)):
    return crud.get_recent_activities(db)

@router.get("/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).order_by(models.User.created_at.desc()).all() 