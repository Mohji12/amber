#!/usr/bin/env python3
"""
Add Sample Blogs Script
This script adds sample blogs to the database for testing.
"""

import sys
import os
from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

def add_sample_blogs():
    """Add sample blogs to the database"""
    print("🔄 Adding sample blogs to database...")
    
    # Create engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Add sample blogs
            print("📝 Adding sample blogs...")
            blogs_data = [
                {
                    "title": "The Health Benefits of Indian Spices",
                    "content": """
                    Indian spices are not just about flavor - they're packed with incredible health benefits that have been recognized for centuries in Ayurvedic medicine.

                    **Turmeric (Haldi)**
                    - Contains curcumin, a powerful anti-inflammatory compound
                    - Helps with arthritis, heart disease, and even cancer prevention
                    - Natural pain reliever and immune booster

                    **Black Pepper (Kali Mirch)**
                    - Enhances nutrient absorption, especially curcumin from turmeric
                    - Rich in antioxidants and anti-inflammatory properties
                    - Improves digestion and gut health

                    **Cardamom (Elaichi)**
                    - Excellent for digestive health and bad breath
                    - Contains compounds that help lower blood pressure
                    - Natural diuretic and detoxifier

                    **Cinnamon (Dalchini)**
                    - Helps regulate blood sugar levels
                    - Rich in antioxidants and anti-inflammatory properties
                    - Supports heart health and brain function

                    Incorporating these spices into your daily diet can significantly improve your overall health and well-being.
                    """,
                    "author": "Amber Global Team"
                },
                {
                    "title": "Export Quality Standards for Indian Agricultural Products",
                    "content": """
                    India is one of the world's largest exporters of agricultural products, and maintaining high quality standards is crucial for international success.

                    **Quality Parameters We Follow:**

                    1. **Physical Standards**
                       - Size and shape consistency
                       - Color uniformity
                       - Moisture content control
                       - Foreign matter elimination

                    2. **Chemical Standards**
                       - Pesticide residue testing
                       - Heavy metal analysis
                       - Nutritional content verification
                       - Shelf life testing

                    3. **Microbiological Standards**
                       - Pathogen testing
                       - Microbial load assessment
                       - Hygiene standards compliance

                    4. **Packaging Standards**
                       - Food-grade materials
                       - Proper sealing and labeling
                       - International compliance
                       - Traceability systems

                    **Our Commitment:**
                    At Amber Global, we ensure every product meets or exceeds international export standards, making Indian agricultural products competitive in global markets.
                    """,
                    "author": "Quality Assurance Team"
                },
                {
                    "title": "Sustainable Farming Practices in India",
                    "content": """
                    India's agricultural sector is embracing sustainable farming practices to ensure long-term food security and environmental protection.

                    **Key Sustainable Practices:**

                    **1. Organic Farming**
                    - Natural pest control methods
                    - Organic fertilizers and compost
                    - Crop rotation and diversity
                    - Soil health improvement

                    **2. Water Conservation**
                    - Drip irrigation systems
                    - Rainwater harvesting
                    - Efficient water management
                    - Drought-resistant crops

                    **3. Soil Health Management**
                    - Cover cropping
                    - Minimal tillage
                    - Organic matter addition
                    - Soil testing and monitoring

                    **4. Integrated Pest Management**
                    - Biological pest control
                    - Crop diversification
                    - Natural predators
                    - Minimal chemical use

                    **Benefits:**
                    - Reduced environmental impact
                    - Better soil health
                    - Lower production costs
                    - Premium market access
                    - Long-term sustainability

                    These practices ensure that Indian agriculture remains productive while protecting our environment for future generations.
                    """,
                    "author": "Agricultural Expert"
                },
                {
                    "title": "The Future of Indian Spice Exports",
                    "content": """
                    India's spice industry is poised for significant growth in the global market, driven by increasing demand for authentic flavors and health benefits.

                    **Market Trends:**

                    **1. Growing Global Demand**
                    - Rising interest in ethnic cuisines
                    - Health-conscious consumers
                    - Natural flavor preferences
                    - Organic product demand

                    **2. Innovation in Processing**
                    - Advanced drying technologies
                    - Quality preservation methods
                    - Convenient packaging formats
                    - Value-added products

                    **3. Digital Transformation**
                    - E-commerce platforms
                    - Blockchain traceability
                    - Smart supply chains
                    - Digital marketing strategies

                    **4. Sustainability Focus**
                    - Organic certification
                    - Fair trade practices
                    - Environmental responsibility
                    - Social impact initiatives

                    **Opportunities:**
                    - Premium market segments
                    - Health and wellness sector
                    - Convenience food industry
                    - International partnerships

                    The future looks bright for Indian spices, with technology and sustainability driving growth in global markets.
                    """,
                    "author": "Market Analyst"
                },
                {
                    "title": "Traditional Indian Grains: Nutritional Powerhouses",
                    "content": """
                    India's traditional grains are gaining recognition worldwide for their exceptional nutritional value and health benefits.

                    **Nutritional Benefits:**

                    **1. Millets**
                    - Rich in protein and fiber
                    - Gluten-free alternatives
                    - High mineral content
                    - Low glycemic index

                    **2. Ancient Rice Varieties**
                    - Red rice: High in antioxidants
                    - Black rice: Rich in anthocyanins
                    - Brown rice: Fiber and B-vitamins
                    - Basmati: Aromatic and digestible

                    **3. Pulses and Legumes**
                    - Excellent protein source
                    - High fiber content
                    - Rich in vitamins and minerals
                    - Heart-healthy nutrients

                    **4. Traditional Wheat Varieties**
                    - Emmer wheat: Ancient grain
                    - Spelt: Easier to digest
                    - Khorasan: High protein content
                    - Einkorn: Original wheat variety

                    **Health Benefits:**
                    - Better blood sugar control
                    - Improved heart health
                    - Enhanced digestion
                    - Weight management support
                    - Reduced inflammation

                    These traditional grains are not just food - they're medicine for the body and soul, passed down through generations of Indian wisdom.
                    """,
                    "author": "Nutrition Expert"
                }
            ]
            
            for blog in blogs_data:
                connection.execute(text("""
                    INSERT IGNORE INTO blogs (
                        title, content, author, created_at
                    ) VALUES (
                        :title, :content, :author, NOW()
                    )
                """), blog)
            
            connection.commit()
            print(f"✅ {len(blogs_data)} sample blogs added successfully!")
            
            # Verify the data
            result = connection.execute(text("SELECT COUNT(*) as count FROM blogs"))
            blog_count = result.fetchone().count
            print(f"📊 Total blogs in database: {blog_count}")
            
    except Exception as e:
        print(f"❌ Error adding sample blogs: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = add_sample_blogs()
    if success:
        print("🎉 Sample blogs setup completed successfully!")
    else:
        print("💥 Sample blogs setup failed!")
        sys.exit(1)
