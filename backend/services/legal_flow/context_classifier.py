"""
Context Classifier

Classifies legal context and domain from case descriptions.
"""

import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import logging

from ..ai.consensus_engine import get_consensus_engine


logger = logging.getLogger(__name__)


class LegalDomain(str, Enum):
    """Legal domain categories"""
    PIDANA = "pidana"  # Criminal law
    PERDATA = "perdata"  # Civil law
    BISNIS = "bisnis"  # Business law
    KETENAGAKERJAAN = "ketenagakerjaan"  # Employment law
    KELUARGA = "keluarga"  # Family law
    PROPERTI = "properti"  # Property law
    PAJAK = "pajak"  # Tax law
    ADMINISTRATIF = "administratif"  # Administrative law
    LINGKUNGAN = "lingkungan"  # Environmental law
    TEKNOLOGI = "teknologi"  # Technology/cyber law
    KONSUMEN = "konsumen"  # Consumer protection
    OTHER = "other"  # Other/mixed


@dataclass
class LegalContext:
    """Legal context classification result"""
    primary_domain: LegalDomain
    secondary_domains: List[LegalDomain]
    confidence: float
    
    # Detailed categorization
    is_criminal: bool
    is_civil: bool
    is_urgent: bool
    
    # Keywords found
    keywords: List[str]
    
    # Legal complexity (1-5)
    complexity_score: int
    
    # Suggested expertise
    suggested_expertise: List[str]
    
    # AI explanation
    explanation: str
    
    # Metadata
    metadata: Dict[str, Any]


