import os
import logging
from typing import Dict, Any
from fastapi import HTTPException
import byteplussdkcore
from byteplussdkarkruntime import Ark

logger = logging.getLogger(__name__)

class BytePlusAIService:
    def __init__(self):
        # Setup BytePlus configuration
        self.api_key = os.getenv("ARK_API_KEY")
        self.base_url = "https://ark.ap-southeast.bytepluses.com/api/v3"
        self.model = "ep-20250830093230-swczp"  # Model yang disarankan user

        # Configure BytePlus SDK
        self._configure_sdk()

        # Initialize Ark client
        if self.api_key:
            self.client = Ark(
                api_key=self.api_key,
                base_url=self.base_url,
                region="ap-southeast"
            )
        else:
            self.client = None
            logger.warning("ARK_API_KEY not found in environment variables")

    def _configure_sdk(self):
        """Configure BytePlus SDK"""
        configuration = byteplussdkcore.Configuration()
        configuration.client_side_validation = True
        configuration.schema = "http"
        configuration.debug = False
        configuration.logger_file = "sdk.log"

        byteplussdkcore.Configuration.set_default(configuration)

    async def get_legal_response(self, query: str, user_context: str = "") -> Dict[str, Any]:
        """
        Mendapatkan respons dari BytePlus AI untuk konsultasi hukum
        """
        if not self.client:
            raise HTTPException(
                status_code=503,
                detail="BytePlus client not initialized - check API key"
            )

        try:
            # System prompt yang disesuaikan untuk konsultasi hukum Indonesia
            system_prompt = f"""
Anda adalah asisten hukum AI profesional untuk masyarakat Indonesia bernama Pasalku.ai.

**INFORMASI PENGGUNA:**
- Nama: Muhammad Syarifuddin Yahya
- Kontak: +6285183104294 / +6282330919114
- Email: syarifuddinudin526@gmail.com
- Lokasi: Ngoro, Jombang, Jawa Timur

**PEDOMAN RESPON:**
1. **TIDAK MEMBERIKAN NASIHAT HUKUM** - Anda hanya memberikan INFORMASI HUKUM berdasarkan peraturan yang berlaku
2. **GUNAKAN BAHASA FORMAL** - Bahasa Indonesia yang sopan dan mudah dipahami
3. **SERTAKAN SITASI HUKUM** - Selalu cantumkan sumber hukum (UU, Pasal, Yurisprudensi)
4. **BERIKAN ANALISIS OBJEKTIF** - Jelaskan berbagai perspektif hukum
5. **TAMBAHKAN DISCLAIMER** - Selalu ingatkan bahwa ini bukan nasihat hukum

**STRUKTUR RESPON:**
1. **Pengakuan Pertanyaan** - Akui pertanyaan user
2. **Analisis Hukum** - Berikan analisis berdasarkan hukum Indonesia
3. **Opsi & Pertimbangan** - Jelaskan opsi yang tersedia
4. **Sumber Hukum** - Cantumkan UU/Pasal/Yurisprudensi
5. **Disclaimer** - Ingatkan bahwa ini informasi, bukan nasihat

**KONTEKS PENGGUNA:**
Gunakan informasi pengguna di atas jika relevan dengan pertanyaan.
"""

            # Create completion using BytePlus SDK
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Konteks: {user_context}\n\nPertanyaan: {query}"},
                ],
                # Enable encryption as recommended
                extra_headers={'x-is-encrypted': 'true'},
                # Reasonable parameters for legal consultation
                max_tokens=1500,
                temperature=0.3,  # More conservative for legal content
                top_p=0.9
            )

            ai_answer = completion.choices[0].message.content

            # Struktur respons yang sesuai
            structured_response = {
                "answer": ai_answer,
                "citations": self._extract_citations(ai_answer),
                "disclaimer": "Informasi ini bersifat edukasi dan bukan merupakan nasihat hukum resmi. Pasalku.ai tidak bertanggung jawab atas penggunaan informasi ini untuk keputusan hukum. Untuk kasus spesifik, mohon berkonsultasi dengan advokat yang berkompeten."
            }

            return structured_response

        except Exception as e:
            logger.error(f"Error calling BytePlus API: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail=f"AI service error: {str(e)}"
            )

    def _extract_citations(self, text: str) -> list:
        """Extract citations from AI response"""
        citations = []

        import re

        # Cari Pasal dalam teks
        pasal_matches = re.findall(r'Pasal\s+\d+[A-Za-z]*', text)
        citations.extend(pasal_matches)

        # Cari Undang-Undang
        uu_matches = re.findall(r'Undang-Undang\s+(?:Nomor\s+)?\d+\s+Tahun\s+\d+', text)
        citations.extend(uu_matches)

        # Cari Yurisprudensi/Putusan
        yuris_matches = re.findall(r'(?:Yurisprudensi|Putusan)\s+(?:Mahkamah\s+Agung\s+)?(?:Nomor\s+)?[\w/.-]+', text)
        citations.extend(yuris_matches)

        # Cari Kitab Undang-Undang Hukum
        kuh_matches = re.findall(r'Kitab\s+Undang-Undang\s+Hukum\s+\w+', text)
        citations.extend(kuh_matches)

        return list(set(citations))  # Remove duplicates

    def test_connection(self) -> bool:
        """Test BytePlus API connection"""
        if not self.client:
            return False

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a test assistant."},
                    {"role": "user", "content": "Hello"},
                ],
                max_tokens=50
            )
            return True
        except Exception as e:
            logger.error(f"BytePlus connection test failed: {str(e)}")
            return False

# Global instance
byteplus_service = BytePlusAIService()
