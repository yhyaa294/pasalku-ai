"""
Citation Detector

Mendeteksi semua jenis sitasi hukum dalam teks menggunakan regex patterns
yang disesuaikan dengan format hukum Indonesia.

Jenis sitasi yang didukung:
- Undang-Undang (UU)
- Peraturan Pemerintah (PP)
- Peraturan Presiden (Perpres)
- Peraturan Menteri (Permen)
- Pasal dan Ayat
- Putusan Pengadilan
- KUHP, KUHPerdata, KUHAP
- Peraturan Daerah (Perda)
"""

import re
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class CitationType(Enum):
    """Jenis-jenis sitasi hukum"""
    UU = "undang_undang"  # UU No 13 Tahun 2003
    PP = "peraturan_pemerintah"  # PP No 35 Tahun 2021
    PERPRES = "peraturan_presiden"  # Perpres No 82 Tahun 2018
    PERMEN = "peraturan_menteri"  # Permen No 1 Tahun 2020
    PASAL = "pasal"  # Pasal 1 ayat (2)
    PUTUSAN = "putusan"  # Putusan No 123/Pid/2024/PN.Jkt
    KUHP = "kuhp"  # KUHP, KUHPerdata, KUHAP
    PERDA = "peraturan_daerah"  # Perda DKI No 5 Tahun 2015
    KEPRES = "keputusan_presiden"  # Keppres No 10 Tahun 2020
    INPRES = "instruksi_presiden"  # Inpres No 3 Tahun 2019
    OTHER = "lainnya"


@dataclass
class DetectedCitation:
    """Sitasi yang terdeteksi dalam teks"""
    text: str  # Teks asli sitasi
    type: CitationType  # Jenis sitasi
    normalized: str  # Teks yang dinormalisasi
    start_pos: int  # Posisi awal dalam teks
    end_pos: int  # Posisi akhir dalam teks
    confidence: float  # Tingkat kepercayaan (0.0-1.0)
    metadata: Dict[str, Any]  # Metadata tambahan
    
    def __str__(self):
        return f"{self.type.value}: {self.text}"


