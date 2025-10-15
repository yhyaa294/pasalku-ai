"""
Precedent Finder - Find similar historical cases

Mencari preseden (kasus serupa) berdasarkan:
- Case type similarity
- Legal basis similarity
- Factual similarity
- Court level matching
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio

from .case_analyzer import CaseFeatures, CaseType, CaseCategory, CourtLevel


@dataclass
class SimilarCase:
    """
    Kasus serupa yang ditemukan sebagai preseden
    """
    # Case identification
    case_id: str
    case_number: Optional[str] = None
    case_title: Optional[str] = None
    
    # Similarity scores
    overall_similarity: float = 0.0
    type_similarity: float = 0.0
    legal_similarity: float = 0.0
    factual_similarity: float = 0.0
    
    # Case info
    case_type: Optional[CaseType] = None
    case_category: Optional[CaseCategory] = None
    court_level: Optional[CourtLevel] = None
    
    # Outcome
    outcome: Optional[str] = None  # Won/Lost/Partial
    outcome_details: str = ""
    
    # Legal bases
    laws_used: List[str] = field(default_factory=list)
    
    # Metadata
    decision_date: Optional[datetime] = None
    court_name: Optional[str] = None
    judge_names: List[str] = field(default_factory=list)
    
    # Reference
    case_url: Optional[str] = None
    summary: str = ""
    
    # Relevance
    relevance_score: float = 0.0
    confidence: float = 0.0


class PrecedentFinder:
    """
    Find similar historical cases as precedents
    """
    
    def __init__(self):
        self.min_similarity_threshold = 0.3
        self.weight_type = 0.25
        self.weight_legal = 0.40
        self.weight_factual = 0.25
        self.weight_procedural = 0.10
    
    async def find_similar_cases(
        self,
        case_features: CaseFeatures,
        limit: int = 10,
        min_similarity: Optional[float] = None
    ) -> List[SimilarCase]:
        """
        Find similar cases based on case features
        
        Args:
            case_features: Extracted features from current case
            limit: Maximum number of similar cases to return
            min_similarity: Minimum similarity threshold (default: 0.3)
        
        Returns:
            List of similar cases sorted by similarity
        """
        if min_similarity is None:
            min_similarity = self.min_similarity_threshold
        
        # Search for potential matches
        candidates = await self._search_candidate_cases(case_features)
        
        # Calculate similarity for each candidate
        similar_cases = []
        
        for candidate in candidates:
            similarity_scores = self._calculate_similarity(
                case_features,
                candidate
            )
            
            overall_similarity = similarity_scores["overall"]
            
            if overall_similarity >= min_similarity:
                similar_case = SimilarCase(
                    case_id=candidate.get("case_id", ""),
                    case_number=candidate.get("case_number"),
                    case_title=candidate.get("title"),
                    overall_similarity=overall_similarity,
                    type_similarity=similarity_scores["type"],
                    legal_similarity=similarity_scores["legal"],
                    factual_similarity=similarity_scores["factual"],
                    case_type=candidate.get("case_type"),
                    case_category=candidate.get("case_category"),
                    court_level=candidate.get("court_level"),
                    outcome=candidate.get("outcome"),
                    outcome_details=candidate.get("outcome_details", ""),
                    laws_used=candidate.get("laws_used", []),
                    decision_date=candidate.get("decision_date"),
                    court_name=candidate.get("court_name"),
                    judge_names=candidate.get("judge_names", []),
                    case_url=candidate.get("url"),
                    summary=candidate.get("summary", ""),
                    relevance_score=overall_similarity,
                    confidence=similarity_scores.get("confidence", 0.8)
                )
                
                similar_cases.append(similar_case)
        
        # Sort by similarity and limit
        similar_cases.sort(key=lambda x: x.overall_similarity, reverse=True)
        
        return similar_cases[:limit]
    
    async def _search_candidate_cases(
        self,
        case_features: CaseFeatures
    ) -> List[Dict[str, Any]]:
        """
        Search for candidate cases from database
        
        Uses Knowledge Graph Search to find potential matches
        """
        try:
            from ..knowledge_graph import get_search_engine
            
            search_engine = get_search_engine()
            
            # Build search query from case features
            query_parts = []
            
            # Add case type
            if case_features.case_type:
                query_parts.append(case_features.case_type.value)
            
            # Add primary laws
            if case_features.primary_laws:
                query_parts.extend(case_features.primary_laws[:3])
            
            # Add key facts
            if case_features.key_facts:
                query_parts.extend(case_features.key_facts[:5])
            
            query = " ".join(query_parts)
            
            # Search for cases
            # Note: Assumes cases are stored in knowledge graph
            # In real implementation, might need separate cases database
            results = await search_engine.search(
                query=query,
                filters={"type": "case"},  # Filter for case documents
                limit=50
            )
            
            # Convert search results to candidate format
            candidates = []
            for result in results:
                candidates.append({
                    "case_id": result.get("id"),
                    "case_number": result.get("case_number"),
                    "title": result.get("title"),
                    "case_type": self._parse_case_type(result.get("case_type")),
                    "case_category": self._parse_case_category(result.get("category")),
                    "court_level": self._parse_court_level(result.get("court_level")),
                    "outcome": result.get("outcome"),
                    "outcome_details": result.get("outcome_details", ""),
                    "laws_used": result.get("laws_used", []),
                    "decision_date": result.get("decision_date"),
                    "court_name": result.get("court_name"),
                    "judge_names": result.get("judges", []),
                    "url": result.get("url"),
                    "summary": result.get("summary", ""),
                    "content": result.get("content", "")
                })
            
            return candidates
            
        except Exception as e:
            # Fallback: return mock data or empty list
            return self._get_mock_candidates(case_features)
    
    def _calculate_similarity(
        self,
        case_features: CaseFeatures,
        candidate: Dict[str, Any]
    ) -> Dict[str, float]:
        """
        Calculate similarity scores between current case and candidate
        
        Returns dict with:
        - overall: weighted overall similarity
        - type: case type similarity
        - legal: legal basis similarity
        - factual: factual similarity
        - confidence: confidence in similarity calculation
        """
        # Type similarity
        type_sim = self._calculate_type_similarity(
            case_features.case_type,
            case_features.case_category,
            candidate.get("case_type"),
            candidate.get("case_category")
        )
        
        # Legal basis similarity
        legal_sim = self._calculate_legal_similarity(
            case_features.primary_laws,
            candidate.get("laws_used", [])
        )
        
        # Factual similarity
        factual_sim = self._calculate_factual_similarity(
            case_features.key_facts,
            candidate.get("content", "")
        )
        
        # Procedural similarity
        procedural_sim = self._calculate_procedural_similarity(
            case_features.court_level,
            candidate.get("court_level")
        )
        
        # Calculate weighted overall similarity
        overall = (
            type_sim * self.weight_type +
            legal_sim * self.weight_legal +
            factual_sim * self.weight_factual +
            procedural_sim * self.weight_procedural
        )
        
        return {
            "overall": overall,
            "type": type_sim,
            "legal": legal_sim,
            "factual": factual_sim,
            "procedural": procedural_sim,
            "confidence": 0.8  # Fixed confidence for now
        }
    
    def _calculate_type_similarity(
        self,
        type1: CaseType,
        category1: CaseCategory,
        type2: Optional[CaseType],
        category2: Optional[CaseCategory]
    ) -> float:
        """Calculate similarity based on case type and category"""
        score = 0.0
        
        # Exact type match: 0.6
        if type1 == type2:
            score += 0.6
        
        # Exact category match: 0.4
        if category1 == category2:
            score += 0.4
        
        return score
    
    def _calculate_legal_similarity(
        self,
        laws1: List[str],
        laws2: List[str]
    ) -> float:
        """Calculate similarity based on legal bases"""
        if not laws1 or not laws2:
            return 0.0
        
        # Jaccard similarity on laws
        set1 = set(laws1)
        set2 = set(laws2)
        
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        
        if union == 0:
            return 0.0
        
        return intersection / union
    
    def _calculate_factual_similarity(
        self,
        facts1: List[str],
        content2: str
    ) -> float:
        """Calculate similarity based on factual elements"""
        if not facts1 or not content2:
            return 0.0
        
        content2_lower = content2.lower()
        
        # Count how many facts appear in candidate content
        matches = sum(1 for fact in facts1 if fact.lower() in content2_lower)
        
        return matches / len(facts1) if facts1 else 0.0
    
    def _calculate_procedural_similarity(
        self,
        level1: CourtLevel,
        level2: Optional[CourtLevel]
    ) -> float:
        """Calculate similarity based on procedural elements"""
        if level1 == level2:
            return 1.0
        
        # Partial match for related levels
        if level1 == CourtLevel.BANDING and level2 == CourtLevel.KASASI:
            return 0.5
        
        return 0.0
    
    def _parse_case_type(self, type_str: Optional[str]) -> Optional[CaseType]:
        """Parse case type from string"""
        if not type_str:
            return None
        
        try:
            return CaseType(type_str.lower())
        except ValueError:
            return None
    
    def _parse_case_category(self, category_str: Optional[str]) -> Optional[CaseCategory]:
        """Parse case category from string"""
        if not category_str:
            return None
        
        try:
            return CaseCategory(category_str.lower())
        except ValueError:
            return None
    
    def _parse_court_level(self, level_str: Optional[str]) -> Optional[CourtLevel]:
        """Parse court level from string"""
        if not level_str:
            return None
        
        try:
            return CourtLevel(level_str.lower())
        except ValueError:
            return None
    
    def _get_mock_candidates(
        self,
        case_features: CaseFeatures
    ) -> List[Dict[str, Any]]:
        """
        Get mock candidate cases for testing/fallback
        """
        return [
            {
                "case_id": "mock_case_1",
                "case_number": "123/Pdt/2023/PN.Jkt",
                "title": "Sengketa Wanprestasi Kontrak",
                "case_type": case_features.case_type,
                "case_category": case_features.case_category,
                "court_level": CourtLevel.PERTAMA,
                "outcome": "won",
                "outcome_details": "Gugatan dikabulkan sebagian",
                "laws_used": case_features.primary_laws[:2] if case_features.primary_laws else [],
                "decision_date": datetime(2023, 6, 15),
                "court_name": "Pengadilan Negeri Jakarta Selatan",
                "judge_names": ["H. Bambang, S.H., M.H."],
                "url": "https://example.com/case/123",
                "summary": "Kasus wanprestasi kontrak dengan gugatan dikabulkan sebagian",
                "content": " ".join(case_features.key_facts) if case_features.key_facts else ""
            },
            {
                "case_id": "mock_case_2",
                "case_number": "456/Pdt/2022/PN.Jkt",
                "title": "Perbuatan Melawan Hukum",
                "case_type": case_features.case_type,
                "case_category": CaseCategory.PERBUATAN_MELAWAN_HUKUM,
                "court_level": CourtLevel.PERTAMA,
                "outcome": "lost",
                "outcome_details": "Gugatan ditolak",
                "laws_used": case_features.primary_laws[1:3] if len(case_features.primary_laws) > 1 else [],
                "decision_date": datetime(2022, 11, 20),
                "court_name": "Pengadilan Negeri Jakarta Pusat",
                "judge_names": ["Dra. Siti, S.H."],
                "url": "https://example.com/case/456",
                "summary": "Gugatan perbuatan melawan hukum ditolak",
                "content": " ".join(case_features.key_facts[:3]) if case_features.key_facts else ""
            }
        ]
    
    async def get_precedent_details(
        self,
        case_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get full details of a precedent case
        
        Args:
            case_id: ID of the precedent case
        
        Returns:
            Full case details including decision text, reasoning, etc.
        """
        try:
            from ..knowledge_graph import get_search_engine
            
            search_engine = get_search_engine()
            
            # Search by case_id
            results = await search_engine.search(
                query=case_id,
                filters={"id": case_id},
                limit=1
            )
            
            if results:
                return results[0]
            
            return None
            
        except Exception:
            return None
    
    async def find_by_outcome(
        self,
        case_features: CaseFeatures,
        desired_outcome: str,
        limit: int = 5
    ) -> List[SimilarCase]:
        """
        Find similar cases with specific outcome
        
        Useful for finding precedents that support desired outcome
        
        Args:
            case_features: Current case features
            desired_outcome: Desired outcome (won/lost/partial)
            limit: Max results
        
        Returns:
            Similar cases with specified outcome
        """
        all_similar = await self.find_similar_cases(
            case_features,
            limit=limit * 3  # Get more to filter
        )
        
        # Filter by outcome
        filtered = [
            case for case in all_similar
            if case.outcome and desired_outcome.lower() in case.outcome.lower()
        ]
        
        return filtered[:limit]
