"""
Base interface dan implementasi untuk layanan AI di Pasalku.ai.
Mendukung multiple AI providers dengan interface yang konsisten.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import logging
import httpx
from fastapi import HTTPException

from backend.core.config import settings

logger = logging.getLogger(__name__)

class BaseAIService(ABC):
    """Base class untuk semua AI service providers"""
    
    @abstractmethod
    async def get_legal_response(
        self,
        query: str,
        user_context: str = "",
        **kwargs
    ) -> Dict[str, Any]:
        """
        Dapatkan respons hukum dari AI provider
        
        Args:
            query: Pertanyaan hukum dari pengguna
            user_context: Konteks tambahan tentang pengguna
            **kwargs: Parameter tambahan spesifik ke provider
            
        Returns:
            Dict berisi answer, citations, dan disclaimer
        """
        pass

    @abstractmethod
    async def test_connection(self) -> bool:
        """Uji koneksi ke API provider"""
        pass

    def _get_system_prompt(self) -> str:
        """Template prompt sistem untuk konsultasi hukum"""
        return """
Anda adalah asisten hukum AI profesional untuk masyarakat Indonesia bernama Pasalku.ai.

**INFORMASI DEVELOPER:**
- Developer: Muhammad Syarifuddin Yahya
- Kontak: +6285183104294 / +6282330919114  
- Email: syarifuddinudin526@gmail.com
- Lokasi: Ngoro, Jombang, Jawa Timur

**PEDOMAN RESPON:**
1. **TIDAK MEMBERIKAN NASIHAT HUKUM** - Hanya berikan INFORMASI HUKUM berdasarkan peraturan Indonesia
2. **GUNAKAN BAHASA FORMAL** - Bahasa Indonesia yang sopan dan mudah dipahami
3. **SERTAKAN SITASI HUKUM** - Selalu cantumkan sumber hukum (UU, Pasal, Yurisprudensi)
4. **BERIKAN ANALISIS OBJEKTIF** - Jelaskan berbagai perspektif hukum yang relevan
5. **SELALU TAMBAHKAN DISCLAIMER** - Ingatkan bahwa ini bukan nasihat hukum resmi

