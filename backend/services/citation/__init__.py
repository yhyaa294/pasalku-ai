"""
Sistem Sitasi Otomatis (Automatic Citation System)

Sistem untuk mendeteksi, menghubungkan, dan memformat referensi hukum secara otomatis.

Komponen:
1. Citation Detector - Deteksi sitasi dalam teks
2. Citation Linker - Hubungkan dengan Knowledge Graph
3. Citation Formatter - Format sitasi yang konsisten
4. Citation Tracker - Lacak penggunaan sitasi
5. Citation Enhancer - Tambahkan link dan metadata
"""

from .citation_detector import (
    CitationDetector,
    get_citation_detector,
    DetectedCitation,
    CitationType
)

from .citation_linker import (
    CitationLinker,
    get_citation_linker,
    LinkedCitation,
    LinkStatus
)

from .citation_formatter import (
    CitationFormatter,
    get_citation_formatter,
    FormattedCitation,
    CitationFormat
)

from .citation_tracker import (
    CitationTracker,
    get_citation_tracker,
    CitationUsage,
    CitationStats
)

from .citation_enhancer import (
    CitationEnhancer,
    get_citation_enhancer,
    EnhancedCitation
)


__all__ = [
    # Citation Detector
    "CitationDetector",
    "get_citation_detector",
    "DetectedCitation",
    "CitationType",
    
    # Citation Linker
    "CitationLinker",
    "get_citation_linker",
    "LinkedCitation",
    "LinkStatus",
    
    # Citation Formatter
    "CitationFormatter",
    "get_citation_formatter",
    "FormattedCitation",
    "CitationFormat",
    
    # Citation Tracker
    "CitationTracker",
    "get_citation_tracker",
    "CitationUsage",
    "CitationStats",
    
    # Citation Enhancer
    "CitationEnhancer",
    "get_citation_enhancer",
    "EnhancedCitation",
]
