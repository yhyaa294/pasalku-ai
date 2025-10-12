"""
Core Configuration Module for Pasalku.ai Backend
Uses environment variables - NO hardcoded secrets
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    All secrets MUST be in .env file, never hardcoded here.
    """

    # ==============================================
    # Application Settings
    # ==============================================
    APP_NAME: str = Field(default="Pasalku.ai API")
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=False)
    API_V1_STR: str = Field(default="/api/v1")
    
    # CORS
    CORS_ORIGINS: str = Field(default="http://localhost:3000,http://127.0.0.1:3000")

    # ==============================================
    # AI Services Configuration
    # ==============================================
    # BytePlus Ark (Primary AI)
    ARK_API_KEY: str = Field(default="")
    ARK_BASE_URL: str = Field(default="https://ark.ap-southeast.bytepluses.com/api/v3")
    ARK_MODEL_ID: str = Field(default="ep-20250830093230-swczp")
    ARK_REGION: str = Field(default="ap-southeast")

    # Groq AI (Fallback)
    GROQ_API_KEY: str = Field(default="")

    # ==============================================
    # Database Configuration
    # ==============================================
    # Neon PostgreSQL (Primary)
    DATABASE_URL: str = Field(default="sqlite:///sql_app.db")
    DATABASE_URL_UNPOOLED: str = Field(default="")
    PGHOST: str = Field(default="")
    PGHOST_UNPOOLED: str = Field(default="")
    PGUSER: str = Field(default="")
    PGDATABASE: str = Field(default="")
    PGPASSWORD: str = Field(default="")

    # MongoDB (Conversation Archive)
    MONGODB_URI: str = Field(default="")
    MONGO_DB_NAME: str = Field(default="pasalku_ai_conversation_archive")

    # Supabase (Realtime & Edge)
    SUPABASE_URL: str = Field(default="")
    SUPABASE_ANON_KEY: str = Field(default="")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default="")

    # Turso (Edge SQL Cache)
    TURSO_AUTH_TOKEN: str = Field(default="")
    TURSO_DATABASE_URL: str = Field(default="")

    # EdgeDB (Knowledge Graph)
    EDGEDB_INSTANCE: str = Field(default="")
    EDGEDB_SECRET_KEY: str = Field(default="")

    # ==============================================
    # Security & Authentication
    # ==============================================
    SECRET_KEY: str = Field(default="change-this-in-production")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)

    # Clerk Auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: str = Field(default="")
    CLERK_SECRET_KEY: str = Field(default="")

    # StackAuth
    NEXT_PUBLIC_STACK_PROJECT_ID: str = Field(default="")
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: str = Field(default="")
    STACK_SECRET_SERVER_KEY: str = Field(default="")

    # SMS Provider
    SMS_API_KEY: str = Field(default="")
    SMS_PROVIDER: str = Field(default="twilio")

    # ==============================================
    # Monetization (Stripe)
    # ==============================================
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: str = Field(default="")
    STRIPE_SECRET_KEY: str = Field(default="")
    STRIPE_MCP_KEY: str = Field(default="")
    NEXT_PUBLIC_STRIPE_PRICE_ID: str = Field(default="")

    # ==============================================
    # Analytics & Experimentation
    # ==============================================
    # Statsig
    NEXT_PUBLIC_STATSIG_CLIENT_KEY: str = Field(default="")
    STATSIG_SERVER_API_KEY: str = Field(default="")
    EXPERIMENTATION_CONFIG_ITEM_KEY: str = Field(default="")

    # Hypertune
    NEXT_PUBLIC_HYPERTUNE_TOKEN: str = Field(default="")
    PASALKU_NEXT_PUBLIC_HYPERTUNE_TOKEN: str = Field(default="")
    HYPERTUNE_EXPERIMENTATION_CONFIG_ITEM_KEY: str = Field(default="")

    # ==============================================
    # Error Tracking & Logging (Sentry)
    # ==============================================
    NEXT_PUBLIC_SENTRY_DSN: str = Field(default="")
    SENTRY_PROJECT: str = Field(default="pasalku-ai")
    SENTRY_AUTH_TOKEN: str = Field(default="")
    SENTRY_ORG: str = Field(default="pasalkuai")

    # ==============================================
    # Async Jobs & Workflows (Inngest)
    # ==============================================
    INNGEST_EVENT_KEY: str = Field(default="")
    INNGEST_SIGNING_KEY: str = Field(default="")

    # ==============================================
    # Monitoring & Uptime (Checkly)
    # ==============================================
    CHECKLY_ACCOUNT_ID: str = Field(default="")
    CHECKLY_API_KEY: str = Field(default="")

    # ==============================================
    # Additional Services
    # ==============================================
    # Resend (Email)
    RESEND_API_KEY: str = Field(default="")
    
    # App URL
    NEXT_PUBLIC_APP_URL: str = Field(default="http://localhost:3000")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()