Berikan jawaban dalam bahasa Indonesia yang profesional dan mudah dipahami.
"""

    def _extract_citations(self, text: str) -> list:
        """Ekstrak sitasi hukum dari teks respons AI"""
        citations = []
        import re
        
        # Pola sitasi hukum Indonesia
        patterns = [
            r'Pasal\s+\d+[A-Za-z]*(?:\s+(?:ayat\s+\(\d+\)|\(\d+\)))?',  # Referensi Pasal
            r'Undang-Undang\s+(?:Nomor\s+)?\d+\s+Tahun\s+\d+',  # Referensi UU
            r'UU\s+(?:No\.|Nomor)\s*\d+\/\d+',  # Singkatan UU
            r'(?:Yurisprudensi|Putusan)\s+(?:Mahkamah\s+Agung\s+)?(?:Nomor\s+)?[\w\/.-]+',  # Yurisprudensi
            r'Kitab\s+Undang-Undang\s+Hukum\s+\w+',  # Kodifikasi hukum
            r'KUHP?\s*(?:Pasal\s+\d+)?',  # Referensi KUHP
            r'KUH\s*Perdata\s*(?:Pasal\s+\d+)?',  # Referensi KUHPerdata
            r'Peraturan\s+(?:Pemerintah|Menteri)\s+(?:Nomor\s+)?\d+',  # Peraturan pemerintah
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            citations.extend(matches)
        
        return list(set(citations))

    def _get_fallback_response(self, query: str) -> Dict[str, Any]:
        """Respons fallback ketika layanan AI tidak tersedia"""
        return {
            "answer": f"Terima kasih atas pertanyaan Anda mengenai '{query[:50]}...'. "
                     f"Saat ini layanan AI sedang dalam pemeliharaan. Untuk konsultasi "
                     f"hukum yang akurat, silakan hubungi langsung developer Pasalku.ai "
                     f"di +6285183104294 atau email syarifuddinudin526@gmail.com.",
            "citations": ["Layanan AI sedang dalam pemeliharaan"],
            "disclaimer": "Layanan AI sementara tidak tersedia. Untuk konsultasi hukum "
                         "profesional, hubungi advokat yang berkompeten atau developer "
                         "Pasalku.ai."
        }

class BytePlusArkService(BaseAIService):
    """Implementasi BytePlus Ark AI service"""
    
    def __init__(self):
        """Inisialisasi dengan konfigurasi dari settings"""
        self.api_key = settings.ARK_API_KEY
        self.base_url = settings.ARK_BASE_URL
        self.model_id = settings.ARK_MODEL_ID
        self.region = "ap-southeast"
        self.sdk_client = None
        
        if not self.api_key:
            logger.warning("ARK_API_KEY tidak diatur")
            return
            
        try:
            from byteplussdkarkruntime import Ark
            self.sdk_client = Ark(
                api_key=self.api_key,
                base_url=self.base_url,
                region=self.region
            )
            logger.info("SDK BytePlus Ark berhasil diinisialisasi")
        except ImportError:
            logger.warning("BytePlus SDK tidak tersedia, menggunakan HTTP client")
        except Exception as e:
            logger.error(f"Gagal menginisialisasi BytePlus Ark: {str(e)}")

    async def get_legal_response(
        self,
        query: str,
        user_context: str = "",
        **kwargs
    ) -> Dict[str, Any]:
        """Implementasi get_legal_response untuk BytePlus Ark"""
        if not self.api_key:
            return self._get_fallback_response(query)
            
        try:
            # Siapkan pesan
            system_prompt = self._get_system_prompt()
            user_message = f"Konteks Pengguna: {user_context}\n\nPertanyaan Hukum: {query}"
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            # Coba gunakan SDK terlebih dahulu
            if self.sdk_client:
                try:
                    response = self.sdk_client.chat.completions.create(
                        model=self.model_id,
                        messages=messages,
                        temperature=0.3,
                        max_tokens=2000
                    )
                    
                    if response and hasattr(response, 'choices'):
                        ai_response = response.choices[0].message.content
                        return {
                            "answer": ai_response,
                            "citations": self._extract_citations(ai_response),
                            "disclaimer": "Informasi ini bersifat edukasi dan bukan merupakan nasihat hukum resmi."
                        }
                except Exception as e:
                    logger.error(f"SDK error, falling back to HTTP: {str(e)}")
            
            # Fallback ke HTTP client
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    json={
                        "model": self.model_id,
                        "messages": messages,
                        "max_tokens": 2000,
                        "temperature": 0.3
                    },
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    }
                )
                
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"BytePlus API error: {response.text}"
                    )
                
                data = response.json()
                ai_response = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                
                if not ai_response:
                    raise ValueError("Respons API kosong")
                    
                return {
                    "answer": ai_response,
                    "citations": self._extract_citations(ai_response),
                    "disclaimer": "Informasi ini bersifat edukasi dan bukan merupakan nasihat hukum resmi."
                }
                
        except Exception as e:
            logger.error(f"Error dalam mendapatkan respons AI: {str(e)}")
            return self._get_fallback_response(query)

    async def test_connection(self) -> bool:
        """Implementasi test_connection untuk BytePlus Ark"""
        if not self.api_key:
            return False
            
        try:
            test_messages = [
                {"role": "system", "content": "You are a test assistant."},
                {"role": "user", "content": "Hello, test connection"}
            ]
            
            if self.sdk_client:
                response = self.sdk_client.chat.completions.create(
                    model=self.model_id,
                    messages=test_messages,
                    max_tokens=50,
                    temperature=0.1
                )
                return bool(response and hasattr(response, 'choices'))
            else:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        json={
                            "model": self.model_id,
                            "messages": test_messages,
                            "max_tokens": 50,
                            "temperature": 0.1
                        },
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": f"Bearer {self.api_key}"
                        }
                    )
                    return response.status_code == 200
                    
        except Exception as e:
            logger.error(f"Uji koneksi BytePlus gagal: {str(e)}")
            return False

# Factory untuk membuat instance AI service berdasarkan provider
def create_ai_service(provider: str = "byteplus") -> BaseAIService:
    """
    Factory function untuk membuat instance AI service
    
    Args:
        provider: Nama provider AI ("byteplus", "openai", dll.)
        
    Returns:
        Instance dari BaseAIService
    """
    if provider == "byteplus":
        return BytePlusArkService()
    # Tambahkan provider lain di sini
    raise ValueError(f"Provider AI tidak dikenal: {provider}")

# Instance global default (BytePlus)
ai_service = create_ai_service("byteplus")