"""
BytePlus Ark AI Service
Primary AI engine untuk Pasalku.ai
"""
import os
import logging
import time
from typing import List, Dict, Any, Optional
import httpx
from datetime import datetime

logger = logging.getLogger(__name__)


class ArkAIService:
    """BytePlus Ark AI integration service"""
    
    def __init__(self):
        self.api_key = os.getenv("ARK_API_KEY")
        self.base_url = os.getenv("ARK_BASE_URL", "https://ark.cn-beijing.volces.com/api/v3")
        self.model_id = os.getenv("ARK_MODEL_ID", "ep-20241211161256-d6pjl")
        self.region = os.getenv("ARK_REGION", "cn-beijing")
        
        if not self.api_key:
            logger.warning("ARK_API_KEY not configured")
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
        stream: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Send chat completion request to Ark AI
        
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
            async with httpx.AsyncClient(timeout=60.0) as client:
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
                
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                response.raise_for_status()
                result = response.json()
                
                response_time_ms = int((time.time() - start_time) * 1000)
                
                # Extract response data
                choice = result.get("choices", [{}])[0]
                message = choice.get("message", {})
                usage = result.get("usage", {})
                
                return {
                    "success": True,
                    "content": message.get("content", ""),
                    "role": message.get("role", "assistant"),
                    "model": result.get("model", self.model_id),
                    "usage": {
                        "prompt_tokens": usage.get("prompt_tokens", 0),
                        "completion_tokens": usage.get("completion_tokens", 0),
                        "total_tokens": usage.get("total_tokens", 0)
                    },
                    "response_time_ms": response_time_ms,
                    "finish_reason": choice.get("finish_reason"),
                    "raw_response": result
                }
                
        except httpx.HTTPStatusError as e:
            logger.error(f"Ark AI HTTP error: {e.response.status_code} - {e.response.text}")
            return {
                "success": False,
                "error": f"HTTP {e.response.status_code}",
                "error_detail": e.response.text,
                "response_time_ms": int((time.time() - start_time) * 1000)
            }
        except Exception as e:
            logger.error(f"Ark AI error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "response_time_ms": int((time.time() - start_time) * 1000)
            }
    
    async def legal_consultation(
        self,
        user_query: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        legal_context: Optional[Dict[str, Any]] = None,
        persona: str = "default"
    ) -> Dict[str, Any]:
        """
        Specialized legal consultation using Ark AI
        
        Args:
            user_query: User's legal question
            conversation_history: Previous messages in conversation
            legal_context: Additional legal context (laws, precedents, etc.)
            persona: AI persona to use
        
        Returns:
            Dict with consultation response
        """
        # Build system prompt based on persona
        system_prompts = {
            "default": """Anda adalah asisten hukum AI yang profesional dan membantu. 
Berikan jawaban yang akurat, jelas, dan mudah dipahami tentang hukum Indonesia. 
Selalu sertakan referensi pasal atau peraturan yang relevan jika memungkinkan.
Jika tidak yakin, katakan dengan jujur dan sarankan untuk berkonsultasi dengan profesional hukum.""",
            
            "advokat_progresif": """Anda adalah advokat progresif yang berpengalaman dalam hukum Indonesia.
Berikan analisis hukum yang mendalam dengan perspektif progresif dan perlindungan HAM.
Fokus pada keadilan substantif dan interpretasi hukum yang melindungi hak-hak individu.""",
            
            "konsultan_bisnis": """Anda adalah konsultan hukum bisnis yang ahli dalam hukum perusahaan Indonesia.
Berikan saran praktis untuk kepatuhan hukum bisnis, kontrak, dan regulasi.
Fokus pada solusi yang efisien dan meminimalkan risiko hukum.""",
            
            "mediator": """Anda adalah mediator hukum yang netral dan objektif.
Berikan perspektif yang seimbang dari berbagai sudut pandang hukum.
Fokus pada penyelesaian sengketa dan win-win solution."""
        }
        
        system_prompt = system_prompts.get(persona, system_prompts["default"])
        
        # Add legal context to system prompt if provided
        if legal_context:
            context_text = self._format_legal_context(legal_context)
            system_prompt += f"\n\nKonteks Hukum Relevan:\n{context_text}"
        
        # Build messages
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add current query
        messages.append({"role": "user", "content": user_query})
        
        # Get AI response
        result = await self.chat_completion(
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )
        
        if result["success"]:
            # Extract citations from response
            citations = self._extract_citations(result["content"])
            result["citations"] = citations
            
            # Calculate confidence score (simple heuristic)
            result["confidence_score"] = self._calculate_confidence(result)
        
        return result
    
    def _format_legal_context(self, context: Dict[str, Any]) -> str:
        """Format legal context for system prompt"""
        parts = []
        
        if context.get("relevant_laws"):
            parts.append("Undang-Undang Terkait:")
            for law in context["relevant_laws"]:
                parts.append(f"- {law}")
        
        if context.get("relevant_articles"):
            parts.append("\nPasal-Pasal Terkait:")
            for article in context["relevant_articles"]:
                parts.append(f"- {article}")
        
        if context.get("precedents"):
            parts.append("\nPutusan Pengadilan Terkait:")
            for precedent in context["precedents"]:
                parts.append(f"- {precedent}")
        
        return "\n".join(parts)
    
    def _extract_citations(self, content: str) -> List[Dict[str, str]]:
        """Extract legal citations from AI response"""
        import re
        
        citations = []
        
        # Pattern untuk pasal (e.g., "Pasal 338 KUHP")
        pasal_pattern = r'Pasal\s+(\d+[a-z]?)\s+([A-Z\s]+)'
        matches = re.finditer(pasal_pattern, content, re.IGNORECASE)
        
        for match in matches:
            citations.append({
                "type": "pasal",
                "article": match.group(1),
                "law": match.group(2).strip(),
                "text": match.group(0)
            })
        
        # Pattern untuk UU (e.g., "UU No. 1 Tahun 2023")
        uu_pattern = r'UU\s+No\.?\s*(\d+)\s+Tahun\s+(\d{4})'
        matches = re.finditer(uu_pattern, content, re.IGNORECASE)
        
        for match in matches:
            citations.append({
                "type": "undang_undang",
                "number": match.group(1),
                "year": match.group(2),
                "text": match.group(0)
            })
        
        return citations
    
    def _calculate_confidence(self, result: Dict[str, Any]) -> float:
        """Calculate confidence score based on response characteristics"""
        score = 0.5  # Base score
        
        # Higher score if response has citations
        if result.get("citations"):
            score += 0.2
        
        # Higher score if response is detailed (more tokens)
        completion_tokens = result.get("usage", {}).get("completion_tokens", 0)
        if completion_tokens > 500:
            score += 0.15
        elif completion_tokens > 200:
            score += 0.1
        
        # Lower score if response is too short
        if completion_tokens < 50:
            score -= 0.2
        
        # Check for uncertainty phrases
        content = result.get("content", "").lower()
        uncertainty_phrases = ["mungkin", "kemungkinan", "tidak yakin", "sebaiknya konsultasi"]
        if any(phrase in content for phrase in uncertainty_phrases):
            score -= 0.1
        
        return max(0.0, min(1.0, score))  # Clamp between 0 and 1
    
    async def analyze_document(
        self,
        document_text: str,
        analysis_type: str = "general"
    ) -> Dict[str, Any]:
        """
        Analyze legal document using Ark AI
        
        Args:
            document_text: Full text of document
            analysis_type: Type of analysis (general, contract, lawsuit, etc.)
        
        Returns:
            Dict with analysis results
        """
        analysis_prompts = {
            "general": """Analisis dokumen hukum berikut dan berikan:
1. Ringkasan singkat
2. Poin-poin penting
3. Isu hukum yang teridentifikasi
4. Pihak-pihak yang terlibat
5. Tanggal dan deadline penting
6. Rekomendasi tindak lanjut""",
            
            "contract": """Analisis kontrak berikut dan berikan:
1. Jenis kontrak
2. Para pihak dan peran mereka
3. Hak dan kewajiban masing-masing pihak
4. Klausul-klausul penting
5. Potensi risiko hukum
6. Rekomendasi revisi atau negosiasi""",
            
            "lawsuit": """Analisis gugatan/tuntutan hukum berikut dan berikan:
1. Jenis perkara
2. Penggugat dan tergugat
3. Pokok perkara
4. Dasar hukum yang digunakan
5. Tuntutan yang diajukan
6. Analisis kekuatan dan kelemahan kasus"""
        }
        
        prompt = analysis_prompts.get(analysis_type, analysis_prompts["general"])
        
        messages = [
            {"role": "system", "content": "Anda adalah ahli analisis dokumen hukum Indonesia."},
            {"role": "user", "content": f"{prompt}\n\nDokumen:\n{document_text}"}
        ]
        
        return await self.chat_completion(
            messages=messages,
            temperature=0.5,  # Lower temperature for analysis
            max_tokens=3000
        )
    
    async def generate_legal_document(
        self,
        document_type: str,
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate legal document template using Ark AI
        
        Args:
            document_type: Type of document (surat_kuasa, somasi, etc.)
            parameters: Document parameters (names, dates, details, etc.)
        
        Returns:
            Dict with generated document
        """
        templates = {
            "surat_kuasa": """Buatkan draft Surat Kuasa dengan detail berikut:
Pemberi Kuasa: {client_name}
Penerima Kuasa: {attorney_name}
Tujuan: {purpose}
Lingkup Kuasa: {scope}

Format sesuai standar hukum Indonesia.""",
            
            "somasi": """Buatkan draft Surat Somasi dengan detail berikut:
Pengirim: {sender_name}
Penerima: {recipient_name}
Perihal: {subject}
Dasar Hukum: {legal_basis}
Tuntutan: {demands}
Batas Waktu: {deadline}

Format sesuai standar hukum Indonesia."""
        }
        
        template = templates.get(document_type, "Buatkan dokumen hukum dengan detail: {parameters}")
        prompt = template.format(**parameters)
        
        messages = [
            {"role": "system", "content": "Anda adalah ahli penyusunan dokumen hukum Indonesia."},
            {"role": "user", "content": prompt}
        ]
        
        return await self.chat_completion(
            messages=messages,
            temperature=0.3,  # Very low temperature for document generation
            max_tokens=4000
        )


# Global instance
ark_ai_service = ArkAIService()
