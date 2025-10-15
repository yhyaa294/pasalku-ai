"""
Entity Extractor

Extracts legal entities from case descriptions using AI and NLP.
"""

import asyncio
import re
from typing import List, Dict, Any, Optional, Set
from dataclasses import dataclass
from enum import Enum
import logging

from ..ai.consensus_engine import get_consensus_engine


logger = logging.getLogger(__name__)


class EntityType(str, Enum):
    """Types of legal entities"""
    PERSON = "person"  # Nama orang/pihak
    ORGANIZATION = "organization"  # Perusahaan, instansi
    LOCATION = "location"  # Tempat kejadian
    DATE = "date"  # Tanggal penting
    MONEY = "money"  # Jumlah uang
    LAW_REFERENCE = "law_reference"  # Referensi UU/pasal
    DOCUMENT = "document"  # Nama dokumen
    EVENT = "event"  # Kejadian/peristiwa
    LEGAL_TERM = "legal_term"  # Istilah hukum


@dataclass
class ExtractedEntity:
    """Extracted legal entity"""
    entity_type: EntityType
    text: str
    context: str  # Surrounding text
    confidence: float
    start_pos: int
    end_pos: int
    metadata: Dict[str, Any]


class EntityExtractor:
    """
    Extracts legal entities from text using hybrid approach:
    - Regex patterns for structured entities (dates, money, laws)
    - AI for semantic entities (people, events, terms)
    """
    
    # Regex patterns for Indonesian legal entities
    PATTERNS = {
        EntityType.DATE: [
            r'\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4}',
            r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}',
            r'tanggal\s+\d{1,2}\s+\w+\s+\d{4}',
        ],
        EntityType.MONEY: [
            r'Rp\.?\s*[\d.,]+\s*(?:juta|ribu|miliar|triliun)?',
            r'sebesar\s+Rp\.?\s*[\d.,]+',
            r'senilai\s+Rp\.?\s*[\d.,]+',
        ],
        EntityType.LAW_REFERENCE: [
            r'UU\s+No\.?\s*\d+\s+Tahun\s+\d{4}',
            r'Pasal\s+\d+(?:\s+ayat\s+\(\d+\))?',
            r'PP\s+No\.?\s*\d+\s+Tahun\s+\d{4}',
            r'Perpres\s+No\.?\s*\d+\s+Tahun\s+\d{4}',
            r'Permen\s+\w+\s+No\.?\s*\d+\s+Tahun\s+\d{4}',
        ],
        EntityType.DOCUMENT: [
            r'(?:surat|kontrak|perjanjian|akta|putusan)\s+(?:No\.?\s*)?[\w\-/]+',
            r'bukti\s+(?:P|T)-\d+',
        ],
    }
    
    def __init__(self):
        self.consensus_engine = get_consensus_engine()
    
    async def extract(
        self,
        text: str,
        use_ai: bool = True,
        min_confidence: float = 0.5
    ) -> List[ExtractedEntity]:
        """
        Extract all entities from text.
        
        Args:
            text: Input text
            use_ai: Whether to use AI for entity extraction
            min_confidence: Minimum confidence threshold
        
        Returns:
            List of extracted entities
        """
        entities = []
        
        # Extract pattern-based entities
        pattern_entities = await self._extract_with_patterns(text)
        entities.extend(pattern_entities)
        
        # Extract AI-based entities
        if use_ai:
            ai_entities = await self._extract_with_ai(text)
            entities.extend(ai_entities)
        
        # Filter by confidence
        entities = [e for e in entities if e.confidence >= min_confidence]
        
        # Remove duplicates
        entities = self._deduplicate_entities(entities)
        
        # Sort by position
        entities.sort(key=lambda e: e.start_pos)
        
        logger.info(f"Extracted {len(entities)} entities from text")
        
        return entities
    
    async def _extract_with_patterns(self, text: str) -> List[ExtractedEntity]:
        """Extract entities using regex patterns"""
        entities = []
        
        for entity_type, patterns in self.PATTERNS.items():
            for pattern in patterns:
                for match in re.finditer(pattern, text, re.IGNORECASE):
                    # Get surrounding context (50 chars before/after)
                    start = max(0, match.start() - 50)
                    end = min(len(text), match.end() + 50)
                    context = text[start:end]
                    
                    entity = ExtractedEntity(
                        entity_type=entity_type,
                        text=match.group(0),
                        context=context,
                        confidence=0.9,  # High confidence for pattern matches
                        start_pos=match.start(),
                        end_pos=match.end(),
                        metadata={"method": "pattern"}
                    )
                    entities.append(entity)
        
        return entities
    
    async def _extract_with_ai(self, text: str) -> List[ExtractedEntity]:
        """Extract entities using AI"""
        try:
            # Prepare prompt for AI
            prompt = f"""Ekstrak entitas hukum dari teks berikut. Identifikasi:
- Nama orang/pihak yang terlibat
- Organisasi/perusahaan
- Tempat kejadian
- Kejadian/peristiwa penting
- Istilah hukum yang relevan

Teks:
{text}

Format jawaban sebagai JSON array dengan struktur:
[
  {{
    "type": "person|organization|location|event|legal_term",
    "text": "entitas yang ditemukan",
    "context": "konteks singkat",
    "confidence": 0.0-1.0
  }}
]

Hanya kembalikan JSON array, tanpa penjelasan tambahan."""

            # Get AI response
            result = await self.consensus_engine.get_consensus(
                query=prompt,
                temperature=0.1
            )
            
            # Parse AI response
            import json
            try:
                ai_entities = json.loads(result.consensus_answer)
                
                entities = []
                for item in ai_entities:
                    # Find position in text
                    entity_text = item.get("text", "")
                    match = re.search(re.escape(entity_text), text, re.IGNORECASE)
                    
                    if match:
                        entity_type_str = item.get("type", "legal_term")
                        try:
                            entity_type = EntityType(entity_type_str)
                        except ValueError:
                            entity_type = EntityType.LEGAL_TERM
                        
                        entity = ExtractedEntity(
                            entity_type=entity_type,
                            text=entity_text,
                            context=item.get("context", ""),
                            confidence=item.get("confidence", 0.7),
                            start_pos=match.start(),
                            end_pos=match.end(),
                            metadata={"method": "ai"}
                        )
                        entities.append(entity)
                
                return entities
                
            except json.JSONDecodeError:
                logger.warning("Failed to parse AI entity extraction response")
                return []
        
        except Exception as e:
            logger.error(f"AI entity extraction failed: {e}")
            return []
    
    def _deduplicate_entities(
        self,
        entities: List[ExtractedEntity]
    ) -> List[ExtractedEntity]:
        """Remove duplicate entities"""
        seen: Set[tuple] = set()
        unique_entities = []
        
        for entity in entities:
            # Create key from type and normalized text
            key = (entity.entity_type, entity.text.lower().strip())
            
            if key not in seen:
                seen.add(key)
                unique_entities.append(entity)
            else:
                # Keep entity with higher confidence
                existing = next(
                    e for e in unique_entities
                    if (e.entity_type, e.text.lower().strip()) == key
                )
                if entity.confidence > existing.confidence:
                    unique_entities.remove(existing)
                    unique_entities.append(entity)
        
        return unique_entities
    
    def group_by_type(
        self,
        entities: List[ExtractedEntity]
    ) -> Dict[EntityType, List[ExtractedEntity]]:
        """Group entities by type"""
        grouped: Dict[EntityType, List[ExtractedEntity]] = {}
        
        for entity in entities:
            if entity.entity_type not in grouped:
                grouped[entity.entity_type] = []
            grouped[entity.entity_type].append(entity)
        
        return grouped
    
    def format_entities(
        self,
        entities: List[ExtractedEntity],
        include_context: bool = False
    ) -> str:
        """
        Format entities as readable text.
        
        Args:
            entities: List of entities
            include_context: Whether to include context
        
        Returns:
            Formatted string
        """
        grouped = self.group_by_type(entities)
        
        lines = ["## Entitas yang Teridentifikasi\n"]
        
        type_names = {
            EntityType.PERSON: "👤 Pihak yang Terlibat",
            EntityType.ORGANIZATION: "🏢 Organisasi",
            EntityType.LOCATION: "📍 Lokasi",
            EntityType.DATE: "📅 Tanggal Penting",
            EntityType.MONEY: "💰 Nilai Uang",
            EntityType.LAW_REFERENCE: "⚖️ Referensi Hukum",
            EntityType.DOCUMENT: "📄 Dokumen",
            EntityType.EVENT: "📌 Kejadian",
            EntityType.LEGAL_TERM: "📚 Istilah Hukum",
        }
        
        for entity_type in EntityType:
            if entity_type in grouped:
                entities_list = grouped[entity_type]
                lines.append(f"\n### {type_names.get(entity_type, entity_type.value)}")
                
                for entity in entities_list:
                    confidence_str = f" ({entity.confidence:.0%})" if entity.confidence < 1.0 else ""
                    lines.append(f"- {entity.text}{confidence_str}")
                    
                    if include_context and entity.context:
                        lines.append(f"  > {entity.context}")
        
        return "\n".join(lines)


# Singleton instance
_entity_extractor_instance: Optional[EntityExtractor] = None


def get_entity_extractor() -> EntityExtractor:
    """Get or create singleton entity extractor instance"""
    global _entity_extractor_instance
    
    if _entity_extractor_instance is None:
        _entity_extractor_instance = EntityExtractor()
    
    return _entity_extractor_instance
