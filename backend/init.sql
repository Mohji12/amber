-- Database initialization script for Amber Global
-- This script runs when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS amberdata1;
USE amberdata1;

-- Root user is already created by MySQL with MYSQL_ROOT_PASSWORD
-- No need to create additional users
FLUSH PRIVILEGES;

-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_super_admin BOOLEAN DEFAULT FALSE NOT NULL,
    permissions JSON,
    last_login DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- Insert your secure super admin (password: Amberglobal@2424)
-- Password hash for 'Amberglobal@2424' using bcrypt
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
);

-- You can add any additional initial data here
-- The FastAPI application will handle other table creation through SQLAlchemy models 