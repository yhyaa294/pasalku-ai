from typing import List
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from dotenv import load_dotenv
from pathlib import Path
import os

# Load .env file from project root directory
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    """
    Konfigurasi aplikasi menggunakan Pydantic V2 BaseSettings.
    """
    model_config = SettingsConfigDict(
        env_file=env_path,
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='ignore'
    )
    
    # Application
    PROJECT_NAME: str = Field(default="Pasalku.ai")
    VERSION: str = Field(default="1.0.0")
    DESCRIPTION: str = Field(default="Asisten hukum AI untuk masyarakat Indonesia")
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    
    # Database
    DATABASE_URL: str = Field(default="sqlite:///sql_app.db")
    
    # Security
    SECRET_KEY: str = Field(default="your-secret-key-here")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    
    # BytePlus Ark
    ARK_API_KEY: str = Field(default="863f6a1b-e0ed-4cff-a198-26b92dec48c2")
    ARK_BASE_URL: str = Field(
        default="https://ark.ap-southeast.bytepluses.com/api/v3"
    )
    ARK_MODEL_ID: str = Field(default="ep-20250830093230-swczp")
    
    # CORS - Menggunakan Field dengan default value berupa list
    CORS_ORIGINS: List[str] = Field(
        default_factory=lambda: ["http://localhost:3000"],
        description="List of allowed CORS origins"
    )
    
    # Optional Services
    MONGODB_URL: str = Field(default="")
    GOOGLE_API_KEY: str = Field(default="")

@lru_cache()
def get_settings() -> Settings:
    """
    Create cached instance of settings.
    Use this function to get settings instead of creating a new instance each time.
    """
    return Settings()

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "Pasalku.ai"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Asisten hukum AI untuk masyarakat Indonesia"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///sql_app.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # BytePlus Ark
    ARK_API_KEY: str = os.getenv("ARK_API_KEY", "863f6a1b-e0ed-4cff-a198-26b92dec48c2")
    ARK_BASE_URL: str = os.getenv("ARK_BASE_URL", "https://ark.ap-southeast.bytepluses.com/api/v3")
    ARK_MODEL_ID: str = os.getenv("ARK_MODEL_ID", "ep-20250830093230-swczp")
    
    # CORS
    CORS_ORIGINS: List[str] = get_cors_origins()
    
    # Optional Services
    MONGODB_URL: str = os.getenv("MONGODB_URL", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    
    class Config:
        case_sensitive = True
        env_file = env_path
        extra = "ignore"  # Ignore extra fields in .env

settings = Settings()
