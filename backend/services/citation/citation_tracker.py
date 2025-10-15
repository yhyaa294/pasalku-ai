"""
Citation Tracker

Melacak penggunaan sitasi hukum untuk analytics dan statistik.
Membantu memahami hukum mana yang paling sering dirujuk.
"""

import asyncio
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import logging

from .citation_detector import DetectedCitation, CitationType
from .citation_linker import LinkedCitation

logger = logging.getLogger(__name__)


@dataclass
class CitationUsage:
    """Record penggunaan sitasi"""
    citation_text: str  # Text sitasi
    citation_type: CitationType  # Jenis sitasi
    law_id: Optional[str] = None  # ID hukum (jika di-link)
    law_title: Optional[str] = None  # Judul hukum
    timestamp: datetime = field(default_factory=datetime.now)  # Waktu penggunaan
    context: str = ""  # Konteks penggunaan
    user_id: Optional[str] = None  # ID user
    session_id: Optional[str] = None  # ID session
    source: str = "api"  # Sumber (api, chat, analysis, etc)
    metadata: Dict[str, Any] = field(default_factory=dict)  # Metadata tambahan


@dataclass
class CitationStats:
    """Statistik penggunaan sitasi"""
    total_citations: int  # Total sitasi
    unique_citations: int  # Jumlah sitasi unik
    total_laws: int  # Total hukum yang dirujuk
    by_type: Dict[str, int]  # Jumlah per jenis
    by_law: Dict[str, int]  # Jumlah per hukum
    top_citations: List[Dict[str, Any]]  # Top 10 sitasi
    top_laws: List[Dict[str, Any]]  # Top 10 hukum
    recent_citations: List[CitationUsage]  # Sitasi terbaru
    time_range: str  # Range waktu statistik
    generated_at: datetime = field(default_factory=datetime.now)


