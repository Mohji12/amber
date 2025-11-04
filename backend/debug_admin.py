#!/usr/bin/env python3
"""
Debug Admin User Script
This script helps debug admin authentication issues
"""

from app.database import SessionLocal
from app import models, crud
from app.auth import verify_password, get_password_hash

def debug_admin_user():
    """Debug admin user details"""
    print("🔍 Debugging admin user...")
    
    db = SessionLocal()
    try:
        # Check admin by email
        admin_by_email = crud.get_admin_by_email(db, "amberglobaltrade1@gmail.com")
        print(f"Admin by email: {admin_by_email.username if admin_by_email else 'None'}")
        
        # Check admin by username
        admin_by_username = crud.get_admin_by_username(db, "amber_admin")
        print(f"Admin by username: {admin_by_username.username if admin_by_username else 'None'}")
        
        if admin_by_username:
            print(f"Admin details:")
            print(f"  ID: {admin_by_username.id}")
            print(f"  Username: {admin_by_username.username}")
            print(f"  Email: {admin_by_username.email}")
            print(f"  Role: {admin_by_username.role}")
            print(f"  Is Active: {admin_by_username.is_active}")
            print(f"  Is Super Admin: {admin_by_username.is_super_admin}")
            print(f"  Password Hash: {admin_by_username.password_hash[:50]}...")
            
            # Test password verification
            test_password = "Amberglobal@2424"
            is_valid = verify_password(test_password, admin_by_username.password_hash)
            print(f"Password verification: {is_valid}")
            
            # Test authentication function
            auth_result = crud.authenticate_admin(db, "amber_admin", test_password)
            print(f"Authentication result: {auth_result.username if auth_result else 'None'}")
            
        else:
            print("❌ No admin user found!")
            
    except Exception as e:
        print(f"❌ Debug error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Admin User Debug")
    print("=" * 30)
    debug_admin_user()