class ContextClassifier:
    """
    Classifies legal context from case descriptions.
    
    Uses hybrid approach:
    - Keyword matching for quick classification
    - AI consensus for detailed analysis
    """
    
    # Domain keywords for quick classification
    DOMAIN_KEYWORDS = {
        LegalDomain.PIDANA: [
            "pencurian", "penipuan", "penggelapan", "perampokan", "pembunuhan",
            "kekerasan", "penyiksaan", "penganiayaan", "korupsi", "narkotika",
            "terorisme", "pidana", "criminal", "laporan polisi", "LP", "tersangka",
            "terdakwa", "jaksa", "hakim", "vonis", "hukuman"
        ],
        LegalDomain.PERDATA: [
            "gugatan", "wanprestasi", "ganti rugi", "perbuatan melawan hukum",
            "perjanjian", "kontrak", "jual beli", "sewa menyewa", "utang piutang",
            "perdata", "civil", "penggugat", "tergugat", "arbitrase", "mediasi"
        ],
        LegalDomain.BISNIS: [
            "PT", "CV", "firma", "koperasi", "perusahaan", "bisnis", "usaha",
            "modal", "saham", "investor", "pemegang saham", "direksi", "komisaris",
            "akuisisi", "merger", "joint venture", "MOU", "perjanjian bisnis",
            "franchise", "lisensi"
        ],
        LegalDomain.KETENAGAKERJAAN: [
            "karyawan", "pekerja", "buruh", "PHK", "pemecatan", "resign", "upah",
            "gaji", "lembur", "cuti", "kontrak kerja", "PKWT", "PKWTT", "outsourcing",
            "serikat pekerja", "mogok", "demo", "tunjangan", "pesangon", "jamsostek",
            "BPJS"
        ],
        LegalDomain.KELUARGA: [
            "nikah", "kawin", "pernikahan", "perkawinan", "cerai", "perceraian",
            "talak", "fasakh", "waris", "warisan", "ahli waris", "harta bersama",
            "harta gono-gini", "nafkah", "anak", "hak asuh", "adopsi", "pengangkatan anak"
        ],
        LegalDomain.PROPERTI: [
            "tanah", "rumah", "properti", "real estate", "sertifikat", "hak milik",
            "HGB", "hak guna bangunan", "IMB", "izin mendirikan bangunan", "sengketa tanah",
            "jual beli tanah", "hibah", "wakaf", "kavling", "developer", "notaris"
        ],
        LegalDomain.PAJAK: [
            "pajak", "PPN", "PPh", "NPWP", "SPT", "tax", "Dirjen Pajak", "DJP",
            "pemeriksaan pajak", "sengketa pajak", "pengadilan pajak", "keberatan pajak",
            "banding pajak", "tunggakan pajak"
        ],
        LegalDomain.ADMINISTRATIF: [
            "izin", "perizinan", "SIUP", "TDP", "NIB", "OSS", "pemerintah",
            "dinas", "instansi", "tata usaha negara", "TUN", "PTUN", "keputusan tata usaha",
            "judicial review", "gugatan TUN"
        ],
        LegalDomain.LINGKUNGAN: [
            "lingkungan", "pencemaran", "polusi", "limbah", "sampah", "AMDAL",
            "UKL-UPL", "reklamasi", "konservasi", "hutan", "tambang", "pertambangan",
            "emisi", "dampak lingkungan"
        ],
        LegalDomain.TEKNOLOGI: [
            "cyber", "online", "digital", "internet", "data", "privasi", "hacker",
            "phishing", "ITE", "e-commerce", "marketplace", "fintech", "cryptocurrency",
            "NFT", "perlindungan data", "GDPR", "ransomware"
        ],
        LegalDomain.KONSUMEN: [
            "konsumen", "pembeli", "penjual", "toko", "barang", "produk", "cacat",
            "garansi", "komplain", "retur", "refund", "BPKN", "Yayasan Lembaga Konsumen",
            "hak konsumen", "perlindungan konsumen"
        ],
    }
    
    def __init__(self):
        self.consensus_engine = get_consensus_engine()
    
    async def classify(
        self,
        text: str,
        use_ai: bool = True
    ) -> LegalContext:
        """
        Classify legal context from text.
        
        Args:
            text: Case description text
            use_ai: Whether to use AI for classification
        
        Returns:
            Legal context classification
        """
        # Quick keyword-based classification
        keyword_result = self._classify_with_keywords(text)
        
        if use_ai:
            # AI-enhanced classification
            ai_result = await self._classify_with_ai(text, keyword_result)
            return ai_result
        else:
            return keyword_result
    
    def _classify_with_keywords(self, text: str) -> LegalContext:
        """Classify using keyword matching"""
        text_lower = text.lower()
        
        # Count matches for each domain
        domain_scores: Dict[LegalDomain, int] = {}
        matched_keywords: Dict[LegalDomain, List[str]] = {}
        
        for domain, keywords in self.DOMAIN_KEYWORDS.items():
            score = 0
            matches = []
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    score += 1
                    matches.append(keyword)
            
            if score > 0:
                domain_scores[domain] = score
                matched_keywords[domain] = matches
        
        # Determine primary and secondary domains
        if not domain_scores:
            primary_domain = LegalDomain.OTHER
            secondary_domains = []
            confidence = 0.3
            keywords_found = []
        else:
            sorted_domains = sorted(
                domain_scores.items(),
                key=lambda x: x[1],
                reverse=True
            )
            
            primary_domain = sorted_domains[0][0]
            secondary_domains = [d for d, s in sorted_domains[1:3] if s > 1]
            
            # Calculate confidence based on score distribution
            total_score = sum(domain_scores.values())
            primary_score = domain_scores[primary_domain]
            confidence = min(0.9, primary_score / total_score) if total_score > 0 else 0.5
            
            keywords_found = matched_keywords[primary_domain][:5]
        
        # Determine criminal/civil nature
        is_criminal = primary_domain == LegalDomain.PIDANA
        is_civil = primary_domain in [
            LegalDomain.PERDATA, LegalDomain.BISNIS, LegalDomain.KELUARGA,
            LegalDomain.PROPERTI, LegalDomain.KETENAGAKERJAAN
        ]
        
        # Check urgency indicators
        urgency_keywords = [
            "darurat", "urgent", "segera", "mendesak", "penahanan", "tersangka",
            "kejahatan", "ancaman", "bahaya"
        ]
        is_urgent = any(kw in text_lower for kw in urgency_keywords)
        
        # Estimate complexity
        complexity_score = min(5, max(1, len(secondary_domains) + 2))
        
        # Suggest expertise
        expertise_map = {
            LegalDomain.PIDANA: ["Hukum Pidana", "Advokat Litigasi"],
            LegalDomain.PERDATA: ["Hukum Perdata", "Mediator"],
            LegalDomain.BISNIS: ["Hukum Bisnis", "Corporate Law"],
            LegalDomain.KETENAGAKERJAAN: ["Hukum Ketenagakerjaan", "Labor Law"],
            LegalDomain.KELUARGA: ["Hukum Keluarga", "Mediator Keluarga"],
            LegalDomain.PROPERTI: ["Hukum Properti", "Notaris"],
            LegalDomain.PAJAK: ["Hukum Pajak", "Konsultan Pajak"],
            LegalDomain.ADMINISTRATIF: ["Hukum Administrasi Negara"],
            LegalDomain.LINGKUNGAN: ["Hukum Lingkungan"],
            LegalDomain.TEKNOLOGI: ["Hukum Teknologi", "Cyber Law"],
            LegalDomain.KONSUMEN: ["Hukum Perlindungan Konsumen"],
        }
        
        suggested_expertise = expertise_map.get(primary_domain, ["Advokat Umum"])
        
        return LegalContext(
            primary_domain=primary_domain,
            secondary_domains=secondary_domains,
            confidence=confidence,
            is_criminal=is_criminal,
            is_civil=is_civil,
            is_urgent=is_urgent,
            keywords=keywords_found,
            complexity_score=complexity_score,
            suggested_expertise=suggested_expertise,
            explanation=f"Klasifikasi berdasarkan {len(keywords_found)} kata kunci yang cocok.",
            metadata={"method": "keyword", "scores": domain_scores}
        )
    
    async def _classify_with_ai(
        self,
        text: str,
        keyword_result: LegalContext
    ) -> LegalContext:
        """Enhance classification with AI"""
        try:
            # Prepare prompt
            prompt = f"""Analisis konteks hukum dari kasus berikut:

{text}

Klasifikasi awal (berdasarkan kata kunci):
- Domain utama: {keyword_result.primary_domain.value}
- Domain sekunder: {', '.join(d.value for d in keyword_result.secondary_domains)}

Berikan analisis komprehensif dalam format JSON:
{{
  "primary_domain": "pidana|perdata|bisnis|ketenagakerjaan|keluarga|properti|pajak|administratif|lingkungan|teknologi|konsumen|other",
  "secondary_domains": ["domain1", "domain2"],
  "confidence": 0.0-1.0,
  "is_criminal": true/false,
  "is_civil": true/false,
  "is_urgent": true/false,
  "complexity_score": 1-5,
  "suggested_expertise": ["expertise1", "expertise2"],
  "explanation": "penjelasan singkat mengapa diklasifikasikan seperti ini"
}}

Hanya kembalikan JSON, tanpa penjelasan tambahan."""

            # Get AI response
            result = await self.consensus_engine.get_consensus(
                query=prompt,
                temperature=0.1
            )
            
            # Parse AI response
            import json
            try:
                ai_data = json.loads(result.consensus_answer)
                
                # Parse primary domain
                primary_str = ai_data.get("primary_domain", keyword_result.primary_domain.value)
                try:
                    primary_domain = LegalDomain(primary_str)
                except ValueError:
                    primary_domain = keyword_result.primary_domain
                
                # Parse secondary domains
                secondary_strs = ai_data.get("secondary_domains", [])
                secondary_domains = []
                for s in secondary_strs:
                    try:
                        secondary_domains.append(LegalDomain(s))
                    except ValueError:
                        pass
                
                return LegalContext(
                    primary_domain=primary_domain,
                    secondary_domains=secondary_domains,
                    confidence=ai_data.get("confidence", keyword_result.confidence),
                    is_criminal=ai_data.get("is_criminal", keyword_result.is_criminal),
                    is_civil=ai_data.get("is_civil", keyword_result.is_civil),
                    is_urgent=ai_data.get("is_urgent", keyword_result.is_urgent),
                    keywords=keyword_result.keywords,
                    complexity_score=ai_data.get("complexity_score", keyword_result.complexity_score),
                    suggested_expertise=ai_data.get("suggested_expertise", keyword_result.suggested_expertise),
                    explanation=ai_data.get("explanation", "Klasifikasi dengan AI."),
                    metadata={
                        "method": "ai",
                        "consensus_confidence": result.consensus_confidence,
                        "keyword_result": keyword_result.primary_domain.value
                    }
                )
            
            except json.JSONDecodeError:
                logger.warning("Failed to parse AI classification response")
                return keyword_result
        
        except Exception as e:
            logger.error(f"AI classification failed: {e}")
            return keyword_result
    
    def format_context(self, context: LegalContext) -> str:
        """
        Format legal context as readable text.
        
        Args:
            context: Legal context
        
        Returns:
            Formatted string
        """
        lines = ["## Konteks Hukum\n"]
        
        domain_names = {
            LegalDomain.PIDANA: "Hukum Pidana",
            LegalDomain.PERDATA: "Hukum Perdata",
            LegalDomain.BISNIS: "Hukum Bisnis",
            LegalDomain.KETENAGAKERJAAN: "Hukum Ketenagakerjaan",
            LegalDomain.KELUARGA: "Hukum Keluarga",
            LegalDomain.PROPERTI: "Hukum Properti",
            LegalDomain.PAJAK: "Hukum Pajak",
            LegalDomain.ADMINISTRATIF: "Hukum Administratif",
            LegalDomain.LINGKUNGAN: "Hukum Lingkungan",
            LegalDomain.TEKNOLOGI: "Hukum Teknologi/Cyber",
            LegalDomain.KONSUMEN: "Hukum Perlindungan Konsumen",
            LegalDomain.OTHER: "Lainnya",
        }
        
        lines.append(f"**Domain Utama:** {domain_names.get(context.primary_domain, context.primary_domain.value)}")
        lines.append(f"**Confidence:** {context.confidence:.0%}")
        
        if context.secondary_domains:
            secondary = ", ".join(domain_names.get(d, d.value) for d in context.secondary_domains)
            lines.append(f"**Domain Sekunder:** {secondary}")
        
        lines.append(f"\n**Karakteristik:**")
        if context.is_criminal:
            lines.append("- ⚠️ Kasus Pidana")
        if context.is_civil:
            lines.append("- 📋 Kasus Perdata")
        if context.is_urgent:
            lines.append("- 🚨 Mendesak")
        
        lines.append(f"\n**Kompleksitas:** {'⭐' * context.complexity_score} ({context.complexity_score}/5)")
        
        lines.append(f"\n**Keahlian yang Disarankan:**")
        for expertise in context.suggested_expertise:
            lines.append(f"- {expertise}")
        
        lines.append(f"\n**Penjelasan:**")
        lines.append(context.explanation)
        
        if context.keywords:
            lines.append(f"\n**Kata Kunci:**")
            lines.append(", ".join(context.keywords))
        
        return "\n".join(lines)


# Singleton instance
_context_classifier_instance: Optional[ContextClassifier] = None


def get_context_classifier() -> ContextClassifier:
    """Get or create singleton context classifier instance"""
    global _context_classifier_instance
    
    if _context_classifier_instance is None:
        _context_classifier_instance = ContextClassifier()
    
    return _context_classifier_instance
