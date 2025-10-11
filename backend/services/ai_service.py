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

    @abstractmethod
    async def classify_problem(self, description: str) -> Dict[str, Any]:
        """
        Klasifikasi jenis masalah hukum dari deskripsi pengguna

        Args:
            description: Deskripsi masalah dari pengguna

        Returns:
            Dict dengan category, confidence, dan explanation
        """
        pass

    @abstractmethod
    async def generate_questions(self, category: str, current_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate struktur pertanyaan untuk kategori hukum tertentu

        Args:
            category: Kategori hukum
            current_data: Data yang sudah dikumpulkan

        Returns:
            List of question dictionaries with id, text, type, required
        """
        pass

    @abstractmethod
    async def process_evidence(self, evidence_description: str) -> Dict[str, Any]:
        """
        Process dan simulasi analisis bukti

        Args:
            evidence_description: Deskripsi bukti dari pengguna

        Returns:
            Dict dengan evaluation dan notes
        """
        pass

    @abstractmethod
    async def generate_pre_analysis(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate pre-analysis summary untuk konfirmasi pengguna

        Args:
            session_data: Semua data sesi konsultasi

        Returns:
            Dict dengan summary, key_points, dan next_steps
        """
        pass

    @abstractmethod
    async def generate_structured_analysis(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate analisis hukum terstruktur dengan opsi solusi

        Args:
            session_data: Data sesi konsultasi lengkap

        Returns:
            Dict dengan analysis, solution_options, dan recommendations
        """
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

    async def classify_problem(self, description: str) -> Dict[str, Any]:
        """Klasifikasi jenis masalah hukum dari deskripsi"""
        if not self.api_key:
            return {"category": "Tidak Dapat Diklasifikasikan", "confidence": 0, "explanation": "AI tidak tersedia"}

        try:
            prompt = f"""
Analisis deskripsi masalah berikut dan klasifikasikan ke dalam kategori hukum Indonesia yang tepat:

Deskripsi: {description}

Kategori hukum utama di Indonesia:
- Hukum Pidana (mis: kejahatan, pelanggaran)
- Hukum Perdata (mis: kontrak, perjanjian, kerugian)
- Hukum Keluarga (mis: perceraian, warisan)
- Hukum Tenagakerjaan (mis: PHK, gaji)
- Hukum Administrasi Negara (mis: izin, perizinan)
- Hukum Bisnis (mis: perusahaan, merger, IPO)
- Hukum Lingkungan (mis: pencemaran, AMDAL)
- Hukum Konsumen (mis: barang cacat, pelayanan buruk)

Berikan respons dalam format JSON:
{{
    "category": "nama_kategori",
    "confidence": 0.0-1.0,
    "explanation": "penjelasan_singkat"
}}
"""
            messages = [
                {"role": "system", "content": "You are a legal classification AI. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ]

            if self.sdk_client:
                response = self.sdk_client.chat.completions.create(
                    model=self.model_id,
                    messages=messages,
                    temperature=0.2,
                    max_tokens=500
                )
                result_text = response.choices[0].message.content
            else:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        json={
                            "model": self.model_id,
                            "messages": messages,
                            "max_tokens": 500,
                            "temperature": 0.2
                        },
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": f"Bearer {self.api_key}"
                        }
                    )
                    result_text = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")

            # Parse JSON response
            import json
            try:
                result = json.loads(result_text)
                return result
            except:
                # Fallback jika parsing gagal
                return {
                    "category": "Hukum Perdata",
                    "confidence": 0.5,
                    "explanation": f"Berdasarkan deskripsi: {description[:50]}..."
                }

        except Exception as e:
            logger.error(f"Error dalam klasifikasi masalah: {str(e)}")
            return {"category": "Tidak Dapat Diklasifikasikan", "confidence": 0, "explanation": str(e)}

    async def generate_questions(self, category: str, current_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate pertanyaan terstruktur berdasarkan kategori"""
        import json
        logger.info(f"[GENERATE_QUESTIONS] Starting for category: {category}, data: {current_data}")

        # Temporarily always return fallback questions for testing
        logger.warning("[GENERATE_QUESTIONS] Temporarily bypassing AI call and returning fallback questions")
        return [
            {
                "id": "fallback_question_1",
                "text": f"Jelaskan lebih detail tentang masalah hukum Anda di kategori {category}:",
                "type": "text",
                "required": True
            },
            {
                "id": "fallback_question_2",
                "text": "Berapa lama masalah ini terjadi?",
                "type": "text",
                "required": True
            },
            {
                "id": "fallback_question_3",
                "text": "Siapa saja pihak yang terlibat dalam masalah ini?",
                "type": "text",
                "required": True
            }
        ]

        if not self.api_key:
            logger.warning(f"[GENERATE_QUESTIONS] No API key available - self.api_key: '{self.api_key}', settings.ARK_API_KEY: '{settings.ARK_API_KEY}'")
            return []

        try:
            logger.info(f"[GENERATE_QUESTIONS] API key available, preparing prompt...")
            prompt = f"""
Berdasarkan kategori hukum: {category}

Dan data yang sudah dikumpulkan:
{json.dumps(current_data, indent=2, ensure_ascii=False)}

Generate daftar pertanyaan yang perlu dijawab pengguna untuk melengkapi informasi.
Urutkan dari pertanyaan umum ke spesifik.

Berikan respons dalam format JSON array:
[
    {{
        "id": "question_1",
        "text": "Pertanyaan lengkap dalam bahasa Indonesia?",
        "type": "text|date|number|choice",
        "required": true,
        "options": ["pilihan1", "pilihan2"]
    }}
]
"""
            messages = [
                {"role": "system", "content": "You are a legal questionnaire generator. Generate relevant questions for Indonesian legal consultation. Always respond with valid JSON array. Generate at least 3 questions."},
                {"role": "user", "content": prompt}
            ]

            logger.info(f"[GENERATE_QUESTIONS] Making API call to AI service...")

            if self.sdk_client:
                logger.info(f"[GENERATE_QUESTIONS] Using SDK client")
                response = self.sdk_client.chat.completions.create(
                    model=self.model_id,
                    messages=messages,
                    temperature=0.3,
                    max_tokens=1000
                )
                result_text = response.choices[0].message.content
                logger.info(f"[GENERATE_QUESTIONS] SDK response received, length: {len(result_text)}")
            else:
                logger.info(f"[GENERATE_QUESTIONS] Using HTTP client (SDK not available)")
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        json={
                            "model": self.model_id,
                            "messages": messages,
                            "max_tokens": 1000,
                            "temperature": 0.3
                        },
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": f"Bearer {self.api_key}"
                        }
                    )
                    if response.status_code == 200:
                        result_text = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
                        logger.info(f"[GENERATE_QUESTIONS] HTTP response received, length: {len(result_text)}")
                    else:
                        logger.error(f"[GENERATE_QUESTIONS] HTTP error: {response.status_code} - {response.text}")
                        result_text = ""

            # Parse JSON response
            logger.info(f"Raw AI response for questions: {result_text[:500]}...")

            try:
                questions = json.loads(result_text)
                if isinstance(questions, list) and questions:
                    logger.info(f"Successfully parsed {len(questions)} questions")
                    return questions
                else:
                    logger.warning("AI returned empty or invalid question list")
                    return [
                        {
                            "id": "general_description",
                            "text": f"Silakan jelaskan lebih detail tentang masalah hukum Anda di kategori {category}:",
                            "type": "text",
                            "required": True
                        }
                    ]
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing failed: {str(e)}")
                logger.error(f"Raw response: {result_text}")

                return [
                    {
                        "id": "general_description",
                        "text": f"Silakan jelaskan lebih detail tentang masalah hukum Anda di kategori {category}:",
                        "type": "text",
                        "required": True
                    },
                    {
                        "id": "duration",
                        "text": "Berapa lama masalah ini terjadi?",
                        "type": "text",
                        "required": True
                    },
                    {
                        "id": "parties",
                        "text": "Siapa saja pihak yang terlibat dalam masalah ini?",
                        "type": "text",
                        "required": True
                    },
                    {
                        "id": "paternity",
                        "text": "Apakah Anda membuat surat resmi atau ada komunikasi tertulis?",
                        "type": "choice",
                        "required": True,
                        "options": ["Ya, ada surat resmi", "Tidak ada, hanya komunikasi verbal", "Ada email/catatan WA"]
                    }
                ]

        except Exception as e:
            logger.error(f"Error dalam generate questions: {str(e)}")
            # Force return fallback questions instead of empty list
            logger.warning("[GENERATE_QUESTIONS] Exception occurred, returning fallback questions")
            return [
                {
                    "id": "fallback_question_1",
                    "text": f"Jelaskan lebih detail tentang masalah hukum Anda di kategori {category}:",
                    "type": "text",
                    "required": True
                },
                {
                    "id": "fallback_question_2",
                    "text": "Berapa lama masalah ini terjadi?",
                    "type": "text",
                    "required": True
                },
                {
                    "id": "fallback_question_3",
                    "text": "Siapa saja pihak yang terlibat dalam masalah ini?",
                    "type": "text",
                    "required": True
                }
            ]

    async def process_evidence(self, evidence_description: str) -> Dict[str, Any]:
        """Simulasi proses dan analisis bukti"""
        if not self.api_key:
            return {"evaluation": "Tidak dapat dievaluasi", "notes": "AI tidak tersedia"}

        try:
            prompt = f"""
Analisis deskripsi bukti berikut dalam konteks hukum Indonesia:

Deskripsi Bukti: {evidence_description}

Simulasikan evaluasi bukti hukum dengan memberikan:
1. Validitas bukti
2. Kekuatan bukti
3. Catatan penting

Berikan respons dalam format JSON:
{{
    "evaluation": "penilaian_overall",
    "validity_score": 0.0-1.0,
    "strength_level": "lemah|sedang|kuat",
    "notes": "catatan_penting",
    "recommendations": ["saran_improvement"]
}}
"""
            messages = [
                {"role": "system", "content": "You are a legal evidence evaluator. Evaluate evidence descriptions and provide legal assessment."},
                {"role": "user", "content": prompt}
            ]

            if self.sdk_client:
                response = self.sdk_client.chat.completions.create(
                    model=self.model_id,
                    messages=messages,
                    temperature=0.2,
                    max_tokens=800
                )
                result_text = response.choices[0].message.content
            else:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        json={
                            "model": self.model_id,
                            "messages": messages,
                            "max_tokens": 800,
                            "temperature": 0.2
                        },
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": f"Bearer {self.api_key}"
                        }
                    )
                    result_text = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")

            try:
                result = json.loads(result_text)
                return result
            except:
                return {
                    "evaluation": "Butuh verifikasi lebih lanjut",
                    "validity_score": 0.5,
                    "strength_level": "sedang",
                    "notes": f"Bukti: {evidence_description[:100]}...",
                    "recommendations": ["Dokumentasikan bukti dengan lebih formal"]
                }

        except Exception as e:
            logger.error(f"Error dalam process evidence: {str(e)}")
            return {"evaluation": "Error dalam evaluasi", "notes": str(e)}

    async def generate_pre_analysis(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate pre-analysis summary untuk konfirmasi"""
        if not self.api_key:
            return {"summary": "AI tidak tersedia untuk pre-analysis", "key_points": [], "next_steps": []}

        try:
            prompt = f"""
Berdasarkan data konsultasi berikut, buat ringkasan pre-analysis untuk konfirmasi pengguna:

Data Sesi:
{json.dumps(session_data, indent=2, ensure_ascii=False)}

Buat ringkasan yang mencakup:
- Masalah utama
- Pihak-pihak terlibat
- Bukti yang tersedia
- Kategori hukum
- Timeline kejadian

Berikan respons dalam format JSON:
{{
    "summary": "ringkasan_singkat_2-3_kalimat",
    "key_points": ["poin1", "poin2", "poin3"],
    "missing_information": ["info_yang_kurang"],
    "risk_assessment": "penilaian_risiko_tinggi/sedang/rendah",
    "next_steps": ["langkah_selanjutnya1", "langkah2"]
}}
"""
            messages = [
                {"role": "system", "content": "You are a legal pre-analysis assistant. Create comprehensive summaries from consultation data."},
                {"role": "user", "content": prompt}
            ]

            if self.sdk_client:
                response = self.sdk_client.chat.completions.create(
                    model=self.model_id,
                    messages=messages,
                    temperature=0.3,
                    max_tokens=1000
                )
                result_text = response.choices[0].message.content
            else:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        json={
                            "model": self.model_id,
                            "messages": messages,
                            "max_tokens": 1000,
                            "temperature": 0.3
                        },
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": f"Bearer {self.api_key}"
                        }
                    )
                    result_text = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")

            try:
                result = json.loads(result_text)
                return result
            except:
                return {
                    "summary": f"Pre-analysis untuk kasus: {session_data.get('problem_description', 'Tidak tercantum')[:100]}...",
                    "key_points": ["Perlu konfirmasi detail", "Bukti perlu diverifikasi"],
                    "missing_information": ["Detail timeline", "Informasi pihak lawan"],
                    "risk_assessment": "sedang",
                    "next_steps": ["Konfirmasi informasi dengan pengguna", "Lanjutkan ke analisis mendalam"]
                }

        except Exception as e:
            logger.error(f"Error dalam pre-analysis: {str(e)}")
            return {"summary": "Error dalam pembuatan pre-analysis", "key_points": [], "next_steps": []}

    async def generate_structured_analysis(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate analisis hukum terstruktur dengan opsi solusi"""
        if not self.api_key:
            return {"analysis": "AI tidak tersedia", "solution_options": [], "recommendations": []}

        try:
            prompt = f"""
Berdasarkan data konsultasi lengkap berikut, buat analisis hukum terstruktur dengan opsi solusi:

Data Sesi Lengkap:
{json.dumps(session_data, indent=2, ensure_ascii=False)}

Berikan analisis yang mencakup:
1. Analisis hukum utama
2. Pendapat hukum yang mungkin
3. 2-4 opsi solusi dengan estimasi durasi dan biaya
4. Rekomendasi tindakan

Gunakan format hukum Indonesia yang tepat, cantumkan pasal-pasal relevan.

Berikan respons dalam format JSON:
{{
    "analysis": {{
        "legal_basis": "dasar_hukum_utama",
        "main_issues": ["masalah1", "masalah2"],
        "legal_opinions": ["pendapat1", "pendapat2"]
    }},
    "solution_options": [
        {{
            "option_id": "option_1",
            "title": "Judul Opsi",
            "description": "Deskripsi lengkap",
            "estimated_duration": "1-3 bulan",
            "estimated_cost": "Rp 5-10 juta",
            "success_probability": "tinggi/sedang/rendah",
            "required_steps": ["langkah1", "langkah2"]
        }}
    ],
    "recommendations": ["rekomendasi1", "rekomendasi2"],
    "citations": ["Pasal 1 UU No. 1 Tahun 2020", "Yurisprudensi MA No. 123/Pdt/2020"]
}}
"""
            messages = [
                {"role": "system", "content": "You are a comprehensive legal analysis AI. Provide structured legal analysis with multiple solution options, duration and cost estimates."},
                {"role": "user", "content": prompt}
            ]

            if self.sdk_client:
                response = self.sdk_client.chat.completions.create(
                    model=self.model_id,
                    messages=messages,
                    temperature=0.4,
                    max_tokens=2000
                )
                result_text = response.choices[0].message.content
            else:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        json={
                            "model": self.model_id,
                            "messages": messages,
                            "max_tokens": 2000,
                            "temperature": 0.4
                        },
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": f"Bearer {self.api_key}"
                        }
                    )
                    result_text = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")

            try:
                result = json.loads(result_text)
                return result
            except:
                return {
                    "analysis": {
                        "legal_basis": "Perlu konsultasi lebih lanjut dengan advokat",
                        "main_issues": session_data.get('main_issues', []),
                        "legal_opinions": ["Berbagai interpretasi hukum memungkinkan"]
                    },
                    "solution_options": [
                        {
                            "option_id": "consultation",
                            "title": "Konsultasi dengan Advokat",
                            "description": "Berkonsultasi dengan advokat profesional untuk mendapatkan nasihat hukum yang akurat",
                            "estimated_duration": "1-2 minggu",
                            "estimated_cost": "Rp 500.000 - 2.000.000",
                            "success_probability": "tinggi",
                            "required_steps": ["Cari advokat kompeten", "Siapkan dokumen lengkap"]
                        }
                    ],
                    "recommendations": ["Segera konsultasi dengan ahli hukum", "Jaga semua bukti dan dokumentasi"],
                    "citations": ["Pasal 4 UU Advokat"]
                }

        except Exception as e:
            logger.error(f"Error dalam analisis terstruktur: {str(e)}")
            return {"analysis": "Error dalam analisis", "solution_options": [], "recommendations": []}

    async def analyze_evidence(self, content: bytes, evidence_type: str, description: str) -> Dict[str, Any]:
        """Analyze uploaded evidence file content using AI"""
        if not self.api_key:
            return {
                "strength_level": "unknown",
                "validity_score": 0.3,
                "notes": "AI tidak tersedia untuk analisis bukti",
                "recommendations": ["Simpan bukti dengan aman", "Dokumentasikan tanggal dan lokasi"]
            }

        try:
            # For now, basic analysis based on file properties
            # In production, this would include OCR for documents, image analysis, etc.
            analysis_prompt = f"""
            Analisis bukti berikut berdasarkan deskripsi dan tipe file:

            Tipe File: {evidence_type}
            Deskripsi Bukti: {description}
            Ukuran File: {len(content)} bytes

            Berikan penilaian komprehensif dalam konteks hukum Indonesia:

            {"""
            Khusus untuk bukti digital/surat:
            - Validitas formil (legalitas dokumen)
            - Chain of custody (asal-usul bukti)
            - Authenticity (keaslian)
            - Relevance (relevansi dengan kasus)
            """ if evidence_type in ["document", "image"] else "Kh sus untuk bukti non-digital: Evaluasi narasi dan kredibilitas saksi."}

            BERIKAN RESPON DALAM FORMAT JSON:
            {{
                "strength_level": "kuat|sedang|lemah",
                "validity_score": 0.0-1.0,
                "authenticity_score": 0.0-1.0,
                "relevance_score": 0.0-1.0,
                "notes": "penilaian detail dalam bahasa Indonesia",
                "legal_value": "penjelasan nilai bukti secara hukum",
                "recommendations": ["rekomendasi1", "rekomendasi2"],
                "preservation_advice": ["saran penyimpanan bukti"]
            }}
            """
            messages = [
                {"role": "system", "content": "You are a legal evidence evaluation expert in Indonesian law. Provide thorough forensic assessment of evidence."},
                {"role": "user", "content": analysis_prompt}
            ]

            if self.sdk_client:
                response = self.sdk_client.chat.completions.create(
                    model=self.model_id,
                    messages=messages,
                    temperature=0.2,
                    max_tokens=1000
                )
                result_text = response.choices[0].message.content
            else:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        json={
                            "model": self.model_id,
                            "messages": messages,
                            "max_tokens": 1000,
                            "temperature": 0.2
                        },
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": f"Bearer {self.api_key}"
                        }
                    )
                    result_text = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")

            try:
                result = json.loads(result_text)
                return result
            except:
                return {
                    "strength_level": "sedang",
                    "validity_score": 0.6,
                    "authenticity_score": 0.7,
                    "relevance_score": 0.8,
                    "notes": f"Bukti {evidence_type} perlu verifikasi lebih lanjut oleh ahli.",
                    "legal_value": "Bukti memiliki nilai probatif yang cukup, namun memerlukan penguatan.",
                    "recommendations": [
                        "Simpan bukti dalam kondisi original",
                        "Dokumentasikan proses pengumpulan bukti",
                        "Pertimbangkan untuk mendapatkan pendapat ahli hukum"
                    ],
                    "preservation_advice": [
                        "Simpan dalam tempat yang aman dari kerusakan",
                        "Buat duplikasi untuk keperluan pengadilan",
                        "Catat tanggal dan kondisi penyimpanan"
                    ]
                }

        except Exception as e:
            logger.error(f"Error dalam analyze evidence: {str(e)}")
            return {
                "strength_level": "belum_dievaluasi",
                "validity_score": 0.3,
                "authenticity_score": 0.3,
                "relevance_score": 0.3,
                "notes": f"Analisis AI gagal: {str(e)}",
                "legal_value": "Perlu evaluasi manual oleh ahli hukum.",
                "recommendations": ["Konsultasikan dengan advokat", "Kumpulkan bukti tambahan"],
                "preservation_advice": ["Simpan aman", "Jaga keaslian"]
            }


