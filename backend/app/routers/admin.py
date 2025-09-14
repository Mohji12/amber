from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

from app import crud, models, schemas
from app.database import get_db

router = APIRouter()
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))  # 8 hours for admin

def create_admin_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        admin_id: int = payload.get("admin_id")
        role: str = payload.get("role")
        if username is None or admin_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {"username": username, "admin_id": admin_id, "role": role}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_admin(token_data: dict = Depends(verify_admin_token), db: Session = Depends(get_db)):
    admin = crud.get_admin_by_id(db, admin_id=token_data["admin_id"])
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found"
        )
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is inactive"
        )
    return admin

def require_super_admin(current_admin: models.Admin = Depends(get_current_admin)):
    if not current_admin.is_super_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    return current_admin

def require_permission(permission: str):
    def permission_checker(current_admin: models.Admin = Depends(get_current_admin)):
        if not crud.check_admin_permissions(current_admin, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission}' required"
            )
        return current_admin
    return permission_checker

# Authentication endpoints
@router.post("/login", response_model=schemas.AdminToken)
async def admin_login(admin_credentials: schemas.AdminLogin, db: Session = Depends(get_db)):
    """Admin login endpoint"""
    # Try to find admin by email first
    admin = crud.get_admin_by_email(db, admin_credentials.email)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not crud.verify_password(admin_credentials.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Update last login
    crud.update_admin_last_login(db, admin.id)
    
    # Create activity log
    crud.create_activity(db, "admin_login", f"Admin {admin.username} logged in", admin.email)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_admin_access_token(
        data={"sub": admin.username, "admin_id": admin.id, "role": admin.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin_id": admin.id,
        "username": admin.username,
        "role": admin.role,
        "permissions": admin.permissions
    }

@router.get("/me", response_model=schemas.AdminOut)
async def get_current_admin_info(current_admin: models.Admin = Depends(get_current_admin)):
    """Get current admin information"""
    return current_admin

@router.post("/change-password")
async def change_admin_password(
    password_data: schemas.AdminPasswordChange,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Change admin password"""
    # Verify current password
    if not crud.verify_password(password_data.current_password, current_admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    success = crud.change_admin_password(db, current_admin.id, password_data.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update password"
        )
    
    # Create activity log
    crud.create_activity(db, "admin_password_change", f"Admin {current_admin.username} changed password", current_admin.email)
    
    return {"message": "Password updated successfully"}

# Admin management endpoints (Super Admin only)
@router.post("/create", response_model=schemas.AdminOut)
async def create_new_admin(
    admin_data: schemas.AdminCreate,
    current_admin: models.Admin = Depends(require_super_admin),
    db: Session = Depends(get_db)
):
    """Create a new admin (Super Admin only)"""
    # Check if username or email already exists
    if crud.get_admin_by_username(db, admin_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    if crud.get_admin_by_email(db, admin_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create admin
    new_admin = crud.create_admin(db, admin_data, created_by=current_admin.id)
    
    # Create activity log
    crud.create_activity(
        db, 
        "admin_created", 
        f"Admin {new_admin.username} created by {current_admin.username}", 
        current_admin.email
    )
    
    return new_admin

@router.get("/list", response_model=List[schemas.AdminOut])
async def list_admins(
    skip: int = 0,
    limit: int = 100,
    current_admin: models.Admin = Depends(require_super_admin),
    db: Session = Depends(get_db)
):
    """List all admins (Super Admin only)"""
    admins = crud.get_admins(db, skip=skip, limit=limit)
    return admins

@router.get("/{admin_id}", response_model=schemas.AdminOut)
async def get_admin(
    admin_id: int,
    current_admin: models.Admin = Depends(require_super_admin),
    db: Session = Depends(get_db)
):
    """Get admin by ID (Super Admin only)"""
    admin = crud.get_admin_by_id(db, admin_id)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    return admin

@router.put("/{admin_id}", response_model=schemas.AdminOut)
async def update_admin(
    admin_id: int,
    admin_update: schemas.AdminUpdate,
    current_admin: models.Admin = Depends(require_super_admin),
    db: Session = Depends(get_db)
):
    """Update admin (Super Admin only)"""
    admin = crud.get_admin_by_id(db, admin_id)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    
    # Prevent super admin from removing their own super admin status
    if admin.id == current_admin.id and admin_update.is_super_admin is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove super admin status from yourself"
        )
    
    updated_admin = crud.update_admin(db, admin_id, admin_update)
    
    # Create activity log
    crud.create_activity(
        db, 
        "admin_updated", 
        f"Admin {admin.username} updated by {current_admin.username}", 
        current_admin.email
    )
    
    return updated_admin

@router.delete("/{admin_id}")
async def delete_admin(
    admin_id: int,
    current_admin: models.Admin = Depends(require_super_admin),
    db: Session = Depends(get_db)
):
    """Delete admin (Super Admin only)"""
    admin = crud.get_admin_by_id(db, admin_id)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    
    # Prevent super admin from deleting themselves
    if admin.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
    
    success = crud.delete_admin(db, admin_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete admin"
        )
    
    # Create activity log
    crud.create_activity(
        db, 
        "admin_deleted", 
        f"Admin {admin.username} deleted by {current_admin.username}", 
        current_admin.email
    )
    
    return {"message": f"Admin {admin.username} deleted successfully"}

# Dashboard and management endpoints
@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    stats = crud.get_admin_dashboard_stats(db)
    return stats

# User management endpoints
@router.get("/users/list", response_model=List[schemas.UserOut])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_admin: models.Admin = Depends(require_permission("manage_users")),
    db: Session = Depends(get_db)
):
    """List all users"""
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    is_verified: bool,
    current_admin: models.Admin = Depends(require_permission("manage_users")),
    db: Session = Depends(get_db)
):
    """Update user verification status"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_verified = is_verified
    db.commit()
    
    # Create activity log
    crud.create_activity(
        db, 
        "user_status_updated", 
        f"User {user.email} verification status updated to {is_verified} by {current_admin.username}", 
        current_admin.email
    )
    
    return {"message": f"User status updated successfully"}

# Enquiry management endpoints
@router.get("/enquiries/list", response_model=List[schemas.EnquiryOut])
async def list_enquiries(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    current_admin: models.Admin = Depends(require_permission("manage_enquiries")),
    db: Session = Depends(get_db)
):
    """List all enquiries with optional status filter"""
    query = db.query(models.Enquiry)
    if status_filter:
        query = query.filter(models.Enquiry.status == status_filter)
    
    enquiries = query.offset(skip).limit(limit).all()
    return enquiries

@router.put("/enquiries/{enquiry_id}/status")
async def update_enquiry_status(
    enquiry_id: int,
    new_status: str,
    current_admin: models.Admin = Depends(require_permission("manage_enquiries")),
    db: Session = Depends(get_db)
):
    """Update enquiry status"""
    enquiry = db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found"
        )
    
    old_status = enquiry.status
    enquiry.status = new_status
    db.commit()
    
    # Create activity log
    crud.create_activity(
        db, 
        "enquiry_status_updated", 
        f"Enquiry {enquiry_id} status updated from {old_status} to {new_status} by {current_admin.username}", 
        current_admin.email
    )
    
    return {"message": f"Enquiry status updated successfully"}

# Activity logs endpoint
@router.get("/activities/recent")
async def get_recent_activities(
    limit: int = 50,
    current_admin: models.Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get recent activities"""
    activities = crud.get_recent_activities(db, limit=limit)
    return activities
