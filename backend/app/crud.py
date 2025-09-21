from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional
from passlib.context import CryptContext
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# User CRUD

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        user_name=user.user_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_profile(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def update_profile(db: Session, user_id: int, profile_data: dict) -> Optional[models.User]:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        for key, value in profile_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

# Category CRUD

def get_categories(db: Session) -> List[models.Category]:
    # Get all categories
    all_categories = db.query(models.Category).all()
    
    # Find Wellness & Medicinals category
    wellness_category = None
    other_categories = []
    
    for category in all_categories:
        if category.name.lower() == 'wellness & medicinals':
            wellness_category = category
        else:
            other_categories.append(category)
    
    # Return Wellness first, then all others
    if wellness_category:
        return [wellness_category] + other_categories
    else:
        return all_categories

def create_category(db: Session, name: str) -> models.Category:
    db_category = models.Category(name=name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, name: str) -> Optional[models.Category]:
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if db_category:
        db_category.name = name
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category has subcategories
    subcategories = db.query(models.Subcategory).filter(models.Subcategory.category_id == category_id).all()
    if subcategories:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete category '{db_category.name}' because it has {len(subcategories)} subcategories. Please delete all subcategories first."
        )
    
    # Check if category has products
    products = db.query(models.Product).filter(models.Product.category_id == category_id).all()
    if products:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete category '{db_category.name}' because it has {len(products)} products. Please delete all products first."
        )
    
    try:
        db.delete(db_category)
        db.commit()
        return {"message": f"Category '{db_category.name}' deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete category: {str(e)}")

# Subcategory CRUD

def get_subcategories(db: Session) -> List[models.Subcategory]:
    # Get wellness category ID (assuming it's category 7 based on the database output)
    wellness_category_id = 7
    
    # First get wellness subcategories, then others
    wellness_subcategories = db.query(models.Subcategory).filter(
        models.Subcategory.category_id == wellness_category_id
    ).all()
    
    # Get non-wellness subcategories
    other_subcategories = db.query(models.Subcategory).filter(
        models.Subcategory.category_id != wellness_category_id
    ).all()
    
    # Combine: wellness subcategories first, then others
    return wellness_subcategories + other_subcategories

def get_subcategory(db: Session, subcategory_id: int) -> Optional[models.Subcategory]:
    return db.query(models.Subcategory).filter(models.Subcategory.id == subcategory_id).first()

def get_subcategories_by_category(db: Session, category_id: int) -> List[models.Subcategory]:
    return db.query(models.Subcategory).filter(models.Subcategory.category_id == category_id).all()

def create_subcategory(db: Session, subcategory: schemas.SubcategoryCreate) -> models.Subcategory:
    db_subcategory = models.Subcategory(**subcategory.model_dump())
    db.add(db_subcategory)
    db.commit()
    db.refresh(db_subcategory)
    return db_subcategory

def update_subcategory(db: Session, subcategory_id: int, subcategory: schemas.SubcategoryCreate) -> Optional[models.Subcategory]:
    db_subcategory = db.query(models.Subcategory).filter(models.Subcategory.id == subcategory_id).first()
    if db_subcategory:
        for key, value in subcategory.model_dump().items():
            setattr(db_subcategory, key, value)
        db.commit()
        db.refresh(db_subcategory)
    return db_subcategory

def delete_subcategory(db: Session, subcategory_id: int):
    db_subcategory = db.query(models.Subcategory).filter(models.Subcategory.id == subcategory_id).first()
    if db_subcategory:
        db.delete(db_subcategory)
        db.commit()

# Hierarchical CRUD functions

def get_categories_with_subcategories(db: Session) -> List[models.Category]:
    """Get all categories with their subcategories loaded"""
    from sqlalchemy.orm import joinedload
    return db.query(models.Category).options(
        joinedload(models.Category.subcategories)
    ).all()

def get_subcategory_with_products(db: Session, subcategory_id: int) -> Optional[models.Subcategory]:
    """Get a subcategory with all its products loaded"""
    from sqlalchemy.orm import joinedload
    return db.query(models.Subcategory).options(
        joinedload(models.Subcategory.products)
    ).filter(models.Subcategory.id == subcategory_id).first()

def get_subcategories_with_products_by_category(db: Session, category_id: int) -> List[models.Subcategory]:
    """Get all subcategories for a category with their products loaded"""
    from sqlalchemy.orm import joinedload
    return db.query(models.Subcategory).options(
        joinedload(models.Subcategory.products)
    ).filter(models.Subcategory.category_id == category_id).all()

