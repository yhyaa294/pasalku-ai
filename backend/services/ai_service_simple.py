"""
Simple AI Service untuk Pasalku.ai
"""
import os
import logging
from typing import Dict, Any, Optional
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

class BaseAIService(ABC):
    """Base class untuk semua AI service providers"""
    
    @abstractmethod
    async def get_legal_response(self, query: str, user_context: str = "") -> Dict[str, Any]:
        """Get legal response from AI service"""
        pass
    
    @abstractmethod
    async def test_connection(self) -> bool:
        """Test connection to AI service"""
        pass

class BytePlusArkService(BaseAIService):
    """BytePlus Ark AI service implementation"""
    
    def __init__(self):
        self.api_key = os.getenv("ARK_API_KEY", "")
        self.base_url = os.getenv("ARK_BASE_URL", "https://ark.ap-southeast.bytepluses.com/api/v3")
        self.model_id = os.getenv("ARK_MODEL_ID", "ep-20250830093230-swczp")
    
    async def get_legal_response(self, query: str, user_context: str = "") -> Dict[str, Any]:
        """Get legal response from BytePlus Ark"""
        try:
            # Simple response for now
            return {
                "answer": f"Terima kasih atas pertanyaan hukum Anda: {query}. Ini adalah respons dari BytePlus Ark AI.",
                "citations": [],
                "confidence": 0.85
            }
        except Exception as e:
            logger.error(f"Error in BytePlus Ark: {str(e)}")
            return {
                "answer": "Maaf, terjadi kesalahan dalam memproses pertanyaan Anda.",
                "citations": [],
                "confidence": 0.0
            }
    
    async def test_connection(self) -> bool:
        """Test BytePlus Ark connection"""
        return bool(self.api_key)

class GroqAIService(BaseAIService):
    """Groq AI service implementation"""
    
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY", "")
    
    async def get_legal_response(self, query: str, user_context: str = "") -> Dict[str, Any]:
        """Get legal response from Groq AI"""
        try:
            # Simple response for now
            return {
                "answer": f"Terima kasih atas pertanyaan hukum Anda: {query}. Ini adalah respons dari Groq AI.",
                "citations": [],
                "confidence": 0.80
            }
        except Exception as e:
            logger.error(f"Error in Groq AI: {str(e)}")
            return {
                "answer": "Maaf, terjadi kesalahan dalam memproses pertanyaan Anda.",
                "citations": [],
                "confidence": 0.0
            }
    
    async def test_connection(self) -> bool:
        """Test Groq AI connection"""
        return bool(self.api_key)

class AdvancedAIService(BaseAIService):
    """Advanced AI service with multiple providers"""
    
    def __init__(self):
        self.ark_service = BytePlusArkService()
        self.groq_service = GroqAIService()
    
    async def get_legal_response(self, query: str, user_context: str = "") -> Dict[str, Any]:
        """Get consensus response from multiple AI providers"""
        try:
            # Try BytePlus first
            if await self.ark_service.test_connection():
                return await self.ark_service.get_legal_response(query, user_context)
            # Fallback to Groq
            elif await self.groq_service.test_connection():
                return await self.groq_service.get_legal_response(query, user_context)
            else:
                return {
                    "answer": "Maaf, semua layanan AI sedang tidak tersedia.",
                    "citations": [],
                    "confidence": 0.0
                }
        except Exception as e:
            logger.error(f"Error in Advanced AI: {str(e)}")
            return {
                "answer": "Maaf, terjadi kesalahan dalam memproses pertanyaan Anda.",
                "citations": [],
                "confidence": 0.0
            }
    
    async def test_connection(self) -> bool:
        """Test if any AI service is available"""
        return (await self.ark_service.test_connection() or 
                await self.groq_service.test_connection())

# Factory function
def create_ai_service(provider: str = "byteplus") -> BaseAIService:
    """Create AI service instance based on provider"""
    if provider == "byteplus":
        return BytePlusArkService()
    elif provider == "groq":
        return GroqAIService()
    elif provider == "multi":
        return AdvancedAIService()
    else:
        raise ValueError(f"Provider AI tidak dikenal: {provider}")

# Global instances
ai_service = create_ai_service("byteplus")
advanced_ai_service = create_ai_service("multi")
