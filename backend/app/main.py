from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.middleware.gzip import GZipMiddleware
from dotenv import load_dotenv
import os
import json
import asyncio
from contextlib import asynccontextmanager

# Conditional import for Mangum (AWS Lambda support)
try:
    from mangum import Mangum
    MANGUM_AVAILABLE = True
except ImportError:
    MANGUM_AVAILABLE = False
from app.routers import auth, blogs, analytics, products, enquiries, categories, subcategories, admin
from app import models
from app.database import engine

# Load environment variables
load_dotenv()

# Startup optimization: Pre-load critical components
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize critical services
    print("🚀 Starting Amber Global API...")
    
    # Pre-warm database connection
    try:
        from app.database import get_db
        async for db in get_db():
            # Test connection
            await db.execute("SELECT 1")
            break
        print("✅ Database connection established")
    except Exception as e:
        print(f"⚠️ Database connection warning: {e}")
    
    yield
    
    # Shutdown: Cleanup
    print("🛑 Shutting down Amber Global API...")

app = FastAPI(
    title="Amber Global API", 
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") != "production" else None
)

# Performance middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(blogs.router, prefix="/blogs", tags=["Blogs"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(enquiries.router, prefix="/enquiries", tags=["Enquiries"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
app.include_router(subcategories.router, prefix="/subcategories", tags=["Subcategories"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "Amber Global API is running", "status": "ready"}

@app.get("/health")
async def health_check():
    """Optimized health check for faster response"""
    try:
        # Quick database ping
        from app.database import SessionLocal
        from sqlalchemy import text
        db = SessionLocal()
        try:
            db.execute(text("SELECT 1"))
            return {"status": "healthy", "service": "amber-global-api", "database": "connected"}
        finally:
            db.close()
    except Exception as e:
        return {"status": "degraded", "service": "amber-global-api", "database": "disconnected", "error": str(e)}

@app.get("/ready")
async def readiness_check():
    """Readiness probe for deployment health checks"""
    return {"status": "ready", "timestamp": asyncio.get_event_loop().time()}

@app.get("/favicon.ico")
async def favicon():
    """Serve favicon for the API"""
    # You can replace this path with your actual logo file
    logo_path = "logo.png"  # or "logo.ico", "logo.jpg", etc.
    
    # Check if logo exists, if not return a default response
    if os.path.exists(logo_path):
        return FileResponse(logo_path, media_type="image/png")
    else:
        # Return a simple text response if no logo found
        return {"message": "Favicon not found. Add a logo.png file to your backend directory."}

@app.get("/logo")
async def get_logo():
    """Serve the main logo"""
    logo_path = "logo.png"
    
    if os.path.exists(logo_path):
        return FileResponse(logo_path, media_type="image/png")
    else:
        return {"message": "Logo not found. Add a logo.png file to your backend directory."}

@app.get("/apple-touch-icon.png")
async def apple_touch_icon():
    """Serve Apple touch icon"""
    logo_path = "logo.png"
    
    if os.path.exists(logo_path):
        return FileResponse(logo_path, media_type="image/png")
    else:
        return {"message": "Apple touch icon not found. Add a logo.png file to your backend directory."}

# models.Base.metadata.create_all(bind=engine)  # Commented out for Docker startup

# Mangum handler for AWS Lambda (only if available)
if MANGUM_AVAILABLE:
    handler = Mangum(app, lifespan="off")
else:
    # Fallback for local development without Mangum
    handler = None 