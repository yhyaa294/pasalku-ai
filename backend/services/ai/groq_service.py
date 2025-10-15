"""
Groq AI Service
Fast inference AI engine for Pasalku.ai
"""
import os
import logging
import time
from typing import List, Dict, Any, Optional
import httpx
from datetime import datetime

logger = logging.getLogger(__name__)


class GroqAIService:
    """Groq AI integration service for fast inference"""
    
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.base_url = "https://api.groq.com/openai/v1"
        self.model = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")
        
        if not self.api_key:
            logger.warning("GROQ_API_KEY not configured")
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Send chat completion request to Groq AI
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Sampling temperature (0-1)
            max_tokens: Maximum tokens to generate
            stream: Whether to stream response
            **kwargs: Additional parameters
        
        Returns:
            Dict with response data
        """
        start_time = time.time()
        
        try:
            if not self.api_key:
                raise ValueError("GROQ_API_KEY not configured")
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": stream,
                **kwargs
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                response.raise_for_status()
                result = response.json()
            
            elapsed_time = time.time() - start_time
            
            logger.info(
                f"✅ Groq response received "
                f"(model: {self.model}, time: {elapsed_time:.2f}s)"
            )
            
            return result
            
        except httpx.HTTPStatusError as e:
            logger.error(f"Groq API HTTP error: {e.response.status_code} - {e.response.text}")
            raise Exception(f"Groq API error: {e.response.status_code}")
        except httpx.TimeoutException:
            logger.error("Groq API timeout")
            raise Exception("Groq API timeout")
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            raise
    
    async def simple_query(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000
    ) -> str:
        """
        Simple query interface that returns just the text response.
        
        Args:
            prompt: User query
            system_prompt: Optional system instruction
            temperature: Sampling temperature
            max_tokens: Maximum tokens
        
        Returns:
            Response text
        """
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        response = await self.chat_completion(
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        content = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        return content
    
    async def analyze_legal_text(
        self,
        text: str,
        analysis_type: str = "general"
    ) -> Dict[str, Any]:
        """
        Analyze legal text using Groq's fast inference.
        
        Args:
            text: Legal text to analyze
            analysis_type: Type of analysis (general, contract, case, etc.)
        
        Returns:
            Analysis result
        """
        prompts = {
            "general": f"Analyze the following legal text and provide key insights:\n\n{text}",
            "contract": f"Analyze this contract and identify key clauses, obligations, and risks:\n\n{text}",
            "case": f"Analyze this legal case and provide summary of facts, issues, and decision:\n\n{text}"
        }
        
        prompt = prompts.get(analysis_type, prompts["general"])
        
        system_prompt = (
            "You are an expert legal analyst specializing in Indonesian law. "
            "Provide clear, structured analysis with citations where applicable."
        )
        
        response = await self.simple_query(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.5,  # Lower temp for analysis
            max_tokens=2000
        )
        
        return {
            "analysis": response,
            "analysis_type": analysis_type,
            "timestamp": datetime.now().isoformat()
        }
    
    def get_status(self) -> Dict[str, Any]:
        """Get service status"""
        return {
            "service": "Groq AI",
            "model": self.model,
            "configured": bool(self.api_key),
            "base_url": self.base_url
        }


# Singleton instance
_groq_service: Optional[GroqAIService] = None


def get_groq_service() -> GroqAIService:
    """Get singleton Groq service instance"""
    global _groq_service
    if _groq_service is None:
        _groq_service = GroqAIService()
    return _groq_service
