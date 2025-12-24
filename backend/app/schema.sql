-- SQL Schema for Amber Application
-- Generated from models.py
-- Database: MySQL

-- Table: users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    business_name VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_verified TINYINT(1) DEFAULT 0,
    INDEX idx_users_email (email)
);

-- Table: otps
CREATE TABLE otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used TINYINT(1) DEFAULT 0,
    INDEX idx_otps_email (email)
);

-- Table: categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Table: subcategories
CREATE TABLE subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(1000),
    category_id INT,
    badge_type VARCHAR(20),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table: products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grade VARCHAR(100),
    moq VARCHAR(100),
    origin VARCHAR(255),
    image_url VARCHAR(1000),
    certifications VARCHAR(255),
    details TEXT,
    additional_info TEXT,
    created_at DATETIME,
    specs JSON,
    highlights TEXT,
    private_label_options TEXT,
    use_cases TEXT,
    status VARCHAR(50) DEFAULT 'In Stock',
    is_featured TINYINT(1) DEFAULT 0,
    category_id INT,
    subcategory_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE RESTRICT
);

-- Table: blogs
CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    name VARCHAR(100),
    email VARCHAR(255),
    contact_number VARCHAR(50),
    company_name VARCHAR(255),
    required_amount INT,
    any_query TEXT,
    product_interest VARCHAR(255),
    destination_country VARCHAR(100),
    about_you VARCHAR(50),
    status VARCHAR(50) DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: activities
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    user_email VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: admins
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' NOT NULL,
    is_active TINYINT(1) DEFAULT 1 NOT NULL,
    is_super_admin TINYINT(1) DEFAULT 0 NOT NULL,
    permissions JSON,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_admins_username (username),
    INDEX idx_admins_email (email)
);

