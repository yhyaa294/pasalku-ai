"""
Consolidated BytePlus Ark AI Service for Pasalku.ai
Handles all AI interactions with proper error handling and fallback mechanisms.
"""
import os
import logging
from typing import Dict, Any, Optional
from fastapi import HTTPException
import json
import asyncio

logger = logging.getLogger(__name__)

class BytePlusArkService:
    def __init__(self):
        """Initialize BytePlus Ark AI service with configuration from environment variables"""
        self.api_key = os.getenv("ARK_API_KEY")
        self.base_url = os.getenv("ARK_BASE_URL", "https://ark.ap-southeast.bytepluses.com/api/v3")
        self.model_id = os.getenv("ARK_MODEL_ID", "ep-20250830093230-swczp")
        self.region = os.getenv("ARK_REGION", "ap-southeast")
        
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the BytePlus Ark client"""
        if not self.api_key:
            logger.warning("ARK_API_KEY not found in environment variables")
            return
        
        try:
            # Import BytePlus SDK
            from byteplussdkarkruntime import Ark
            
            self.client = Ark(
                api_key=self.api_key,
                base_url=self.base_url,
                region=self.region
            )
            logger.info("BytePlus Ark client initialized successfully")
            
        except ImportError as e:
            logger.error(f"BytePlus SDK not available: {e}")
        except Exception as e:
            logger.error(f"Failed to initialize BytePlus client: {e}")
    
    async def get_legal_response(self, query: str, user_context: str = "") -> Dict[str, Any]:
        """
        Get legal consultation response from BytePlus AI
        
        Args:
            query: User's legal question
            user_context: Additional context about the user
            
        Returns:
            Dict containing answer, citations, and disclaimer
        """
        if not self.client:
            logger.warning("BytePlus client not available, using fallback response")
            return self._get_fallback_response(query)
        
        try:
            # Enhanced system prompt for Indonesian legal consultation
            system_prompt = """
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

**STRUKTUR RESPON:**
1. **Pengakuan Pertanyaan** - Terima dan pahami pertanyaan pengguna
2. **Analisis Hukum** - Berikan analisis berdasarkan hukum Indonesia yang berlaku
3. **Opsi & Pertimbangan** - Jelaskan opsi-opsi yang tersedia secara objektif
4. **Sumber Hukum** - Cantumkan UU/Pasal/Yurisprudensi yang relevan
5. **Disclaimer** - Selalu sertakan disclaimer bahwa ini informasi, bukan nasihat

**FORMAT RESPONS:**
Berikan respons dalam format JSON dengan struktur:
{
  "answer": "Jawaban lengkap dalam bahasa Indonesia",
  "citations": ["Daftar sitasi hukum"],
  "disclaimer": "Disclaimer standar"
}
"""
            
            user_message = f"Konteks Pengguna: {user_context}\n\nPertanyaan Hukum: {query}"
            
            # Make API call to BytePlus Ark
            completion = self.client.chat.completions.create(
                model=self.model_id,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                # Optimized parameters for legal consultation
                max_tokens=2000,
                temperature=0.3,  # More conservative for legal accuracy
                top_p=0.9,
                # Enable encryption for security
                extra_headers={'x-is-encrypted': 'true'}
            )
            
            response_content = completion.choices[0].message.content
            
            # Try to parse JSON response first
            try:
                structured_response = json.loads(response_content)
                # Validate required keys
                if all(key in structured_response for key in ['answer', 'citations', 'disclaimer']):
                    return structured_response
            except json.JSONDecodeError:
                pass
            
            # Fallback: create structured response from plain text
            return {
                "answer": response_content,
                "citations": self._extract_citations(response_content),
                "disclaimer": "Informasi ini bersifat edukasi dan bukan merupakan nasihat hukum resmi. Pasalku.ai tidak bertanggung jawab atas penggunaan informasi ini untuk keputusan hukum. Untuk kasus spesifik, mohon berkonsultasi dengan advokat yang berkompeten."
            }
            
        except Exception as e:
            logger.error(f"Error calling BytePlus Ark API: {str(e)}")
            return self._get_fallback_response(query)
    
    def _extract_citations(self, text: str) -> list:
        """Extract legal citations from AI response text"""
        citations = []
        
        import re
        
        # Indonesian legal citation patterns
        patterns = [
            r'Pasal\s+\d+[A-Za-z]*(?:\s+(?:ayat\s+\(\d+\)|\(\d+\)))?',  # Pasal references
            r'Undang-Undang\s+(?:Nomor\s+)?\d+\s+Tahun\s+\d+',  # UU references
            r'UU\s+(?:No\.|Nomor)\s*\d+\/\d+',  # UU abbreviation
            r'(?:Yurisprudensi|Putusan)\s+(?:Mahkamah\s+Agung\s+)?(?:Nomor\s+)?[\w\/.-]+',  # Jurisprudence
            r'Kitab\s+Undang-Undang\s+Hukum\s+\w+',  # Legal codes (KUHP, KUHPerdata, etc.)
            r'KUHP?\s*(?:Pasal\s+\d+)?',  # KUHP references
            r'KUH\s*Perdata\s*(?:Pasal\s+\d+)?',  # KUHPerdata references
            r'Peraturan\s+(?:Pemerintah|Menteri)\s+(?:Nomor\s+)?\d+',  # Government regulations
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            citations.extend(matches)
        
        # Remove duplicates and return
        return list(set(citations))
    
    def _get_fallback_response(self, query: str) -> Dict[str, Any]:
        """Provide fallback response when BytePlus service is unavailable"""
        return {
            "answer": f"Terima kasih atas pertanyaan Anda mengenai '{query[:50]}...'. Saat ini layanan AI sedang dalam pemeliharaan. Untuk konsultasi hukum yang akurat, silakan hubungi langsung developer Pasalku.ai di +6285183104294 atau email syarifuddinudin526@gmail.com.",
            "citations": ["Layanan AI sedang dalam pemeliharaan"],
            "disclaimer": "Layanan AI sementara tidak tersedia. Untuk konsultasi hukum profesional, hubungi advokat yang berkompeten atau developer Pasalku.ai."
        }
    
    def test_connection(self) -> bool:
        """Test BytePlus Ark API connection"""
        if not self.client:
            return False
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model_id,
                messages=[
                    {"role": "system", "content": "You are a test assistant."},
                    {"role": "user", "content": "Hello, test connection"}
                ],
                max_tokens=50,
                temperature=0.1
            )
            
            response = completion.choices[0].message.content
            logger.info("BytePlus connection test successful")
            return bool(response)
            
        except Exception as e:
            logger.error(f"BytePlus connection test failed: {str(e)}")
            return False

# Global service instance
ai_service = BytePlusArkService()