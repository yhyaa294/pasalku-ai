import os
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the base class for the models
Base = declarative_base()

# Define the Turso database URL
TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL")

# Create the database engine
engine = create_engine(TURSO_DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Example model for a table in the Turso database
class ExampleModel(Base):
    __tablename__ = "example_table"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

# Function to create the database tables
def init_turso_db():
    Base.metadata.create_all(bind=engine)