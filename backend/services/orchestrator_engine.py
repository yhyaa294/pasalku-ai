"""
AI Orchestrator Engine - IMPLEMENTASI NYATA
Menganalisis konteks user dan memutuskan fitur apa yang harus ditrigger
"""

from typing import Dict, List, Any, Optional
from enum import Enum
import re


class UserTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    PROFESSIONAL = "professional"


class LegalArea(str, Enum):
    EMPLOYMENT = "employment"
    CONSUMER = "consumer"
    BUSINESS = "business"
    FAMILY = "family"
    PROPERTY = "property"
    CRIMINAL = "criminal"
    GENERAL = "general"


class ConversationStage(int, Enum):
    INITIAL = 1  # User baru cerita masalah
    CLARIFICATION = 2  # AI tanya detail
    ANALYSIS = 3  # AI kasih analisis + tawarkan fitur
    EXECUTION = 4  # User pilih & execute fitur
    SYNTHESIS = 5  # Generate final report


class OrchestratorEngine:
    """Engine utama untuk orchestrate conversation dan trigger features"""
    
    def __init__(self):
        # Keyword mapping untuk detect legal area
        self.legal_keywords = {
            LegalArea.EMPLOYMENT: [
                "phk", "resign", "kontrak kerja", "pesangon", "thr", 
                "cuti", "gaji", "karyawan", "perusahaan", "resign",
                "dipecat", "diberhentikan", "kerja", "upah"
            ],
            LegalArea.CONSUMER: [
                "produk rusak", "penipuan", "garansi", "ganti rugi",
                "komplain", "cacat produk", "olshop", "marketplace",
                "barang", "beli", "pelayanan buruk"
            ],
            LegalArea.BUSINESS: [
                "perjanjian", "kontrak bisnis", "kerjasama", "mou",
                "breach", "wanprestasi", "hutang piutang", "invoice",
                "partnership", "usaha", "bisnis"
            ],
            LegalArea.FAMILY: [
                "cerai", "perceraian", "harta gono gini", "nafkah",
                "anak", "hak asuh", "warisan", "waris", "nikah",
                "pernikahan", "talak"
            ],
            LegalArea.PROPERTY: [
                "tanah", "rumah", "sertifikat", "jual beli", "sewa",
                "properti", "apartemen", "kos", "kontrakan", "ahk"
            ],
            LegalArea.CRIMINAL: [
                "pencurian", "penganiayaan", "pemerkosaan", "pembunuhan",
                "penipuan", "korupsi", "narkoba", "pidana", "polisi",
                "laporan", "tersangka"
            ]
        }
        
        # Features yang bisa ditrigger per legal area
        self.feature_map = {
            LegalArea.EMPLOYMENT: [
                {
                    "id": "contract_analysis",
                    "name": "Analisis Kontrak Kerja",
                    "tier": UserTier.PREMIUM,
                    "description": "Scan kontrak kerja Anda dan identifikasi klausul berisiko",
                    "trigger_condition": lambda ctx: ctx.get("has_document", False),
                    "priority": 1
                },
                {
                    "id": "negotiation_sim",
                    "name": "Simulasi Negosiasi dengan HRD",
                    "tier": UserTier.PREMIUM,
                    "description": "Latihan negosiasi dengan AI yang berperan sebagai HRD",
                    "trigger_condition": lambda ctx: "negosiasi" in str(ctx).lower() or "nego" in str(ctx).lower(),
                    "priority": 2
                },
                {
                    "id": "letter_generator",
                    "name": "Generator Surat Tuntutan Hak",
                    "tier": UserTier.PREMIUM,
                    "description": "Generate surat formal untuk tuntut hak pesangon",
                    "trigger_condition": lambda ctx: True,
                    "priority": 3
                }
            ],
            LegalArea.CONSUMER: [
                {
                    "id": "evidence_analyzer",
                    "name": "Analisis Bukti Transaksi",
                    "tier": UserTier.PREMIUM,
                    "description": "Analisis bukti chat, invoice, dan foto produk",
                    "trigger_condition": lambda ctx: ctx.get("has_document", False),
                    "priority": 1
                },
                {
                    "id": "complaint_letter",
                    "name": "Surat Komplain ke Penjual",
                    "tier": UserTier.FREE,
                    "description": "Generate surat komplain yang efektif",
                    "trigger_condition": lambda ctx: True,
                    "priority": 2
                }
            ],
            # Add more areas as needed
        }
    
    def detect_legal_area(self, message: str) -> LegalArea:
        """Deteksi area hukum dari pesan user"""
        message_lower = message.lower()
        
        # Count keyword matches per area
        area_scores = {}
        for area, keywords in self.legal_keywords.items():
            score = sum(1 for keyword in keywords if keyword in message_lower)
            if score > 0:
                area_scores[area] = score
        
        # Return area dengan score tertinggi
        if area_scores:
            return max(area_scores, key=area_scores.get)
        
        return LegalArea.GENERAL
    
    def extract_context_signals(self, message: str, conversation_history: List[str] = None) -> Dict[str, Any]:
        """Extract signals penting dari message"""
        message_lower = message.lower()
        
        signals = {
            "has_document": any(word in message_lower for word in ["kontrak", "surat", "dokumen", "file", "pdf"]),
            "has_urgency": any(word in message_lower for word in ["urgent", "segera", "cepat", "besok", "deadline"]),
            "needs_negotiation": any(word in message_lower for word in ["negosiasi", "nego", "tawar", "bicara"]),
            "needs_legal_action": any(word in message_lower for word in ["gugat", "somasi", "pengadilan", "polisi", "lapor"]),
            "has_money_dispute": bool(re.search(r'rp\.?\s*\d+|rupiah|\d+\s*(juta|ribu|milyar)', message_lower)),
            "mention_company": any(word in message_lower for word in ["perusahaan", "pt", "cv", "company", "kantor"]),
            "mention_person": any(word in message_lower for word in ["bos", "atasan", "pihak", "orang", "dia", "mereka"]),
        }
        
        return signals
    
    def determine_stage(self, context: Dict[str, Any]) -> ConversationStage:
        """Tentukan stage conversation saat ini"""
        messages_count = context.get("messages_count", 1)
        has_complete_data = context.get("has_complete_data", False)
        
        if messages_count == 1:
            return ConversationStage.INITIAL
        elif messages_count <= 3 and not has_complete_data:
            return ConversationStage.CLARIFICATION
        elif has_complete_data and not context.get("features_offered", False):
            return ConversationStage.ANALYSIS
        elif context.get("feature_selected"):
            return ConversationStage.EXECUTION
        else:
            return ConversationStage.ANALYSIS
    
    def generate_clarifying_questions(self, legal_area: LegalArea, context: Dict[str, Any]) -> List[str]:
        """Generate pertanyaan untuk klarifikasi"""
        
        questions_map = {
            LegalArea.EMPLOYMENT: [
                "Sudah berapa lama Anda bekerja di perusahaan ini?",
                "Apakah status Anda karyawan tetap (PKWTT) atau kontrak (PKWT)?",
                "Apa alasan yang diberikan perusahaan untuk PHK?",
                "Apakah Anda memiliki surat PHK atau kontrak kerja?",
            ],
            LegalArea.CONSUMER: [
                "Kapan Anda membeli produk tersebut?",
                "Berapa total nilai transaksi?",
                "Apakah Anda memiliki bukti pembelian (invoice/struk)?",
                "Sudah komunikasi dengan penjual? Apa responnya?",
            ],
            LegalArea.BUSINESS: [
                "Apa bentuk perjanjian yang dibuat (tertulis/lisan)?",
                "Berapa nilai kontrak yang disepakati?",
                "Apa yang sudah dilakukan dan yang belum?",
                "Apakah ada klausul sanksi dalam perjanjian?",
            ],
        }
        
        return questions_map.get(legal_area, [
            "Bisakah Anda ceritakan kronologi lengkapnya?",
            "Apa yang sudah Anda lakukan sejauh ini?",
            "Apa hasil yang Anda harapkan?",
        ])[:3]  # Max 3 questions
    
    def get_feature_suggestions(
        self, 
        legal_area: LegalArea,
        context: Dict[str, Any],
        user_tier: UserTier
    ) -> List[Dict[str, Any]]:
        """Get feature suggestions yang relevan"""
        
        features = self.feature_map.get(legal_area, [])
        
        # Filter berdasarkan trigger condition
        suggested = []
        for feature in features:
            if feature["trigger_condition"](context):
                # Add accessibility info
                is_accessible = (
                    user_tier == UserTier.PROFESSIONAL or
                    (user_tier == UserTier.PREMIUM and feature["tier"] != UserTier.PROFESSIONAL) or
                    feature["tier"] == UserTier.FREE
                )
                
                feature_copy = feature.copy()
                feature_copy["is_accessible"] = is_accessible
                feature_copy["upgrade_needed"] = not is_accessible
                suggested.append(feature_copy)
        
        # Sort by priority
        suggested.sort(key=lambda x: x["priority"])
        
        # Always add free fallback
        if not any(f["tier"] == UserTier.FREE for f in suggested):
            suggested.append({
                "id": "free_consultation",
                "name": "Konsultasi Dasar",
                "tier": UserTier.FREE,
                "description": "Lanjutkan konsultasi dasar dengan saya",
                "is_accessible": True,
                "upgrade_needed": False,
                "priority": 999
            })
        
        return suggested[:3]  # Max 3 options
    
    def orchestrate(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]] = None,
        user_tier: UserTier = UserTier.FREE,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Main orchestration function
        
        Returns response structure dengan:
        - stage: conversation stage
        - legal_area: detected area
        - response_type: 'question', 'analysis', 'feature_offer', 'execution'
        - content: actual response
        - features: suggested features (if applicable)
        """
        
        if context is None:
            context = {}
        
        # Detect legal area
        legal_area = self.detect_legal_area(user_message)
        
        # Extract signals
        signals = self.extract_context_signals(user_message, conversation_history)
        context.update(signals)
        context["messages_count"] = len(conversation_history or []) + 1
        
        # Determine stage
        stage = self.determine_stage(context)
        
        # Build response based on stage
        if stage == ConversationStage.INITIAL or stage == ConversationStage.CLARIFICATION:
            questions = self.generate_clarifying_questions(legal_area, context)
            return {
                "stage": stage.value,
                "legal_area": legal_area.value,
                "response_type": "clarification",
                "questions": questions,
                "signals": signals,
                "message": f"Saya memahami ini terkait {legal_area.value}. Untuk analisis akurat, saya perlu beberapa detail:"
            }
        
        elif stage == ConversationStage.ANALYSIS:
            features = self.get_feature_suggestions(legal_area, context, user_tier)
            return {
                "stage": stage.value,
                "legal_area": legal_area.value,
                "response_type": "feature_offer",
                "features": features,
                "signals": signals,
                "message": "Berdasarkan situasi Anda, saya bisa membantu lebih jauh dengan:"
            }
        
        else:
            return {
                "stage": stage.value,
                "legal_area": legal_area.value,
                "response_type": "general",
                "message": "Silakan lanjutkan...",
                "signals": signals
            }


# Global instance
orchestrator = OrchestratorEngine()
