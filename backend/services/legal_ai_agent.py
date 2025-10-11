from typing import List, Optional, Dict, Any
import httpx
import json
from datetime import datetime
import logging
from passlib.context import CryptContext
from ..core.config import settings
from ..models import ChatSession, ChatMessage, User

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LegalAIAgent:
    def __init__(self):
        self.base_url = settings.ARK_BASE_URL
        self.api_key = settings.ARK_API_KEY
        self.model_id = settings.ARK_MODEL_ID
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.analysis_template = {
            "klasifikasi": "",
            "ringkasan_masalah": "",
            "poin_kunci": [],
            "bukti_dibutuhkan": [],
            "opsi_solusi": [],
            "rekomendasi": ""
        }

    async def create_consultation(self, user: User, category: str) -> Dict[str, Any]:
        """Initialize a new consultation session with proper greeting and context."""
        system_prompt = self._get_system_prompt(category)
        greeting = await self._get_ai_response(
            "Perkenalkan diri Anda sebagai asisten hukum AI dan mulai sesi konsultasi untuk kategori " + category,
            system_prompt
        )
        
        return {
            "greeting": greeting,
            "initial_analysis": self.analysis_template
        }

    async def process_message(
        self,
        session: ChatSession,
        message: str,
        history: List[ChatMessage]
    ) -> Dict[str, Any]:
        """Process user message and generate appropriate response."""
        system_prompt = self._get_system_prompt(session.category)
        context = self._build_context(session, history)
        
        try:
            # Generate AI response
            response = await self._get_ai_response(
                message,
                system_prompt,
                context
            )
            
            # Update consultation data if needed
            updated_analysis = self._update_analysis(session, message, response)
            
            return {
                "response": response,
                "updated_analysis": updated_analysis
            }
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            import sentry_sdk
            sentry_sdk.capture_exception(e)
            return {
                "response": "Maaf, terjadi kesalahan dalam memproses pesan Anda. Silakan coba lagi.",
                "updated_analysis": None
            }

    async def generate_summary(self, session: ChatSession, history: List[ChatMessage]) -> str:
        """Generate a comprehensive summary of the consultation session."""
        system_prompt = """
        Buatkan ringkasan komprehensif dari sesi konsultasi hukum ini.
        Format ringkasan harus mencakup:
        1. Klasifikasi Masalah Hukum
        2. Ringkasan Situasi
        3. Poin-poin Kunci
        4. Bukti yang Telah Dikumpulkan
        5. Opsi Solusi yang Dibahas
        6. Rekomendasi Berikutnya
        """
        
        context = self._build_context(session, history)
        prompt = "Buat ringkasan sesi konsultasi ini berdasarkan seluruh percakapan yang telah terjadi."
        
        return await self._get_ai_response(prompt, system_prompt, context)

    async def _get_ai_response(
        self,
        prompt: str,
        system_prompt: str,
        conversation_history: Optional[List] = None
    ) -> str:
        """Get response from AI model with fallback to Groq"""
        try:
            # Try BytePlus Ark first
            async with httpx.AsyncClient() as client:
                payload = {
                    "model": self.model_id,
                    "messages": [
                        {"role": "system", "content": system_prompt}
                    ]
                }
                
                if conversation_history:
                    payload["messages"].extend(conversation_history)
                
                payload["messages"].append({"role": "user", "content": prompt})

                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]
                
                # If BytePlus fails, try Groq as fallback
                return await self._get_groq_response(prompt, system_prompt, conversation_history)
        
        except Exception as e:
            logger.error(f"BytePlus Ark error: {str(e)}")
            import sentry_sdk
            sentry_sdk.capture_exception(e)
            
            # Fallback to Groq
            return await self._get_groq_response(prompt, system_prompt, conversation_history)

    async def _get_groq_response(
        self,
        prompt: str,
        system_prompt: str,
        conversation_history: Optional[List] = None
    ) -> str:
        """Fallback to Groq if BytePlus Ark fails"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "model": "mixtral-8x7b-32768",
                    "messages": [
                        {"role": "system", "content": system_prompt}
                    ]
                }
                
                if conversation_history:
                    payload["messages"].extend(conversation_history)
                
                payload["messages"].append({"role": "user", "content": prompt})

                response = await client.post(
                    "https://api.groq.com/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]
                
                raise Exception(f"Groq API error: {response.text}")
        
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            import sentry_sdk
            sentry_sdk.capture_exception(e)
            return "Maaf, terjadi kesalahan dalam memproses permintaan Anda. Silakan coba lagi."

    def _get_system_prompt(self, category: str) -> str:
        """Get system prompt based on legal category"""
        base_prompt = """
        Anda adalah asisten hukum AI profesional yang membantu pengguna dengan masalah hukum mereka.
        
        Panduan Wajib:
        1. SELALU mulai dengan mengklasifikasikan jenis masalah hukum yang dihadapi
        2. Ajukan pertanyaan terstruktur dari umum ke spesifik
        3. Lakukan "pengumpulan bukti" dengan menanyakan bukti yang dimiliki
        4. Berikan rangkuman sebelum analisis final
        5. Sajikan opsi solusi dengan estimasi durasi dan biaya
        6. SELALU akhiri dengan menanyakan apakah ada yang perlu diklarifikasi
        
        Prinsip Penting:
        - Jaga kerahasiaan informasi pengguna
        - Berikan saran yang realistis dan dapat ditindaklanjuti
        - Rekomendasikan konsultasi dengan praktisi hukum untuk kasus serius
        - Gunakan bahasa yang mudah dipahami
        """
        
        category_prompts = {
            "Hukum Pidana": """
            Fokus khusus untuk kasus pidana:
            - Klasifikasikan tingkat keseriusan tindak pidana
            - Identifikasi unsur-unsur tindak pidana
            - Tekankan pentingnya bukti forensik dan saksi
            - Jelaskan prosedur pelaporan ke kepolisian
            - Bahas kemungkinan pendampingan hukum
            """,
            "Hukum Perdata": """
            Fokus khusus untuk kasus perdata:
            - Identifikasi pihak-pihak yang terlibat
            - Analisis dokumen dan perjanjian terkait
            - Tekankan opsi penyelesaian di luar pengadilan
            - Estimasi biaya litigasi vs mediasi
            - Bahas prosedur gugatan perdata
            """,
            "Hukum Ketenagakerjaan": """
            Fokus khusus untuk kasus ketenagakerjaan:
            - Verifikasi status hubungan kerja
            - Analisis kontrak kerja dan peraturan perusahaan
            - Identifikasi pelanggaran hak pekerja
            - Bahas prosedur PHK dan pesangon
            - Tekankan opsi mediasi bipartit/tripartit
            """,
            "Hukum Bisnis": """
            Fokus khusus untuk kasus bisnis:
            - Analisis struktur dan dokumen bisnis
            - Bahas kepatuhan regulasi
            - Identifikasi risiko hukum
            - Tekankan pentingnya perjanjian tertulis
            - Berikan opsi mitigasi risiko
            """,
            "Hukum Keluarga": """
            Fokus khusus untuk kasus keluarga:
            - Prioritaskan pendekatan yang menjaga hubungan
            - Bahas dampak pada anak (jika relevan)
            - Tekankan opsi mediasi keluarga
            - Jelaskan prosedur pengadilan agama
            - Berikan saran untuk dokumentasi
            """
        }
        
        specific_prompt = category_prompts.get(category, """
        Fokus umum:
        - Identifikasi kategori hukum yang tepat
        - Kumpulkan informasi dasar
        - Arahkan ke spesialisasi yang sesuai
        - Berikan panduan umum
        """)
        
        return base_prompt + "\n\n" + specific_prompt

    def _build_context(self, session: ChatSession, history: List[ChatMessage]) -> List:
        """Build conversation context from history"""
        formatted_history = []
        for msg in history:
            formatted_history.append({
                "role": "user" if msg.role == "user" else "assistant",
                "content": msg.content
            })
        return formatted_history

    def _update_analysis(
        self,
        session: ChatSession,
        user_message: str,
        ai_response: str
    ) -> Dict[str, Any]:
        """Update the consultation analysis based on new information"""
        try:
            current_data = json.loads(session.consultation_data) if session.consultation_data else self.analysis_template.copy()
            
            # Update analysis based on new information
            # TODO: Implement more sophisticated analysis updates using AI
            
            return current_data
            
        except Exception as e:
            logger.error(f"Error updating analysis: {str(e)}")
            return self.analysis_template.copy()

    def hash_pin(self, pin: str) -> str:
        """Hash PIN for secure storage"""
        return pwd_context.hash(pin)