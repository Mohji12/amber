from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from pydantic import BaseModel, EmailStr
from app import models, schemas, crud
from app.database import get_db
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.email_service import email_service
from app.auth import verify_password, create_access_token
from datetime import datetime, timedelta
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "ambersecret")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")



def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("user_id"))
        return user_id
    except (JWTError, Exception):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
def login(auth_req: LoginRequest, db: Session = Depends(get_db)):
    # First, check if this is an admin login attempt
    # Check by email or username (admin might use username instead of email)
    admin_user = None
    
    # Try to find admin by email
    admin_user = crud.get_admin_by_email(db, auth_req.email)
    
    # If not found by email, try by username (in case they entered username in email field)
    if not admin_user:
        try:
            admin_user = crud.get_admin_by_username(db, auth_req.email)
        except:
            pass
    
    # If admin credentials found, authenticate as admin
    if admin_user:
        if not crud.verify_password(auth_req.password, admin_user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect admin credentials")
        
        if not admin_user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin account is inactive")
        
        # Update last login
        crud.update_admin_last_login(db, admin_user.id)
        
        # Create activity log
        crud.log_activity(db, "admin_login", f"Admin {admin_user.username} logged in via user endpoint", admin_user.email)
        
        # Create admin access token (using admin-specific token creation)
        from datetime import timedelta
        SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
        ALGORITHM = os.getenv("ALGORITHM", "HS256")
        ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))  # 8 hours for admin
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.utcnow() + access_token_expires
        to_encode = {"sub": admin_user.username, "admin_id": admin_user.id, "role": admin_user.role, "exp": expire}
        access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_type": "admin",
            "admin_id": admin_user.id,
            "username": admin_user.username,
            "email": admin_user.email,
            "role": admin_user.role,
            "permissions": admin_user.permissions,
            "is_admin": True
        }
    
    # If not admin, proceed with regular user login
    user = crud.get_user_by_email(db, email=auth_req.email)
    if not user or not verify_password(auth_req.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    # Check if user is verified
    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please verify your email before logging in")
    
    access_token = create_access_token(data={"sub": user.email})
    crud.log_activity(db, "login", f"User {user.email} logged in.", user.email)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": "user",
        "user_id": user.id,
        "email": user.email,
        "is_admin": False
    }

@router.post("/signup", response_model=schemas.SignupResponse)
def signup(auth_req: schemas.AuthRequest, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, email=auth_req.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user with unverified status
    user = crud.create_user(db, auth_req)
    
    # Generate OTP
    otp_code = email_service.generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Save OTP to database
    crud.create_otp(db, auth_req.email, otp_code, expires_at)
    
    # Send OTP email
    email_sent = email_service.send_otp_email(auth_req.email, otp_code, auth_req.user_name)
    
    if not email_sent:
        # If email fails, delete the user and OTP
        db.delete(user)
        db.commit()
        raise HTTPException(status_code=500, detail="Failed to send verification email. Please try again.")
    
    crud.log_activity(db, "signup", f"User {user.email} registered and OTP sent.", user.email)
    
    return {
        "message": "Registration successful! Please check your email for verification code.",
        "email": auth_req.email
    }

@router.post("/verify-otp", response_model=schemas.Token)
def verify_otp(otp_req: schemas.OTPVerifyRequest, db: Session = Depends(get_db)):
    # Get valid OTP
    otp = crud.get_valid_otp(db, otp_req.email, otp_req.otp_code)
    
    if not otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code")
    
    # Mark OTP as used
    crud.mark_otp_as_used(db, otp.id)
    
    # Verify user email
    user = crud.verify_user_email(db, otp_req.email)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    crud.log_activity(db, "email_verified", f"User {user.email} verified email.", user.email)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_admin": getattr(user, "is_admin", False),
        "user_id": user.id,
        "email": user.email
    }

@router.post("/resend-otp", response_model=schemas.OTPResponse)
def resend_otp(otp_req: schemas.OTPRequest, db: Session = Depends(get_db)):
    # Check if user exists and is not verified
    user = crud.get_user_by_email(db, email=otp_req.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_verified:
        raise HTTPException(status_code=400, detail="User is already verified")
    
    # Generate new OTP
    otp_code = email_service.generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Save new OTP to database
    crud.create_otp(db, otp_req.email, otp_code, expires_at)
    
    # Send OTP email
    email_sent = email_service.send_otp_email(otp_req.email, otp_code, user.user_name)
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send verification email. Please try again.")
    
    crud.log_activity(db, "otp_resent", f"OTP resent to {otp_req.email}.", otp_req.email)
    
    return {
        "message": "OTP sent successfully! Please check your email.",
        "email": otp_req.email
    }

@router.get("/profile", response_model=schemas.UserOut)
def get_profile_endpoint(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    user = crud.get_profile(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/profile", response_model=schemas.UserOut)
def create_profile_endpoint(profile: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, profile.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    user = crud.create_user(db, profile)
    return user

@router.put("/profile", response_model=schemas.UserOut)
def update_profile_endpoint(profile: schemas.UserBase, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    user = crud.update_profile(db, user_id, profile.model_dump(exclude_unset=True))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user 

@router.post("/forgot-password", response_model=schemas.PasswordResetResponse)
def forgot_password(reset_req: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = crud.get_user_by_email(db, email=reset_req.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate OTP
    otp_code = email_service.generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Save OTP to database
    crud.create_otp(db, reset_req.email, otp_code, expires_at)
    
    # Send OTP email
    email_sent = email_service.send_password_reset_email(reset_req.email, otp_code, user.user_name)
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send password reset email. Please try again.")
    
    crud.log_activity(db, "password_reset_requested", f"Password reset requested for {user.email}.", user.email)
    
    return {
        "message": "Password reset OTP sent! Please check your email for verification code.",
        "email": reset_req.email
    }

@router.post("/reset-password", response_model=schemas.Token)
def reset_password(reset_req: schemas.PasswordResetVerifyRequest, db: Session = Depends(get_db)):
    # Validate passwords match
    if reset_req.new_password != reset_req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Enhanced password strength validation
    password_errors = []
    if len(reset_req.new_password) < 8:
        password_errors.append("Password must be at least 8 characters long")
    if not any(c.isupper() for c in reset_req.new_password):
        password_errors.append("Password must contain at least one uppercase letter")
    if not any(c.islower() for c in reset_req.new_password):
        password_errors.append("Password must contain at least one lowercase letter")
    if not any(c.isdigit() for c in reset_req.new_password):
        password_errors.append("Password must contain at least one number")
    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in reset_req.new_password):
        password_errors.append("Password must contain at least one special character (!@#$%^&*)")
    
    if password_errors:
        raise HTTPException(status_code=400, detail=f"Password requirements not met: {'; '.join(password_errors)}")
    
    # Get valid OTP
    otp = crud.get_valid_otp(db, reset_req.email, reset_req.otp_code)
    
    if not otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code. Please request a new one.")
    
    # Mark OTP as used
    crud.mark_otp_as_used(db, otp.id)
    
    # Update user password
    user = crud.update_user_password(db, reset_req.email, reset_req.new_password)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    crud.log_activity(db, "password_reset_completed", f"Password reset completed for {user.email}.", user.email)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_admin": getattr(user, "is_admin", False),
        "user_id": user.id,
        "email": user.email
    } 