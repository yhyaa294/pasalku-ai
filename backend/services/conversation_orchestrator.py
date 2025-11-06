"""
🧠 CONVERSATION FLOW ORCHESTRATOR - AI Proactive Consultant System

Sistem ini mengubah Pasalku.ai dari "chatbot penjawab" menjadi "konsultan proaktif"
yang secara cerdas memicu 96+ fitur berdasarkan konteks percakapan.

KONSEP UTAMA:
- Chat adalah "Otak Utama" (Orchestrator)
- 96+ fitur adalah "Tools" yang dipicu secara proaktif
- AI mendeteksi kebutuhan pengguna dan menawarkan fitur premium di momen yang tepat

ALUR 4 TAHAP:
1. Konsultasi Interaktif (Gratis) - Klarifikasi masalah
2. Analisis Awal & Pemicu Fitur (Hybrid) - Tawarkan fitur premium
3. Eksekusi Fitur Lanjutan (Premium) - Contract Analysis, Persona Simulation, dll
4. Sintesis & Laporan Strategi (Premium) - PDF report generation
"""

import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from enum import Enum
import re

logger = logging.getLogger(__name__)


class ConversationStage(Enum):
    """Tahapan dalam conversation flow"""
    INITIAL_INQUIRY = "initial_inquiry"  # Tahap 1: Pengguna bertanya pertama kali
    CLARIFICATION = "clarification"       # Tahap 1: AI mengklarifikasi detail
    INITIAL_ANALYSIS = "initial_analysis" # Tahap 2: AI memberikan analisis awal
    FEATURE_OFFERING = "feature_offering" # Tahap 2: AI menawarkan fitur premium
    FEATURE_EXECUTION = "feature_execution" # Tahap 3: Eksekusi fitur yang dipilih
    SYNTHESIS = "synthesis"                # Tahap 4: Kombinasi hasil & report generation


class LegalCategory(Enum):
    """Kategori hukum yang terdeteksi"""
    KETENAGAKERJAAN = "ketenagakerjaan"
    PERDATA = "perdata"
    PIDANA = "pidana"
    BISNIS_KOMERSIAL = "bisnis_komersial"
    PROPERTI = "properti"
    KELUARGA = "keluarga"
    KONTRAK = "kontrak"
    STARTUP = "startup"
    UNKNOWN = "unknown"


