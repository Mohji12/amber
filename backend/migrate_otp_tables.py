from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+mysqlconnector://admin:Amberglobaltrade2424@amber-database.cbeyuko6yxme.ap-south-1.rds.amazonaws.com:3306/amberdata1")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the OTP model
class OTP(Base):
    __tablename__ = "otps"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    otp_code = Column(String(6), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

def migrate_database():
    """Add OTP table and update User table"""
    try:
        # Create OTP table
        OTP.__table__.create(engine, checkfirst=True)
        print("✅ OTP table created successfully")
        
        # Add is_verified column to users table if it doesn't exist
        with engine.connect() as conn:
            # Check if is_verified column exists
            result = conn.execute(text("SHOW COLUMNS FROM users LIKE 'is_verified'"))
            if not result.fetchone():
                conn.execute(text("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE"))
                print("✅ Added is_verified column to users table")
            else:
                print("ℹ️ is_verified column already exists in users table")
        
        print("🎉 Database migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
        raise

if __name__ == "__main__":
    migrate_database() 