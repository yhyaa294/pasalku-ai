"""
AI Service for Pasalku.ai - Handles BytePlus Ark API integration
"""
import logging
import json
from typing import Dict, Any, Optional
import httpx
from pydantic import BaseModel

from backend.core.config import settings

logger = logging.getLogger(__name__)

class LegalResponse(BaseModel):
    answer: str
    citations: list[str]
    disclaimer: str

class AIService:
    def __init__(self):
        self.ark_api_key = settings.ARK_API_KEY
        self.ark_base_url = settings.ARK_BASE_URL
        self.ark_model_id = settings.ARK_MODEL_ID
        self.client = httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {self.ark_api_key}",
                "Content-Type": "application/json"
            },
            timeout=60.0  # 60 seconds timeout
        )

    async def get_legal_response(self, query: str, user_context: str = "") -> LegalResponse:
        """
        Get response from BytePlus Ark model for legal queries
        """
        try:
            # If ARK_API_KEY is not set, return a mock response
            if not self.ark_api_key or "your_ark_api_key_here" in self.ark_api_key:
                logger.warning("ARK API key not configured, returning mock response")
                return LegalResponse(
                    answer=f"Jawaban hukum untuk pertanyaan: '{query}'. Ini adalah respons mock karena API key belum dikonfigurasi. Harap konfigurasi ARK_API_KEY di file .env Anda.",
                    citations=["Pasal 1 UU No. 1 Tahun 2023 (mock)", "Pasal 2 UU No. 2 Tahun 2023 (mock)"],
                    disclaimer="Ini adalah respons mock untuk pengujian. Harap konfigurasi API key yang valid sebelum produksi."
                )
            
            # Prepare the system prompt with legal guidelines
            system_prompt = f"""
            Anda adalah asisten hukum AI untuk Pasalku.ai, platform konsultasi hukum di Indonesia.
            Berikan jawaban yang akurat, ringkas, dan mudah dimengerti berdasarkan hukum positif Indonesia.
            Sertakan referensi pasal atau peraturan yang relevan jika memungkinkan.
            Jika Anda tidak yakin tentang jawaban, akui keterbatasan Anda dan sarankan pengguna untuk berkonsultasi dengan pengacara profesional.
            """
            
            if user_context:
                system_prompt += f"\nKonteks pengguna: {user_context}"
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ]
            
            # Prepare the request to BytePlus Ark
            payload = {
                "model": self.ark_model_id,
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1024
            }
            
            response = await self.client.post(
                f"{self.ark_base_url}/chat/completions",
                json=payload
            )
            
            if response.status_code != 200:
                logger.error(f"ARK API error: {response.status_code} - {response.text}")
                return LegalResponse(
                    answer="Terjadi kesalahan saat menghubungi layanan AI. Silakan coba lagi nanti.",
                    citations=[],
                    disclaimer="Tidak dapat menghubungi layanan AI saat ini."
                )
            
            result = response.json()
            
            # Extract the response content
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            # For now, return the content without citations (they would need to be extracted properly)
            return LegalResponse(
                answer=content,
                citations=[],
                disclaimer="Jawaban ini disediakan oleh AI dan bukan merupakan nasihat hukum resmi. Konsultasikan dengan pengacara profesional untuk masalah hukum spesifik Anda."
            )
            
        except Exception as e:
            logger.error(f"Error getting response from Ark API: {str(e)}")
            return LegalResponse(
                answer="Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.",
                citations=[],
                disclaimer="Tidak dapat memproses permintaan saat ini."
            )

    async def test_connection(self) -> bool:
        """
        Test the connection to the BytePlus Ark API
        """
        try:
            if not self.ark_api_key or "your_ark_api_key_here" in self.ark_api_key:
                logger.warning("ARK API key not configured, skipping connection test")
                return False
            
            # Test with a simple request
            test_payload = {
                "model": self.ark_model_id,
                "messages": [{"role": "user", "content": "Hello"}],
                "temperature": 0.1,
                "max_tokens": 10
            }
            
            response = await self.client.post(
                f"{self.ark_base_url}/chat/completions",
                json=test_payload
            )
            
            return response.status_code == 200
        except Exception as e:
            logger.error(f"ARK API connection test failed: {str(e)}")
            return False

    async def close(self):
        """
        Close the HTTP client
        """
        await self.client.aclose()

# Global AI service instance
ai_service = AIService()

async def get_legal_response(query: str, user_context: str = "") -> LegalResponse:
    """
    Convenience function to get legal response
    """
    return await ai_service.get_legal_response(query, user_context)