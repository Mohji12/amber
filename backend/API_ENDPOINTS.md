# Amber Global API Documentation

## Overview
This API provides a hierarchical product structure with Categories → Subcategories → Products, allowing for detailed product specifications and organized product management.

## Base URL
```
http://localhost:8000
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Categories

### Get All Categories
```http
GET /categories/
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Spices",
    "description": "Premium spices from India",
    "image_url": "/images/spices.jpg"
  }
]
```

### Create Category
```http
POST /categories/
```
**Request Body:**
```json
{
  "name": "Spices",
  "description": "Premium spices from India",
  "image_url": "/images/spices.jpg"
}
```

---

## Subcategories

### Get All Subcategories
```http
GET /subcategories/
```

### Get Subcategory by ID
```http
GET /subcategories/{subcategory_id}
```

### Get Subcategories by Category
```http
GET /subcategories/category/{category_id}
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Chili",
    "description": "Various types of chili peppers and powders",
    "image_url": "/images/chili.jpg",
    "category_id": 1,
    "category": {
      "id": 1,
      "name": "Spices",
      "description": "Premium spices from India",
      "image_url": "/images/spices.jpg"
    }
  }
]
```

### Create Subcategory
```http
POST /subcategories/
```
**Request Body:**
```json
{
  "name": "Chili",
  "description": "Various types of chili peppers and powders",
  "image_url": "/images/chili.jpg",
  "category_id": 1
}
```

### Update Subcategory
```http
PUT /subcategories/{subcategory_id}
```

### Delete Subcategory
```http
DELETE /subcategories/{subcategory_id}
```

---

## Products

### Get All Products
```http
GET /products/
```

### Get Product by ID
```http
GET /products/{product_id}
```

### Get Products by Subcategory
```http
GET /products/subcategory/{subcategory_id}
```

### Get Products by Category
```http
GET /products/category/{category_id}
```

### Get Featured Products
```http
GET /products/featured/
```

### Create Product
```http
POST /products/
```
**Request Body:**
```json
{
  "name": "Whole Stemless Red Chili (Teja/Sannam)",
  "grade": "Premium",
  "moq": "1000 KG",
  "origin": "Andhra Pradesh, Telangana",
  "image_url": "/images/chili-teja.jpg",
  "certifications": "ISO 22000, HACCP, Organic",
  "details": "Premium quality whole stemless red chili with excellent color and heat profile",
  "category_id": 1,
  "subcategory_id": 1,
  "specs": {
    "size": "4-6 cm",
    "moisture": "≤12%",
    "shu": "30,000-90,000",
    "color": "Bright red",
    "ash_content": "Low",
    "cleaning": "Machine-cleaned"
  },
  "highlights": "De-stemmed, machine-cleaned, low-ash content, bright red color, consistent heat profile",
  "private_label_options": "Vacuum packs, printed pouches, foodservice bags, bulk containers",
  "use_cases": "Whole spice blends, oil infusions, grinding, pickling, marinades"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Whole Stemless Red Chili (Teja/Sannam)",
  "grade": "Premium",
  "moq": "1000 KG",
  "origin": "Andhra Pradesh, Telangana",
  "image_url": "/images/chili-teja.jpg",
  "certifications": "ISO 22000, HACCP, Organic",
  "details": "Premium quality whole stemless red chili with excellent color and heat profile",
  "category_id": 1,
  "subcategory_id": 1,
  "specs": {
    "size": "4-6 cm",
    "moisture": "≤12%",
    "shu": "30,000-90,000",
    "color": "Bright red",
    "ash_content": "Low",
    "cleaning": "Machine-cleaned"
  },
  "highlights": "De-stemmed, machine-cleaned, low-ash content, bright red color, consistent heat profile",
  "private_label_options": "Vacuum packs, printed pouches, foodservice bags, bulk containers",
  "use_cases": "Whole spice blends, oil infusions, grinding, pickling, marinades",
  "category": {
    "id": 1,
    "name": "Spices",
    "description": "Premium spices from India",
    "image_url": "/images/spices.jpg"
  },
  "subcategory": {
    "id": 1,
    "name": "Chili",
    "description": "Various types of chili peppers and powders",
    "image_url": "/images/chili.jpg",
    "category_id": 1
  }
}
```

### Update Product
```http
PUT /products/{product_id}
```

### Delete Product
```http
DELETE /products/{product_id}
```

---

## Product Specifications Structure

The `specs` field is a JSON object that can contain any product-specific specifications. Here are some examples:

### Chili Products
```json
{
  "specs": {
    "size": "4-6 cm",
    "moisture": "≤12%",
    "shu": "30,000-90,000",
    "color": "Bright red",
    "ash_content": "Low",
    "cleaning": "Machine-cleaned"
  }
}
```

### Rice Products
```json
{
  "specs": {
    "grain_length": "7-8 mm",
    "aging": "2+ years",
    "moisture": "≤14%",
    "broken_grains": "≤5%"
  }
}
```

### Turmeric Products
```json
{
  "specs": {
    "curcumin_content": "≥5%",
    "moisture": "≤12%",
    "color": "Deep yellow-orange",
    "form": "Finger/rhizome"
  }
}
```

---

## Usage Examples

### 1. Get all products in Chili subcategory
```bash
curl -X GET "http://localhost:8000/products/subcategory/1"
```

### 2. Get all subcategories in Spices category
```bash
curl -X GET "http://localhost:8000/subcategories/category/1"
```

### 3. Create a new product with detailed specs
```bash
curl -X POST "http://localhost:8000/products/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Chili Product",
    "grade": "Premium",
    "moq": "500 KG",
    "origin": "Karnataka, India",
    "category_id": 1,
    "subcategory_id": 1,
    "specs": {
      "size": "3-4 cm",
      "moisture": "≤10%",
      "shu": "20,000-50,000"
    },
    "highlights": "Medium heat, consistent quality",
    "use_cases": "Cooking, seasoning, blends"
  }'
```

---

## Database Schema

### Categories Table
- `id` (Primary Key)
- `name` (String, Unique)
- `description` (Text, Optional)
- `image_url` (String, Optional)

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

---

## Error Responses

### 404 Not Found
```json
{
  "detail": "Product not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
``` 