class CitationTracker:
    """
    Melacak dan menganalisis penggunaan sitasi.
    
    Menyimpan history penggunaan sitasi untuk:
    - Analytics: Hukum mana yang paling sering dirujuk
    - Trending: Hukum yang sedang trending
    - User behavior: Pattern penggunaan per user
    - Quality: Evaluasi kualitas linking
    """
    
    def __init__(self):
        """Inisialisasi Citation Tracker"""
        # In-memory storage (bisa dipindah ke database nanti)
        self.usage_history: List[CitationUsage] = []
        self.usage_by_law: Dict[str, List[CitationUsage]] = defaultdict(list)
        self.usage_by_type: Dict[CitationType, List[CitationUsage]] = defaultdict(list)
        self.usage_by_user: Dict[str, List[CitationUsage]] = defaultdict(list)
        
        logger.info("Citation Tracker initialized")
    
    def track_citation(
        self,
        citation: DetectedCitation,
        linked: Optional[LinkedCitation] = None,
        context: str = "",
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        source: str = "api"
    ) -> CitationUsage:
        """
        Track penggunaan single citation.
        
        Args:
            citation: Sitasi yang terdeteksi
            linked: LinkedCitation (opsional)
            context: Konteks penggunaan
            user_id: ID user
            session_id: ID session
            source: Sumber penggunaan
        
        Returns:
            CitationUsage record
        """
        usage = CitationUsage(
            citation_text=citation.text,
            citation_type=citation.type,
            law_id=linked.law_id if linked else None,
            law_title=linked.law_title if linked else None,
            timestamp=datetime.now(),
            context=context[:200],  # Max 200 chars
            user_id=user_id,
            session_id=session_id,
            source=source,
            metadata={
                "confidence": citation.confidence,
                "linked": linked is not None,
                "link_status": linked.status.value if linked else None
            }
        )
        
        # Simpan ke storage
        self.usage_history.append(usage)
        
        if usage.law_id:
            self.usage_by_law[usage.law_id].append(usage)
        
        self.usage_by_type[citation.type].append(usage)
        
        if user_id:
            self.usage_by_user[user_id].append(usage)
        
        logger.debug(f"Tracked citation: {citation.text}")
        
        return usage
    
    def track_citations(
        self,
        citations: List[DetectedCitation],
        linked_citations: Optional[List[LinkedCitation]] = None,
        context: str = "",
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        source: str = "api"
    ) -> List[CitationUsage]:
        """Track multiple citations"""
        # Map linked citations
        linked_map = {}
        if linked_citations:
            for linked in linked_citations:
                linked_map[linked.citation.text] = linked
        
        usages = []
        for citation in citations:
            linked = linked_map.get(citation.text)
            usage = self.track_citation(
                citation=citation,
                linked=linked,
                context=context,
                user_id=user_id,
                session_id=session_id,
                source=source
            )
            usages.append(usage)
        
        logger.info(f"Tracked {len(usages)} citations")
        
        return usages
    
    def get_statistics(
        self,
        time_range: Optional[timedelta] = None,
        user_id: Optional[str] = None,
        citation_type: Optional[CitationType] = None
    ) -> CitationStats:
        """
        Get statistik penggunaan sitasi.
        
        Args:
            time_range: Range waktu (default: all time)
            user_id: Filter by user (opsional)
            citation_type: Filter by type (opsional)
        
        Returns:
            CitationStats
        """
        # Filter usage berdasarkan criteria
        filtered_usage = self.usage_history
        
        if time_range:
            cutoff = datetime.now() - time_range
            filtered_usage = [u for u in filtered_usage if u.timestamp >= cutoff]
        
        if user_id:
            filtered_usage = [u for u in filtered_usage if u.user_id == user_id]
        
        if citation_type:
            filtered_usage = [u for u in filtered_usage if u.citation_type == citation_type]
        
        # Hitung statistik
        total_citations = len(filtered_usage)
        unique_citations = len(set(u.citation_text for u in filtered_usage))
        total_laws = len(set(u.law_id for u in filtered_usage if u.law_id))
        
        # By type
        type_counter = Counter(u.citation_type.value for u in filtered_usage)
        by_type = dict(type_counter)
        
        # By law
        law_counter = Counter(
            (u.law_id, u.law_title) 
            for u in filtered_usage 
            if u.law_id
        )
        by_law = {law_id: count for (law_id, _), count in law_counter.items()}
        
        # Top citations (by frequency)
        citation_counter = Counter(u.citation_text for u in filtered_usage)
        top_citations = [
            {
                "text": text,
                "count": count,
                "percentage": (count / total_citations * 100) if total_citations > 0 else 0
            }
            for text, count in citation_counter.most_common(10)
        ]
        
        # Top laws (by frequency)
        top_laws = [
            {
                "law_id": law_id,
                "law_title": law_title,
                "count": count,
                "percentage": (count / total_citations * 100) if total_citations > 0 else 0
            }
            for (law_id, law_title), count in law_counter.most_common(10)
        ]
        
        # Recent citations (last 10)
        recent_citations = sorted(
            filtered_usage,
            key=lambda u: u.timestamp,
            reverse=True
        )[:10]
        
        # Time range description
        if time_range:
            time_range_str = f"Last {time_range.days} days" if time_range.days > 0 else f"Last {time_range.seconds // 3600} hours"
        else:
            time_range_str = "All time"
        
        return CitationStats(
            total_citations=total_citations,
            unique_citations=unique_citations,
            total_laws=total_laws,
            by_type=by_type,
            by_law=by_law,
            top_citations=top_citations,
            top_laws=top_laws,
            recent_citations=recent_citations,
            time_range=time_range_str
        )
    
    def get_trending_citations(
        self,
        time_range: timedelta = timedelta(days=7),
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get sitasi yang sedang trending.
        
        Args:
            time_range: Range waktu untuk analisis
            limit: Jumlah maksimal hasil
        
        Returns:
            List trending citations
        """
        cutoff = datetime.now() - time_range
        recent_usage = [u for u in self.usage_history if u.timestamp >= cutoff]
        
        # Count frequency
        citation_counter = Counter(u.citation_text for u in recent_usage)
        
        # Calculate trend (compare dengan periode sebelumnya)
        previous_cutoff = cutoff - time_range
        previous_usage = [
            u for u in self.usage_history 
            if previous_cutoff <= u.timestamp < cutoff
        ]
        previous_counter = Counter(u.citation_text for u in previous_usage)
        
        trending = []
        for text, current_count in citation_counter.most_common(limit):
            previous_count = previous_counter.get(text, 0)
            
            # Calculate growth
            if previous_count > 0:
                growth = ((current_count - previous_count) / previous_count) * 100
            else:
                growth = 100.0 if current_count > 0 else 0.0
            
            trending.append({
                "text": text,
                "current_count": current_count,
                "previous_count": previous_count,
                "growth_percentage": growth,
                "is_new": previous_count == 0
            })
        
        # Sort by growth
        trending.sort(key=lambda x: x["growth_percentage"], reverse=True)
        
        return trending[:limit]
    
    def get_user_history(
        self,
        user_id: str,
        limit: int = 50
    ) -> List[CitationUsage]:
        """
        Get history penggunaan sitasi per user.
        
        Args:
            user_id: ID user
            limit: Jumlah maksimal hasil
        
        Returns:
            List CitationUsage
        """
        user_usage = self.usage_by_user.get(user_id, [])
        
        # Sort by timestamp descending
        sorted_usage = sorted(user_usage, key=lambda u: u.timestamp, reverse=True)
        
        return sorted_usage[:limit]
    
    def get_law_popularity(
        self,
        time_range: Optional[timedelta] = None
    ) -> List[Dict[str, Any]]:
        """
        Get popularitas hukum berdasarkan frekuensi penggunaan.
        
        Returns:
            List hukum yang paling populer
        """
        # Filter by time range
        filtered_usage = self.usage_history
        if time_range:
            cutoff = datetime.now() - time_range
            filtered_usage = [u for u in filtered_usage if u.timestamp >= cutoff]
        
        # Count by law
        law_counter = Counter(
            (u.law_id, u.law_title)
            for u in filtered_usage
            if u.law_id
        )
        
        total = sum(law_counter.values())
        
        popularity = [
            {
                "law_id": law_id,
                "law_title": law_title,
                "usage_count": count,
                "percentage": (count / total * 100) if total > 0 else 0,
                "rank": rank + 1
            }
            for rank, ((law_id, law_title), count) in enumerate(law_counter.most_common())
        ]
        
        return popularity
    
    def get_citation_quality_metrics(self) -> Dict[str, Any]:
        """
        Get metrics kualitas linking sitasi.
        
        Returns:
            Dictionary dengan metrics kualitas
        """
        total = len(self.usage_history)
        
        if total == 0:
            return {
                "total_citations": 0,
                "link_rate": 0.0,
                "average_confidence": 0.0,
                "quality_distribution": {}
            }
        
        # Count linked
        linked = sum(1 for u in self.usage_history if u.law_id is not None)
        link_rate = linked / total
        
        # Average confidence
        confidences = [
            u.metadata.get("confidence", 0.0)
            for u in self.usage_history
            if "confidence" in u.metadata
        ]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
        
        # Quality distribution
        high_quality = sum(1 for c in confidences if c >= 0.8)
        medium_quality = sum(1 for c in confidences if 0.5 <= c < 0.8)
        low_quality = sum(1 for c in confidences if c < 0.5)
        
        return {
            "total_citations": total,
            "linked_citations": linked,
            "link_rate": link_rate,
            "average_confidence": avg_confidence,
            "quality_distribution": {
                "high": high_quality,
                "medium": medium_quality,
                "low": low_quality
            }
        }
    
    def cleanup_old_data(self, days: int = 90):
        """
        Cleanup data lama untuk menghemat memory.
        
        Args:
            days: Data lebih lama dari X hari akan dihapus
        """
        cutoff = datetime.now() - timedelta(days=days)
        
        # Filter usage history
        before_count = len(self.usage_history)
        self.usage_history = [u for u in self.usage_history if u.timestamp >= cutoff]
        after_count = len(self.usage_history)
        
        # Rebuild indexes
        self.usage_by_law.clear()
        self.usage_by_type.clear()
        self.usage_by_user.clear()
        
        for usage in self.usage_history:
            if usage.law_id:
                self.usage_by_law[usage.law_id].append(usage)
            self.usage_by_type[usage.citation_type].append(usage)
            if usage.user_id:
                self.usage_by_user[usage.user_id].append(usage)
        
        logger.info(f"Cleaned up {before_count - after_count} old citation records")


# Singleton instance
_citation_tracker: Optional[CitationTracker] = None


def get_citation_tracker() -> CitationTracker:
    """Get atau buat Citation Tracker instance"""
    global _citation_tracker
    
    if _citation_tracker is None:
        _citation_tracker = CitationTracker()
    
    return _citation_tracker