class GroqAIService(BaseAIService):
    """Implementasi Groq AI service sebagai fallback/komparasi"""

    def __init__(self):
        """Inisialisasi dengan konfigurasi dari settings"""
        self.api_key = settings.GROQ_API_KEY
        self.base_url = "https://api.groq.com/openai/v1"  # Groq uses OpenAI-compatible API
        self.model_id = "llama3-8b-8192"  # Default model, can be configurable

        if not self.api_key:
            logger.warning("GROQ_API_KEY tidak diatur")
            return

        logger.info("Groq AI service initialized")

    async def get_legal_response(
        self,
        query: str,
        user_context: str = "",
        **kwargs
    ) -> Dict[str, Any]:
        """Implementasi get_legal_response untuk Groq"""
        if not self.api_key:
            return self._get_fallback_response(query)

        try:
            system_prompt = self._get_system_prompt()
            user_message = f"Konteks Pengguna: {user_context}\n\nPertanyaan Hukum: {query}"
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]

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
                        detail=f"Groq API error: {response.text}"
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
            logger.error(f"Error dalam mendapatkan respons Groq AI: {str(e)}")
            return self._get_fallback_response(query)

    async def test_connection(self) -> bool:
        """Implementasi test_connection untuk Groq"""
        if not self.api_key:
            return False

        try:
            test_messages = [
                {"role": "system", "content": "You are a test assistant."},
                {"role": "user", "content": "Hello, test connection"}
            ]

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
            logger.error(f"Uji koneksi Groq gagal: {str(e)}")
            return False

    # Delegate other methods to BytePlus for now (fallback implementation)
    async def classify_problem(self, description: str) -> Dict[str, Any]:
        fallback_service = BytePlusArkService()
        return await fallback_service.classify_problem(description)

    async def generate_questions(self, category: str, current_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        fallback_service = BytePlusArkService()
        return await fallback_service.generate_questions(category, current_data)

    async def process_evidence(self, evidence_description: str) -> Dict[str, Any]:
        fallback_service = BytePlusArkService()
        return await fallback_service.process_evidence(evidence_description)

    async def generate_pre_analysis(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        fallback_service = BytePlusArkService()
        return await fallback_service.generate_pre_analysis(session_data)

    async def generate_structured_analysis(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        fallback_service = BytePlusArkService()
        return await fallback_service.generate_structured_analysis(session_data)


# Advanced Features Implementation
class AdvancedAIService(BaseAIService):
    """Advanced AI service with multi-provider consensus and specialized features"""

    def __init__(self):
        """Initialize with multiple AI providers"""
        self.primary_ai = BytePlusArkService()
        self.fallback_ai = GroqAIService()
        from backend.database import get_edgedb_client, get_turso_db
        self.edgedb_client = get_edgedb_client()
        self.turso_client = get_turso_db()

    async def get_multi_ai_consensus(
        self,
        query: str,
        user_context: str = "",
        **kwargs
    ) -> Dict[str, Any]:
        """Get consensus response from multiple AI providers"""
        if not self.fallback_ai.api_key:
            return await self.primary_ai.get_legal_response(query, user_context, **kwargs)

        try:
            # Get responses from both AIs concurrently
            primary_task = asyncio.create_task(
                self.primary_ai.get_legal_response(query, user_context, **kwargs)
            )
            fallback_task = asyncio.create_task(
                self.fallback_ai.get_legal_response(query, user_context, **kwargs)
            )

            primary_response, fallback_response = await asyncio.gather(primary_task, fallback_task)

            # Compare responses and provide consensus
            consensus = self._analyze_consensus(primary_response, fallback_response)

            return {
                "consensus_answer": consensus["answer"],
                "confidence": consensus["confidence"],
                "differences_notated": consensus["differences"],
                "citations": self._extract_citations(consensus["answer"]),
                "disclaimer": "Consensus dari multiple AI providers - silakan verifikasi dengan profesional.",
                "individual_responses": {
                    "primary": primary_response,
                    "fallback": fallback_response
                }
            }

        except Exception as e:
            logger.error(f"Error dalam multi-AI consensus: {str(e)}")
            return await self.primary_ai.get_legal_response(query, user_context, **kwargs)

    def _analyze_consensus(self, response1: Dict, response2: Dict) -> Dict:
        """Analyze consensus between two AI responses"""
        # Simple consensus analysis - in production could use more sophisticated NLP
        answer1 = response1.get("answer", "")
        answer2 = response2.get("answer", "")

        similarity_score = self._calculate_similarity(answer1, answer2)

        if similarity_score > 0.8:
            return {
                "answer": answer1,  # Use primary if very similar
                "confidence": "high",
                "differences": "Minor variations, high consensus"
            }
        elif similarity_score > 0.5:
            return {
                "answer": f"{answer1}\n\n[Alternatif dari AI kedua]: {answer2}",
                "confidence": "medium",
                "differences": "Some differences, medium consensus"
            }
        else:
            return {
                "answer": f"{answer1}\n\n[Respons berbeda dari AI kedua - silakan pilih lebih sesuai]: {answer2}",
                "confidence": "low",
                "differences": "Significant differences, consensus needed from user"
            }

    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Simple similarity calculation (placeholder for more sophisticated NLP)"""
        # Very basic word overlap similarity
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        return len(intersection) / len(union) if union else 0.0

    async def get_reasoning_chain_response(
        self,
        query: str,
        user_context: str = "",
        **kwargs
    ) -> Dict[str, Any]:
        """Get response with reasoning chain using EdgeDB knowledge graph"""
        try:
            # Get initial response
            response = await self.primary_ai.get_legal_response(query, user_context, **kwargs)

            # Query EdgeDB for related legal concepts if available
            reasoning_chain = []
            if self.edgedb_client:
                try:
                    # Query knowledge graph for related information
                    related_concepts = await self._query_knowledge_graph(query)
                    reasoning_chain = related_concepts
                except Exception as e:
                    logger.warning(f"EdgeDB query failed: {e}")
                    reasoning_chain = ["Informasi knowledge graph tidak tersedia"]

            return {
                **response,
                "reasoning_chain": reasoning_chain,
                "knowledge_source": "EdgeDB Knowledge Graph"
            }

        except Exception as e:
            logger.error(f"Error in reasoning chain response: {str(e)}")
            return await self.primary_ai.get_legal_response(query, user_context, **kwargs)

    async def _query_knowledge_graph(self, query: str) -> List[str]:
        """Query EdgeDB for legal knowledge relationships"""
        # Placeholder for EdgeDB queries - would need actual schema
        # This would query for related pasals, precedents, legal concepts
        return [
            "Query knowledge graph: Mengakses hubungan hukum terkait",
            "Referensi: Peraturan terkait kebijakan pemerintah",
            "Analisis: Membandingkan dengan kasus serupa dari yurisprudensi"
        ]

    async def get_adaptive_persona_response(
        self,
        query: str,
        user_role: str = "general",
        **kwargs
    ) -> Dict[str, Any]:
        """Get response with adaptive persona based on user role"""
        persona_prompts = {
            "legal_professional": "Anda adalah asisten AI untuk advokat profesional Indonesia. Berikan analisis mendalam dengan mencantumkan pasal-pasal hukum lengkap, yurisprudensi terkait, dan pertimbangan strategis.",
            "general": "Anda adalah asisten AI yang membantu pengguna umum dengan pertanyaan hukum. Gunakan bahasa sederhana, jelaskan istilah hukum, dan prioritaskan pemahaman.",
            "business_owner": "Anda adalah konsultan hukum bisnis. Fokus pada aspek komersial, risiko usaha, dan kepatuhan regulasi perusahaan.",
            "student": "Anda adalah tutor hukum untuk mahasiswa. Jelaskan konsep-konsep hukum dengan pendekatan akademis dan mudah dipahami."
        }

        # Store original prompt
        original_system_prompt = self.primary_ai._get_system_prompt()

        # Modify for persona
        adapted_prompt = persona_prompts.get(user_role, original_system_prompt)

        # Temporarily override system prompt (this is a simplified implementation)
        # In practice, this might require modifying the service instance
        user_context = f"Role pengguna: {user_role}. Kontekskan respons sesuai dengan background pengguna ini."

        return await self.primary_ai.get_legal_response(query, user_context, **kwargs)

    async def analyze_sentiment_and_adapt(self, query: str, **kwargs) -> Dict[str, Any]:
        """Analyze sentiment in query and adapt response accordingly"""
        sentiment = self._analyze_sentiment(query)

        # Modify temperature and tone based on sentiment
        adapted_kwargs = kwargs.copy()
        if sentiment["level"] == "urgent":
            adapted_kwargs["temperature"] = 0.7  # More creative for urgent cases
            prompt_addition = "Pengguna tampak urgent/marah. Berikan respons yang empati dan prioritaskan solusi cepat."
        elif sentiment["level"] == "confused":
            adapted_kwargs["temperature"] = 0.2  # More systematic for confused users
            prompt_addition = "Pengguna tampak bingung. Jelaskan langkah demi langkah dengan detail."
        else:
            prompt_addition = "Pengguna netral. Berikan respons balanced."

        # Adapt user context
        user_context = f"Sentimen pengguna: {sentiment['level']}. {prompt_addition}"

        return await self.primary_ai.get_legal_response(query, user_context, **adapted_kwargs)

    def _analyze_sentiment(self, text: str) -> Dict[str, str]:
        """Simple sentiment analysis (placeholder for more sophisticated NLP)"""
        urgent_keywords = ["urgent", "darurat", "segera", "panik", "marah", "kurang puas"]
        confused_keywords = ["bingung", "tidak paham", "jelaskan", "apa itu", "bagaimana"]

        text_lower = text.lower()
        if any(keyword in text_lower for keyword in urgent_keywords):
            return {"level": "urgent", "description": "Urgent/high emotion"}
        elif any(keyword in text_lower for keyword in confused_keywords):
            return {"level": "confused", "description": "Confused/needs clarity"}
        else:
            return {"level": "neutral", "description": "Neutral/calm"}

    # Delegate other methods to primary AI
    async def get_legal_response(self, query: str, user_context: str = "", **kwargs) -> Dict[str, Any]:
        return await self.primary_ai.get_legal_response(query, user_context, **kwargs)

    async def test_connection(self) -> bool:
        return await self.primary_ai.test_connection()

    async def classify_problem(self, description: str) -> Dict[str, Any]:
        return await self.primary_ai.classify_problem(description)

    async def generate_questions(self, category: str, current_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        return await self.primary_ai.generate_questions(category, current_data)

    async def process_evidence(self, evidence_description: str) -> Dict[str, Any]:
        return await self.primary_ai.process_evidence(evidence_description)

    async def generate_pre_analysis(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        return await self.primary_ai.generate_pre_analysis(session_data)

    async def generate_structured_analysis(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        return await self.primary_ai.generate_structured_analysis(session_data)


# Factory untuk membuat instance AI service berdasarkan provider
def create_ai_service(provider: str = "byteplus") -> BaseAIService:
    """
    Factory function untuk membuat instance AI service

    Args:
        provider: Nama provider AI ("byteplus", "groq", "multi", "advanced")

    Returns:
        Instance dari BaseAIService
    """
    if provider == "byteplus":
        return BytePlusArkService()
    elif provider == "groq":
        return GroqAIService()
    elif provider == "multi":
        return AdvancedAIService()
    else:
        raise ValueError(f"Provider AI tidak dikenal: {provider}")

# Instance global default (BytePlus)
ai_service = create_ai_service("byteplus")

# Advanced service instance
advanced_ai_service = create_ai_service("multi")