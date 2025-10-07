"""
Layanan BytePlus Ark AI terpadu untuk Pasalku.ai.
Menggunakan SDK BytePlus jika tersedia, dengan fallback ke HTTP client.
"""
import os
import logging
from typing import Dict, List, Any, Optional
import httpx
from fastapi import HTTPException

try:
    from byteplussdkarkruntime import Ark
    SDK_AVAILABLE = True
except ImportError:
    SDK_AVAILABLE = False
    logging.warning("BytePlus SDK tidak tersedia, menggunakan fallback HTTP client")

from backend.core.config import settings

logger = logging.getLogger(__name__)

class ArkAIService:
    def __init__(self):
        """Inisialisasi layanan BytePlus Ark AI dengan konfigurasi dari variabel lingkungan"""
        self.api_key = settings.ARK_API_KEY
        self.base_url = settings.ARK_BASE_URL
        self.model_id = settings.ARK_MODEL_ID
        self.region = "ap-southeast"
        self.sdk_client = None
        
        if not self.api_key:
            logger.warning("ARK_API_KEY tidak diatur. Layanan akan menggunakan respons fallback.")
            return
            
        if SDK_AVAILABLE:
            try:
                self.sdk_client = Ark(
                    api_key=self.api_key,
                    base_url=self.base_url,
                    region=self.region
                )
                logger.info("SDK BytePlus Ark berhasil diinisialisasi")
            except Exception as e:
                logger.error(f"Gagal menginisialisasi SDK BytePlus Ark: {str(e)}")
                self.sdk_client = None
        
        logger.info(f"Layanan BytePlus diinisialisasi dengan kunci API: {self.api_key[:10] if self.api_key else 'None'}...")

    def _get_system_prompt(self) -> str:
        """Dapatkan prompt sistem standar untuk konsultasi hukum"""
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

    async def get_legal_response(self, query: str, user_context: str = "", use_sdk: bool = True) -> Dict[str, Any]:
        """
        Dapatkan respons konsultasi hukum dari BytePlus AI
        
        Args:
            query: Pertanyaan hukum pengguna
            user_context: Konteks tambahan tentang pengguna
            use_sdk: Gunakan SDK jika tersedia (default True)
            
        Returns:
            Dict berisi jawaban, sitasi, dan disclaimer
        """
        if not self.api_key:
            logger.warning("ARK_API_KEY tidak tersedia, menggunakan respons fallback")
            return self._get_fallback_response(query)
        
        try:
            # Siapkan pesan untuk AI
            system_prompt = self._get_system_prompt()
            user_message = f"Konteks Pengguna: {user_context}\n\nPertanyaan Hukum: {query}"
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            # Coba gunakan SDK jika diminta dan tersedia
            if use_sdk and self.sdk_client:
                return await self._get_response_via_sdk(messages)
            else:
                return await self._get_response_via_http(messages)
                
        except Exception as e:
            logger.error(f"Error dalam mendapatkan respons AI: {str(e)}")
            return self._get_fallback_response(query)

    async def _get_response_via_sdk(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Dapatkan respons menggunakan SDK BytePlus"""
        try:
            response = self.sdk_client.chat.completions.create(
                model=self.model_id,
                messages=messages,
                temperature=0.3,
                max_tokens=2000
            )
            
            if not response or not hasattr(response, 'choices'):
                raise ValueError("Respons SDK tidak valid")
                
            ai_response = response.choices[0].message.content
            return self._format_success_response(ai_response)
            
        except Exception as e:
            logger.error(f"Error SDK BytePlus: {str(e)}")
            raise

    async def _get_response_via_http(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Dapatkan respons menggunakan HTTP client"""
        payload = {
            "model": self.model_id,
            "messages": messages,
            "max_tokens": 2000,
            "temperature": 0.3,
            "top_p": 0.9
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                json=payload,
                headers=headers
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
                
            return self._format_success_response(ai_response)

    def _format_success_response(self, ai_response: str) -> Dict[str, Any]:
        """Format respons sukses dengan sitasi dan disclaimer"""
        return {
            "answer": ai_response,
            "citations": self._extract_citations(ai_response),
            "disclaimer": "Informasi ini bersifat edukasi dan bukan merupakan nasihat hukum resmi. "
                        "Pasalku.ai tidak bertanggung jawab atas penggunaan informasi ini untuk "
                        "keputusan hukum. Untuk kasus spesifik, mohon berkonsultasi dengan "
                        "advokat yang berkompeten."
        }

    def _get_fallback_response(self, query: str) -> Dict[str, Any]:
        """Sediakan respons fallback ketika layanan BytePlus tidak tersedia"""
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

    async def test_connection(self) -> bool:
        """Uji koneksi ke API BytePlus Ark"""
        if not self.api_key:
            return False
            
        try:
            test_messages = [
                {"role": "system", "content": "You are a test assistant."},
                {"role": "user", "content": "Hello, test connection"}
            ]
            
            if self.sdk_client:
                # Uji menggunakan SDK
                response = self.sdk_client.chat.completions.create(
                    model=self.model_id,
                    messages=test_messages,
                    max_tokens=50,
                    temperature=0.1
                )
                return bool(response and hasattr(response, 'choices'))
            else:
                # Uji menggunakan HTTP
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

# Instansi global
ai_service = ArkAIService()