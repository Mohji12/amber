#!/usr/bin/env python3
"""
Setup AWS RDS database
"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import ProgrammingError

# AWS RDS connection without database name
AWS_DATABASE_URL = "mysql+mysqlconnector://admin:Amberglobaltrade2424@amber-database.cbeyuko6yxme.ap-south-1.rds.amazonaws.com:3306"

def setup_database():
    try:
        # Connect to MySQL server (without specifying database)
        engine = create_engine(
            AWS_DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300,
            connect_args={"connect_timeout": 10}
        )
        
        with engine.connect() as connection:
            # Create database if it doesn't exist
            connection.execute(text("CREATE DATABASE IF NOT EXISTS amberdata1"))
            print("✅ Database 'amberdata1' created successfully!")
            
            # Use the database
            connection.execute(text("USE amberdata1"))
            print("✅ Switched to 'amberdata1' database")
            
            # Test connection
            result = connection.execute(text("SELECT DATABASE() as current_db"))
            current_db = result.fetchone()
            print(f"✅ Current database: {current_db[0]}")
            
            return True
            
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

if __name__ == "__main__":
    setup_database()
