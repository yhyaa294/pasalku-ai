"""
Clarification Generator

Generates targeted clarifying questions based on case context.
"""

import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import logging

from ..ai.consensus_engine import get_consensus_engine
from .context_classifier import LegalContext, LegalDomain


logger = logging.getLogger(__name__)


class QuestionType(str, Enum):
    """Types of clarification questions"""
    FACTUAL = "factual"  # Pertanyaan faktual
    TEMPORAL = "temporal"  # Pertanyaan waktu
    FINANCIAL = "financial"  # Pertanyaan keuangan
    EVIDENCE = "evidence"  # Pertanyaan bukti
    WITNESS = "witness"  # Pertanyaan saksi
    INTENT = "intent"  # Pertanyaan niat/maksud
    OUTCOME = "outcome"  # Pertanyaan hasil yang diinginkan


@dataclass
class ClarificationQuestion:
    """Clarification question"""
    question_id: str
    question_type: QuestionType
    question_text: str
    importance: int  # 1-5, 5 = most important
    suggested_answers: List[str]  # Suggested answer options
    answer: Optional[str] = None
    metadata: Dict[str, Any] = None


class ClarificationGenerator:
    """
    Generates intelligent clarifying questions based on:
    - Legal context/domain
    - Extracted entities
    - Missing critical information
    """
    
    # Domain-specific question templates
    DOMAIN_QUESTIONS = {
        LegalDomain.PIDANA: [
            {
                "type": QuestionType.TEMPORAL,
                "text": "Kapan kejadian ini terjadi? Tanggal dan waktu yang spesifik akan membantu.",
                "importance": 5,
                "answers": []
            },
            {
                "type": QuestionType.WITNESS,
                "text": "Apakah ada saksi yang melihat kejadian ini? Siapa saja mereka?",
                "importance": 4,
                "answers": ["Ada saksi", "Tidak ada saksi", "Tidak tahu"]
            },
            {
                "type": QuestionType.EVIDENCE,
                "text": "Apakah sudah ada laporan polisi (LP)? Jika ya, nomor LP-nya apa?",
                "importance": 5,
                "answers": ["Sudah ada LP", "Belum ada LP", "Dalam proses"]
            },
            {
                "type": QuestionType.FACTUAL,
                "text": "Apakah ada bukti fisik atau dokumentasi (foto, video, rekaman)?",
                "importance": 4,
                "answers": ["Ada", "Tidak ada"]
            },
        ],
        LegalDomain.PERDATA: [
            {
                "type": QuestionType.FINANCIAL,
                "text": "Berapa nilai kerugian materiil yang Anda alami?",
                "importance": 5,
                "answers": []
            },
            {
                "type": QuestionType.EVIDENCE,
                "text": "Apakah ada perjanjian tertulis atau kontrak yang mengatur hal ini?",
                "importance": 5,
                "answers": ["Ada perjanjian tertulis", "Perjanjian lisan", "Tidak ada perjanjian"]
            },
            {
                "type": QuestionType.TEMPORAL,
                "text": "Sejak kapan masalah ini dimulai? Apakah sudah ada upaya penyelesaian sebelumnya?",
                "importance": 4,
                "answers": []
            },
            {
                "type": QuestionType.OUTCOME,
                "text": "Apa yang Anda harapkan sebagai penyelesaian? (mis: ganti rugi, pembatalan kontrak, dll)",
                "importance": 5,
                "answers": ["Ganti rugi", "Pembatalan kontrak", "Pemenuhan prestasi", "Lainnya"]
            },
        ],
        LegalDomain.KETENAGAKERJAAN: [
            {
                "type": QuestionType.FACTUAL,
                "text": "Apa status kepegawaian Anda? (Karyawan tetap/PKWTT, kontrak/PKWT, outsourcing)",
                "importance": 5,
                "answers": ["Karyawan Tetap (PKWTT)", "Kontrak (PKWT)", "Outsourcing", "Lainnya"]
            },
            {
                "type": QuestionType.TEMPORAL,
                "text": "Berapa lama Anda bekerja di perusahaan ini?",
                "importance": 4,
                "answers": []
            },
            {
                "type": QuestionType.EVIDENCE,
                "text": "Apakah Anda memiliki surat perjanjian kerja dan slip gaji?",
                "importance": 5,
                "answers": ["Ada keduanya", "Hanya perjanjian kerja", "Hanya slip gaji", "Tidak ada"]
            },
        ],
        LegalDomain.KELUARGA: [
            {
                "type": QuestionType.TEMPORAL,
                "text": "Kapan pernikahan Anda berlangsung? Apakah tercatat resmi?",
                "importance": 5,
                "answers": ["Tercatat resmi", "Belum tercatat", "Nikah siri"]
            },
            {
                "type": QuestionType.FACTUAL,
                "text": "Apakah ada anak dari pernikahan ini? Jika ya, berapa usianya?",
                "importance": 5,
                "answers": []
            },
            {
                "type": QuestionType.FINANCIAL,
                "text": "Bagaimana dengan harta bersama? Apakah ada kesepakatan pranikah?",
                "importance": 4,
                "answers": ["Ada perjanjian pranikah", "Tidak ada perjanjian", "Tidak ada harta bersama"]
            },
        ],
    }
    
    def __init__(self):
        self.consensus_engine = get_consensus_engine()
    
    async def generate_questions(
        self,
        case_description: str,
        legal_context: LegalContext,
        extracted_entities: List[Dict[str, Any]],
        max_questions: int = 5
    ) -> List[ClarificationQuestion]:
        """
        Generate clarifying questions.
        
        Args:
            case_description: Original case description
            legal_context: Classified legal context
            extracted_entities: Extracted entities
            max_questions: Maximum number of questions
        
        Returns:
            List of clarification questions
        """
        questions = []
        
        # Get domain-specific template questions
        template_questions = self._get_template_questions(legal_context.primary_domain)
        
        # Filter out already answered questions (based on entities)
        filtered_questions = self._filter_answered_questions(
            template_questions,
            extracted_entities
        )
        
        # Generate AI-based custom questions
        ai_questions = await self._generate_ai_questions(
            case_description,
            legal_context,
            extracted_entities
        )
        
        # Combine and prioritize
        all_questions = filtered_questions + ai_questions
        all_questions.sort(key=lambda q: q.importance, reverse=True)
        
        # Return top N questions
        return all_questions[:max_questions]
    
    def _get_template_questions(
        self,
        domain: LegalDomain
    ) -> List[ClarificationQuestion]:
        """Get template questions for domain"""
        templates = self.DOMAIN_QUESTIONS.get(domain, [])
        
        questions = []
        for i, template in enumerate(templates):
            question = ClarificationQuestion(
                question_id=f"{domain.value}_q{i+1}",
                question_type=template["type"],
                question_text=template["text"],
                importance=template["importance"],
                suggested_answers=template["answers"],
                metadata={"source": "template", "domain": domain.value}
            )
            questions.append(question)
        
        return questions
    
    def _filter_answered_questions(
        self,
        questions: List[ClarificationQuestion],
        entities: List[Dict[str, Any]]
    ) -> List[ClarificationQuestion]:
        """Filter out questions that are already answered by entities"""
        # Check what types of entities we have
        entity_types = {e.get("entity_type") for e in entities}
        
        filtered = []
        for question in questions:
            # Skip date questions if we have dates
            if question.question_type == QuestionType.TEMPORAL and "date" in entity_types:
                continue
            
            # Skip money questions if we have money entities
            if question.question_type == QuestionType.FINANCIAL and "money" in entity_types:
                continue
            
            # Skip law reference questions if we have law entities
            if question.question_type == QuestionType.EVIDENCE and "law_reference" in entity_types:
                continue
            
            filtered.append(question)
        
        return filtered
    
    async def _generate_ai_questions(
        self,
        case_description: str,
        legal_context: LegalContext,
        entities: List[Dict[str, Any]]
    ) -> List[ClarificationQuestion]:
        """Generate custom questions using AI"""
        try:
            # Prepare prompt
            entities_summary = ", ".join([
                f"{e.get('entity_type')}: {e.get('text')}"
                for e in entities[:5]
            ])
            
            prompt = f"""Berdasarkan deskripsi kasus hukum berikut, buat 2-3 pertanyaan klarifikasi yang penting.

Deskripsi Kasus:
{case_description}

Domain Hukum: {legal_context.primary_domain.value}
Entitas yang Teridentifikasi: {entities_summary}

Buat pertanyaan yang:
1. Belum dijawab dalam deskripsi
2. Kritikal untuk analisis hukum
3. Spesifik dan jelas

Format jawaban sebagai JSON array:
[
  {{
    "type": "factual|temporal|financial|evidence|witness|intent|outcome",
    "text": "pertanyaan klarifikasi",
    "importance": 1-5,
    "suggested_answers": ["opsi1", "opsi2"]
  }}
]

Hanya kembalikan JSON array, tanpa penjelasan."""

            # Get AI response
            result = await self.consensus_engine.get_consensus(
                query=prompt,
                temperature=0.3
            )
            
            # Parse AI response
            import json
            try:
                ai_data = json.loads(result.consensus_answer)
                
                questions = []
                for i, item in enumerate(ai_data):
                    # Parse question type
                    type_str = item.get("type", "factual")
                    try:
                        question_type = QuestionType(type_str)
                    except ValueError:
                        question_type = QuestionType.FACTUAL
                    
                    question = ClarificationQuestion(
                        question_id=f"ai_q{i+1}",
                        question_type=question_type,
                        question_text=item.get("text", ""),
                        importance=item.get("importance", 3),
                        suggested_answers=item.get("suggested_answers", []),
                        metadata={"source": "ai", "confidence": result.consensus_confidence}
                    )
                    questions.append(question)
                
                return questions
            
            except json.JSONDecodeError:
                logger.warning("Failed to parse AI questions response")
                return []
        
        except Exception as e:
            logger.error(f"AI question generation failed: {e}")
            return []
    
    def format_questions(
        self,
        questions: List[ClarificationQuestion],
        include_options: bool = True
    ) -> str:
        """
        Format questions as readable text.
        
        Args:
            questions: List of questions
            include_options: Whether to include answer options
        
        Returns:
            Formatted string
        """
        lines = ["## Pertanyaan Klarifikasi\n"]
        lines.append("Untuk memberikan analisis yang lebih akurat, mohon jawab pertanyaan berikut:\n")
        
        for i, q in enumerate(questions, 1):
            importance_stars = "⭐" * q.importance
            lines.append(f"### {i}. {q.question_text}")
            lines.append(f"*Prioritas: {importance_stars}*\n")
            
            if include_options and q.suggested_answers:
                lines.append("**Pilihan jawaban:**")
                for j, answer in enumerate(q.suggested_answers, 1):
                    lines.append(f"{j}. {answer}")
                lines.append("")
        
        return "\n".join(lines)


# Singleton instance
_clarification_generator_instance: Optional[ClarificationGenerator] = None


def get_clarification_generator() -> ClarificationGenerator:
    """Get or create singleton clarification generator instance"""
    global _clarification_generator_instance
    
    if _clarification_generator_instance is None:
        _clarification_generator_instance = ClarificationGenerator()
    
    return _clarification_generator_instance
