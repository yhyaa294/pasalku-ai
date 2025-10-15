"""
Case Analyzer - Extract features from legal cases

Menganalisis kasus dan extract fitur-fitur penting untuk prediction:
- Case type and category
- Legal basis (laws, articles)
- Parties involved
- Key facts and circumstances
- Damages/claims amount
- Jurisdiction and court level
- Judge/panel information
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from enum import Enum
import re
from datetime import datetime


class CaseType(Enum):
    """Jenis kasus"""
    PIDANA = "pidana"  # Criminal
    PERDATA = "perdata"  # Civil
    TUN = "tun"  # Administrative
    AGAMA = "agama"  # Religious
    NIAGA = "niaga"  # Commercial
    HUBUNGAN_INDUSTRIAL = "hubungan_industrial"  # Labor
    PEMILU = "pemilu"  # Election
    LAINNYA = "lainnya"  # Other


class CaseCategory(Enum):
    """Kategori kasus lebih spesifik"""
    # Pidana
    KORUPSI = "korupsi"
    NARKOTIKA = "narkotika"
    PENGGELAPAN = "penggelapan"
    PENIPUAN = "penipuan"
    PEMBUNUHAN = "pembunuhan"
    PENCURIAN = "pencurian"
    
    # Perdata
    WANPRESTASI = "wanprestasi"
    PERBUATAN_MELAWAN_HUKUM = "perbuatan_melawan_hukum"
    PERCERAIAN = "perceraian"
    WARISAN = "warisan"
    SENGKETA_TANAH = "sengketa_tanah"
    KONTRAK = "kontrak"
    
    # Ketenagakerjaan
    PHK = "phk"
    UPAH = "upah"
    PELECEHAN = "pelecehan"
    
    # Lainnya
    LAINNYA = "lainnya"


class CourtLevel(Enum):
    """Tingkat pengadilan"""
    PERTAMA = "pertama"  # First instance
    BANDING = "banding"  # Appeal
    KASASI = "kasasi"  # Supreme Court
    PENINJAUAN_KEMBALI = "peninjauan_kembali"  # Judicial review


@dataclass
class PartyInfo:
    """Informasi pihak dalam kasus"""
    role: str  # Penggugat/Tergugat, Jaksa/Terdakwa
    name: Optional[str] = None
    type: Optional[str] = None  # Individual/Company/Government
    represented_by: Optional[str] = None  # Lawyer name


@dataclass
class LegalBasis:
    """Dasar hukum yang digunakan"""
    law_type: str  # UU, PP, Pasal, etc
    law_id: Optional[str] = None
    law_title: Optional[str] = None
    citation_text: str = ""
    relevance_score: float = 0.0


@dataclass
class CaseFeatures:
    """
    Extracted features dari kasus untuk prediction
    """
    # Basic info
    case_id: Optional[str] = None
    case_number: Optional[str] = None
    case_type: CaseType = CaseType.LAINNYA
    case_category: CaseCategory = CaseCategory.LAINNYA
    
    # Court info
    court_name: Optional[str] = None
    court_level: CourtLevel = CourtLevel.PERTAMA
    province: Optional[str] = None
    
    # Parties
    parties: List[PartyInfo] = field(default_factory=list)
    plaintiff_count: int = 0
    defendant_count: int = 0
    
    # Legal basis
    legal_bases: List[LegalBasis] = field(default_factory=list)
    primary_laws: List[str] = field(default_factory=list)
    
    # Case details
    claim_amount: Optional[float] = None
    has_criminal_aspect: bool = False
    has_civil_aspect: bool = False
    
    # Key facts (extracted keywords)
    key_facts: List[str] = field(default_factory=list)
    factual_complexity: float = 0.0  # 0-1 score
    
    # Procedural
    has_mediation: bool = False
    has_expert_witness: bool = False
    evidence_count: int = 0
    witness_count: int = 0
    
    # Timing
    filing_date: Optional[datetime] = None
    decision_date: Optional[datetime] = None
    duration_days: Optional[int] = None
    
    # Judge info (if available)
    judge_names: List[str] = field(default_factory=list)
    panel_size: int = 1
    
    # Text features
    case_summary: str = ""
    full_text: str = ""
    text_length: int = 0
    
    # Metadata
    confidence: float = 0.0  # Confidence in feature extraction
    extracted_at: datetime = field(default_factory=datetime.now)


class CaseAnalyzer:
    """
    Analyze legal cases and extract features for prediction
    """
    
    def __init__(self):
        self.case_type_keywords = {
            CaseType.PIDANA: [
                "pidana", "terdakwa", "jaksa", "penuntut", "dakwaan",
                "tuntutan pidana", "penjara", "denda"
            ],
            CaseType.PERDATA: [
                "perdata", "penggugat", "tergugat", "gugatan", "ganti rugi",
                "wanprestasi", "perbuatan melawan hukum"
            ],
            CaseType.HUBUNGAN_INDUSTRIAL: [
                "phk", "pemutusan hubungan kerja", "upah", "pekerja",
                "buruh", "pengusaha", "hubungan industrial"
            ],
            CaseType.NIAGA: [
                "niaga", "kepailitan", "penundaan kewajiban", "pkpu",
                "pailit"
            ],
            CaseType.TUN: [
                "tata usaha negara", "tun", "keputusan tata usaha",
                "pejabat tata usaha"
            ]
        }
        
        self.category_keywords = {
            CaseCategory.KORUPSI: ["korupsi", "gratifikasi", "suap"],
            CaseCategory.NARKOTIKA: ["narkotika", "psikotropika", "narkoba"],
            CaseCategory.PENIPUAN: ["penipuan", "tipu", "378", "pasal 378"],
            CaseCategory.PHK: ["phk", "pemutusan hubungan kerja"],
            CaseCategory.WANPRESTASI: ["wanprestasi", "ingkar janji"],
            CaseCategory.PERBUATAN_MELAWAN_HUKUM: ["perbuatan melawan hukum", "pml"],
            CaseCategory.PERCERAIAN: ["cerai", "perceraian", "talak"],
            CaseCategory.SENGKETA_TANAH: ["tanah", "sengketa tanah", "kepemilikan tanah"],
        }
    
    async def analyze_case(
        self,
        case_text: str,
        case_metadata: Optional[Dict[str, Any]] = None
    ) -> CaseFeatures:
        """
        Analyze case text and extract features
        
        Args:
            case_text: Full case text (putusan, gugatan, etc)
            case_metadata: Optional metadata (case number, court, etc)
        
        Returns:
            CaseFeatures object with extracted features
        """
        features = CaseFeatures()
        
        # Basic metadata
        if case_metadata:
            features.case_id = case_metadata.get("case_id")
            features.case_number = case_metadata.get("case_number")
            features.court_name = case_metadata.get("court_name")
            features.province = case_metadata.get("province")
        
        # Store text
        features.full_text = case_text
        features.text_length = len(case_text)
        
        # Extract case type and category
        features.case_type = self._detect_case_type(case_text)
        features.case_category = self._detect_case_category(case_text)
        
        # Extract court level
        features.court_level = self._detect_court_level(case_text, case_metadata)
        
        # Extract parties
        features.parties = self._extract_parties(case_text, features.case_type)
        features.plaintiff_count = len([p for p in features.parties if "gugat" in p.role.lower() or "penuntut" in p.role.lower()])
        features.defendant_count = len([p for p in features.parties if "gugat" in p.role.lower() or "dakwa" in p.role.lower()])
        
        # Extract legal bases (laws, articles)
        features.legal_bases = await self._extract_legal_bases(case_text)
        features.primary_laws = self._get_primary_laws(features.legal_bases)
        
        # Extract claim amount
        features.claim_amount = self._extract_claim_amount(case_text)
        
        # Extract key facts
        features.key_facts = self._extract_key_facts(case_text, features.case_type)
        features.factual_complexity = self._calculate_complexity(case_text)
        
        # Extract procedural elements
        features.has_mediation = self._check_mediation(case_text)
        features.has_expert_witness = self._check_expert_witness(case_text)
        features.evidence_count = self._count_evidence(case_text)
        features.witness_count = self._count_witnesses(case_text)
        
        # Extract judge info
        features.judge_names = self._extract_judges(case_text)
        features.panel_size = len(features.judge_names) if features.judge_names else 1
        
        # Generate summary
        features.case_summary = self._generate_summary(features)
        
        # Calculate overall confidence
        features.confidence = self._calculate_extraction_confidence(features)
        
        return features
    
    def _detect_case_type(self, text: str) -> CaseType:
        """Detect case type from text"""
        text_lower = text.lower()
        
        scores = {}
        for case_type, keywords in self.case_type_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            scores[case_type] = score
        
        if scores:
            best_type = max(scores.items(), key=lambda x: x[1])
            if best_type[1] > 0:
                return best_type[0]
        
        return CaseType.LAINNYA
    
    def _detect_case_category(self, text: str) -> CaseCategory:
        """Detect specific case category"""
        text_lower = text.lower()
        
        scores = {}
        for category, keywords in self.category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            scores[category] = score
        
        if scores:
            best_category = max(scores.items(), key=lambda x: x[1])
            if best_category[1] > 0:
                return best_category[0]
        
        return CaseCategory.LAINNYA
    
    def _detect_court_level(
        self,
        text: str,
        metadata: Optional[Dict[str, Any]]
    ) -> CourtLevel:
        """Detect court level"""
        text_lower = text.lower()
        
        if "kasasi" in text_lower or "mahkamah agung" in text_lower:
            return CourtLevel.KASASI
        elif "banding" in text_lower or "pengadilan tinggi" in text_lower:
            return CourtLevel.BANDING
        elif "peninjauan kembali" in text_lower or "pk" in text_lower:
            return CourtLevel.PENINJAUAN_KEMBALI
        
        return CourtLevel.PERTAMA
    
    def _extract_parties(self, text: str, case_type: CaseType) -> List[PartyInfo]:
        """Extract party information"""
        parties = []
        
        # Regex patterns untuk extract parties
        if case_type == CaseType.PIDANA:
            # Extract terdakwa
            terdakwa_pattern = r"(?:terdakwa|tertuduh)\s*:?\s*([A-Z][A-Za-z\s\.]+)"
            matches = re.finditer(terdakwa_pattern, text, re.IGNORECASE)
            for match in matches:
                parties.append(PartyInfo(
                    role="Terdakwa",
                    name=match.group(1).strip()
                ))
        else:
            # Extract penggugat/tergugat
            penggugat_pattern = r"(?:penggugat|pemohon)\s*:?\s*([A-Z][A-Za-z\s\.]+)"
            matches = re.finditer(penggugat_pattern, text, re.IGNORECASE)
            for match in matches:
                parties.append(PartyInfo(
                    role="Penggugat",
                    name=match.group(1).strip()
                ))
            
            tergugat_pattern = r"(?:tergugat|termohon)\s*:?\s*([A-Z][A-Za-z\s\.]+)"
            matches = re.finditer(tergugat_pattern, text, re.IGNORECASE)
            for match in matches:
                parties.append(PartyInfo(
                    role="Tergugat",
                    name=match.group(1).strip()
                ))
        
        return parties
    
    async def _extract_legal_bases(self, text: str) -> List[LegalBasis]:
        """Extract legal bases using citation detector"""
        try:
            from ..citation import get_citation_detector
            
            detector = get_citation_detector()
            citations = detector.detect(text)
            
            legal_bases = []
            for citation in citations:
                legal_bases.append(LegalBasis(
                    law_type=citation.type.value,
                    citation_text=citation.text,
                    relevance_score=citation.confidence
                ))
            
            return legal_bases
        except Exception:
            return []
    
    def _get_primary_laws(self, legal_bases: List[LegalBasis]) -> List[str]:
        """Get primary laws from legal bases"""
        # Sort by relevance and get top laws
        sorted_bases = sorted(
            legal_bases,
            key=lambda x: x.relevance_score,
            reverse=True
        )
        
        return [base.citation_text for base in sorted_bases[:5]]
    
    def _extract_claim_amount(self, text: str) -> Optional[float]:
        """Extract claim/damages amount"""
        # Pattern untuk extract angka rupiah
        patterns = [
            r"Rp\.?\s*([\d.,]+)\s*(?:juta|miliar|ribu)?",
            r"gugatan\s+sebesar\s+Rp\.?\s*([\d.,]+)",
            r"ganti\s+rugi\s+(?:sebesar\s+)?Rp\.?\s*([\d.,]+)"
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    amount_str = match.group(1).replace(".", "").replace(",", "")
                    amount = float(amount_str)
                    
                    # Check for multiplier
                    if "miliar" in match.group(0).lower():
                        amount *= 1_000_000_000
                    elif "juta" in match.group(0).lower():
                        amount *= 1_000_000
                    elif "ribu" in match.group(0).lower():
                        amount *= 1_000
                    
                    return amount
                except ValueError:
                    continue
        
        return None
    
    def _extract_key_facts(self, text: str, case_type: CaseType) -> List[str]:
        """Extract key factual elements"""
        # Simplified keyword extraction
        keywords = []
        
        # Common legal keywords
        legal_keywords = [
            "kontrak", "perjanjian", "pelanggaran", "kerugian",
            "bukti", "saksi", "pengakuan", "dokumen", "fakta"
        ]
        
        text_lower = text.lower()
        for keyword in legal_keywords:
            if keyword in text_lower:
                keywords.append(keyword)
        
        return keywords[:10]  # Top 10
    
    def _calculate_complexity(self, text: str) -> float:
        """Calculate factual complexity score"""
        # Simple complexity based on:
        # - Length
        # - Number of parties mentioned
        # - Number of legal citations
        
        length_score = min(len(text) / 10000, 1.0)  # Normalize to 0-1
        
        return length_score
    
    def _check_mediation(self, text: str) -> bool:
        """Check if case went through mediation"""
        keywords = ["mediasi", "perdamaian", "perma"]
        return any(kw in text.lower() for kw in keywords)
    
    def _check_expert_witness(self, text: str) -> bool:
        """Check if expert witness was involved"""
        keywords = ["ahli", "saksi ahli", "expert", "keterangan ahli"]
        return any(kw in text.lower() for kw in keywords)
    
    def _count_evidence(self, text: str) -> int:
        """Count evidence items"""
        # Simple count of "bukti" mentions
        return text.lower().count("bukti")
    
    def _count_witnesses(self, text: str) -> int:
        """Count witnesses"""
        return text.lower().count("saksi")
    
    def _extract_judges(self, text: str) -> List[str]:
        """Extract judge names"""
        judges = []
        
        # Pattern untuk extract hakim
        pattern = r"(?:hakim|majelis hakim)\s*:?\s*([A-Z][A-Za-z\s\.]+(?:,\s*S\.H\.?)?)"
        matches = re.finditer(pattern, text, re.IGNORECASE)
        
        for match in matches:
            judge_name = match.group(1).strip()
            if judge_name and len(judge_name) > 3:
                judges.append(judge_name)
        
        return list(set(judges))[:5]  # Unique, max 5
    
    def _generate_summary(self, features: CaseFeatures) -> str:
        """Generate case summary from features"""
        parts = []
        
        parts.append(f"Kasus {features.case_type.value}")
        
        if features.case_category != CaseCategory.LAINNYA:
            parts.append(f"kategori {features.case_category.value}")
        
        if features.court_level != CourtLevel.PERTAMA:
            parts.append(f"tingkat {features.court_level.value}")
        
        if features.claim_amount:
            parts.append(f"dengan nilai gugatan Rp {features.claim_amount:,.0f}")
        
        if features.primary_laws:
            laws_str = ", ".join(features.primary_laws[:3])
            parts.append(f"berdasarkan {laws_str}")
        
        return " ".join(parts) + "."
    
    def _calculate_extraction_confidence(self, features: CaseFeatures) -> float:
        """Calculate confidence in extracted features"""
        score = 0.0
        total_checks = 0
        
        # Check completeness of features
        checks = [
            features.case_type != CaseType.LAINNYA,
            features.case_category != CaseCategory.LAINNYA,
            len(features.parties) > 0,
            len(features.legal_bases) > 0,
            len(features.key_facts) > 0,
            features.text_length > 100
        ]
        
        score = sum(checks)
        total_checks = len(checks)
        
        return score / total_checks if total_checks > 0 else 0.0
