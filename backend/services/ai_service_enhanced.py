"""
Enhanced AI Service dengan streaming, error handling, dan rate limiting
"""
import asyncio
import logging
import json
import time
from typing import Dict, List, Any, Optional, AsyncGenerator
from datetime import datetime, timedelta
import aiohttp
from aiohttp import ClientTimeout
import backoff

from backend.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.base_url = settings.ARK_BASE_URL
        self.api_key = settings.ARK_API_KEY
        self.model_id = settings.ARK_MODEL_ID
        self.timeout = ClientTimeout(total=30)
        self.max_retries = 3
        self.rate_limit_window = 60  # seconds
        self.max_requests_per_window = 100  # requests per minute

        # Rate limiting storage (in production, use Redis)
        self.request_counts = {}
        self.last_cleanup = time.time()

    def _cleanup_rate_limits(self):
        """Clean up old rate limit entries."""
        current_time = time.time()
        if current_time - self.last_cleanup > 300:  # Clean up every 5 minutes
            cutoff_time = current_time - self.rate_limit_window
            self.request_counts = {
                user_id: timestamps
                for user_id, timestamps in self.request_counts.items()
                if any(ts > cutoff_time for ts in timestamps)
            }
            self.last_cleanup = current_time

    def _check_rate_limit(self, user_id: str) -> bool:
        """Check if user is within rate limits."""
        self._cleanup_rate_limits()
        current_time = time.time()

        if user_id not in self.request_counts:
            self.request_counts[user_id] = []

        # Remove old timestamps
        cutoff_time = current_time - self.rate_limit_window
        self.request_counts[user_id] = [
            ts for ts in self.request_counts[user_id] if ts > cutoff_time
        ]

        # Check if under limit
        if len(self.request_counts[user_id]) >= self.max_requests_per_window:
            return False

        # Add current request
        self.request_counts[user_id].append(current_time)
        return True

    @backoff.on_exception(
        backoff.expo,
        (aiohttp.ClientError, asyncio.TimeoutError),
        max_tries=3,
        jitter=backoff.random_jitter
    )
    async def _make_request(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Make HTTP request to AI service with retry logic."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        async with aiohttp.ClientSession(timeout=self.timeout) as session:
            async with session.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"AI service error: {response.status} - {error_text}")
                    raise aiohttp.ClientError(f"AI service returned {response.status}")

                return await response.json()

    async def test_connection(self) -> bool:
        """Test connection to AI service."""
        try:
            # Simple test payload
            test_payload = {
                "model": self.model_id,
                "messages": [{"role": "user", "content": "Test"}],
                "max_tokens": 10
            }

            await self._make_request(test_payload)
            logger.info("AI service connection test successful")
            return True
        except Exception as e:
            logger.error(f"AI service connection test failed: {str(e)}")
            return False

    async def get_legal_response(
        self,
        query: str,
        user_context: str = "",
        session_history: Optional[List[Dict[str, str]]] = None,
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Get legal response from AI service.

        Args:
            query: User's legal question
            user_context: Additional context about the user
            session_history: Previous messages in the conversation
            stream: Whether to stream the response

        Returns:
            Dict containing answer, citations, and disclaimer
        """
        try:
            # Check rate limiting (skip for now, implement per user later)
            # if not self._check_rate_limit(user_id):
            #     raise Exception("Rate limit exceeded")

            # Prepare system prompt
            system_prompt = f"""Anda adalah asisten AI hukum Indonesia yang membantu pengguna dengan pertanyaan hukum.

Konteks pengguna: {user_context}

Instruksi:
- Berikan jawaban yang jelas, ringkas, dan mudah dimengerti
- Sertakan referensi hukum jika memungkinkan
- Gunakan bahasa Indonesia yang sopan dan profesional
- Jika tidak yakin, sarankan berkonsultasi dengan pengacara
- Jawab berdasarkan hukum Indonesia terkini"""

            # Prepare messages
            messages = [{"role": "system", "content": system_prompt}]

            # Add session history if provided
            if session_history:
                messages.extend(session_history[-10:])  # Last 10 messages

            # Add current query
            messages.append({"role": "user", "content": query})

            # Prepare payload
            payload = {
                "model": self.model_id,
                "messages": messages,
                "max_tokens": 2000,
                "temperature": 0.7,
                "stream": stream
            }

            logger.info(f"Sending request to AI service for query: {query[:50]}...")

            if stream:
                # Handle streaming response
                return await self._get_streaming_response(payload)
            else:
                # Handle regular response
                response_data = await self._make_request(payload)

                # Extract response
                if "choices" in response_data and response_data["choices"]:
                    ai_response = response_data["choices"][0]["message"]["content"]

                    # Extract citations (basic implementation)
                    citations = self._extract_citations(ai_response)

                    return {
                        "answer": ai_response,
                        "citations": citations,
                        "disclaimer": (
                            "Informasi yang diberikan bersifat umum dan bukan merupakan nasihat hukum. "
                            "Untuk masalah hukum spesifik, disarankan untuk berkonsultasi dengan pengacara."
                        ),
                        "model": self.model_id,
                        "tokens_used": response_data.get("usage", {}).get("total_tokens", 0)
                    }
                else:
                    raise Exception("Invalid response format from AI service")

        except Exception as e:
            logger.error(f"Error getting AI response: {str(e)}")
            raise Exception(f"Failed to get AI response: {str(e)}")

    async def _get_streaming_response(self, payload: Dict[str, Any]) -> AsyncGenerator[str, None]:
        """Get streaming response from AI service."""
        # For now, return non-streaming response
        # Streaming implementation would require SSE or WebSocket
        response_data = await self._make_request(payload)

        if "choices" in response_data and response_data["choices"]:
            ai_response = response_data["choices"][0]["message"]["content"]
            yield ai_response
        else:
            yield "Maaf, terjadi kesalahan dalam memproses permintaan Anda."

    def _extract_citations(self, response: str) -> List[str]:
        """Extract legal citations from AI response."""
        citations = []

        # Basic citation extraction patterns
        import re

        # Look for common legal citation patterns
        patterns = [
            r'Pasal\s+\d+',
            r'UU\s+No\.\s*\d+',
            r'Undang-undang\s+No\.\s*\d+',
            r'KUH\s+Pidana',
            r'KUH\s+Perdata'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, response, re.IGNORECASE)
            citations.extend(matches)

        # Remove duplicates and limit to 5 citations
        return list(set(citations))[:5]

    async def get_conversation_summary(self, messages: List[Dict[str, str]]) -> str:
        """Generate summary of conversation."""
        try:
            summary_prompt = "Ringkas percakapan berikut dalam 2-3 kalimat:"
            conversation_text = "\n".join([
                f"{msg['role']}: {msg['content'][:200]}..."
                for msg in messages[-20:]  # Last 20 messages
            ])

            payload = {
                "model": self.model_id,
                "messages": [
                    {"role": "system", "content": "Buat ringkasan singkat dari percakapan hukum."},
                    {"role": "user", "content": f"{summary_prompt}\n\n{conversation_text}"}
                ],
                "max_tokens": 200
            }

            response_data = await self._make_request(payload)

            if "choices" in response_data and response_data["choices"]:
                return response_data["choices"][0]["message"]["content"]
            else:
                return "Ringkasan tidak tersedia"

        except Exception as e:
            logger.error(f"Error generating conversation summary: {str(e)}")
            return "Ringkasan tidak tersedia"

# Global AI service instance
ai_service_enhanced = AIService()
