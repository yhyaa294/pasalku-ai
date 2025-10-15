"""
Translation Memory

Cache translations dengan fuzzy matching untuk consistency
"""

from dataclasses import dataclass, field
from typing import Optional, List, Dict
from datetime import datetime, timedelta
import json
from pathlib import Path


@dataclass
class TranslationEntry:
    """Translation cache entry"""
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    timestamp: datetime = field(default_factory=datetime.now)
    usage_count: int = 0
    quality: Optional[str] = None
    confidence: Optional[float] = None
    
    def to_dict(self) -> dict:
        """Convert to dict"""
        return {
            "source_text": self.source_text,
            "translated_text": self.translated_text,
            "source_lang": self.source_lang,
            "target_lang": self.target_lang,
            "timestamp": self.timestamp.isoformat(),
            "usage_count": self.usage_count,
            "quality": self.quality,
            "confidence": self.confidence
        }
    
    @staticmethod
    def from_dict(data: dict) -> 'TranslationEntry':
        """Create from dict"""
        data['timestamp'] = datetime.fromisoformat(data['timestamp'])
        return TranslationEntry(**data)


class TranslationMemory:
    """
    Translation memory dengan caching dan fuzzy matching
    """
    
    def __init__(
        self,
        cache_file: Optional[str] = None,
        ttl_days: int = 30,
        max_entries: int = 10000
    ):
        self.cache_file = cache_file
        self.ttl_days = ttl_days
        self.max_entries = max_entries
        
        # In-memory cache
        self.cache: Dict[str, List[TranslationEntry]] = {}
        
        # Statistics
        self.stats = {
            "hits": 0,
            "misses": 0,
            "fuzzy_hits": 0,
            "total_entries": 0
        }
        
        # Load from file jika ada
        if cache_file:
            self.load_from_file(cache_file)
    
    def add_translation(
        self,
        source_text: str,
        translated_text: str,
        source_lang: str,
        target_lang: str,
        quality: Optional[str] = None,
        confidence: Optional[float] = None
    ) -> None:
        """
        Add translation to cache
        
        Args:
            source_text: Source text
            translated_text: Translated text
            source_lang: Source language code
            target_lang: Target language code
            quality: Translation quality
            confidence: Confidence score
        """
        # Create cache key
        cache_key = self._create_cache_key(source_lang, target_lang)
        
        # Check if already exists (exact match)
        if cache_key in self.cache:
            for entry in self.cache[cache_key]:
                if entry.source_text == source_text:
                    # Update existing entry
                    entry.translated_text = translated_text
                    entry.timestamp = datetime.now()
                    entry.usage_count += 1
                    entry.quality = quality
                    entry.confidence = confidence
                    return
        
        # Create new entry
        entry = TranslationEntry(
            source_text=source_text,
            translated_text=translated_text,
            source_lang=source_lang,
            target_lang=target_lang,
            quality=quality,
            confidence=confidence
        )
        
        # Add to cache
        if cache_key not in self.cache:
            self.cache[cache_key] = []
        
        self.cache[cache_key].append(entry)
        self.stats["total_entries"] += 1
        
        # Clean old entries jika terlalu banyak
        self._clean_old_entries()
        
        # Save to file
        if self.cache_file:
            self.save_to_file(self.cache_file)
    
    def get_translation(
        self,
        source_text: str,
        source_lang: str,
        target_lang: str,
        fuzzy_threshold: float = 0.9
    ) -> Optional[TranslationEntry]:
        """
        Get translation dari cache
        
        Args:
            source_text: Source text
            source_lang: Source language code
            target_lang: Target language code
            fuzzy_threshold: Similarity threshold for fuzzy matching (0.0-1.0)
        
        Returns:
            TranslationEntry jika found, None otherwise
        """
        cache_key = self._create_cache_key(source_lang, target_lang)
        
        if cache_key not in self.cache:
            self.stats["misses"] += 1
            return None
        
        # Exact match
        for entry in self.cache[cache_key]:
            if entry.source_text == source_text:
                # Check if expired
                if self._is_expired(entry):
                    continue
                
                entry.usage_count += 1
                self.stats["hits"] += 1
                return entry
        
        # Fuzzy match
        best_match = None
        best_similarity = 0.0
        
        for entry in self.cache[cache_key]:
            if self._is_expired(entry):
                continue
            
            similarity = self._calculate_similarity(source_text, entry.source_text)
            
            if similarity > best_similarity and similarity >= fuzzy_threshold:
                best_similarity = similarity
                best_match = entry
        
        if best_match:
            best_match.usage_count += 1
            self.stats["fuzzy_hits"] += 1
            return best_match
        
        self.stats["misses"] += 1
        return None
    
    def find_similar(
        self,
        source_text: str,
        source_lang: str,
        target_lang: str,
        threshold: float = 0.7,
        limit: int = 5
    ) -> List[tuple[TranslationEntry, float]]:
        """
        Find similar translations dengan fuzzy matching
        
        Args:
            source_text: Source text
            source_lang: Source language code
            target_lang: Target language code
            threshold: Minimum similarity threshold
            limit: Maximum number of results
        
        Returns:
            List of (TranslationEntry, similarity_score)
        """
        cache_key = self._create_cache_key(source_lang, target_lang)
        
        if cache_key not in self.cache:
            return []
        
        # Calculate similarity untuk semua entries
        results = []
        
        for entry in self.cache[cache_key]:
            if self._is_expired(entry):
                continue
            
            similarity = self._calculate_similarity(source_text, entry.source_text)
            
            if similarity >= threshold:
                results.append((entry, similarity))
        
        # Sort by similarity (descending)
        results.sort(key=lambda x: x[1], reverse=True)
        
        return results[:limit]
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate similarity menggunakan Levenshtein distance
        
        Returns:
            Similarity score (0.0 - 1.0)
        """
        # Normalize
        text1 = text1.lower().strip()
        text2 = text2.lower().strip()
        
        if text1 == text2:
            return 1.0
        
        if not text1 or not text2:
            return 0.0
        
        # Levenshtein distance
        distance = self._levenshtein_distance(text1, text2)
        
        # Convert to similarity (0.0 - 1.0)
        max_len = max(len(text1), len(text2))
        similarity = 1.0 - (distance / max_len)
        
        return max(0.0, min(1.0, similarity))
    
    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        """
        Calculate Levenshtein distance between two strings
        """
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)
        
        if len(s2) == 0:
            return len(s1)
        
        previous_row = range(len(s2) + 1)
        
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            
            for j, c2 in enumerate(s2):
                # Cost of insertions, deletions, or substitutions
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                
                current_row.append(min(insertions, deletions, substitutions))
            
            previous_row = current_row
        
        return previous_row[-1]
    
    def _create_cache_key(self, source_lang: str, target_lang: str) -> str:
        """Create cache key dari language pair"""
        return f"{source_lang}_{target_lang}"
    
    def _is_expired(self, entry: TranslationEntry) -> bool:
        """Check if entry expired"""
        if self.ttl_days <= 0:
            return False
        
        age = datetime.now() - entry.timestamp
        return age.days > self.ttl_days
    
    def _clean_old_entries(self) -> None:
        """Clean old or expired entries"""
        # Remove expired entries
        for cache_key in list(self.cache.keys()):
            self.cache[cache_key] = [
                entry for entry in self.cache[cache_key]
                if not self._is_expired(entry)
            ]
            
            # Remove empty cache keys
            if not self.cache[cache_key]:
                del self.cache[cache_key]
        
        # Jika masih terlalu banyak, remove least used
        total_entries = sum(len(entries) for entries in self.cache.values())
        
        if total_entries > self.max_entries:
            # Collect all entries
            all_entries = []
            for cache_key, entries in self.cache.items():
                for entry in entries:
                    all_entries.append((cache_key, entry))
            
            # Sort by usage_count (ascending)
            all_entries.sort(key=lambda x: x[1].usage_count)
            
            # Remove least used
            to_remove = total_entries - self.max_entries
            removed = 0
            
            for cache_key, entry in all_entries:
                if removed >= to_remove:
                    break
                
                self.cache[cache_key].remove(entry)
                removed += 1
        
        # Update stats
        self.stats["total_entries"] = sum(len(entries) for entries in self.cache.values())
    
    def clear_cache(self) -> None:
        """Clear all cache"""
        self.cache.clear()
        self.stats = {
            "hits": 0,
            "misses": 0,
            "fuzzy_hits": 0,
            "total_entries": 0
        }
        
        # Delete cache file
        if self.cache_file:
            cache_path = Path(self.cache_file)
            if cache_path.exists():
                cache_path.unlink()
    
    def get_statistics(self) -> dict:
        """Get cache statistics"""
        total_requests = self.stats["hits"] + self.stats["misses"]
        
        hit_rate = 0.0
        if total_requests > 0:
            hit_rate = (self.stats["hits"] + self.stats["fuzzy_hits"]) / total_requests
        
        return {
            **self.stats,
            "total_requests": total_requests,
            "hit_rate": hit_rate,
            "exact_hit_rate": self.stats["hits"] / total_requests if total_requests > 0 else 0.0,
            "fuzzy_hit_rate": self.stats["fuzzy_hits"] / total_requests if total_requests > 0 else 0.0
        }
    
    def save_to_file(self, filepath: str) -> None:
        """Save cache to file"""
        try:
            cache_data = {}
            
            for cache_key, entries in self.cache.items():
                cache_data[cache_key] = [
                    entry.to_dict() for entry in entries
                ]
            
            data = {
                "cache": cache_data,
                "stats": self.stats,
                "saved_at": datetime.now().isoformat()
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        
        except Exception as e:
            print(f"Error saving translation memory: {e}")
    
    def load_from_file(self, filepath: str) -> None:
        """Load cache from file"""
        try:
            cache_path = Path(filepath)
            
            if not cache_path.exists():
                return
            
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Load cache
            cache_data = data.get("cache", {})
            
            for cache_key, entries in cache_data.items():
                self.cache[cache_key] = [
                    TranslationEntry.from_dict(entry_data)
                    for entry_data in entries
                ]
            
            # Load stats
            self.stats = data.get("stats", self.stats)
            
            # Clean expired entries
            self._clean_old_entries()
        
        except Exception as e:
            print(f"Error loading translation memory: {e}")
    
    def export_to_tmx(self, filepath: str) -> None:
        """
        Export cache to TMX format (Translation Memory eXchange)
        
        Args:
            filepath: Output TMX file path
        """
        try:
            # TMX header
            tmx_content = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<!DOCTYPE tmx SYSTEM "tmx14.dtd">',
                '<tmx version="1.4">',
                '  <header',
                '    creationtool="PasalKu AI"',
                '    creationtoolversion="1.0"',
                f'    datatype="plaintext"',
                '    segtype="sentence"',
                '    adminlang="id"',
                f'    srclang="*all*"',
                '    o-tmf="unknown"',
                f'    creationdate="{datetime.now().strftime("%Y%m%dT%H%M%SZ")}"',
                '  />',
                '  <body>'
            ]
            
            # Add translation units
            for cache_key, entries in self.cache.items():
                source_lang, target_lang = cache_key.split('_')
                
                for entry in entries:
                    if self._is_expired(entry):
                        continue
                    
                    tmx_content.append('    <tu>')
                    tmx_content.append(f'      <tuv xml:lang="{source_lang}">')
                    tmx_content.append(f'        <seg>{self._escape_xml(entry.source_text)}</seg>')
                    tmx_content.append('      </tuv>')
                    tmx_content.append(f'      <tuv xml:lang="{target_lang}">')
                    tmx_content.append(f'        <seg>{self._escape_xml(entry.translated_text)}</seg>')
                    tmx_content.append('      </tuv>')
                    tmx_content.append('    </tu>')
            
            # Close TMX
            tmx_content.append('  </body>')
            tmx_content.append('</tmx>')
            
            # Write to file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write('\n'.join(tmx_content))
        
        except Exception as e:
            print(f"Error exporting to TMX: {e}")
    
    def _escape_xml(self, text: str) -> str:
        """Escape XML special characters"""
        text = text.replace('&', '&amp;')
        text = text.replace('<', '&lt;')
        text = text.replace('>', '&gt;')
        text = text.replace('"', '&quot;')
        text = text.replace("'", '&apos;')
        return text
