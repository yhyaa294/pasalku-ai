import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pasalku AI"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    NEXT_PUBLIC_SENTRY_DSN: str = os.getenv("NEXT_PUBLIC_SENTRY_DSN", "")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    POSTGRES_URI: str = os.getenv("POSTGRES_URI", "")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    TURSO_URI: str = os.getenv("TURSO_URI", "")
    EDGEDB_URI: str = os.getenv("EDGEDB_URI", "")
    ARK_MODEL_ID: str = os.getenv("ARK_MODEL_ID", "")

    class Config:
        env_file = ".env"

settings = Settings()