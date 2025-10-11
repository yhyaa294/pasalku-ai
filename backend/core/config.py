from typing import List
from pydantic import BaseModel, Field, field_validator
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
        extra='ignore',
        env_parse_mode='auto'  # Let pydantic handle parsing automatically
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
    
    # CORS Origins (comma-separated string)
    CORS_ORIGINS_STR: str = Field(
        default="http://localhost:3000,https://pasalku-ai.vercel.app",
        env="CORS_ORIGINS",
        description="Comma-separated list of allowed CORS origins"
    )

    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Return CORS origins as a list, parsed from the string."""
        return [origin.strip() for origin in self.CORS_ORIGINS_STR.split(',')]
    
    # Optional Services
    MONGODB_URL: str = Field(default="")
    GOOGLE_API_KEY: str = Field(default="")

    # Statsig Configuration
    STATSIG_CLIENT_KEY: str = Field(default="")
    STATSIG_SERVER_API_KEY: str = Field(default="")
    EXPERIMENTATION_CONFIG_ITEM_KEY: str = Field(default="")

    # Clerk Authentication
    CLERK_PUBLISHABLE_KEY: str = Field(default="")
    CLERK_SECRET_KEY: str = Field(default="")

    # Stripe Payment Processing
    STRIPE_PUBLISHABLE_KEY: str = Field(default="")
    STRIPE_SECRET_KEY: str = Field(default="")
    STRIPE_MCP_KEY: str = Field(default="")
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: str = Field(default="")

    # MongoDB Configuration
    MONGODB_URI: str = Field(default="")
    MONGO_DB_NAME: str = Field(default="pasalku_ai")

    # Inngest Workflow Automation
    INNGEST_EVENT_KEY: str = Field(default="")
    INNGEST_SIGNING_KEY: str = Field(default="")

    # Groq AI Configuration
    GROQ_API_KEY: str = Field(default="")

    # Sentry Error Monitoring
    SENTRY_PROJECT: str = Field(default="")
    SENTRY_AUTH_TOKEN: str = Field(default="")
    SENTRY_ORG: str = Field(default="")
    NEXT_PUBLIC_SENTRY_DSN: str = Field(default="")

@lru_cache()
def get_settings() -> Settings:
    """
    Create cached instance of settings.
    Use this function to get settings instead of creating a new instance each time.
    """
    return Settings()

settings = get_settings()

