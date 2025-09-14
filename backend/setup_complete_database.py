#!/usr/bin/env python3
"""
Complete Database Setup Script for Amber Global Backend
This script creates all missing tables and sets up the proper structure.
"""

import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.database import SQLALCHEMY_DATABASE_URL

def setup_complete_database():
    """Create all missing tables and setup database structure"""
    print("🔄 Starting complete database setup...")
    
    # Create engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Create database if it doesn't exist
            connection.execute(text("CREATE DATABASE IF NOT EXISTS amberdata1"))
            connection.execute(text("USE amberdata1"))
            
            # Create all tables
            create_tables_queries = [
                # Users table
                """CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    user_name VARCHAR(100) NOT NULL,
                    business_name VARCHAR(255) NULL,
                    address TEXT NULL,
                    phone VARCHAR(50) NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_verified BOOLEAN DEFAULT FALSE,
                    INDEX idx_email (email),
                    INDEX idx_created_at (created_at)
                )""",
                
                # OTP table
                """CREATE TABLE IF NOT EXISTS otps (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) NOT NULL,
                    otp_code VARCHAR(6) NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    expires_at DATETIME NOT NULL,
                    is_used BOOLEAN DEFAULT FALSE,
                    INDEX idx_email (email),
                    INDEX idx_expires_at (expires_at),
                    INDEX idx_created_at (created_at)
                )""",
                
                # Categories table
                """CREATE TABLE IF NOT EXISTS categories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL UNIQUE,
                    description TEXT NULL,
                    image_url VARCHAR(1000) NULL,
                    INDEX idx_name (name)
                )""",
                
                # Subcategories table
                """CREATE TABLE IF NOT EXISTS subcategories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    description TEXT NULL,
                    image_url VARCHAR(1000) NULL,
                    category_id INT NOT NULL,
                    INDEX idx_category_id (category_id),
                    INDEX idx_name (name),
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
                )""",
                
                # Products table
                """CREATE TABLE IF NOT EXISTS products (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    grade VARCHAR(100) NULL,
                    moq VARCHAR(100) NULL,
                    origin VARCHAR(255) NULL,
                    image_url VARCHAR(1000) NULL,
                    certifications VARCHAR(255) NULL,
                    details TEXT NULL,
                    additional_info TEXT NULL,
                    created_at DATETIME NULL,
                    specs JSON NULL,
                    highlights TEXT NULL,
                    private_label_options TEXT NULL,
                    use_cases TEXT NULL,
                    subcategory_id INT NOT NULL,
                    INDEX idx_subcategory_id (subcategory_id),
                    INDEX idx_name (name),
                    INDEX idx_created_at (created_at),
                    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
                )""",
                
                # Blogs table
                """CREATE TABLE IF NOT EXISTS blogs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    author VARCHAR(100) NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_title (title),
                    INDEX idx_created_at (created_at)
                )""",
                
                # Enquiries table
                """CREATE TABLE IF NOT EXISTS enquiries (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NULL,
                    product_id INT NULL,
                    name VARCHAR(100) NULL,
                    email VARCHAR(255) NULL,
                    contact_number VARCHAR(50) NULL,
                    company_name VARCHAR(255) NULL,
                    required_amount INT NULL,
                    any_query TEXT NULL,
                    product_interest VARCHAR(255) NULL,
                    destination_country VARCHAR(100) NULL,
                    status VARCHAR(50) DEFAULT 'open',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_user_id (user_id),
                    INDEX idx_product_id (product_id),
                    INDEX idx_email (email),
                    INDEX idx_status (status),
                    INDEX idx_created_at (created_at)
                )""",
                
                # Activities table
                """CREATE TABLE IF NOT EXISTS activities (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    type VARCHAR(50) NOT NULL,
                    description TEXT NOT NULL,
                    user_email VARCHAR(255) NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_type (type),
                    INDEX idx_user_email (user_email),
                    INDEX idx_created_at (created_at)
                )""",
                
                # Admins table
                """CREATE TABLE IF NOT EXISTS admins (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(100) NOT NULL UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(255) NOT NULL,
                    role VARCHAR(50) DEFAULT 'admin' NOT NULL,
                    is_active BOOLEAN DEFAULT TRUE NOT NULL,
                    is_super_admin BOOLEAN DEFAULT FALSE NOT NULL,
                    permissions JSON NULL,
                    last_login DATETIME NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    created_by INT NULL,
                    INDEX idx_username (username),
                    INDEX idx_email (email),
                    INDEX idx_role (role),
                    INDEX idx_is_active (is_active),
                    INDEX idx_created_at (created_at),
                    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
                )"""
            ]
            
            # Execute all table creation queries
            for i, query in enumerate(create_tables_queries, 1):
                try:
                    print(f"  Creating table {i}/{len(create_tables_queries)}...")
                    connection.execute(text(query))
                    print(f"  ✅ Table {i} created successfully")
                except Exception as e:
                    print(f"  ⚠️ Table {i} creation failed (might already exist): {str(e)[:80]}")
            
            # Insert default super admin if not exists
            admin_insert_query = """
            INSERT IGNORE INTO admins (
                username, 
                email, 
                password_hash, 
                full_name, 
                role, 
                is_super_admin, 
                permissions,
                created_at
            ) VALUES (
                'amber_admin',
                'amberglobaltrade1@gmail.com',
                '$2b$12$IPZdVCOPR3l08UIsHVl2c.1WL/Fv1IMWrYpluWMoKNI3JvWaBtdNi',
                'Amber Global Super Administrator',
                'super_admin',
                TRUE,
                '{"manage_users": true, "manage_admins": true, "manage_products": true, "manage_categories": true, "manage_blogs": true, "manage_enquiries": true, "view_analytics": true, "system_admin": true}',
                NOW()
            )
            """
            
            try:
                connection.execute(text(admin_insert_query))
                print("  ✅ Default admin user created/verified")
            except Exception as e:
                print(f"  ⚠️ Admin creation failed: {str(e)[:80]}")
            
            # Insert sample categories if they don't exist
            sample_categories = [
                ("Spices", "Premium spices from India", "/images/spices.jpg"),
                ("Rice", "High-quality rice varieties", "/images/rice.jpg"),
                ("Pulses", "Nutritious pulse varieties", "/images/pulses.jpg"),
                ("Dry Fruits", "Premium dried fruits and nuts", "/images/dry-fruits.jpg")
            ]
            
            for name, description, image_url in sample_categories:
                try:
                    connection.execute(text("""
                        INSERT IGNORE INTO categories (name, description, image_url) 
                        VALUES (:name, :description, :image_url)
                    """), {"name": name, "description": description, "image_url": image_url})
                except Exception as e:
                    print(f"  ⚠️ Category '{name}' creation failed: {str(e)[:80]}")
            
            print("  ✅ Sample categories created/verified")
            
            connection.commit()
            print("✅ Complete database setup finished successfully!")
            
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    setup_complete_database()

