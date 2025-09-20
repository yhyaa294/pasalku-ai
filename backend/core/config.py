from pydantic_settings import BaseSettings
from dotenv import load_dotenv
load_dotenv()  # Pastikan ini dipanggil sebelum memuat variabel lain

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Stripe
    STRIPE_SECRET_KEY: str
    STRIPE_PUBLISHABLE_KEY: str
    STRIPE_PRICE_ID: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # BytePlus Ark
    ARK_API_KEY: str
    ARK_BASE_URL: str
    ARK_MODEL_ID: str

    class Config:
        env_file = ".env"

settings = Settings()
