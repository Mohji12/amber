import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text


# Local MySQL connection (commented out)
# SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:AnithaS%4000@127.0.0.1:3306/amberdata"

# AWS RDS MySQL connection
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://admin:Mentee_tracker#2025@mentee.cr82604eu9d2.ap-south-1.rds.amazonaws.com:3306/amber"
)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={"connect_timeout": 10}
)

# Debug: Print the connected database name (commented out to avoid startup issues)
# with engine.connect() as connection:
#     result = connection.execute(text("SELECT DATABASE();"))
#     print("Connected to database:", result.fetchone())

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

