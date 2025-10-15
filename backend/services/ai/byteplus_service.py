"""
BytePlus Ark AI Service
Deep reasoning AI engine for Pasalku.ai
"""

import os
import logging
import time
from typing import List, Dict, Any, Optional
import httpx
from datetime import datetime

logger = logging.getLogger(__name__)


class BytePlusArkService:
    """BytePlus Ark AI integration service for deep reasoning"""

    def __init__(self):
        self.api_key = os.getenv("ARK_API_KEY")
        self.base_url = os.getenv("ARK_BASE_URL", "https://ark.ap-southeast.bytepluses.com/api/v3")
        self.model_id = os.getenv("ARK_MODEL_ID", "ep-20250830093230-swczp")
        self.region = os.getenv("ARK_REGION", "ap-southeast")

        if not self.api_key:
            logger.warning("ARK_API_KEY not configured - BytePlus service unavailable")

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Send chat completion request to BytePlus Ark AI

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
                raise ValueError("ARK_API_KEY not configured")

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": self.model_id,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": stream,
                **kwargs
            }

            async with httpx.AsyncClient(timeout=120.0) as client:  # Longer timeout for deep reasoning
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                )

                response.raise_for_status()
                result = response.json()

            elapsed_time = time.time() - start_time

            logger.info(
                f"✅ BytePlus Ark response received "
                f"(model: {self.model_id}, time: {elapsed_time:.2f}s)"
            )

            return result

        except httpx.HTTPStatusError as e:
            logger.error(f"BytePlus Ark API HTTP error: {e.response.status_code} - {e.response.text}")
            raise Exception(f"BytePlus Ark API error: {e.response.status_code}")
        except httpx.TimeoutException:
            logger.error("BytePlus Ark API timeout")
            raise Exception("BytePlus Ark API timeout")
        except Exception as e:
            logger.error(f"BytePlus Ark API error: {str(e)}")
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

    async def analyze_legal_case(
        self,
        case_description: str,
        analysis_type: str = "comprehensive",
        legal_domain: str = "general"
    ) -> Dict[str, Any]:
        """
        Analyze legal case using BytePlus Ark's deep reasoning.

        Args:
            case_description: Description of the legal case
            analysis_type: Type of analysis (comprehensive, precedent, risk)
            legal_domain: Legal domain (civil, criminal, administrative, constitutional)

        Returns:
            Analysis result with deep reasoning insights
        """
        prompts = {
            "comprehensive": f"""Analisis kasus hukum berikut secara mendalam dengan pendekatan reasoning chain:

Kasus: {case_description}

Berikan analisis yang mencakup:
1. Fakta-fakta penting dari kasus
2. Masalah hukum yang timbul
3. Argumentasi hukum yang sistematis
4. Preseden atau yurisprudensi relevant
5. Kesimpulan dengan alternatif penyelesaian
6. Risiko-risiko yang perlu diperhatikan

Domain hukum: {legal_domain}""",

            "precedent": f"""Cari dan analisis preseden hukum yang relevan untuk kasus:

Kasus: {case_description}

Fokus pada:
1. Putusan Mahkamah Agung yang serupa
2. Yurisprudensi konstitusi yang applicable
3. Interpretasi hakim dalam kasus sejenis
4. Prinsip hukum yang dapat diterapkan

Berikan reasoning chain lengkap tentang mengapa preseden ini relevant.""",

            "risk": f"""Lakukan risk assessment untuk kasus hukum ini:

Kasus: {case_description}

Identifikasi:
1. Risiko hukum utama
2. Dampak financial dan reputasi
3. Alternatives penyelesaian
4. Legal strategies mitigasi
5. Probabilitas keberhasilan setiap opsi

Domain: {legal_domain}"""
        }

        prompt = prompts.get(analysis_type, prompts["comprehensive"])

        system_prompt = (
            f"You are an expert legal analyst specializing in Indonesian {'law in general' if legal_domain == 'general' else legal_domain + ' law'}. "
            "Provide deep, reasoned analysis with logical progression. "
            "Always include relevant legal citations and explain your reasoning step by step."
        )

        response = await self.simple_query(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.3,  # Lower temp for legal reasoning accuracy
            max_tokens=3000  # Longer responses for deep analysis
        )

        return {
            "analysis": response,
            "analysis_type": analysis_type,
            "legal_domain": legal_domain,
            "timestamp": datetime.now().isoformat(),
            "model": "byteplus_ark"
        }

    async def compare_legal_text(
        self,
        text1: str,
        text2: str,
        comparison_type: str = "similarity"
    ) -> Dict[str, Any]:
        """
        Compare two legal texts using deep reasoning.

        Args:
            text1: First legal text
            text2: Second legal text
            comparison_type: Type of comparison (similarity, conflict, compatibility)

        Returns:
            Detailed comparison analysis
        """
        prompt_map = {
            "similarity": "Compare these two legal texts for similarities and differences:",
            "conflict": "Analyze potential conflicts between these legal provisions:",
            "compatibility": "Determine if these texts are compatible or contradictory:"
        }

        prompt = f"""{prompt_map[comparison_type]}

Text 1:
{text1}

Text 2:
{text2}

Provide detailed analysis with reasoning chain explaining your conclusions."""

        system_prompt = (
            "You are a legal text comparison expert. "
            "Provide structured analysis with clear reasoning for each conclusion drawn. "
            "Cite specific sections and explain legal implications."
        )

        response = await self.simple_query(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.2,  # Very low for consistency
            max_tokens=2500
        )

        return {
            "comparison": response,
            "comparison_type": comparison_type,
            "timestamp": datetime.now().isoformat(),
            "model": "byteplus_ark"
        }

    def get_status(self) -> Dict[str, Any]:
        """Get service status"""
        return {
            "service": "BytePlus Ark",
            "model": self.model_id,
            "region": self.region,
            "configured": bool(self.api_key),
            "base_url": self.base_url
        }


# Singleton instance
_byteplus_service: Optional[BytePlusArkService] = None


def get_byteplus_service() -> BytePlusArkService:
    """Get singleton BytePlus service instance"""
    global _byteplus_service
    if _byteplus_service is None:
        _byteplus_service = BytePlusArkService()
    return _byteplus_service