# Product CRUD

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.Product]:
    # Get wellness category ID (assuming it's category 7 based on the database output)
    wellness_category_id = 7
    
    # First get wellness products (products from wellness subcategories)
    wellness_subcategories = db.query(models.Subcategory).filter(models.Subcategory.category_id == wellness_category_id).all()
    wellness_subcategory_ids = [sub.id for sub in wellness_subcategories]
    
    # Get wellness products first, then other products
    wellness_products = db.query(models.Product).filter(
        models.Product.subcategory_id.in_(wellness_subcategory_ids)
    ).all()
    
    # Get non-wellness products
    other_products = db.query(models.Product).filter(
        ~models.Product.subcategory_id.in_(wellness_subcategory_ids)
    ).all()
    
    # Combine: wellness products first, then others
    all_products = wellness_products + other_products
    
    # Apply pagination
    return all_products[skip:skip + limit]

def get_product(db: Session, product_id: int) -> Optional[models.Product]:
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products_by_subcategory(db: Session, subcategory_id: int) -> List[models.Product]:
    return db.query(models.Product).filter(models.Product.subcategory_id == subcategory_id).all()

def get_products_by_category(db: Session, category_id: int) -> List[models.Product]:
    """Get all products for a category by getting products from all its subcategories"""
    subcategories = get_subcategories_by_category(db, category_id)
    products = []
    for subcategory in subcategories:
        subcategory_products = get_products_by_subcategory(db, subcategory.id)
        products.extend(subcategory_products)
    return products

def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_update: schemas.ProductCreate) -> Optional[models.Product]:
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        for key, value in product_update.model_dump().items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def get_featured_products(db: Session, limit: int = 4):
    """
    Returns a small, curated list of featured products.
    (For now, just the latest products, but you can add custom logic here.)
    """
    return db.query(models.Product).order_by(models.Product.id.desc()).limit(limit).all()

def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()

# Blog CRUD

def get_blogs(db: Session, skip: int = 0, limit: int = 100) -> List[models.Blog]:
    return db.query(models.Blog).offset(skip).limit(limit).all()

def get_blog(db: Session, blog_id: int) -> Optional[models.Blog]:
    return db.query(models.Blog).filter(models.Blog.id == blog_id).first()

def create_blog(db: Session, blog: schemas.BlogCreate) -> models.Blog:
    db_blog = models.Blog(**blog.model_dump())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

def update_blog(db: Session, blog_id: int, blog_update: schemas.BlogCreate) -> Optional[models.Blog]:
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()
    if db_blog:
        for key, value in blog_update.model_dump().items():
            setattr(db_blog, key, value)
        db.commit()
        db.refresh(db_blog)
    return db_blog

def delete_blog(db: Session, blog_id: int):
    db_blog = get_blog(db, blog_id)
    if db_blog:
        db.delete(db_blog)
        db.commit()

# Enquiry CRUD

def get_enquiries(db: Session, skip: int = 0, limit: int = 100) -> List[models.Enquiry]:
    return db.query(models.Enquiry).offset(skip).limit(limit).all()

def create_enquiry(db: Session, enquiry: schemas.EnquiryCreate) -> models.Enquiry:
    db_enquiry = models.Enquiry(**enquiry.model_dump())
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)
    return db_enquiry

def delete_enquiry(db: Session, enquiry_id: int):
    db_enquiry = db.query(models.Enquiry).filter(models.Enquiry.id == enquiry_id).first()
    if db_enquiry:
        db.delete(db_enquiry)
        db.commit()

def log_activity(db: Session, type: str, description: str, user_email: str = None):
    from .models import Activity
    activity = Activity(type=type, description=description, user_email=user_email)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

# Alias for backward compatibility
def create_activity(db: Session, activity_type: str, description: str, user_email: str = None):
    """Alias for log_activity function"""
    return log_activity(db, activity_type, description, user_email)

def get_recent_activities(db: Session, limit: int = 20):
    from .models import Activity
    return db.query(Activity).order_by(Activity.created_at.desc()).limit(limit).all() 

# OTP CRUD

