from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
import datetime

class UserBase(BaseModel):
    email: EmailStr
    user_name: str
    business_name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(BaseModel):
    user_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    confirm_password: str = Field(..., min_length=6, max_length=100)
    business_name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if values.get('password') != v:
            raise ValueError('Passwords do not match')
        return v

class UserOut(UserBase):
    id: int
    created_at: datetime.datetime
    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str

class CategoryOut(CategoryBase):
    id: int
    class Config:
        from_attributes = True

# Temporarily commented out to fix OpenAPI generation
# class CategoryWithSubcategories(CategoryBase):
#     id: int
#     subcategories: List["SubcategoryOut"] = []
#     class Config:
#         orm_mode = True

class SubcategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category_id: int
    badge_type: Optional[str] = None

class SubcategoryCreate(SubcategoryBase):
    pass

class SubcategoryOut(SubcategoryBase):
    id: int
    # category: Optional[CategoryOut] = None  # Temporarily commented out
    class Config:
        from_attributes = True

# Temporarily commented out to fix OpenAPI generation
# class SubcategoryWithProducts(SubcategoryBase):
#     id: int
#     category: Optional[CategoryOut] = None
#     products: List["ProductOut"] = []
#     class Config:
#         orm_mode = True

class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    grade: Optional[str] = Field(None, max_length=100)
    moq: Optional[str] = Field(None, max_length=100)
    origin: Optional[str] = Field(None, max_length=255)
    image_url: Optional[str] = Field(None, max_length=500)
    certifications: Optional[str] = Field(None, max_length=255)
    details: Optional[str] = Field(None, max_length=2000)
    subcategory_id: int  # Required - products must belong to a subcategory
    
    # New fields for detailed specs
    specs: Optional[Dict[str, Any]] = None
    highlights: Optional[str] = Field(None, max_length=1000)
    private_label_options: Optional[str] = Field(None, max_length=1000)
    use_cases: Optional[str] = Field(None, max_length=1000)
    
    # Status field for availability control
    status: Optional[str] = Field("In Stock", max_length=50)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    grade: Optional[str] = Field(None, max_length=100)
    moq: Optional[str] = Field(None, max_length=100)
    origin: Optional[str] = Field(None, max_length=255)
    image_url: Optional[str] = Field(None, max_length=500)
    certifications: Optional[str] = Field(None, max_length=255)
    details: Optional[str] = Field(None, max_length=2000)
    subcategory_id: Optional[int] = None  # Optional for updates
    
    # New fields for detailed specs
    specs: Optional[Dict[str, Any]] = None
    highlights: Optional[str] = Field(None, max_length=1000)
    private_label_options: Optional[str] = Field(None, max_length=1000)
    use_cases: Optional[str] = Field(None, max_length=1000)

class ProductOut(ProductBase):
    id: int
    # subcategory: Optional[SubcategoryOut]  # Temporarily commented out
    class Config:
        from_attributes = True

class BlogBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    content: str = Field(..., min_length=10)
    author: Optional[str] = Field(None, max_length=255)

class BlogCreate(BlogBase):
    pass

class BlogOut(BlogBase):
    id: int
    created_at: datetime.datetime
    class Config:
        from_attributes = True

class EnquiryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    contact_number: str = Field(..., min_length=5, max_length=50)
    company_name: Optional[str] = None
    required_amount: Optional[int] = None
    any_query: Optional[str] = None
    product_id: Optional[int] = None
    product_interest: Optional[str] = None
    destination_country: Optional[str] = None

class EnquiryCreate(EnquiryBase):
    pass

class EnquiryOut(EnquiryBase):
    id: int
    status: str
    created_at: datetime.datetime
    class Config:
        from_attributes = True 

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: EmailStr

class TokenData(BaseModel):
    email: Optional[str] = None

class AuthRequest(UserCreate):
    pass 

class ActivityBase(BaseModel):
    type: str
    description: str
    user_email: str | None = None

class ActivityOut(ActivityBase):
    id: int
    created_at: datetime.datetime
    class Config:
        from_attributes = True 

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str

class OTPResponse(BaseModel):
    message: str
    email: EmailStr

class SignupResponse(BaseModel):
    message: str
    email: EmailStr 

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str
    confirm_password: str

class PasswordResetResponse(BaseModel):
    message: str
    email: EmailStr

# Admin Schemas
class AdminBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)
    role: str = Field(default="admin", pattern="^(admin|super_admin|moderator)$")
    is_active: bool = Field(default=True)
    is_super_admin: bool = Field(default=False)
    permissions: Optional[Dict[str, Any]] = None

class AdminCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=255)
    role: str = Field(default="admin", pattern="^(admin|super_admin|moderator)$")
    is_super_admin: bool = Field(default=False)
    permissions: Optional[Dict[str, Any]] = None

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if values.get('password') != v:
            raise ValueError('Passwords do not match')
        return v

class AdminUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    role: Optional[str] = Field(None, pattern="^(admin|super_admin|moderator)$")
    is_active: Optional[bool] = None
    is_super_admin: Optional[bool] = None
    permissions: Optional[Dict[str, Any]] = None

class AdminOut(AdminBase):
    id: int
    last_login: Optional[datetime.datetime] = None
    created_at: datetime.datetime
    created_by: Optional[int] = None
    class Config:
        from_attributes = True

class AdminLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8, max_length=100)

class AdminToken(BaseModel):
    access_token: str
    token_type: str
    admin_id: int
    username: str
    role: str
    permissions: Optional[Dict[str, Any]] = None

class AdminPasswordChange(BaseModel):
    current_password: str = Field(..., min_length=8, max_length=100)
    new_password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if values.get('new_password') != v:
            raise ValueError('New passwords do not match')
        return v

# Forward references for nested schemas
# Note: model_rebuild() is not needed in pydantic v1 