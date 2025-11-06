"""
Enhanced AI Service dengan streaming, error handling, dan rate limiting
"""
import asyncio
import logging
import json
import time
from typing import Dict, List, Any, Optional, AsyncGenerator
from datetime import datetime, timedelta
import aiohttp
from aiohttp import ClientTimeout
import backoff
import re

from core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.base_url = settings.ARK_BASE_URL
        self.api_key = settings.ARK_API_KEY
        self.model_id = settings.ARK_MODEL_ID
        self.timeout = ClientTimeout(total=30)
        self.max_retries = 3
        self.rate_limit_window = 60  # seconds
        self.max_requests_per_window = 100  # requests per minute

        # Rate limiting storage (in production, use Redis)
        self.request_counts = {}
        self.last_cleanup = time.time()

    def _cleanup_rate_limits(self):
        """Clean up old rate limit entries."""
        current_time = time.time()
        if current_time - self.last_cleanup > 300:  # Clean up every 5 minutes
            cutoff_time = current_time - self.rate_limit_window
            self.request_counts = {
                user_id: timestamps
                for user_id, timestamps in self.request_counts.items()
                if any(ts > cutoff_time for ts in timestamps)
            }
            self.last_cleanup = current_time

    def _check_rate_limit(self, user_id: str) -> bool:
        """Check if user is within rate limits."""
        self._cleanup_rate_limits()
        current_time = time.time()

        if user_id not in self.request_counts:
            self.request_counts[user_id] = []

        # Remove old timestamps
        cutoff_time = current_time - self.rate_limit_window
        self.request_counts[user_id] = [
            ts for ts in self.request_counts[user_id] if ts > cutoff_time
        ]

        # Check if under limit
        if len(self.request_counts[user_id]) >= self.max_requests_per_window:
            return False

        # Add current request
        self.request_counts[user_id].append(current_time)
        return True

    @backoff.on_exception(
        backoff.expo,
        (aiohttp.ClientError, asyncio.TimeoutError),
        max_tries=3,
        jitter=backoff.random_jitter
    )
    async def _make_request(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Make HTTP request to AI service with retry logic."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        async with aiohttp.ClientSession(timeout=self.timeout) as session:
            async with session.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"AI service error: {response.status} - {error_text}")
                    raise aiohttp.ClientError(f"AI service returned {response.status}")

                return await response.json()

    async def test_connection(self) -> bool:
        """Test connection to AI service."""
        try:
            # Simple test payload
            test_payload = {
                "model": self.model_id,
                "messages": [{"role": "user", "content": "Test"}],
                "max_tokens": 10
            }

            await self._make_request(test_payload)
            logger.info("AI service connection test successful")
            return True
        except Exception as e:
            logger.error(f"AI service connection test failed: {str(e)}")
            return False

    async def get_legal_response(
        self,
        query: str,
        user_context: str = "",
        session_history: Optional[List[Dict[str, str]]] = None,
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Get legal response from AI service.

        Args:
            query: User's legal question
            user_context: Additional context about the user
            session_history: Previous messages in the conversation
            stream: Whether to stream the response

        Returns:
            Dict containing answer, citations, and disclaimer
        """
        try:
            # Check rate limiting (skip for now, implement per user later)
            # if not self._check_rate_limit(user_id):
            #     raise Exception("Rate limit exceeded")

            # Prepare system prompt with AI Constitution
            system_prompt = f"""Anda adalah asisten AI hukum Indonesia Pasalku.ai yang membantu pengguna dengan pertanyaan hukum.

**KONSTITUSI AI PASALKU:**
1. Berikan jawaban dalam format JSON terstruktur yang VALID
2. Sertakan analisis mendalam berdasarkan hukum positif Indonesia
3. Sertakan opsi-opsi solusi yang tersedia dengan estimasi durasi dan biaya
4. Berikan sitasi hukum yang relevan dan valid
5. Jaga netralitas dan profesionalitas
6. Akhiri dengan disclaimer bahwa ini bukan nasihat hukum resmi

**KONTEKS PENGGUNA:**
Role: {user_context.split(',')[0] if ',' in user_context else user_context}

**FORMAT JAWABAN JSON YANG WAJIB:**
{{
  "analysis": "Analisis mendalam situasi hukum berdasarkan fakta dan hukum positif Indonesia",
  "options": [
    {{
      "solution": "Nama solusi yang jelas",
      "description": "Penjelasan lengkap solusi ini",
      "duration_estimate": "cepat/sedang/lama",
      "cost_estimate": "rendah/sedang/tinggi"
    }}
  ],
  "recommendations": "Rekomendasi utama berdasarkan analisis",
  "citations": ["Daftar sitasi hukum: UU No. tahun Tentang pokok", "Putusan Mahkamah Agung dll"],
  "disclaimer": "Disclaimer bahwa ini bukan nasihat hukum resmi"
}}

**PANDUAN TEKNIS:**
- Pastikan JSON valid dan tidak ada syntax error
- Gunakan bahasa Indonesia yang formal dan profesional
- Fokus pada aspek hukum Indonesia
- Berikan estimasi yang realistis

**INSTRUKSI KHUSUS:**
Jika pertanyaan sederhana, berikan jawaban langsung tapi tetap dalam format JSON.
Jika pertanyaan kompleks, berikan analisis mendalam dengan opsi solusi yang lengkap.

Pertanyaan pengguna: {query}"""

            # Prepare messages
            messages = [{"role": "system", "content": system_prompt}]

            # Add session history if provided
            if session_history:
                messages.extend(session_history[-10:])  # Last 10 messages

            # Add current query
            messages.append({"role": "user", "content": query})

            # Prepare payload
            payload = {
                "model": self.model_id,
                "messages": messages,
                "max_tokens": 2000,
                "temperature": 0.7,
                "stream": stream
            }

            logger.info(f"Sending request to AI service for query: {query[:50]}...")

            if stream:
                # Handle streaming response
                return await self._get_streaming_response(payload)
            else:
                # Handle regular response
                response_data = await self._make_request(payload)

                # Extract response
                if "choices" in response_data and response_data["choices"]:
                    ai_response = response_data["choices"][0]["message"]["content"]

                    # Try to parse as structured JSON first
                    try:
                        import json
                        # Clean the response if it contains markdown code blocks
                        if ai_response.strip().startswith('```json'):
                            # Extract content from JSON code block
                            json_match = re.search(r'```json\s*\n(.*?)\n```', ai_response, re.DOTALL)
                            if json_match:
                                ai_response = json_match.group(1)
                        elif ai_response.strip().startswith('```'):
                            # Extract content from generic code block
                            code_match = re.search(r'```\s*\n(.*?)\n```', ai_response, re.DOTALL)
                            if code_match:
                                ai_response = code_match.group(1)

                        structured_response = json.loads(ai_response)

                        # Extract citations (basic implementation)
                        citations = self._extract_citations(ai_response)

                        return {
                            "answer": structured_response.get("analysis", ai_response),
                            "citations": structured_response.get("citations", citations),
                            "disclaimer": structured_response.get("disclaimer", (
                                "Informasi yang diberikan bersifat umum dan bukan merupakan nasihat hukum. "
                                "Untuk masalah hukum spesifik, disarankan untuk berkonsultasi dengan pengacara."
                            )),
                            "model": self.model_id,
                            "tokens_used": response_data.get("usage", {}).get("total_tokens", 0),
                            "structured": True,
                            "options": structured_response.get("options", []),
                            "recommendations": structured_response.get("recommendations", "")
                        }
                    except json.JSONDecodeError:
                        # Fallback to regular text response
                        citations = self._extract_citations(ai_response)
                        return {
                            "answer": ai_response,
                            "citations": citations,
                            "disclaimer": (
                                "Informasi yang diberikan bersifat umum dan bukan merupakan nasihat hukum. "
                                "Untuk masalah hukum spesifik, disarankan untuk berkonsultasi dengan pengacara."
                            ),
                            "model": self.model_id,
                            "tokens_used": response_data.get("usage", {}).get("total_tokens", 0),
                            "structured": False
                        }
                else:
                    raise Exception("Invalid response format from AI service")

        except Exception as e:
            logger.error(f"Error getting AI response: {str(e)}")
            raise Exception(f"Failed to get AI response: {str(e)}")

    async def _get_streaming_response(self, payload: Dict[str, Any]) -> AsyncGenerator[str, None]:
        """Get streaming response from AI service."""
        # For now, return non-streaming response
        # Streaming implementation would require SSE or WebSocket
        response_data = await self._make_request(payload)

        if "choices" in response_data and response_data["choices"]:
            ai_response = response_data["choices"][0]["message"]["content"]
            yield ai_response
        else:
            yield "Maaf, terjadi kesalahan dalam memproses permintaan Anda."

    def _extract_citations(self, response: str) -> List[str]:
        """Extract legal citations from AI response."""
        citations = []

        # Basic citation extraction patterns
        import re

        # Look for common legal citation patterns
        patterns = [
            r'Pasal\s+\d+',
            r'UU\s+No\.\s*\d+',
            r'Undang-undang\s+No\.\s*\d+',
            r'KUH\s+Pidana',
            r'KUH\s+Perdata'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, response, re.IGNORECASE)
            citations.extend(matches)

        # Remove duplicates and limit to 5 citations
        return list(set(citations))[:5]

    async def get_conversation_summary(self, messages: List[Dict[str, str]]) -> str:
        """Generate summary of conversation."""
        try:
            summary_prompt = "Ringkas percakapan berikut dalam 2-3 kalimat:"
            conversation_text = "\n".join([
                f"{msg['role']}: {msg['content'][:200]}..."
                for msg in messages[-20:]  # Last 20 messages
            ])

            payload = {
                "model": self.model_id,
                "messages": [
                    {"role": "system", "content": "Buat ringkasan singkat dari percakapan hukum."},
                    {"role": "user", "content": f"{summary_prompt}\n\n{conversation_text}"}
                ],
                "max_tokens": 200
            }

            response_data = await self._make_request(payload)

            if "choices" in response_data and response_data["choices"]:
                return response_data["choices"][0]["message"]["content"]
            else:
                return "Ringkasan tidak tersedia"

        except Exception as e:
            logger.error(f"Error generating conversation summary: {str(e)}")
            return "Ringkasan tidak tersedia"

    def classify_legal_problem(self, query: str) -> str:
        """Classify legal problem into categories."""
        lower_query = query.lower()
        if any(word in lower_query for word in ['phk', 'pemutusan', 'kerja', 'karyawan', 'buruh']):
            return 'Hukum Ketenagakerjaan'
        elif any(word in lower_query for word in ['pidana', 'penjara', 'kriminal', 'kejahatan']):
            return 'Hukum Pidana'
        elif any(word in lower_query for word in ['perdata', 'kontrak', 'perjanjian', 'gugatan']):
            return 'Hukum Perdata'
        elif any(word in lower_query for word in ['keluarga', 'cerai', 'waris', 'perceraian']):
            return 'Hukum Keluarga'
        elif any(word in lower_query for word in ['tanah', 'properti', 'sertifikat', 'tanah']):
            return 'Hukum Pertanahan'
        else:
            return 'Hukum Perdata'  # default

    def get_structured_questions(self, category: str) -> List[str]:
        """Get structured questions based on legal category."""
        questions_map = {
            'Hukum Ketenagakerjaan': [
                'Kapan kejadian PHK atau pemutusan hubungan kerja terjadi?',
                'Apakah Anda memiliki kontrak kerja tertulis?',
                'Berapa lama Anda bekerja di perusahaan tersebut?',
                'Apakah perusahaan memberikan pesangon atau kompensasi?',
                'Apakah ada alasan yang diberikan perusahaan untuk PHK?'
            ],
            'Hukum Pidana': [
                'Kapan kejadian pidana terjadi?',
                'Siapa saja pihak yang terlibat?',
                'Apakah sudah ada laporan polisi?',
                'Apakah ada saksi mata atau bukti lainnya?',
                'Apakah Anda korban atau tersangka?'
            ],
            'Hukum Perdata': [
                'Kapan kejadian atau perselisihan terjadi?',
                'Siapa saja pihak yang terlibat?',
                'Apakah ada perjanjian tertulis?',
                'Apa nilai kerugian atau jumlah yang dipersengketakan?',
                'Apakah sudah ada upaya mediasi atau negosiasi?'
            ],
            'Hukum Keluarga': [
                'Kapan kejadian atau perselisihan keluarga terjadi?',
                'Siapa saja anggota keluarga yang terlibat?',
                'Apakah ada anak yang terlibat?',
                'Apakah ada harta bersama yang perlu dibagi?',
                'Apakah sudah ada upaya mediasi keluarga?'
            ],
            'Hukum Pertanahan': [
                'Kapan masalah tanah atau properti terjadi?',
                'Apakah Anda memiliki sertifikat tanah?',
                'Siapa saja pihak yang mengklaim hak atas tanah tersebut?',
                'Apakah ada bukti kepemilikan lainnya?',
                'Apakah sudah ada pengaduan ke BPN?'
            ]
        }
        return questions_map.get(category, questions_map['Hukum Perdata'])

    async def generate_legal_analysis(self, consultation_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate structured legal analysis with options and estimates based on AI Constitution."""
        try:
            category = consultation_data.get('category', 'Hukum Perdata')
            problem = consultation_data.get('problem', '')
            answers = consultation_data.get('answers', [])
            evidence = consultation_data.get('evidence', '')

            # AI Constitution prompt for structured analysis
            analysis_prompt = f"""
Sebagai asisten hukum AI Pasalku.ai, Anda harus memberikan analisis hukum yang akurat dan terstruktur sesuai dengan Konstitusi AI berikut:

**KONSTITUSI AI PASALKU:**
1. Berikan jawaban dalam format JSON terstruktur
2. Sertakan analisis mendalam berdasarkan hukum positif Indonesia
3. Sertakan opsi-opsi solusi yang tersedia dengan estimasi durasi dan biaya
4. Berikan sitasi hukum yang relevan dan valid
5. Jaga netralitas dan profesionalitas
6. Akhiri dengan disclaimer bahwa ini bukan nasihat hukum resmi

**DATA KLIEN:**
Kategori: {category}
Masalah: {problem}
Jawaban klarifikasi: {'; '.join(answers)}
Bukti pendukung: {evidence}

**FORMAT JAWABAN (dalam JSON):**
{{
  "analysis": "Analisis mendalam situasi hukum berdasarkan fakta dan hukum positif",
  "options": [
    {{
      "solution": "Nama solusi",
      "description": "Penjelasan lengkap solusi",
      "duration_estimate": "cepat/sedang/lama",
      "cost_estimate": "rendah/sedang/tinggi"
    }}
  ],
  "recommendations": "Rekomendasi utama berdasarkan analisis",
  "citations": ["Daftar sitasi hukum: UU No. tahun Tentang pokok", "Putusan Mahkamah dll"],
  "disclaimer": "Disclaimer bahwa ini bukan nasihat hukum resmi"
}}
"""

            payload = {
                "model": self.model_id,
                "messages": [
                    {"role": "system", "content": "Anda adalah AI hukum Indonesia yang mengikuti Konstitusi AI Pasalku. Berikan analisis dalam format JSON yang valid sesuai dengan instruksi."},
                    {"role": "user", "content": analysis_prompt}
                ],
                "max_tokens": 1000,
                "temperature": 0.3  # Lower temperature for more consistent, factual responses
            }

            response_data = await self._make_request(payload)

            if "choices" in response_data and response_data["choices"]:
                ai_response = response_data["choices"][0]["message"]["content"]

                # Try to parse JSON
                try:
                    # Clean the response if it contains markdown code blocks
                    if ai_response.strip().startswith('```json'):
                        # Extract content from JSON code block
                        json_match = re.search(r'```json\s*\n(.*?)\n```', ai_response, re.DOTALL)
                        if json_match:
                            ai_response = json_match.group(1)
                    elif ai_response.strip().startswith('```'):
                        # Extract content from generic code block
                        code_match = re.search(r'```\s*\n(.*?)\n```', ai_response, re.DOTALL)
                        if code_match:
                            ai_response = code_match.group(1)

                    analysis = json.loads(ai_response)
                    # Ensure disclaimer is included
                    if "disclaimer" not in analysis:
                        analysis["disclaimer"] = "Informasi ini merupakan hasil analisis AI dan bukan nasihat hukum resmi. Konsultasikan dengan pengacara profesional untuk penanganan spesifik."
                    return analysis
                except json.JSONDecodeError:
                    # Fallback analysis
                    return {
                        "analysis": f"Berdasarkan informasi yang diberikan, masalah ini terkait {category}. Analisis mendalam membutuhkan konsultasi dengan profesional hukum.",
                        "options": [
                            {
                                "solution": "Konsultasi Pengacara",
                                "description": "Konsultasikan dengan pengacara profesional untuk penanganan spesifik terhadap kasus Anda",
                                "duration_estimate": "sedang",
                                "cost_estimate": "sedang"
                            }
                        ],
                        "recommendations": f"Segera konsultasikan dengan pengacara yang berkompeten di bidang {category}",
                        "citations": [f"Hukum positif Indonesia yang relevan dengan {category}"],
                        "disclaimer": "Informasi ini merupakan hasil analisis AI dan bukan nasihat hukum resmi. Konsultasikan dengan pengacara profesional untuk penanganan spesifik."
                    }
            else:
                raise Exception("Invalid response from AI service")

        except Exception as e:
            logger.error(f"Error generating legal analysis: {str(e)}")
            return {
                "analysis": "Terjadi kesalahan dalam analisis. Silakan coba lagi.",
                "options": [
                    {
                        "solution": "Konsultasi Pengacara",
                        "description": "Konsultasikan dengan pengacara profesional untuk penanganan spesifik terhadap kasus Anda",
                        "duration_estimate": "sedang",
                        "cost_estimate": "sedang"
                    }
                ],
                "recommendations": "Segera konsultasikan dengan pengacara yang berkompeten",
                "citations": [],
                "disclaimer": "Informasi ini merupakan hasil analisis AI dan bukan nasihat hukum resmi. Konsultasikan dengan pengacara profesional untuk penanganan spesifik."
            }

    async def get_clarity_flow_response(
        self,
        phase: str,
        user_input: str,
        consultation_data: Dict[str, Any],
        session_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Get response for Clarity Flow phases.

        Phases: initial, classification, questions, evidence, summary, analysis, naming, clarification
        """
        try:
            if phase == "initial":
                return {
                    "message": """Halo! Saya Pasalku.ai, asisten informasi hukum Anda. Saya akan memandu Anda memahami permasalahan hukum dengan cara yang terstruktur dan jelas.

**Sebelum kita mulai:**
- Saya TIDAK memberikan nasihat hukum
- Saya memberikan INFORMASI HUKUM berdasarkan peraturan yang berlaku
- Setiap jawaban akan disertai dengan SITASI hukum
- Jawaban akan diakhiri dengan DISCLAIMER

**Langkah-langkah yang akan kita lalui:**
1. Anda menceritakan permasalahan hukum
2. Saya akan mengajukan beberapa pertanyaan klarifikasi
3. Kita akan membahas bukti pendukung
4. Saya berikan analisis dan opsi solusi

Silakan ceritakan permasalahan hukum Anda.""",
                    "citations": [],
                    "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
                }

            elif phase == "classification":
                category = self.classify_legal_problem(user_input)
                return {
                    "message": f"Apakah masalah Anda ini lebih terkait dengan **{category}**? Mohon konfirmasi dengan menjawab 'Ya' atau 'Tidak'. Jika tidak sesuai, silakan sebutkan kategori yang benar.",
                    "category": category,
                    "citations": [],
                    "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
                }

            elif phase == "questions":
                category = consultation_data.get('category', 'Hukum Perdata')
                questions = self.get_structured_questions(category)
                current_index = consultation_data.get('current_question_index', 0)

                if current_index < len(questions):
                    return {
                        "message": f"Pertanyaan {current_index + 1}: {questions[current_index]}",
                        "citations": [],
                        "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
                    }
                else:
                    return {
                        "message": "Terima kasih atas jawaban Anda. Sekarang, mari kita bahas bukti pendukung yang Anda miliki untuk memperkuat kasus Anda.\n\nSilakan jelaskan bukti-bukti yang relevan (misal: dokumen, foto, saksi, dll.).",
                        "citations": [],
                        "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
                    }

            elif phase == "evidence":
                return {
                    "message": "Baik, saya telah mencatat bukti yang Anda sebutkan. Sekarang saya akan menyusun ringkasan dari semua informasi yang telah dikumpulkan.",
                    "citations": [],
                    "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
                }

            elif phase == "summary":
                # Generate summary
                summary = f"""**Ringkasan Konsultasi Hukum**

**Masalah:** {consultation_data.get('problem', '')}

**Kategori:** {consultation_data.get('category', '')}

**Jawaban Pertanyaan:**
{chr(10).join(f"{i+1}. {answer}" for i, answer in enumerate(consultation_data.get('answers', [])))}

**Bukti Pendukung:** {consultation_data.get('evidence', '')}

Apakah ringkasan ini akurat? Jawab 'Ya' untuk melanjutkan ke analisis, atau 'Tidak' untuk memperbaiki."""

                return {
                    "message": summary,
                    "citations": [],
                    "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
                }

            elif phase == "analysis":
                analysis = await self.generate_legal_analysis(consultation_data)
                return {
                    "message": f"""**Analisis Hukum**

{analysis.get('analysis', '')}

**Opsi Solusi:**
{chr(10).join(f"- **{opt['solution']}**: {opt['description']} (Durasi: {opt['duration_estimate']}, Biaya: {opt['cost_estimate']})" for opt in analysis.get('options', []))}

**Rekomendasi:** {analysis.get('recommendations', '')}

**Sumber Hukum:**
{chr(10).join(f"- {citation}" for citation in analysis.get('citations', []))}

**Disclaimer:** Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi.""",
                    "citations": analysis.get('citations', []),
                    "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
                }

            elif phase == "naming":
                return {
                    "message": "Untuk menyimpan konsultasi ini dengan aman, silakan berikan nama untuk sesi konsultasi ini.",
                    "citations": [],
                    "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
                }

            elif phase == "clarification":
                return {
                    "message": f"Sesi konsultasi '{user_input}' telah disimpan. Apakah ada yang ingin Anda tanyakan lebih lanjut atau butuh klarifikasi?",
                    "citations": [],
                    "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
                }

            else:
                # Default response
                return await self.get_legal_response(user_input, session_history=session_history)

        except Exception as e:
            logger.error(f"Error in clarity flow response: {str(e)}")
            return {
                "message": "Maaf, terjadi kesalahan. Silakan coba lagi.",
                "citations": [],
                "disclaimer": "Informasi ini bukan merupakan nasihat hukum. Untuk nasihat hukum yang spesifik, harap konsultasikan dengan profesional hukum yang berkualifikasi."
            }

# Global AI service instance
ai_service_enhanced = AIService()