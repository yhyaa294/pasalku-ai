from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # BytePlus
    BYTEPLUS_AK: str
    BYTEPLUS_SK: str
    BYTEPLUS_ENDPOINT: str
    BYTEPLUS_MODEL_ID: str

    class Config:
        env_file = ".env"

settings = Settings()
