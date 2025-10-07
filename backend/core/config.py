from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from pathlib import Path
import os

# Load .env file from project root directory
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "Pasalku.ai"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # BytePlus Ark Configuration
    ARK_API_KEY: str = os.getenv("ARK_API_KEY", "")
    ARK_BASE_URL: str = os.getenv("ARK_BASE_URL", "https://ark.ap-southeast.bytepluses.com/api/v3")
    ARK_MODEL_ID: str = os.getenv("ARK_MODEL_ID", "ep-20250830093230-swczp")
    
    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",") if os.getenv("CORS_ORIGINS") else ["*"]
    
    # Google API (if needed)
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    
    # MongoDB (optional)
    MONGO_URL: str = os.getenv("MONGO_URL", "")
    
    class Config:
        case_sensitive = True
        env_file = env_path
        extra = "ignore"  # Ignore extra fields in .env

settings = Settings()
