"""
Analytics Tracker - Track usage events and metrics
Tracks: chat queries, citations, predictions, documents, translations
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from collections import defaultdict
import json
from pathlib import Path


class AnalyticsTracker:
    """Track all usage events for analytics"""
    
    def __init__(self, storage_path: str = "analytics_data"):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(exist_ok=True)
        
        # In-memory cache for quick access
        self.events_cache: List[Dict[str, Any]] = []
        self.metrics_cache: Dict[str, Any] = {}
        
    def track_event(
        self,
        event_type: str,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Track an analytics event
        
        Event Types:
        - chat_query: User asks question
        - citation_detected: Citation found in response
        - prediction_requested: User requests outcome prediction
        - document_generated: Document created
        - translation_performed: Text translated
        - export_performed: Chat exported
        """
        event = {
            "event_id": self._generate_event_id(),
            "event_type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id or "anonymous",
            "metadata": metadata or {}
        }
        
        # Add to cache
        self.events_cache.append(event)
        
        # Save to disk (append mode)
        self._save_event(event)
        
        return event
    
    def track_chat_query(
        self,
        user_id: Optional[str],
        query: str,
        response_time: float,
        success: bool,
        language: str = "id"
    ) -> Dict[str, Any]:
        """Track a chat query"""
        return self.track_event(
            event_type="chat_query",
            user_id=user_id,
            metadata={
                "query_length": len(query),
                "response_time_ms": response_time,
                "success": success,
                "language": language,
                "query_keywords": self._extract_keywords(query)
            }
        )
    
    def track_citation_detected(
        self,
        user_id: Optional[str],
        citation: str,
        is_valid: bool,
        law_name: str,
        article: str
    ) -> Dict[str, Any]:
        """Track citation detection"""
        return self.track_event(
            event_type="citation_detected",
            user_id=user_id,
            metadata={
                "citation": citation,
                "is_valid": is_valid,
                "law_name": law_name,
                "article": article
            }
        )
    
    def track_prediction_requested(
        self,
        user_id: Optional[str],
        case_type: str,
        predicted_outcome: str,
        confidence: float,
        similar_cases: int
    ) -> Dict[str, Any]:
        """Track prediction request"""
        return self.track_event(
            event_type="prediction_requested",
            user_id=user_id,
            metadata={
                "case_type": case_type,
                "predicted_outcome": predicted_outcome,
                "confidence": confidence,
                "similar_cases": similar_cases
            }
        )
    
    def track_document_generated(
        self,
        user_id: Optional[str],
        document_type: str,
        success: bool,
        generation_time: float
    ) -> Dict[str, Any]:
        """Track document generation"""
        return self.track_event(
            event_type="document_generated",
            user_id=user_id,
            metadata={
                "document_type": document_type,
                "success": success,
                "generation_time_ms": generation_time
            }
        )
    
    def track_translation_performed(
        self,
        user_id: Optional[str],
        source_lang: str,
        target_lang: str,
        text_length: int,
        success: bool
    ) -> Dict[str, Any]:
        """Track translation"""
        return self.track_event(
            event_type="translation_performed",
            user_id=user_id,
            metadata={
                "source_lang": source_lang,
                "target_lang": target_lang,
                "text_length": text_length,
                "success": success
            }
        )
    
    def track_export_performed(
        self,
        user_id: Optional[str],
        export_format: str,
        message_count: int,
        include_citations: bool,
        include_predictions: bool
    ) -> Dict[str, Any]:
        """Track chat export"""
        return self.track_event(
            event_type="export_performed",
            user_id=user_id,
            metadata={
                "export_format": export_format,
                "message_count": message_count,
                "include_citations": include_citations,
                "include_predictions": include_predictions
            }
        )
    
    def get_events(
        self,
        event_type: Optional[str] = None,
        user_id: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 1000
    ) -> List[Dict[str, Any]]:
        """Get events with filters"""
        # Load from disk if cache is empty
        if not self.events_cache:
            self._load_events()
        
        events = self.events_cache
        
        # Apply filters
        if event_type:
            events = [e for e in events if e["event_type"] == event_type]
        
        if user_id:
            events = [e for e in events if e["user_id"] == user_id]
        
        if start_date:
            events = [
                e for e in events
                if datetime.fromisoformat(e["timestamp"]) >= start_date
            ]
        
        if end_date:
            events = [
                e for e in events
                if datetime.fromisoformat(e["timestamp"]) <= end_date
            ]
        
        # Sort by timestamp (newest first)
        events = sorted(
            events,
            key=lambda x: x["timestamp"],
            reverse=True
        )
        
        return events[:limit]
    
    def get_event_counts(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, int]:
        """Get event counts by type"""
        events = self.get_events(start_date=start_date, end_date=end_date)
        
        counts = defaultdict(int)
        for event in events:
            counts[event["event_type"]] += 1
        
        return dict(counts)
    
    def get_popular_topics(
        self,
        limit: int = 10,
        days: int = 30
    ) -> List[Dict[str, Any]]:
        """Get most popular query topics"""
        start_date = datetime.utcnow() - timedelta(days=days)
        chat_events = self.get_events(
            event_type="chat_query",
            start_date=start_date
        )
        
        # Count keywords
        keyword_counts = defaultdict(int)
        for event in chat_events:
            keywords = event["metadata"].get("query_keywords", [])
            for keyword in keywords:
                keyword_counts[keyword] += 1
        
        # Sort and format
        topics = [
            {"topic": keyword, "count": count}
            for keyword, count in keyword_counts.items()
        ]
        topics.sort(key=lambda x: x["count"], reverse=True)
        
        return topics[:limit]
    
    def get_success_rate(
        self,
        event_type: str,
        days: int = 30
    ) -> Dict[str, Any]:
        """Calculate success rate for event type"""
        start_date = datetime.utcnow() - timedelta(days=days)
        events = self.get_events(
            event_type=event_type,
            start_date=start_date
        )
        
        if not events:
            return {
                "total": 0,
                "successful": 0,
                "failed": 0,
                "success_rate": 0.0
            }
        
        successful = sum(
            1 for e in events
            if e["metadata"].get("success", False)
        )
        failed = len(events) - successful
        
        return {
            "total": len(events),
            "successful": successful,
            "failed": failed,
            "success_rate": (successful / len(events)) * 100
        }
    
    def get_average_response_time(
        self,
        days: int = 30
    ) -> Dict[str, float]:
        """Get average response times"""
        start_date = datetime.utcnow() - timedelta(days=days)
        chat_events = self.get_events(
            event_type="chat_query",
            start_date=start_date
        )
        
        if not chat_events:
            return {"average_ms": 0.0, "min_ms": 0.0, "max_ms": 0.0}
        
        response_times = [
            e["metadata"].get("response_time_ms", 0)
            for e in chat_events
        ]
        
        return {
            "average_ms": sum(response_times) / len(response_times),
            "min_ms": min(response_times),
            "max_ms": max(response_times)
        }
    
    def get_language_distribution(
        self,
        days: int = 30
    ) -> Dict[str, int]:
        """Get distribution of languages used"""
        start_date = datetime.utcnow() - timedelta(days=days)
        chat_events = self.get_events(
            event_type="chat_query",
            start_date=start_date
        )
        
        lang_counts = defaultdict(int)
        for event in chat_events:
            lang = event["metadata"].get("language", "unknown")
            lang_counts[lang] += 1
        
        return dict(lang_counts)
    
    def get_prediction_accuracy(
        self,
        days: int = 30
    ) -> Dict[str, Any]:
        """Calculate prediction confidence statistics"""
        start_date = datetime.utcnow() - timedelta(days=days)
        pred_events = self.get_events(
            event_type="prediction_requested",
            start_date=start_date
        )
        
        if not pred_events:
            return {
                "total_predictions": 0,
                "average_confidence": 0.0,
                "high_confidence_count": 0,
                "medium_confidence_count": 0,
                "low_confidence_count": 0
            }
        
        confidences = [
            e["metadata"].get("confidence", 0.0)
            for e in pred_events
        ]
        
        high_conf = sum(1 for c in confidences if c >= 0.8)
        medium_conf = sum(1 for c in confidences if 0.6 <= c < 0.8)
        low_conf = sum(1 for c in confidences if c < 0.6)
        
        return {
            "total_predictions": len(pred_events),
            "average_confidence": sum(confidences) / len(confidences),
            "high_confidence_count": high_conf,
            "medium_confidence_count": medium_conf,
            "low_confidence_count": low_conf,
            "high_confidence_percentage": (high_conf / len(pred_events)) * 100,
            "medium_confidence_percentage": (medium_conf / len(pred_events)) * 100,
            "low_confidence_percentage": (low_conf / len(pred_events)) * 100
        }
    
    def get_document_type_distribution(
        self,
        days: int = 30
    ) -> Dict[str, int]:
        """Get distribution of document types generated"""
        start_date = datetime.utcnow() - timedelta(days=days)
        doc_events = self.get_events(
            event_type="document_generated",
            start_date=start_date
        )
        
        type_counts = defaultdict(int)
        for event in doc_events:
            doc_type = event["metadata"].get("document_type", "unknown")
            type_counts[doc_type] += 1
        
        return dict(type_counts)
    
    def get_citation_statistics(
        self,
        days: int = 30
    ) -> Dict[str, Any]:
        """Get citation detection statistics"""
        start_date = datetime.utcnow() - timedelta(days=days)
        citation_events = self.get_events(
            event_type="citation_detected",
            start_date=start_date
        )
        
        if not citation_events:
            return {
                "total_citations": 0,
                "valid_citations": 0,
                "invalid_citations": 0,
                "validation_rate": 0.0,
                "most_cited_laws": []
            }
        
        valid = sum(
            1 for e in citation_events
            if e["metadata"].get("is_valid", False)
        )
        invalid = len(citation_events) - valid
        
        # Count most cited laws
        law_counts = defaultdict(int)
        for event in citation_events:
            law = event["metadata"].get("law_name", "unknown")
            law_counts[law] += 1
        
        most_cited = [
            {"law": law, "count": count}
            for law, count in law_counts.items()
        ]
        most_cited.sort(key=lambda x: x["count"], reverse=True)
        
        return {
            "total_citations": len(citation_events),
            "valid_citations": valid,
            "invalid_citations": invalid,
            "validation_rate": (valid / len(citation_events)) * 100,
            "most_cited_laws": most_cited[:10]
        }
    
    def get_usage_timeline(
        self,
        days: int = 30,
        granularity: str = "day"  # day, hour
    ) -> List[Dict[str, Any]]:
        """Get usage over time"""
        start_date = datetime.utcnow() - timedelta(days=days)
        events = self.get_events(start_date=start_date)
        
        # Group by time period
        timeline = defaultdict(lambda: defaultdict(int))
        
        for event in events:
            timestamp = datetime.fromisoformat(event["timestamp"])
            
            if granularity == "day":
                key = timestamp.strftime("%Y-%m-%d")
            else:  # hour
                key = timestamp.strftime("%Y-%m-%d %H:00")
            
            timeline[key][event["event_type"]] += 1
            timeline[key]["total"] += 1
        
        # Convert to list
        result = [
            {"timestamp": key, **counts}
            for key, counts in timeline.items()
        ]
        
        # Sort by timestamp
        result.sort(key=lambda x: x["timestamp"])
        
        return result
    
    def clear_old_events(self, days: int = 90):
        """Clear events older than specified days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        self.events_cache = [
            e for e in self.events_cache
            if datetime.fromisoformat(e["timestamp"]) >= cutoff_date
        ]
        
        # Save cleaned cache
        self._save_all_events()
    
    # Helper methods
    
    def _generate_event_id(self) -> str:
        """Generate unique event ID"""
        from uuid import uuid4
        return str(uuid4())
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text (simple version)"""
        # Common legal keywords
        keywords = [
            "gugat", "cerai", "waris", "kontrak", "perjanjian",
            "sengketa", "tanah", "properti", "pidana", "perdata",
            "warisan", "nikah", "perceraian", "adopsi", "hak asuh",
            "utang", "piutang", "jaminan", "fidusia", "hipotik"
        ]
        
        text_lower = text.lower()
        found_keywords = [kw for kw in keywords if kw in text_lower]
        
        return found_keywords
    
    def _save_event(self, event: Dict[str, Any]):
        """Save single event to disk"""
        # Append to daily file
        date_str = datetime.utcnow().strftime("%Y-%m-%d")
        file_path = self.storage_path / f"events_{date_str}.jsonl"
        
        with open(file_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(event, ensure_ascii=False) + "\n")
    
    def _save_all_events(self):
        """Save all cached events"""
        # Group by date
        events_by_date = defaultdict(list)
        for event in self.events_cache:
            timestamp = datetime.fromisoformat(event["timestamp"])
            date_str = timestamp.strftime("%Y-%m-%d")
            events_by_date[date_str].append(event)
        
        # Write each date file
        for date_str, events in events_by_date.items():
            file_path = self.storage_path / f"events_{date_str}.jsonl"
            
            with open(file_path, "w", encoding="utf-8") as f:
                for event in events:
                    f.write(json.dumps(event, ensure_ascii=False) + "\n")
    
    def _load_events(self):
        """Load events from disk"""
        self.events_cache = []
        
        # Load all event files
        for file_path in self.storage_path.glob("events_*.jsonl"):
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        event = json.loads(line)
                        self.events_cache.append(event)


# Global tracker instance
_tracker = None


def get_tracker() -> AnalyticsTracker:
    """Get global analytics tracker instance"""
    global _tracker
    if _tracker is None:
        _tracker = AnalyticsTracker()
    return _tracker