class CitationDetector:
    """
    Mendeteksi sitasi hukum dalam teks menggunakan regex patterns.
    
    Menggunakan berbagai pattern untuk mendeteksi format sitasi Indonesia
    yang bervariasi.
    """
    
    # Pattern untuk Undang-Undang
    UU_PATTERNS = [
        # UU No 13 Tahun 2003
        r"UU\s+No\.?\s*(\d+)\s+Tahun\s+(\d{4})",
        # Undang-Undang Nomor 13 Tahun 2003
        r"Undang[-\s]?Undang\s+(?:Nomor|No\.?)\s*(\d+)\s+Tahun\s+(\d{4})",
        # UU 13/2003
        r"UU\s+(\d+)/(\d{4})",
        # Undang-Undang RI No 13 Tahun 2003
        r"Undang[-\s]?Undang\s+(?:RI|Republik\s+Indonesia)?\s*(?:Nomor|No\.?)\s*(\d+)\s+Tahun\s+(\d{4})",
    ]
    
    # Pattern untuk Peraturan Pemerintah
    PP_PATTERNS = [
        # PP No 35 Tahun 2021
        r"PP\s+No\.?\s*(\d+)\s+Tahun\s+(\d{4})",
        # Peraturan Pemerintah Nomor 35 Tahun 2021
        r"Peraturan\s+Pemerintah\s+(?:Nomor|No\.?)\s*(\d+)\s+Tahun\s+(\d{4})",
        # PP 35/2021
        r"PP\s+(\d+)/(\d{4})",
    ]
    
    # Pattern untuk Peraturan Presiden
    PERPRES_PATTERNS = [
        # Perpres No 82 Tahun 2018
        r"Perpres\s+No\.?\s*(\d+)\s+Tahun\s+(\d{4})",
        # Peraturan Presiden Nomor 82 Tahun 2018
        r"Peraturan\s+Presiden\s+(?:Nomor|No\.?)\s*(\d+)\s+Tahun\s+(\d{4})",
        # Perpres 82/2018
        r"Perpres\s+(\d+)/(\d{4})",
    ]
    
    # Pattern untuk Peraturan Menteri
    PERMEN_PATTERNS = [
        # Permen No 1 Tahun 2020
        r"Permen\s+(?:\w+\s+)?No\.?\s*(\d+)\s+Tahun\s+(\d{4})",
        # Peraturan Menteri ... Nomor 1 Tahun 2020
        r"Peraturan\s+Menteri\s+(?:\w+\s+)?(?:Nomor|No\.?)\s*(\d+)\s+Tahun\s+(\d{4})",
    ]
    
    # Pattern untuk Pasal
    PASAL_PATTERNS = [
        # Pasal 1 ayat (2)
        r"Pasal\s+(\d+)\s+ayat\s*\((\d+)\)",
        # Pasal 378
        r"Pasal\s+(\d+)(?!\s+ayat)",
        # Pasal 1 huruf a
        r"Pasal\s+(\d+)\s+huruf\s+([a-z])",
        # Pasal 1 sampai 5
        r"Pasal\s+(\d+)\s+(?:sampai|hingga|s\.?d\.?)\s+(?:Pasal\s+)?(\d+)",
    ]
    
    # Pattern untuk Putusan
    PUTUSAN_PATTERNS = [
        # Putusan No 123/Pid/2024/PN.Jkt
        r"Putusan\s+No\.?\s*([\d/A-Za-z.]+)",
        # Nomor 123/Pid/2024/PN Jakarta
        r"(?:Nomor|No\.?)\s*([\d/]+(?:Pid|Pdt|PHI|TUN)[/\d]+/[A-Za-z.]+)",
    ]
    
    # Pattern untuk KUHP, KUHPerdata, KUHAP
    KUH_PATTERNS = [
        r"\b(KUHP|KUHPerdata|KUH\s*Perdata|KUHAP|KUHPidana)\b",
    ]
    
    # Pattern untuk Peraturan Daerah
    PERDA_PATTERNS = [
        # Perda DKI No 5 Tahun 2015
        r"Perda\s+(\w+)\s+No\.?\s*(\d+)\s+Tahun\s+(\d{4})",
        # Peraturan Daerah Provinsi DKI Jakarta No 5 Tahun 2015
        r"Peraturan\s+Daerah\s+(?:Provinsi|Kabupaten|Kota)?\s*(\w+)\s+(?:Nomor|No\.?)\s*(\d+)\s+Tahun\s+(\d{4})",
    ]
    
    # Pattern untuk Keputusan Presiden
    KEPRES_PATTERNS = [
        # Keppres No 10 Tahun 2020
        r"Keppres\s+No\.?\s*(\d+)\s+Tahun\s+(\d{4})",
        # Keputusan Presiden Nomor 10 Tahun 2020
        r"Keputusan\s+Presiden\s+(?:Nomor|No\.?)\s*(\d+)\s+Tahun\s+(\d{4})",
    ]
    
    # Pattern untuk Instruksi Presiden
    INPRES_PATTERNS = [
        # Inpres No 3 Tahun 2019
        r"Inpres\s+No\.?\s*(\d+)\s+Tahun\s+(\d{4})",
        # Instruksi Presiden Nomor 3 Tahun 2019
        r"Instruksi\s+Presiden\s+(?:Nomor|No\.?)\s*(\d+)\s+Tahun\s+(\d{4})",
    ]
    
    def __init__(self):
        """Inisialisasi Citation Detector"""
        self._compile_patterns()
        logger.info("Citation Detector initialized")
    
    def _compile_patterns(self):
        """Compile semua regex patterns untuk performa lebih baik"""
        self.compiled_patterns = {
            CitationType.UU: [re.compile(p, re.IGNORECASE) for p in self.UU_PATTERNS],
            CitationType.PP: [re.compile(p, re.IGNORECASE) for p in self.PP_PATTERNS],
            CitationType.PERPRES: [re.compile(p, re.IGNORECASE) for p in self.PERPRES_PATTERNS],
            CitationType.PERMEN: [re.compile(p, re.IGNORECASE) for p in self.PERMEN_PATTERNS],
            CitationType.PASAL: [re.compile(p, re.IGNORECASE) for p in self.PASAL_PATTERNS],
            CitationType.PUTUSAN: [re.compile(p, re.IGNORECASE) for p in self.PUTUSAN_PATTERNS],
            CitationType.KUHP: [re.compile(p, re.IGNORECASE) for p in self.KUH_PATTERNS],
            CitationType.PERDA: [re.compile(p, re.IGNORECASE) for p in self.PERDA_PATTERNS],
            CitationType.KEPRES: [re.compile(p, re.IGNORECASE) for p in self.KEPRES_PATTERNS],
            CitationType.INPRES: [re.compile(p, re.IGNORECASE) for p in self.INPRES_PATTERNS],
        }
    
    def detect(self, text: str) -> List[DetectedCitation]:
        """
        Deteksi semua sitasi dalam teks.
        
        Args:
            text: Teks yang akan dianalisis
        
        Returns:
            List sitasi yang terdeteksi
        """
        citations: List[DetectedCitation] = []
        
        # Deteksi untuk setiap jenis sitasi
        for citation_type, patterns in self.compiled_patterns.items():
            for pattern in patterns:
                for match in pattern.finditer(text):
                    citation = self._create_citation(
                        text=match.group(0),
                        type=citation_type,
                        match=match,
                        full_text=text
                    )
                    citations.append(citation)
        
        # Sort berdasarkan posisi
        citations.sort(key=lambda c: c.start_pos)
        
        # Remove duplicates (sitasi yang overlap)
        citations = self._remove_overlaps(citations)
        
        logger.info(f"Detected {len(citations)} citations in text")
        
        return citations
    
    def _create_citation(
        self,
        text: str,
        type: CitationType,
        match: re.Match,
        full_text: str
    ) -> DetectedCitation:
        """Buat objek DetectedCitation dari match"""
        # Normalisasi teks
        normalized = self._normalize_citation(text, type, match)
        
        # Ekstrak metadata
        metadata = self._extract_metadata(text, type, match)
        
        # Hitung confidence
        confidence = self._calculate_confidence(text, type, match, full_text)
        
        return DetectedCitation(
            text=text,
            type=type,
            normalized=normalized,
            start_pos=match.start(),
            end_pos=match.end(),
            confidence=confidence,
            metadata=metadata
        )
    
    def _normalize_citation(
        self,
        text: str,
        type: CitationType,
        match: re.Match
    ) -> str:
        """
        Normalisasi format sitasi.
        
        Contoh:
        - "UU No 13 Tahun 2003" -> "UU No. 13 Tahun 2003"
        - "Pasal 378" -> "Pasal 378"
        """
        if type == CitationType.UU:
            groups = match.groups()
            if len(groups) >= 2:
                return f"UU No. {groups[0]} Tahun {groups[1]}"
        
        elif type == CitationType.PP:
            groups = match.groups()
            if len(groups) >= 2:
                return f"PP No. {groups[0]} Tahun {groups[1]}"
        
        elif type == CitationType.PERPRES:
            groups = match.groups()
            if len(groups) >= 2:
                return f"Perpres No. {groups[0]} Tahun {groups[1]}"
        
        elif type == CitationType.PASAL:
            groups = match.groups()
            if len(groups) >= 2 and "ayat" in text.lower():
                return f"Pasal {groups[0]} ayat ({groups[1]})"
            elif len(groups) >= 1:
                return f"Pasal {groups[0]}"
        
        # Default: return original text dengan spasi dinormalisasi
        return re.sub(r'\s+', ' ', text.strip())
    
    def _extract_metadata(
        self,
        text: str,
        type: CitationType,
        match: re.Match
    ) -> Dict[str, Any]:
        """Ekstrak metadata dari sitasi"""
        metadata = {"raw_text": text}
        groups = match.groups()
        
        if type == CitationType.UU:
            if len(groups) >= 2:
                metadata["nomor"] = groups[0]
                metadata["tahun"] = groups[1]
        
        elif type == CitationType.PP:
            if len(groups) >= 2:
                metadata["nomor"] = groups[0]
                metadata["tahun"] = groups[1]
        
        elif type == CitationType.PERPRES:
            if len(groups) >= 2:
                metadata["nomor"] = groups[0]
                metadata["tahun"] = groups[1]
        
        elif type == CitationType.PASAL:
            if len(groups) >= 1:
                metadata["pasal"] = groups[0]
                if len(groups) >= 2:
                    metadata["ayat"] = groups[1]
        
        elif type == CitationType.PUTUSAN:
            if len(groups) >= 1:
                metadata["nomor_putusan"] = groups[0]
        
        elif type == CitationType.PERDA:
            if len(groups) >= 3:
                metadata["daerah"] = groups[0]
                metadata["nomor"] = groups[1]
                metadata["tahun"] = groups[2]
        
        return metadata
    
    def _calculate_confidence(
        self,
        text: str,
        type: CitationType,
        match: re.Match,
        full_text: str
    ) -> float:
        """
        Hitung confidence score berdasarkan:
        - Kelengkapan format (0.5)
        - Konteks sekitar (0.3)
        - Pattern quality (0.2)
        """
        score = 0.0
        
        # 1. Kelengkapan format (0.5)
        groups = match.groups()
        if type in [CitationType.UU, CitationType.PP, CitationType.PERPRES]:
            # Harus punya nomor dan tahun
            if len(groups) >= 2 and groups[0] and groups[1]:
                score += 0.5
            else:
                score += 0.25
        else:
            # Jenis lain cukup punya minimal 1 group
            if len(groups) >= 1 and groups[0]:
                score += 0.5
            else:
                score += 0.25
        
        # 2. Konteks sekitar (0.3)
        # Cek kata-kata hukum di sekitar sitasi
        context_start = max(0, match.start() - 50)
        context_end = min(len(full_text), match.end() + 50)
        context = full_text[context_start:context_end].lower()
        
        legal_keywords = [
            "berdasarkan", "sesuai", "menurut", "mengacu", "merujuk",
            "pasal", "ayat", "undang-undang", "peraturan", "ketentuan",
            "hukum", "pidana", "perdata", "putusan", "pengadilan"
        ]
        
        context_score = sum(1 for kw in legal_keywords if kw in context)
        score += min(0.3, context_score * 0.05)
        
        # 3. Pattern quality (0.2)
        # Pattern lengkap mendapat score lebih tinggi
        if "Nomor" in text or "No." in text or "No " in text:
            score += 0.1
        if "Tahun" in text:
            score += 0.1
        
        return min(1.0, score)
    
    def _remove_overlaps(
        self,
        citations: List[DetectedCitation]
    ) -> List[DetectedCitation]:
        """
        Hapus sitasi yang overlap.
        Pertahankan sitasi dengan confidence tertinggi.
        """
        if not citations:
            return []
        
        result = []
        current = citations[0]
        
        for next_citation in citations[1:]:
            # Cek overlap
            if next_citation.start_pos < current.end_pos:
                # Ada overlap, pilih yang confidence lebih tinggi
                if next_citation.confidence > current.confidence:
                    current = next_citation
            else:
                # Tidak overlap, simpan current dan lanjut ke next
                result.append(current)
                current = next_citation
        
        # Jangan lupa citation terakhir
        result.append(current)
        
        return result
    
    def detect_by_type(
        self,
        text: str,
        citation_types: List[CitationType]
    ) -> List[DetectedCitation]:
        """
        Deteksi sitasi dengan filter jenis tertentu.
        
        Args:
            text: Teks yang akan dianalisis
            citation_types: Jenis-jenis sitasi yang dicari
        
        Returns:
            List sitasi yang terdeteksi dan match dengan filter
        """
        all_citations = self.detect(text)
        return [c for c in all_citations if c.type in citation_types]
    
    def get_citation_count(self, text: str) -> Dict[CitationType, int]:
        """
        Hitung jumlah sitasi per jenis.
        
        Returns:
            Dictionary dengan jumlah per jenis sitasi
        """
        citations = self.detect(text)
        counts = {}
        
        for citation in citations:
            if citation.type not in counts:
                counts[citation.type] = 0
            counts[citation.type] += 1
        
        return counts


# Singleton instance
_citation_detector: Optional[CitationDetector] = None


def get_citation_detector() -> CitationDetector:
    """Get atau buat Citation Detector instance"""
    global _citation_detector
    
    if _citation_detector is None:
        _citation_detector = CitationDetector()
    
    return _citation_detector
