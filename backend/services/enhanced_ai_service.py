from typing import List, Dict, Any, Optional
import httpx
import json
import logging
from passlib.context import CryptContext
from ..core.config import settings
from .. import schemas
from ..models import ChatSession, ChatMessage

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

LEGAL_ASSISTANT_PROMPT = """
Anda adalah asisten hukum AI untuk Pasalku.ai. Ikuti panduan ini dengan ketat:

1. PROSES KONSULTASI:
   - Selalu mulai dengan klasifikasi masalah hukum
   - Ajukan pertanyaan terstruktur dan relevan
   - Lakukan "pengumpulan bukti" dengan menanyakan bukti yang dimiliki
   - Berikan rangkuman sebelum analisis final
   - Sajikan opsi solusi dengan estimasi durasi dan biaya

2. PANDUAN PENTING:
   - JANGAN memberikan nasihat hukum langsung
   - SELALU sertakan dasar hukum (UU, Pasal)
   - Jaga kerahasiaan informasi pengguna
   - Gunakan bahasa yang mudah dipahami
   - Rekomendasikan konsultasi dengan praktisi hukum untuk kasus serius

3. FORMAT JAWABAN:
   Strukturkan respons dalam format JSON dengan properti:
   {
     "klasifikasi": "Kategori masalah hukum",
     "analisis": "Analisis hukum berdasarkan informasi",
     "dasar_hukum": ["UU/Pasal terkait"],
     "bukti_diperlukan": ["Daftar bukti yang relevan"],
     "opsi_solusi": [
       {
         "opsi": "Deskripsi solusi",
         "durasi": "Estimasi waktu",
         "biaya": "Estimasi biaya"
       }
     ],
     "rekomendasi": "Langkah berikutnya",
     "disclaimer": "Informasi ini bersifat umum dan bukan merupakan nasihat hukum..."
   }
"""

