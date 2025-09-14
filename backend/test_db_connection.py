#!/usr/bin/env python3
"""
Simple database connection test
"""
from app.database import engine
from sqlalchemy import text

def test_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1 as test"))
            print("✅ Database connection successful!")
            print(f"Test query result: {result.fetchone()}")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