class FeatureTrigger:
    """Deteksi kapan harus memicu fitur tertentu"""
    
    FEATURE_PATTERNS = {
        # Contract Intelligence Engine
        "contract_analysis": {
            "keywords": ["kontrak", "perjanjian", "agreement", "mou", "pkwt", "pkwtt", "klausul"],
            "contexts": ["review kontrak", "analisis kontrak", "cek kontrak", "kontrak kerja"],
            "tier": "premium",
            "description": "Analisis Kontrak Mendalam dengan Dual AI (BytePlus Ark + Groq)"
        },
        
        # Adaptive Persona System
        "persona_simulation": {
            "keywords": ["negosiasi", "negotiation", "rapat", "meeting", "tawar-menawar", "mediasi"],
            "contexts": ["latihan negosiasi", "simulasi", "berlatih", "persiapan meeting"],
            "tier": "professional",
            "description": "Simulasi Negosiasi dengan AI Personas (4 kepribadian berbeda)"
        },
        
        # Document OCR
        "document_ocr": {
            "keywords": ["scan", "foto dokumen", "gambar", "pdf", "upload file"],
            "contexts": ["baca dokumen", "ekstrak teks", "ocr"],
            "tier": "premium",
            "description": "Smart Document OCR - Ekstrak teks dari gambar/PDF dengan akurasi 96%"
        },
        
        # Legal Reasoning Chain
        "reasoning_analysis": {
            "keywords": ["argumen", "alasan", "logika", "pembelaan", "bantahan", "sanggahan"],
            "contexts": ["cek logika", "fallacy", "analisis argumen", "counter argument"],
            "tier": "professional",
            "description": "Reasoning Chain Analyzer - Deteksi fallacy logis & buat counter-argument"
        },
        
        # Template Generator
        "template_generation": {
            "keywords": ["template", "contoh surat", "draft", "format", "surat"],
            "contexts": ["buatkan surat", "template surat", "contoh dokumen"],
            "tier": "free",  # Basic templates gratis
            "description": "Template Generator - Generate surat hukum otomatis (Somasi, Kuasa, dll)"
        },
        
        # AI Debate System
        "ai_debate": {
            "keywords": ["perspektif lain", "pendapat berbeda", "debate", "pro kontra"],
            "contexts": ["lihat dari sudut lain", "multi perspektif", "bandingkan pendapat"],
            "tier": "professional",
            "description": "AI Debate System - Debate antar Ark AI vs Groq AI untuk perspektif seimbang"
        },
        
        # Contract Comparison
        "contract_comparison": {
            "keywords": ["bandingkan kontrak", "compare", "perbedaan kontrak", "mana yang lebih baik"],
            "contexts": ["banding kontrak", "pilih kontrak", "analisis perbedaan"],
            "tier": "premium",
            "description": "Contract Comparison Engine - Bandingkan 2 kontrak dengan Dual AI"
        },
        
        # Risk Assessment
        "risk_assessment": {
            "keywords": ["risiko", "bahaya", "ancaman", "konsekuensi", "dampak"],
            "contexts": ["analisis risiko", "apa risikonya", "bahaya apa"],
            "tier": "professional",
            "description": "Risk Assessment Engine - Analisis risiko legal mendalam"
        },
        
        # Citation Validator
        "citation_validator": {
            "keywords": ["pasal", "undang-undang", "uu", "peraturan", "pp", "perpres"],
            "contexts": ["cek pasal", "validasi uu", "apakah pasal ini benar"],
            "tier": "free",
            "description": "Citation Validator - Validasi dan jelaskan pasal hukum"
        }
    }
    
    @staticmethod
    def detect_triggers(message: str, conversation_history: List[Dict]) -> List[Dict[str, Any]]:
        """
        Deteksi fitur apa yang relevan berdasarkan pesan pengguna
        
        Returns:
            List of triggered features dengan metadata
        """
        message_lower = message.lower()
        triggered_features = []
        
        for feature_id, feature_config in FeatureTrigger.FEATURE_PATTERNS.items():
            # Check keyword matches
            keyword_score = sum(
                1 for keyword in feature_config["keywords"] 
                if keyword in message_lower
            )
            
            # Check context matches
            context_score = sum(
                1 for context in feature_config["contexts"]
                if context in message_lower
            )
            
            total_score = keyword_score + (context_score * 2)  # Context lebih penting
            
            if total_score > 0:
                triggered_features.append({
                    "feature_id": feature_id,
                    "feature_name": feature_config["description"],
                    "tier": feature_config["tier"],
                    "confidence": min(total_score / 3, 1.0),  # Normalize 0-1
                    "priority": total_score
                })
        
        # Sort by priority
        triggered_features.sort(key=lambda x: x["priority"], reverse=True)
        
        return triggered_features[:3]  # Return top 3 most relevant