class EnhancedAIConsultationService:
    def __init__(self):
        # BytePlus Ark setup
        self.ark_url = settings.ARK_BASE_URL
        self.ark_key = settings.ARK_API_KEY
        self.ark_headers = {
            "Authorization": f"Bearer {self.ark_key}",
            "Content-Type": "application/json"
        }
        
        # Groq fallback setup
        self.groq_key = settings.GROQ_API_KEY
        self.groq_headers = {
            "Authorization": f"Bearer {self.groq_key}",
            "Content-Type": "application/json"
        }

    async def start_consultation(self, category: str) -> Dict[str, Any]:
        """Initialize consultation with category-specific greeting"""
        greeting_prompt = f"""
        Mulai sesi konsultasi hukum untuk kategori {category}.
        1. Perkenalkan diri
        2. Jelaskan proses konsultasi
        3. Mulai dengan pertanyaan awal yang relevan
        4. Sertakan disclaimer
        """
        
        response = await self._get_ai_response(
            prompt=greeting_prompt,
            category=category
        )
        
        return self._parse_response(response)

    async def process_message(
        self,
        session: ChatSession,
        message: str,
        history: List[ChatMessage]
    ) -> Dict[str, Any]:
        """Process user message with full consultation context"""
        # Build context from history
        context = self._build_context(history)
        
        # Get consultation data
        consultation_data = json.loads(session.consultation_data) if session.consultation_data else {}
        
        # Create enhanced prompt
        enhanced_prompt = f"""
        Kategori: {session.category}
        Fase Konsultasi: {session.phase}
        
        Konteks Sebelumnya:
        {json.dumps(consultation_data, indent=2, ensure_ascii=False)}
        
        Pesan Pengguna:
        {message}
        
        Instruksi:
        1. Analisis pesan dalam konteks konsultasi
        2. Lanjutkan dengan pertanyaan yang relevan
        3. Update analisis sesuai informasi baru
        4. Berikan respons terstruktur
        """
        
        response = await self._get_ai_response(
            prompt=enhanced_prompt,
            category=session.category,
            context=context
        )
        
        parsed = self._parse_response(response)
        
        # Update consultation data
        updated_data = self._update_consultation_data(
            consultation_data,
            parsed
        )
        
        return {
            "response": parsed["response"],
            "analysis": updated_data
        }

    async def generate_summary(self, session: ChatSession) -> str:
        """Generate comprehensive consultation summary"""
        if not session.consultation_data:
            return "Tidak ada data konsultasi yang tersedia"
        
        data = json.loads(session.consultation_data)
        
        summary_prompt = f"""
        Buat ringkasan komprehensif dari konsultasi hukum ini.
        
        Data Konsultasi:
        {json.dumps(data, indent=2, ensure_ascii=False)}
        
        Format ringkasan harus mencakup:
        1. Klasifikasi Masalah Hukum
        2. Analisis Situasi
        3. Dasar Hukum Terkait
        4. Bukti yang Dikumpulkan/Diperlukan
        5. Opsi Solusi (dengan estimasi waktu & biaya)
        6. Rekomendasi Langkah Selanjutnya
        7. Disclaimer
        """
        
        response = await self._get_ai_response(
            prompt=summary_prompt,
            category=session.category
        )
        
        return self._parse_response(response)["response"]

    async def _get_ai_response(
        self,
        prompt: str,
        category: str,
        context: Optional[List] = None
    ) -> str:
        """Get AI response with fallback mechanism"""
        try:
            # Try BytePlus Ark first
            response = await self._get_ark_response(prompt, category, context)
            if response:
                return response
            
            # Fallback to Groq
            return await self._get_groq_response(prompt, category, context)
            
        except Exception as e:
            logger.error(f"AI response error: {str(e)}")
            return json.dumps({
                "response": "Maaf, terjadi kesalahan teknis. Silakan coba lagi.",
                "error": str(e)
            })

    async def _get_ark_response(
        self,
        prompt: str,
        category: str,
        context: Optional[List] = None
    ) -> Optional[str]:
        """Get response from BytePlus Ark"""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "model": settings.ARK_MODEL_ID,
                    "messages": [
                        {
                            "role": "system",
                            "content": LEGAL_ASSISTANT_PROMPT
                        }
                    ]
                }
                
                if context:
                    payload["messages"].extend(context)
                
                payload["messages"].append({
                    "role": "user",
                    "content": prompt
                })
                
                response = await client.post(
                    f"{self.ark_url}/chat/completions",
                    headers=self.ark_headers,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]
                
                return None
                
        except Exception as e:
            logger.error(f"BytePlus Ark error: {str(e)}")
            return None

    async def _get_groq_response(
        self,
        prompt: str,
        category: str,
        context: Optional[List] = None
    ) -> str:
        """Get response from Groq as fallback"""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "model": "mixtral-8x7b-32768",
                    "messages": [
                        {
                            "role": "system",
                            "content": LEGAL_ASSISTANT_PROMPT
                        }
                    ]
                }
                
                if context:
                    payload["messages"].extend(context)
                
                payload["messages"].append({
                    "role": "user",
                    "content": prompt
                })
                
                response = await client.post(
                    "https://api.groq.com/v1/chat/completions",
                    headers=self.groq_headers,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]
                
                raise Exception(f"Groq API error: {response.text}")
                
        except Exception as e:
            logger.error(f"Groq error: {str(e)}")
            return json.dumps({
                "response": "Maaf, terjadi kesalahan teknis. Silakan coba lagi.",
                "error": str(e)
            })

    def _parse_response(self, response: str) -> Dict[str, Any]:
        """Parse and validate AI response"""
        try:
            if isinstance(response, str):
                data = json.loads(response)
            else:
                data = response
            
            # Ensure required fields
            required_fields = ["klasifikasi", "analisis", "dasar_hukum", "opsi_solusi"]
            for field in required_fields:
                if field not in data:
                    data[field] = None
            
            # Always include disclaimer
            if "disclaimer" not in data:
                data["disclaimer"] = "Informasi ini bersifat umum dan bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
            
            return data
            
        except Exception as e:
            logger.error(f"Response parsing error: {str(e)}")
            return {
                "response": "Maaf, terjadi kesalahan dalam memproses respons. Silakan coba lagi.",
                "error": str(e)
            }

    def _build_context(self, history: List[ChatMessage]) -> List[Dict[str, str]]:
        """Build conversation context from history"""
        return [
            {
                "role": msg.role,
                "content": msg.content
            }
            for msg in history
        ]

    def _update_consultation_data(
        self,
        current_data: Dict[str, Any],
        new_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update consultation data with new information"""
        if not current_data:
            return new_data
        
        # Merge data intelligently
        merged = current_data.copy()
        
        for key, value in new_data.items():
            if key in merged:
                if isinstance(merged[key], list) and isinstance(value, list):
                    # Merge lists without duplicates
                    merged[key] = list(set(merged[key] + value))
                elif isinstance(merged[key], dict) and isinstance(value, dict):
                    # Recursively merge dictionaries
                    merged[key].update(value)
                else:
                    # Update with new value
                    merged[key] = value
            else:
                merged[key] = value
        
        return merged

    def hash_pin(self, pin: str) -> str:
        """Hash PIN for secure storage"""
        return pwd_context.hash(pin)