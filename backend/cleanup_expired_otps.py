from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime
from app.models import OTP

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+mysqlconnector://admin:Amberglobaltrade2424@amber-database.cbeyuko6yxme.ap-south-1.rds.amazonaws.com:3306/amberdata1")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def cleanup_expired_otps():
    """Clean up expired OTPs from the database"""
    db = SessionLocal()
    try:
        # Find expired OTPs
        expired_otps = db.query(OTP).filter(
            OTP.expires_at <= datetime.utcnow()
        ).all()
        
        if expired_otps:
            # Delete expired OTPs
            for otp in expired_otps:
                db.delete(otp)
            db.commit()
            print(f"🧹 Cleaned up {len(expired_otps)} expired OTPs")
        else:
            print("ℹ️ No expired OTPs found")
            
    except Exception as e:
        print(f"❌ Error during cleanup: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    cleanup_expired_otps() 