class LegalCategoryDetector:
    """Deteksi kategori hukum dari percakapan"""
    
    CATEGORY_PATTERNS = {
        LegalCategory.KETENAGAKERJAAN: [
            "phk", "pesangon", "karyawan", "pekerja", "resign", "outsourcing",
            "upah", "lembur", "cuti", "pkwt", "pkwtt", "kontrak kerja",
            "mutasi", "demosi", "promosi", "thr", "bpjs", "jamsostek"
        ],
        LegalCategory.KONTRAK: [
            "kontrak", "perjanjian", "agreement", "mou", "klausul", "pasal kontrak",
            "breach", "wanprestasi", "force majeure", "addendum", "amandemen"
        ],
        LegalCategory.BISNIS_KOMERSIAL: [
            "pt", "cv", "bisnis", "partnership", "kerjasama", "investasi",
            "saham", "dividen", "modal", "ekspansi", "franchise", "lisensi"
        ],
        LegalCategory.PERDATA: [
            "gugatan", "tuntutan", "ganti rugi", "perdata", "utang piutang",
            "wanprestasi", "somasi", "mediasi", "arbitrase"
        ],
        LegalCategory.PIDANA: [
            "pidana", "penipuan", "pencurian", "penggelapan", "korupsi",
            "laporan polisi", "tersangka", "terdakwa", "jaksa", "penjara"
        ],
        LegalCategory.PROPERTI: [
            "tanah", "rumah", "properti", "sertifikat", "imb", "sewa", "kontrak sewa",
            "jual beli", "hgb", "shm", "girik", "akta jual beli"
        ],
        LegalCategory.KELUARGA: [
            "perceraian", "cerai", "hak asuh", "anak", "nafkah", "warisan",
            "pembagian harta", "harta gono-gini", "perkawinan", "nikah"
        ],
        LegalCategory.STARTUP: [
            "startup", "pendanaan", "investor", "term sheet", "cap table",
            "vesting", "equity", "co-founder", "mvp", "pivot"
        ]
    }
    
    @staticmethod
    def detect_category(message: str, conversation_history: List[Dict]) -> LegalCategory:
        """Deteksi kategori hukum dari pesan"""
        message_lower = message.lower()
        
        # Combine message dengan history terakhir untuk konteks lebih baik
        full_context = message_lower
        if conversation_history:
            recent_messages = " ".join([
                msg.get("content", "").lower() 
                for msg in conversation_history[-3:]  # Last 3 messages
            ])
            full_context = f"{recent_messages} {message_lower}"
        
        category_scores = {}
        
        for category, keywords in LegalCategoryDetector.CATEGORY_PATTERNS.items():
            score = sum(1 for keyword in keywords if keyword in full_context)
            if score > 0:
                category_scores[category] = score
        
        if not category_scores:
            return LegalCategory.UNKNOWN
        
        # Return kategori dengan score tertinggi
        return max(category_scores, key=category_scores.get)


class ClarificationGenerator:
    """Generate pertanyaan klarifikasi untuk Tahap 1"""
    
    CLARIFICATION_TEMPLATES = {
        LegalCategory.KETENAGAKERJAAN: [
            "Berapa lama Anda sudah bekerja di perusahaan tersebut?",
            "Apakah status Anda karyawan tetap (PKWTT) atau kontrak (PKWT)?",
            "Apa alasan yang diberikan perusahaan untuk PHK/masalah ini?",
            "Apakah Anda memiliki kontrak kerja tertulis?"
        ],
        LegalCategory.KONTRAK: [
            "Apakah kontrak sudah ditandatangani oleh kedua belah pihak?",
            "Kapan kontrak ini dibuat dan berapa lama durasinya?",
            "Apakah ada klausul yang menurut Anda bermasalah?",
            "Apakah Anda memiliki salinan kontrak untuk dianalisis?"
        ],
        LegalCategory.BISNIS_KOMERSIAL: [
            "Apa jenis badan usaha yang Anda miliki (PT, CV, atau lainnya)?",
            "Berapa nilai transaksi atau investasi yang terlibat?",
            "Apakah ada perjanjian tertulis dengan partner bisnis?",
            "Apa tujuan utama Anda dalam bisnis ini?"
        ],
        LegalCategory.PERDATA: [
            "Apa nilai kerugian yang Anda alami?",
            "Apakah Anda sudah mengirim somasi atau mediasi?",
            "Apakah ada bukti tertulis atau saksi?",
            "Kapan kejadian ini terjadi?"
        ],
        LegalCategory.PROPERTI: [
            "Apakah Anda memiliki sertifikat properti?",
            "Apa jenis sengketa yang terjadi (jual-beli, sewa, warisan)?",
            "Apakah ada dokumen pendukung seperti AJB atau kontrak sewa?",
            "Berapa lama masalah ini berlangsung?"
        ]
    }
    
    @staticmethod
    def generate_questions(category: LegalCategory, context: Dict) -> List[str]:
        """Generate 3-4 pertanyaan klarifikasi yang relevan"""
        questions = ClarificationGenerator.CLARIFICATION_TEMPLATES.get(
            category,
            [
                "Bisa jelaskan lebih detail situasi Anda?",
                "Apakah ada dokumen pendukung yang Anda miliki?",
                "Apa yang menjadi tujuan utama konsultasi Anda?",
                "Kapan masalah ini mulai terjadi?"
            ]
        )
        
        return questions[:4]  # Return max 4 questions


