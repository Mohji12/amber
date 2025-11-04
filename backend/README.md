# Amber Global Backend API

A FastAPI-based backend for Amber Global's export business, featuring a hierarchical product structure with categories, subcategories, and detailed product specifications.

## 🏗️ Architecture

- **Framework**: FastAPI with SQLAlchemy ORM
- **Database**: MySQL
- **Authentication**: JWT with bcrypt
- **Structure**: Categories → Subcategories → Products

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database connection configuration
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic validation schemas
│   ├── crud.py              # Database operations (CRUD)
│   ├── auth.py              # Authentication utilities
│   └── routers/             # API route handlers
│       ├── auth.py          # User authentication
│       ├── categories.py    # Category management
│       ├── subcategories.py # Subcategory management
│       ├── products.py      # Product management
│       ├── blogs.py         # Blog management
│       ├── enquiries.py     # Contact form submissions
│       └── analytics.py     # Analytics and reporting
├── requirements.txt         # Python dependencies
├── setup_database.py        # Database setup script
├── test_api.py             # API testing script
└── API_ENDPOINTS.md        # Detailed API documentation
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Database Setup

Make sure your MySQL server is running and create the database:

```sql
CREATE DATABASE amberdata1;
```

### 3. Run Database Migration

```bash
python setup_database.py
```

This will:
- Create all necessary tables
- Add missing columns to existing tables
- Populate sample data

### 4. Start the Server

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at: http://localhost:8000

## 📊 Database Schema

### Categories Table
- `id` (Primary Key)
- `name` (String, Unique)

### Subcategories Table
- `id` (Primary Key)
- `name` (String)
- `description` (Text, Optional)
- `image_url` (String, Optional)
- `category_id` (Foreign Key to Categories)

### Products Table
- `id` (Primary Key)
- `name` (String)
- `grade` (String, Optional)
- `moq` (String, Optional)
- `origin` (String, Optional)
- `image_url` (String, Optional)
- `certifications` (String, Optional)
- `details` (Text, Optional)
- `category_id` (Foreign Key to Categories)
- `subcategory_id` (Foreign Key to Subcategories)
- `specs` (JSON, Optional) - Product specifications
- `highlights` (Text, Optional) - Key features
- `private_label_options` (Text, Optional) - Packaging options
- `use_cases` (Text, Optional) - Usage applications
- `created_at` (DateTime)

## 🔌 API Endpoints

### Categories
- `GET /categories/` - Get all categories
- `POST /categories/` - Create category

### Subcategories
- `GET /subcategories/` - Get all subcategories
- `GET /subcategories/{id}` - Get specific subcategory
- `GET /subcategories/category/{category_id}` - Get subcategories by category
- `POST /subcategories/` - Create subcategory
- `PUT /subcategories/{id}` - Update subcategory
- `DELETE /subcategories/{id}` - Delete subcategory

### Products
- `GET /products/` - Get all products
- `GET /products/{id}` - Get specific product
- `GET /products/subcategory/{subcategory_id}` - Get products by subcategory
- `GET /products/category/{category_id}` - Get products by category
- `GET /products/featured/` - Get featured products
- `POST /products/` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Other Endpoints
- `GET /blogs/` - Get all blogs
- `POST /enquiries/` - Submit contact form
- `GET /analytics/users` - Get user analytics

## 🧪 Testing

Run the API test script to verify all endpoints:

```bash
python test_api.py
```

## 📖 API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=mysql+mysqlconnector://admin:Mohangola%23123@database-1.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/amberdata1
SECRET_KEY=your-secret-key-here
```

### Database Connection

Update the database URL in `app/database.py` if needed:

```python
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+mysqlconnector://admin:Mohangola%23123@database-1.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/amberdata1"
)
```

## 📝 Sample Data

The setup script includes sample data:

### Categories
- Spices
- Rice
- Pulses
- Dry Fruits

### Subcategories (under Spices)
- Chili
- Turmeric
- Black Pepper

### Products (under Chili)
- Whole Stemless Red Chili (Teja/Sannam)
- Kashmiri Red Chili Powder
- Bird's Eye Chili (Thai Chili)

Each product includes detailed specifications, highlights, and use cases.

## 🔒 Security

- CORS configured for frontend origin (`http://localhost:5173`)
- JWT authentication for protected endpoints
- Password hashing with bcrypt
- Input validation with Pydantic

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL server is running
   - Check database credentials in `database.py`
   - Verify database `amberdata1` exists

2. **Missing Columns Error**
   - Run `python setup_database.py` to add missing columns
   - Or manually run the SQL commands from the setup script

3. **Import Errors**
   - Ensure all dependencies are installed: `pip install -r requirements.txt`
   - Check Python path and virtual environment

4. **Port Already in Use**
   - Change port: `uvicorn app.main:app --reload --port 8001`
   - Or kill existing process using port 8000

### Logs

Check the console output for detailed error messages and database connection status.

## 📞 Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review the error logs
3. Run the test script to identify specific endpoint issues

## 🔄 Updates

To update the database schema:
1. Modify the models in `models.py`
2. Run `python setup_database.py` to apply migrations
3. Restart the server

---

**Amber Global Backend API** - Ready for production use! 🚀 