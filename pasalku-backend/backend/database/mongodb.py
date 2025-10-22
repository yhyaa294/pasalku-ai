from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from backend.core.config import get_settings
import logging

logger = logging.getLogger("pasalku-backend.database.mongodb")

settings = get_settings()

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None

    async def connect(self):
        try:
            self.client = AsyncIOMotorClient(settings.MONGODB_URI)
            self.db = self.client.get_default_database()
            logger.info("Connected to MongoDB successfully")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise

    async def close(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

mongodb = MongoDB()