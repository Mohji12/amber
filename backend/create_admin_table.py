#!/usr/bin/env python3
"""
Admin Table Creation Script
Creates the admin table and initial super admin user
"""

import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import getpass
from datetime import datetime

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import SQLALCHEMY_DATABASE_URL
from app import models, crud, schemas
from app.database import Base

def create_admin_table():
    """Create the admin table"""
    print("Creating admin table...")
    
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    try:
        # Create the admin table
        models.Admin.__table__.create(engine, checkfirst=True)
        print("✅ Admin table created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating admin table: {e}")
        return False

def create_super_admin():
    """Create the initial super admin user"""
    print("\n=== Creating Super Admin User ===")
    
    # Get admin details
    print("Enter super admin details:")
    username = input("Username: ").strip()
    if not username:
        print("❌ Username cannot be empty")
        return False
    
    email = input("Email: ").strip()
    if not email:
        print("❌ Email cannot be empty")
        return False
    
    full_name = input("Full Name: ").strip()
    if not full_name:
        print("❌ Full name cannot be empty")
        return False
    
    password = getpass.getpass("Password (min 8 characters): ")
    if len(password) < 8:
        print("❌ Password must be at least 8 characters")
        return False
    
    confirm_password = getpass.getpass("Confirm Password: ")
    if password != confirm_password:
        print("❌ Passwords do not match")
        return False
    
    try:
        # Create database session
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Check if username or email already exists
        if crud.get_admin_by_username(db, username):
            print("❌ Username already exists")
            return False
        
        if crud.get_admin_by_email(db, email):
            print("❌ Email already exists")
            return False
        
        # Create super admin
        admin_data = schemas.AdminCreate(
            username=username,
            email=email,
            password=password,
            confirm_password=confirm_password,
            full_name=full_name,
            role="super_admin",
            is_super_admin=True,
            permissions={
                "manage_users": True,
                "manage_admins": True,
                "manage_products": True,
                "manage_categories": True,
                "manage_blogs": True,
                "manage_enquiries": True,
                "view_analytics": True,
                "system_admin": True
            }
        )
        
        super_admin = crud.create_admin(db, admin_data)
        
        # Create activity log
        crud.create_activity(db, "super_admin_created", f"Super admin {username} created", email)
        
        db.close()
        
        print(f"✅ Super admin '{username}' created successfully!")
        print(f"   Email: {email}")
        print(f"   Role: super_admin")
        print(f"   Created at: {datetime.utcnow()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating super admin: {e}")
        return False

def main():
    """Main function"""
    print("=== Amber Global Admin Setup ===\n")
    
    # Create admin table
    if not create_admin_table():
        print("Failed to create admin table. Exiting.")
        sys.exit(1)
    
    # Create super admin
    print("\nWould you like to create a super admin user? (y/n): ", end="")
    create_admin = input().strip().lower()
    
    if create_admin in ['y', 'yes']:
        max_attempts = 3
        attempts = 0
        
        while attempts < max_attempts:
            if create_super_admin():
                break
            attempts += 1
            if attempts < max_attempts:
                print(f"\nTry again ({attempts}/{max_attempts}):")
            else:
                print("❌ Maximum attempts reached. You can create a super admin later using this script.")
    
    print("\n=== Setup Complete ===")
    print("\nAdmin endpoints will be available at:")
    print("  POST /admin/login - Admin login")
    print("  GET /admin/me - Get current admin info")
    print("  GET /admin/dashboard/stats - Dashboard statistics")
    print("  POST /admin/create - Create new admin (super admin only)")
    print("  GET /admin/list - List all admins (super admin only)")
    print("\nFor full API documentation, visit: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
