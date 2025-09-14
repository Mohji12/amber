from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    user_name = Column(String(100), nullable=False)
    business_name = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_verified = Column(Boolean, default=False)  # Add verification status

class OTP(Base):
    __tablename__ = "otps"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    otp_code = Column(String(6), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    subcategories = relationship("Subcategory", back_populates="category")

class Subcategory(Base):
    __tablename__ = "subcategories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(1000), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    badge_type = Column(String(20), nullable=True)  # 'best_seller', 'premium', 'most_favorite', or None
    category = relationship("Category", back_populates="subcategories")
    products = relationship("Product", back_populates="subcategory")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    grade = Column(String(100))
    moq = Column(String(100))
    origin = Column(String(255))
    image_url = Column(String(1000), nullable=True)  # <-- Use image_url to match DB
    certifications = Column(String(255))  # comma-separated
    details = Column(Text)
    additional_info = Column(Text)
    created_at = Column(DateTime)
    
    # New fields for detailed specs
    specs = Column(JSON, nullable=True)  # Store specs as JSON
    highlights = Column(Text, nullable=True)
    private_label_options = Column(Text, nullable=True)
    use_cases = Column(Text, nullable=True)
    
    # Status field for availability control
    status = Column(String(50), default="In Stock")  # In Stock, Out of Stock, Available Soon, Discontinued
    
    # Featured product flag
    is_featured = Column(Boolean, default=False)
    
    # Foreign key relationships
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), nullable=False)
    subcategory = relationship("Subcategory", back_populates="products")

class Blog(Base):
    __tablename__ = "blogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    author = Column(String(100))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Enquiry(Base):
    __tablename__ = "enquiries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    product_id = Column(Integer)
    name = Column(String(100))
    email = Column(String(255))
    contact_number = Column(String(50))
    company_name = Column(String(255))
    required_amount = Column(Integer)
    any_query = Column(Text)
    product_interest = Column(String(255))
    destination_country = Column(String(100))
    status = Column(String(50), default="open")
    created_at = Column(DateTime, default=datetime.datetime.utcnow) 

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False)  # e.g., 'login', 'signup', 'product_created', etc.
    description = Column(Text, nullable=False)
    user_email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="admin", nullable=False)  # admin, super_admin, moderator
    is_active = Column(Boolean, default=True, nullable=False)
    is_super_admin = Column(Boolean, default=False, nullable=False)
    permissions = Column(JSON, nullable=True)  # Store specific permissions as JSON
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_by = Column(Integer, ForeignKey("admins.id"), nullable=True)  # Who created this admin
    
    # Relationships
    creator = relationship("Admin", remote_side=[id], backref="created_admins") 