class ConversationOrchestrator:
    """
    Orchestrator utama yang mengelola alur conversation dan memicu fitur
    """
    
    def __init__(self):
        self.current_stage = ConversationStage.INITIAL_INQUIRY
        self.detected_category = LegalCategory.UNKNOWN
        self.triggered_features = []
        self.user_profile = {}
        self.session_data = {}
    
    async def process_message(
        self,
        message: str,
        conversation_history: List[Dict],
        user_tier: str = "free",  # free, professional, premium
        session_id: str = None
    ) -> Dict[str, Any]:
        """
        Proses pesan pengguna dan tentukan response + fitur yang ditawarkan
        
        Returns:
            {
                "stage": ConversationStage,
                "ai_response": str,
                "clarification_questions": List[str],  # Jika tahap klarifikasi
                "feature_offerings": List[Dict],       # Fitur yang ditawarkan
                "next_actions": List[str],
                "category": LegalCategory,
                "metadata": Dict
            }
        """
        
        # Deteksi kategori hukum
        self.detected_category = LegalCategoryDetector.detect_category(
            message, conversation_history
        )
        
        # Deteksi fitur yang relevan
        self.triggered_features = FeatureTrigger.detect_triggers(
            message, conversation_history
        )
        
        # Tentukan tahap conversation
        self.current_stage = self._determine_stage(
            message, conversation_history, user_tier
        )
        
        # Generate response berdasarkan tahap
        response = await self._generate_stage_response(
            message, conversation_history, user_tier
        )
        
        return response
    
    def _determine_stage(
        self,
        message: str,
        history: List[Dict],
        user_tier: str
    ) -> ConversationStage:
        """Tentukan tahap conversation saat ini"""
        
        # Jika baru mulai (history < 2 messages)
        if len(history) < 2:
            return ConversationStage.INITIAL_INQUIRY
        
        # Jika user baru menjawab pertanyaan klarifikasi
        if len(history) >= 2 and len(history) <= 5:
            return ConversationStage.CLARIFICATION
        
        # Jika sudah ada cukup informasi, masuk ke analisis
        if len(history) > 5 and not self._has_offered_features(history):
            return ConversationStage.INITIAL_ANALYSIS
        
        # Jika user memilih fitur
        if self._is_feature_selection(message):
            return ConversationStage.FEATURE_EXECUTION
        
        return ConversationStage.INITIAL_ANALYSIS
    
    def _has_offered_features(self, history: List[Dict]) -> bool:
        """Check apakah AI sudah menawarkan fitur premium"""
        for msg in history:
            if msg.get("role") == "assistant" and "fitur premium" in msg.get("content", "").lower():
                return True
        return False
    
    def _is_feature_selection(self, message: str) -> bool:
        """Check apakah user memilih salah satu fitur"""
        selection_patterns = [
            r"opsi\s+[abc]",
            r"pilih\s+[abc]",
            r"ya.*analisis",
            r"ya.*simulasi",
            r"gunakan.*fitur"
        ]
        
        message_lower = message.lower()
        return any(re.search(pattern, message_lower) for pattern in selection_patterns)
    
    async def _generate_stage_response(
        self,
        message: str,
        history: List[Dict],
        user_tier: str
    ) -> Dict[str, Any]:
        """Generate response berdasarkan tahap conversation"""
        
        if self.current_stage == ConversationStage.INITIAL_INQUIRY:
            return self._handle_initial_inquiry(message, history)
        
        elif self.current_stage == ConversationStage.CLARIFICATION:
            return self._handle_clarification(message, history)
        
        elif self.current_stage == ConversationStage.INITIAL_ANALYSIS:
            return self._handle_initial_analysis(message, history, user_tier)
        
        elif self.current_stage == ConversationStage.FEATURE_OFFERING:
            return self._handle_feature_offering(message, history, user_tier)
        
        elif self.current_stage == ConversationStage.FEATURE_EXECUTION:
            return self._handle_feature_execution(message, history, user_tier)
        
        else:
            return self._handle_synthesis(message, history)
    
    def _handle_initial_inquiry(self, message: str, history: List[Dict]) -> Dict[str, Any]:
        """Tahap 1: Pengguna bertanya pertama kali"""
        
        questions = ClarificationGenerator.generate_questions(
            self.detected_category, {}
        )
        
        category_name = self._get_category_display_name(self.detected_category)
        
        ai_response = f"""Saya memahami situasi Anda. Ini terkait **{category_name}**. 

Untuk analisis yang akurat, saya perlu beberapa detail tambahan:

"""
        
        for i, question in enumerate(questions, 1):
            ai_response += f"{i}. {question}\n"
        
        return {
            "stage": self.current_stage.value,
            "ai_response": ai_response,
            "clarification_questions": questions,
            "feature_offerings": [],
            "next_actions": ["answer_clarification"],
            "category": self.detected_category.value,
            "metadata": {
                "requires_user_input": True,
                "expected_input_type": "clarification_answers"
            }
        }
    
    def _handle_clarification(self, message: str, history: List[Dict]) -> Dict[str, Any]:
        """Tahap 1 (lanjutan): User menjawab klarifikasi"""
        
        # Extract informasi dari jawaban user
        # (Dalam implementasi real, gunakan NER untuk extract entities)
        
        ai_response = """Terima kasih atas informasinya. 

Apakah Anda memiliki **dokumen pendukung** seperti:
- Kontrak kerja / perjanjian tertulis
- Surat PHK / surat resmi
- Email atau komunikasi tertulis lainnya

Anda **tidak perlu mengunggahnya sekarang**, cukup konfirmasi keberadaannya.
"""
        
        return {
            "stage": self.current_stage.value,
            "ai_response": ai_response,
            "clarification_questions": [],
            "feature_offerings": [],
            "next_actions": ["confirm_documents"],
            "category": self.detected_category.value,
            "metadata": {
                "documents_inquiry": True
            }
        }
    
    def _handle_initial_analysis(
        self,
        message: str,
        history: List[Dict],
        user_tier: str
    ) -> Dict[str, Any]:
        """Tahap 2: Analisis awal & tawarkan fitur premium"""
        
        # Generate analisis awal (ini akan di-replace dengan actual AI response)
        initial_analysis = self._generate_initial_legal_analysis(
            self.detected_category, history
        )
        
        # Filter fitur berdasarkan user tier
        available_features = self._filter_features_by_tier(
            self.triggered_features, user_tier
        )
        
        # Build feature offering text
        feature_text = self._build_feature_offering_text(available_features)
        
        ai_response = f"""{initial_analysis}

---

**🚀 Saya Dapat Membantu Lebih Jauh**

{feature_text}

Pilih salah satu opsi di atas, atau ketik **"Cukup analisis awal saja"** jika Anda hanya butuh informasi dasar.
"""
        
        return {
            "stage": ConversationStage.FEATURE_OFFERING.value,
            "ai_response": ai_response,
            "clarification_questions": [],
            "feature_offerings": available_features,
            "next_actions": ["select_feature", "decline_features"],
            "category": self.detected_category.value,
            "metadata": {
                "analysis_provided": True,
                "premium_features_offered": len(available_features) > 0
            }
        }
    
    def _handle_feature_offering(
        self,
        message: str,
        history: List[Dict],
        user_tier: str
    ) -> Dict[str, Any]:
        """Handle saat user diminta memilih fitur"""
        return self._handle_initial_analysis(message, history, user_tier)
    
    def _handle_feature_execution(
        self,
        message: str,
        history: List[Dict],
        user_tier: str
    ) -> Dict[str, Any]:
        """Tahap 3: Eksekusi fitur yang dipilih"""
        
        # Detect which feature was selected
        selected_feature = self._detect_selected_feature(message)
        
        if not selected_feature:
            return {
                "stage": self.current_stage.value,
                "ai_response": "Maaf, saya tidak mengerti pilihan Anda. Bisa pilih salah satu opsi A, B, atau C?",
                "feature_offerings": self.triggered_features,
                "next_actions": ["select_feature"],
                "category": self.detected_category.value,
                "metadata": {}
            }
        
        # Generate instruction untuk feature
        feature_instruction = self._generate_feature_instruction(selected_feature)
        
        return {
            "stage": self.current_stage.value,
            "ai_response": feature_instruction["response"],
            "selected_feature": selected_feature,
            "feature_offerings": [],
            "next_actions": [feature_instruction["next_action"]],
            "category": self.detected_category.value,
            "metadata": {
                "feature_initiated": selected_feature["feature_id"],
                "requires_api_call": feature_instruction.get("api_endpoint")
            }
        }
    
    def _handle_synthesis(self, message: str, history: List[Dict]) -> Dict[str, Any]:
        """Tahap 4: Sintesis hasil & generate report"""
        
        ai_response = """Kita telah menyelesaikan:
✅ Konsultasi awal
✅ Analisis dokumen
✅ Simulasi negosiasi

Apakah Anda ingin saya menggabungkan semua temuan ini menjadi satu **Laporan Rencana Strategi** (PDF) yang bisa Anda unduh?

Laporan akan berisi:
1. Rangkuman Kasus
2. Analisis SWOT Hukum
3. Poin Kunci dari Analisis Kontrak
4. Tips Negosiasi
5. Draf Surat Resmi (jika diperlukan)
"""
        
        return {
            "stage": self.current_stage.value,
            "ai_response": ai_response,
            "feature_offerings": [],
            "next_actions": ["generate_report", "end_session"],
            "category": self.detected_category.value,
            "metadata": {
                "synthesis_ready": True
            }
        }
    
    # Helper methods
    
    def _get_category_display_name(self, category: LegalCategory) -> str:
        """Convert enum ke display name"""
        names = {
            LegalCategory.KETENAGAKERJAAN: "Hukum Ketenagakerjaan",
            LegalCategory.KONTRAK: "Hukum Kontrak",
            LegalCategory.PERDATA: "Hukum Perdata",
            LegalCategory.PIDANA: "Hukum Pidana",
            LegalCategory.BISNIS_KOMERSIAL: "Hukum Bisnis & Komersial",
            LegalCategory.PROPERTI: "Hukum Properti",
            LegalCategory.KELUARGA: "Hukum Keluarga",
            LegalCategory.STARTUP: "Hukum Startup & Investasi",
            LegalCategory.UNKNOWN: "Konsultasi Hukum Umum"
        }
        return names.get(category, "Konsultasi Hukum")
    
    def _generate_initial_legal_analysis(
        self,
        category: LegalCategory,
        history: List[Dict]
    ) -> str:
        """Generate analisis hukum awal (placeholder - akan diganti dengan actual AI)"""
        
        # Ini placeholder - dalam implementasi real akan call AI service
        return """Baik, berdasarkan informasi yang Anda berikan:

**Ringkasan Situasi:**
- Status: Karyawan tetap (5 tahun masa kerja)
- Alasan PHK: Efisiensi perusahaan
- Dokumen: Kontrak kerja tersedia

**Analisis Hukum Awal:**

Berdasarkan **PP No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja dan Istirahat**, Anda berhak atas:

1. **Uang Pesangon**: 9 bulan upah (masa kerja 5 tahun)
2. **Uang Penghargaan Masa Kerja**: 4 bulan upah
3. **Uang Penggantian Hak**: Cuti + kompensasi lain

**Total estimasi:** 13 bulan upah + penggantian hak.

⚠️ **Penting:** PHK karena "efisiensi" harus melalui prosedur yang benar dan perusahaan wajib membayar kompensasi penuh.
"""
    
    def _filter_features_by_tier(
        self,
        features: List[Dict],
        user_tier: str
    ) -> List[Dict]:
        """Filter fitur berdasarkan tier user"""
        
        tier_hierarchy = {
            "free": ["free"],
            "professional": ["free", "professional"],
            "premium": ["free", "professional", "premium"]
        }
        
        allowed_tiers = tier_hierarchy.get(user_tier, ["free"])
        
        return [
            f for f in features 
            if f.get("tier") in allowed_tiers
        ]
    
    def _build_feature_offering_text(self, features: List[Dict]) -> str:
        """Build text untuk feature offerings"""
        
        if not features:
            return "Saat ini tidak ada fitur premium yang tersedia untuk kasus ini."
        
        options = ["A", "B", "C"]
        text = "Saya mendeteksi beberapa fitur yang bisa membantu:\n\n"
        
        for i, feature in enumerate(features[:3]):  # Max 3 features
            tier_badge = self._get_tier_badge(feature["tier"])
            text += f"**Opsi {options[i]}** {tier_badge}: {feature['feature_name']}\n"
        
        return text
    
    def _get_tier_badge(self, tier: str) -> str:
        """Get badge emoji untuk tier"""
        badges = {
            "free": "🆓",
            "professional": "⭐ Professional",
            "premium": "💎 Premium"
        }
        return badges.get(tier, "")
    
    def _detect_selected_feature(self, message: str) -> Optional[Dict]:
        """Detect fitur mana yang dipilih user"""
        
        message_lower = message.lower()
        
        # Map user input ke feature
        selection_map = {
            "a": 0,
            "b": 1,
            "c": 2,
            "opsi a": 0,
            "opsi b": 1,
            "opsi c": 2,
            "pilih a": 0,
            "pilih b": 1,
            "pilih c": 2
        }
        
        for pattern, index in selection_map.items():
            if pattern in message_lower:
                if index < len(self.triggered_features):
                    return self.triggered_features[index]
        
        # Check by feature name
        for feature in self.triggered_features:
            if any(keyword in message_lower for keyword in [
                feature["feature_id"],
                "kontrak" if "contract" in feature["feature_id"] else "",
                "simulasi" if "persona" in feature["feature_id"] else "",
                "negosiasi" if "persona" in feature["feature_id"] else ""
            ]):
                return feature
        
        return None
    
    def _generate_feature_instruction(self, feature: Dict) -> Dict[str, Any]:
        """Generate instruksi untuk fitur yang dipilih"""
        
        feature_id = feature["feature_id"]
        
        instructions = {
            "contract_analysis": {
                "response": """✅ **Analisis Kontrak Dipilih**

Silakan unggah dokumen kontrak Anda. Saya akan memindainya menggunakan **Contract Intelligence Engine** (Dual AI: BytePlus Ark + Groq) untuk:

🔍 Mencari klausul yang bermasalah
⚖️ Mengecek kepatuhan dengan UU Ketenagakerjaan
💡 Memberikan saran optimasi
📊 Risk assessment lengkap

**Cara Upload:**
1. Klik tombol "📎 Lampirkan File" di bawah
2. Pilih file kontrak (PDF, Word, atau gambar)
3. Tunggu analisis selesai (~2-3 menit)
""",
                "next_action": "upload_document",
                "api_endpoint": "/api/contract-engine/analyze-contract"
            },
            
            "persona_simulation": {
                "response": """✅ **Simulasi Negosiasi Dipilih**

Mode simulasi aktif! Saya sekarang akan berperan sebagai **"Bapak/Ibu HRD"** dari perusahaan Anda.

**Instruksi:**
- Sampaikan argumen Anda seperti dalam negosiasi sungguhan
- Saya akan merespons sesuai karakter HRD
- Setelah selesai, Anda akan mendapat feedback strategi

---

*[Mode: AI Persona - HRD]*

Selamat pagi, terima kasih sudah datang. Saya memahami Anda keberatan dengan keputusan PHK ini. Namun, perusahaan sudah mempertimbangkan secara matang dan keputusan ini final karena efisiensi operasional.

Kami sudah menyiapkan paket pesangon sesuai aturan. Bagaimana menurut Anda?

*(Silakan mulai bernegosiasi)*
""",
                "next_action": "continue_simulation",
                "api_endpoint": "/api/adaptive-persona/negotiate"
            },
            
            "reasoning_analysis": {
                "response": """✅ **Reasoning Chain Analyzer Dipilih**

Saya akan menganalisis argumen hukum Anda untuk mendeteksi:
- Fallacy logis (15+ jenis)
- Kelemahan argumen
- Counter-argument yang kuat

**Silakan sampaikan argumen Anda** (bisa argumen Anda sendiri atau argumen pihak lawan yang ingin Anda bantah).
""",
                "next_action": "provide_argument",
                "api_endpoint": "/api/reasoning-chain/analyze"
            },
            
            "template_generation": {
                "response": """✅ **Template Generator Dipilih**

Saya akan membuatkan template surat untuk Anda. 

**Jenis surat yang bisa saya buat:**
1. Surat Somasi
2. Surat Tuntutan Hak (PHK)
3. Surat Kuasa
4. Surat Jawaban / Bantahan
5. Surat Perjanjian Sederhana

**Silakan ketik nomor atau nama jenis surat yang Anda butuhkan.**
""",
                "next_action": "select_template_type",
                "api_endpoint": "/api/template-generator/generate"
            }
        }
        
        return instructions.get(
            feature_id,
            {
                "response": f"Fitur {feature['feature_name']} akan segera diaktifkan...",
                "next_action": "feature_execution",
                "api_endpoint": None
            }
        )


# Export main class
__all__ = ["ConversationOrchestrator", "ConversationStage", "LegalCategory"]
