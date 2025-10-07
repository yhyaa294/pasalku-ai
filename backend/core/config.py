from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

# Load .env file from backend directory
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./pasalku_ai.db"

    # Stripe (optional)
    STRIPE_SECRET_KEY: str = "your_stripe_secret_key_here"
    STRIPE_PUBLISHABLE_KEY: str = "your_stripe_publishable_key_here"
    STRIPE_PRICE_ID: str = "price_placeholder"

    # JWT
    SECRET_KEY: str = "pasalku_ai_secret_key_change_this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # BytePlus Ark
    ARK_API_KEY: str = ""
    ARK_BASE_URL: str = "https://ark.ap-southeast.bytepluses.com/api/v3"
    ARK_MODEL_ID: str = "ep-20250830093230-swczp"

    class Config:
        env_file = ".env"
        extra = "ignore"  # Allow extra fields in .env

settings = Settings()