def create_otp(db: Session, email: str, otp_code: str, expires_at) -> models.OTP:
    """Create a new OTP record"""
    db_otp = models.OTP(
        email=email,
        otp_code=otp_code,
        expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def get_valid_otp(db: Session, email: str, otp_code: str) -> Optional[models.OTP]:
    """Get a valid OTP that hasn't expired and hasn't been used"""
    from datetime import datetime
    return db.query(models.OTP).filter(
        models.OTP.email == email,
        models.OTP.otp_code == otp_code,
        models.OTP.expires_at > datetime.utcnow(),
        models.OTP.is_used == False
    ).first()

def mark_otp_as_used(db: Session, otp_id: int):
    """Mark an OTP as used"""
    db_otp = db.query(models.OTP).filter(models.OTP.id == otp_id).first()
    if db_otp:
        db_otp.is_used = True
        db.commit()

def cleanup_expired_otps(db: Session):
    """Clean up expired OTPs"""
    from datetime import datetime
    expired_otps = db.query(models.OTP).filter(
        models.OTP.expires_at <= datetime.utcnow()
    ).all()
    for otp in expired_otps:
        db.delete(otp)
    db.commit()

def verify_user_email(db: Session, email: str):
    """Mark user as verified"""
    user = get_user_by_email(db, email)
    if user:
        user.is_verified = True
        db.commit()
        db.refresh(user)
    return user 

def update_user_password(db: Session, email: str, new_password: str) -> Optional[models.User]:
    """Update user password"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        from .auth import get_password_hash
        user.password_hash = get_password_hash(new_password)
        db.commit()
        db.refresh(user)
    return user

# Admin CRUD Operations

def get_admin_by_username(db: Session, username: str) -> Optional[models.Admin]:
    return db.query(models.Admin).filter(models.Admin.username == username).first()

def get_admin_by_email(db: Session, email: str) -> Optional[models.Admin]:
    return db.query(models.Admin).filter(models.Admin.email == email).first()

def get_admin_by_id(db: Session, admin_id: int) -> Optional[models.Admin]:
    return db.query(models.Admin).filter(models.Admin.id == admin_id).first()

def create_admin(db: Session, admin: schemas.AdminCreate, created_by: int = None) -> models.Admin:
    hashed_password = get_password_hash(admin.password)
    db_admin = models.Admin(
        username=admin.username,
        email=admin.email,
        password_hash=hashed_password,
        full_name=admin.full_name,
        role=admin.role,
        is_super_admin=admin.is_super_admin,
        permissions=admin.permissions,
        created_by=created_by
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def get_admins(db: Session, skip: int = 0, limit: int = 100) -> List[models.Admin]:
    return db.query(models.Admin).offset(skip).limit(limit).all()

def update_admin(db: Session, admin_id: int, admin_update: schemas.AdminUpdate) -> Optional[models.Admin]:
    db_admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if db_admin:
        update_data = admin_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_admin, field, value)
        db.commit()
        db.refresh(db_admin)
    return db_admin

def delete_admin(db: Session, admin_id: int) -> bool:
    db_admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if db_admin:
        db.delete(db_admin)
        db.commit()
        return True
    return False

def authenticate_admin(db: Session, username: str, password: str) -> Optional[models.Admin]:
    admin = get_admin_by_username(db, username)
    if not admin:
        return None
    if not verify_password(password, admin.password_hash):
        return None
    if not admin.is_active:
        return None
    return admin

def update_admin_last_login(db: Session, admin_id: int):
    import datetime
    db_admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if db_admin:
        db_admin.last_login = datetime.datetime.utcnow()
        db.commit()
        db.refresh(db_admin)
    return db_admin

def change_admin_password(db: Session, admin_id: int, new_password: str) -> bool:
    db_admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if db_admin:
        db_admin.password_hash = get_password_hash(new_password)
        db.commit()
        return True
    return False

def check_admin_permissions(admin: models.Admin, required_permission: str) -> bool:
    """Check if admin has required permission"""
    if admin.is_super_admin:
        return True
    
    if not admin.permissions:
        return False
    
    return admin.permissions.get(required_permission, False)

def get_admin_dashboard_stats(db: Session) -> dict:
    """Get dashboard statistics for admin"""
    total_users = db.query(models.User).count()
    total_products = db.query(models.Product).count()
    total_enquiries = db.query(models.Enquiry).count()
    total_blogs = db.query(models.Blog).count()
    total_categories = db.query(models.Category).count()
    
    # Recent activities
    recent_activities = db.query(models.Activity).order_by(models.Activity.created_at.desc()).limit(10).all()
    
    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_enquiries": total_enquiries,
        "total_blogs": total_blogs,
        "total_categories": total_categories,
        "recent_activities": recent_activities
    }

def delete_category_with_dependencies(db: Session, category_id: int):
    """Delete a category and all its subcategories and products"""
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    try:
        # Get all subcategories in this category
        subcategories = db.query(models.Subcategory).filter(models.Subcategory.category_id == category_id).all()
        
        # Delete all products in subcategories
        total_products_deleted = 0
        for subcategory in subcategories:
            products = db.query(models.Product).filter(models.Product.subcategory_id == subcategory.id).all()
            for product in products:
                db.delete(product)
                total_products_deleted += 1
        
        # Delete all subcategories
        for subcategory in subcategories:
            db.delete(subcategory)
        
        # Delete the category
        db.delete(db_category)
        db.commit()
        
        return {
            "message": f"Category '{db_category.name}' and all its dependencies deleted successfully",
            "deleted_subcategories": len(subcategories),
            "deleted_products": total_products_deleted
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete category with dependencies: {str(e)}") 