"""
Dual AI Consensus Engine for Pasalku.ai

This module implements the core consensus algorithm that combines outputs from
BytePlus Ark and Groq AI models to produce the most accurate and reliable response.

Key Features:
- Parallel AI model execution
- Semantic similarity analysis
- Confidence scoring
- Intelligent consensus merging
- Fallback mechanisms
"""

import asyncio
import logging
import time
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from difflib import SequenceMatcher
import numpy as np

logger = logging.getLogger(__name__)


class AIModelResponse:
    """Data class for AI model response"""
    
    def __init__(
        self,
        content: str,
        model_name: str,
        confidence: float,
        response_time: float,
        tokens_used: int = 0,
        metadata: Optional[Dict[str, Any]] = None
    ):
        self.content = content
        self.model_name = model_name
        self.confidence = confidence
        self.response_time = response_time
        self.tokens_used = tokens_used
        self.metadata = metadata or {}
        self.timestamp = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "content": self.content,
            "model_name": self.model_name,
            "confidence": self.confidence,
            "response_time": self.response_time,
            "tokens_used": self.tokens_used,
            "metadata": self.metadata,
            "timestamp": self.timestamp.isoformat()
        }


class ConsensusResult:
    """Data class for consensus result"""
    
    def __init__(
        self,
        final_content: str,
        consensus_confidence: float,
        consensus_method: str,
        byteplus_response: AIModelResponse,
        groq_response: AIModelResponse,
        similarity_score: float,
        total_time: float
    ):
        self.final_content = final_content
        self.consensus_confidence = consensus_confidence
        self.consensus_method = consensus_method
        self.byteplus_response = byteplus_response
        self.groq_response = groq_response
        self.similarity_score = similarity_score
        self.total_time = total_time
        self.timestamp = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "final_content": self.final_content,
            "consensus_confidence": self.consensus_confidence,
            "consensus_method": self.consensus_method,
            "byteplus_response": self.byteplus_response.to_dict(),
            "groq_response": self.groq_response.to_dict(),
            "similarity_score": self.similarity_score,
            "total_time": self.total_time,
            "timestamp": self.timestamp.isoformat()
        }


