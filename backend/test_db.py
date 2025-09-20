import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

print("Starting database connection test...")

# Load environment variables from .env file in the current directory
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env file!")
else:
    try:
        print(f"Attempting to connect to the database...")
        # Create an engine
        engine = create_engine(DATABASE_URL)

        # Try to establish a connection
        with engine.connect() as connection:
            print("Connection established. Now running a simple query...")
            # Run a simple query
            result = connection.execute(text("SELECT 1"))
            for row in result:
                print(f"Query result: {row}")
            
            print("\nSUCCESS: Database connection is working correctly!")

    except Exception as e:
        print("\n--- DATABASE CONNECTION FAILED ---")
        print(f"An error occurred: {e}")
        print("------------------------------------")
        print("\nPlease check the following:")
        print("1. Is the DATABASE_URL in your .env file correct?")
        print("2. Is the password correct (special characters might need encoding)?")
        print("3. Have you allowed IP addresses in your Supabase project's network settings?")