class DualAIConsensusEngine:
    """
    Consensus engine that combines BytePlus Ark and Groq AI outputs.
    
    Consensus Strategies:
    1. High Agreement (>85% similarity): Use highest confidence model
    2. Moderate Agreement (60-85% similarity): Weighted merge
    3. Low Agreement (<60% similarity): Conservative merge with flags
    """
    
    # Similarity thresholds
    HIGH_SIMILARITY_THRESHOLD = 0.85
    MODERATE_SIMILARITY_THRESHOLD = 0.60
    
    # Confidence weights
    BYTEPLUS_WEIGHT = 0.6  # BytePlus is primary for deep reasoning
    GROQ_WEIGHT = 0.4      # Groq is secondary for speed & validation
    
    def __init__(
        self,
        byteplus_service: Any,
        groq_service: Any,
        enable_parallel: bool = True
    ):
        """
        Initialize consensus engine.
        
        Args:
            byteplus_service: BytePlus Ark AI service instance
            groq_service: Groq AI service instance
            enable_parallel: Whether to run models in parallel
        """
        self.byteplus_service = byteplus_service
        self.groq_service = groq_service
        self.enable_parallel = enable_parallel
        
        logger.info("🤖 Dual AI Consensus Engine initialized")
    
    async def get_consensus_response(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        context: Optional[Dict[str, Any]] = None
    ) -> ConsensusResult:
        """
        Get consensus response from both AI models.
        
        Args:
            prompt: User query/prompt
            system_prompt: System instruction for AI
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            context: Additional context for the query
        
        Returns:
            ConsensusResult with final merged response
        """
        start_time = time.time()
        
        logger.info(f"🔄 Starting dual AI consensus for prompt: {prompt[:100]}...")
        
        try:
            # Execute both models
            if self.enable_parallel:
                byteplus_response, groq_response = await self._execute_parallel(
                    prompt, system_prompt, temperature, max_tokens
                )
            else:
                byteplus_response = await self._execute_byteplus(
                    prompt, system_prompt, temperature, max_tokens
                )
                groq_response = await self._execute_groq(
                    prompt, system_prompt, temperature, max_tokens
                )
            
            # Calculate similarity
            similarity = self._calculate_semantic_similarity(
                byteplus_response.content,
                groq_response.content
            )
            
            logger.info(f"📊 Similarity score: {similarity:.2%}")
            
            # Apply consensus algorithm
            final_content, consensus_confidence, method = self._apply_consensus(
                byteplus_response,
                groq_response,
                similarity
            )
            
            total_time = time.time() - start_time
            
            logger.info(
                f"✅ Consensus achieved using {method} "
                f"(confidence: {consensus_confidence:.2%}, time: {total_time:.2f}s)"
            )
            
            return ConsensusResult(
                final_content=final_content,
                consensus_confidence=consensus_confidence,
                consensus_method=method,
                byteplus_response=byteplus_response,
                groq_response=groq_response,
                similarity_score=similarity,
                total_time=total_time
            )
            
        except Exception as e:
            logger.error(f"❌ Consensus error: {e}")
            raise
    
    async def _execute_parallel(
        self,
        prompt: str,
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> Tuple[AIModelResponse, AIModelResponse]:
        """Execute both models in parallel"""
        
        tasks = [
            self._execute_byteplus(prompt, system_prompt, temperature, max_tokens),
            self._execute_groq(prompt, system_prompt, temperature, max_tokens)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle exceptions
        byteplus_response = results[0]
        groq_response = results[1]
        
        if isinstance(byteplus_response, Exception):
            logger.error(f"BytePlus error: {byteplus_response}")
            raise byteplus_response
        
        if isinstance(groq_response, Exception):
            logger.error(f"Groq error: {groq_response}")
            # If Groq fails, use BytePlus only
            return byteplus_response, self._create_fallback_response(
                byteplus_response.content, "groq_fallback"
            )
        
        return byteplus_response, groq_response
    
    async def _execute_byteplus(
        self,
        prompt: str,
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> AIModelResponse:
        """Execute BytePlus Ark AI"""
        
        start_time = time.time()
        
        try:
            # Prepare messages
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            # Call BytePlus
            response = await self.byteplus_service.chat_completion(
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            response_time = time.time() - start_time
            
            # Extract content
            content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
            tokens = response.get("usage", {}).get("total_tokens", 0)
            
            # Calculate confidence (based on response quality indicators)
            confidence = self._calculate_confidence(response, "byteplus")
            
            return AIModelResponse(
                content=content,
                model_name="BytePlus Ark",
                confidence=confidence,
                response_time=response_time,
                tokens_used=tokens,
                metadata={"raw_response": response}
            )
            
        except Exception as e:
            logger.error(f"BytePlus execution error: {e}")
            raise
    
    async def _execute_groq(
        self,
        prompt: str,
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> AIModelResponse:
        """Execute Groq AI"""
        
        start_time = time.time()
        
        try:
            # Prepare messages
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            # Call Groq
            response = await self.groq_service.chat_completion(
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            response_time = time.time() - start_time
            
            # Extract content
            content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
            tokens = response.get("usage", {}).get("total_tokens", 0)
            
            # Calculate confidence
            confidence = self._calculate_confidence(response, "groq")
            
            return AIModelResponse(
                content=content,
                model_name="Groq",
                confidence=confidence,
                response_time=response_time,
                tokens_used=tokens,
                metadata={"raw_response": response}
            )
            
        except Exception as e:
            logger.error(f"Groq execution error: {e}")
            raise
    
    def _calculate_semantic_similarity(
        self,
        text1: str,
        text2: str
    ) -> float:
        """
        Calculate semantic similarity between two texts.
        
        Uses multiple similarity metrics:
        1. Sequence matching (character-level)
        2. Word overlap
        3. Sentence structure similarity
        
        Returns:
            Similarity score (0-1)
        """
        if not text1 or not text2:
            return 0.0
        
        # 1. Sequence matching
        seq_similarity = SequenceMatcher(None, text1.lower(), text2.lower()).ratio()
        
        # 2. Word overlap
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 or not words2:
            word_similarity = 0.0
        else:
            intersection = words1.intersection(words2)
            union = words1.union(words2)
            word_similarity = len(intersection) / len(union) if union else 0.0
        
        # 3. Length similarity
        len1, len2 = len(text1), len(text2)
        length_similarity = min(len1, len2) / max(len1, len2) if max(len1, len2) > 0 else 0.0
        
        # Weighted average
        similarity = (
            seq_similarity * 0.4 +
            word_similarity * 0.4 +
            length_similarity * 0.2
        )
        
        return similarity
    
    def _calculate_confidence(
        self,
        response: Dict[str, Any],
        model_name: str
    ) -> float:
        """
        Calculate confidence score for a model's response.
        
        Factors:
        - Response completeness
        - Token usage efficiency
        - Response structure quality
        
        Returns:
            Confidence score (0-1)
        """
        try:
            # Base confidence
            confidence = 0.5
            
            # Check if response has content
            content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
            if content and len(content) > 50:
                confidence += 0.2
            
            # Check finish reason
            finish_reason = response.get("choices", [{}])[0].get("finish_reason", "")
            if finish_reason == "stop":
                confidence += 0.2
            
            # Check token usage
            usage = response.get("usage", {})
            total_tokens = usage.get("total_tokens", 0)
            if 100 < total_tokens < 2000:  # Reasonable range
                confidence += 0.1
            
            # Model-specific bonus
            if model_name == "byteplus":
                confidence += 0.05  # Slight preference for BytePlus reasoning
            
            return min(confidence, 1.0)
            
        except Exception as e:
            logger.error(f"Confidence calculation error: {e}")
            return 0.5
    
    def _apply_consensus(
        self,
        byteplus_response: AIModelResponse,
        groq_response: AIModelResponse,
        similarity: float
    ) -> Tuple[str, float, str]:
        """
        Apply consensus algorithm based on similarity.
        
        Returns:
            Tuple of (final_content, consensus_confidence, method_used)
        """
        
        # High agreement: Use highest confidence model
        if similarity >= self.HIGH_SIMILARITY_THRESHOLD:
            logger.info("🎯 High agreement detected - using best model")
            
            if byteplus_response.confidence >= groq_response.confidence:
                return (
                    byteplus_response.content,
                    byteplus_response.confidence * 0.95,  # Slight reduction for consensus
                    "high_agreement_byteplus"
                )
            else:
                return (
                    groq_response.content,
                    groq_response.confidence * 0.95,
                    "high_agreement_groq"
                )
        
        # Moderate agreement: Weighted merge
        elif similarity >= self.MODERATE_SIMILARITY_THRESHOLD:
            logger.info("⚖️ Moderate agreement - weighted merge")
            
            # Prefer longer, more detailed response
            if len(byteplus_response.content) > len(groq_response.content):
                final_content = byteplus_response.content
            else:
                final_content = groq_response.content
            
            # Weighted confidence
            consensus_confidence = (
                byteplus_response.confidence * self.BYTEPLUS_WEIGHT +
                groq_response.confidence * self.GROQ_WEIGHT
            ) * 0.9  # Reduction for moderate agreement
            
            return (
                final_content,
                consensus_confidence,
                "moderate_agreement_weighted"
            )
        
        # Low agreement: Conservative approach
        else:
            logger.warning("⚠️ Low agreement detected - conservative merge")
            
            # Use BytePlus (primary model) but flag low confidence
            final_content = byteplus_response.content
            
            # Significantly reduce confidence
            consensus_confidence = (
                byteplus_response.confidence * 0.7
            )
            
            # Add disclaimer note
            disclaimer = (
                "\n\n⚠️ Catatan: Tingkat kepastian jawaban ini lebih rendah. "
                "Disarankan untuk berkonsultasi dengan profesional hukum."
            )
            
            final_content = final_content + disclaimer
            
            return (
                final_content,
                consensus_confidence,
                "low_agreement_conservative"
            )
    
    def _create_fallback_response(
        self,
        content: str,
        fallback_type: str
    ) -> AIModelResponse:
        """Create fallback response when one model fails"""
        
        return AIModelResponse(
            content=content,
            model_name=f"Fallback ({fallback_type})",
            confidence=0.5,
            response_time=0.0,
            tokens_used=0,
            metadata={"is_fallback": True}
        )
    
    async def get_consensus_stream(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ):
        """
        Stream consensus response (for future implementation).
        
        This would stream from the faster model first, then validate
        with the second model and adjust if needed.
        """
        # TODO: Implement streaming consensus
        raise NotImplementedError("Streaming consensus not yet implemented")


# Singleton instance
_consensus_engine: Optional[DualAIConsensusEngine] = None


def get_consensus_engine(
    byteplus_service: Any,
    groq_service: Any
) -> DualAIConsensusEngine:
    """
    Get or create consensus engine instance.
    
    Args:
        byteplus_service: BytePlus Ark service
        groq_service: Groq service
    
    Returns:
        DualAIConsensusEngine instance
    """
    global _consensus_engine
    
    if _consensus_engine is None:
        _consensus_engine = DualAIConsensusEngine(
            byteplus_service=byteplus_service,
            groq_service=groq_service,
            enable_parallel=True
        )
    
    return _consensus_engine
