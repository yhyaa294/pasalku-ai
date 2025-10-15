"""
Legal Analyzer

Performs comprehensive legal analysis using Knowledge Graph.
"""

import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime
import logging

from ..ai.consensus_engine import get_consensus_engine
from ..knowledge_graph.search_engine import get_search_engine
from ..knowledge_graph.citation_extractor import get_citation_extractor
from .context_classifier import LegalContext


logger = logging.getLogger(__name__)


@dataclass
class LegalAnalysis:
    """Comprehensive legal analysis result"""
    analysis_id: str
    
    # Analysis content
    summary: str  # Executive summary
    detailed_analysis: str  # Full analysis
    legal_basis: List[str]  # Dasar hukum yang relevan
    
    # Citations
    citations: List[Dict[str, Any]]  # Legal citations with sources
    reference_list: str  # Formatted reference list
    
    # Recommendations
    recommendations: List[str]  # Action recommendations
    risks: List[str]  # Potential risks
    next_steps: List[str]  # Suggested next steps
    
    # Confidence & metadata
    confidence: float
    analysis_date: datetime
    metadata: Dict[str, Any] = field(default_factory=dict)


class LegalAnalyzer:
    """
    Performs comprehensive legal analysis by:
    1. Searching Knowledge Graph for relevant laws
    2. Analyzing legal implications using AI
    3. Generating recommendations and next steps
    4. Extracting and validating citations
    """
    
    def __init__(self):
        self.consensus_engine = get_consensus_engine()
        self.search_engine = get_search_engine()
        self.citation_extractor = get_citation_extractor()
    
    async def analyze(
        self,
        case_description: str,
        legal_context: LegalContext,
        clarification_answers: List[Dict[str, Any]],
        document_evidence: Optional[List[Dict[str, Any]]] = None
    ) -> LegalAnalysis:
        """
        Perform comprehensive legal analysis.
        
        Args:
            case_description: Original case description
            legal_context: Classified legal context
            clarification_answers: Answers to clarification questions
            document_evidence: Optional uploaded documents
        
        Returns:
            Legal analysis result
        """
        # Step 1: Search Knowledge Graph for relevant laws
        relevant_laws = await self._search_relevant_laws(
            case_description,
            legal_context
        )
        
        # Step 2: Generate comprehensive analysis using AI
        analysis_text = await self._generate_analysis(
            case_description,
            legal_context,
            clarification_answers,
            relevant_laws,
            document_evidence
        )
        
        # Step 3: Extract citations from analysis
        citations = await self._extract_and_validate_citations(analysis_text)
        
        # Step 4: Generate recommendations
        recommendations = await self._generate_recommendations(
            case_description,
            legal_context,
            analysis_text
        )
        
        # Step 5: Identify risks
        risks = await self._identify_risks(
            case_description,
            legal_context,
            analysis_text
        )
        
        # Step 6: Suggest next steps
        next_steps = await self._suggest_next_steps(
            legal_context,
            recommendations
        )
        
        # Create analysis result
        import uuid
        analysis = LegalAnalysis(
            analysis_id=str(uuid.uuid4()),
            summary=analysis_text.split("\n\n")[0] if "\n\n" in analysis_text else analysis_text[:500],
            detailed_analysis=analysis_text,
            legal_basis=[law.get("title", "") for law in relevant_laws],
            citations=citations,
            reference_list=self.citation_extractor.generate_reference_list(
                [c for c in citations if c]
            ),
            recommendations=recommendations,
            risks=risks,
            next_steps=next_steps,
            confidence=0.85,  # TODO: Calculate from consensus
            analysis_date=datetime.now(),
            metadata={
                "domain": legal_context.primary_domain.value,
                "complexity": legal_context.complexity_score,
                "total_laws_found": len(relevant_laws),
                "total_citations": len(citations)
            }
        )
        
        logger.info(f"Generated legal analysis: {analysis.analysis_id}")
        
        return analysis
    
    async def _search_relevant_laws(
        self,
        case_description: str,
        legal_context: LegalContext
    ) -> List[Dict[str, Any]]:
        """Search Knowledge Graph for relevant laws"""
        try:
            # Prepare search query
            domain_keywords = {
                "pidana": "hukum pidana pencurian pembunuhan",
                "perdata": "hukum perdata wanprestasi ganti rugi",
                "bisnis": "hukum bisnis PT perseroan",
                "ketenagakerjaan": "hukum ketenagakerjaan PHK pekerja",
                "keluarga": "hukum perkawinan perceraian",
                "properti": "hukum properti tanah sertifikat",
            }
            
            search_query = f"{case_description[:500]} {domain_keywords.get(legal_context.primary_domain.value, '')}"
            
            # Search with AI enhancement
            search_result = await self.search_engine.search(
                query=search_query,
                document_types=["law", "regulation"],
                domains=[legal_context.primary_domain.value],
                max_results=10,
                use_ai_enhancement=True
            )
            
            # Convert results to dict format
            laws = []
            for citation in search_result.results:
                laws.append({
                    "id": citation.document_id,
                    "title": citation.title,
                    "citation": citation.citation_text,
                    "excerpt": citation.excerpt,
                    "url": citation.url,
                    "relevance": citation.relevance_score
                })
            
            logger.info(f"Found {len(laws)} relevant laws")
            
            return laws
        
        except Exception as e:
            logger.error(f"Failed to search laws: {e}")
            return []
    
    async def _generate_analysis(
        self,
        case_description: str,
        legal_context: LegalContext,
        clarification_answers: List[Dict[str, Any]],
        relevant_laws: List[Dict[str, Any]],
        document_evidence: Optional[List[Dict[str, Any]]]
    ) -> str:
        """Generate comprehensive legal analysis using AI"""
        try:
            # Prepare context
            clarifications = "\n".join([
                f"- {ans.get('question', 'N/A')}: {ans.get('answer', 'N/A')}"
                for ans in clarification_answers
            ])
            
            laws_context = "\n".join([
                f"- {law.get('citation', 'N/A')}: {law.get('title', 'N/A')}\n  {law.get('excerpt', 'N/A')[:200]}"
                for law in relevant_laws[:5]
            ])
            
            documents = ""
            if document_evidence:
                documents = f"\n\nDokumen Bukti:\n" + "\n".join([
                    f"- {doc.get('filename', 'N/A')}: {doc.get('summary', 'N/A')}"
                    for doc in document_evidence
                ])
            
            # Prepare analysis prompt
            prompt = f"""Lakukan analisis hukum komprehensif untuk kasus berikut:

**DESKRIPSI KASUS:**
{case_description}

**DOMAIN HUKUM:** {legal_context.primary_domain.value}
**KOMPLEKSITAS:** {legal_context.complexity_score}/5

**INFORMASI TAMBAHAN (dari klarifikasi):**
{clarifications}
{documents}

**DASAR HUKUM YANG RELEVAN:**
{laws_context}

Berikan analisis yang mencakup:

1. **RINGKASAN KASUS**
   Ringkas inti permasalahan hukum

2. **ANALISIS LEGAL**
   - Kualifikasi hukum (termasuk pasal yang dilanggar jika ada)
   - Analisis unsur-unsur hukum
   - Hak dan kewajiban para pihak
   - Potensi tuntutan atau gugatan

3. **DASAR HUKUM**
   Sebutkan pasal dan UU yang relevan dengan format:
   - Pasal X UU No. Y Tahun Z tentang ...

4. **IMPLIKASI**
   - Konsekuensi hukum yang mungkin terjadi
   - Hak-hak yang dapat diklaim
   - Tanggung jawab hukum

Gunakan bahasa yang jelas dan profesional. Sertakan kutipan pasal dengan format yang tepat."""

            # Get AI analysis
            result = await self.consensus_engine.get_consensus(
                query=prompt,
                temperature=0.2
            )
            
            return result.consensus_answer
        
        except Exception as e:
            logger.error(f"Failed to generate analysis: {e}")
            return "Error: Gagal menghasilkan analisis hukum."
    
    async def _extract_and_validate_citations(
        self,
        analysis_text: str
    ) -> List[Dict[str, Any]]:
        """Extract and validate citations from analysis"""
        try:
            # Extract citations
            citations = self.citation_extractor.extract(analysis_text)
            
            # Convert to dict format
            citation_dicts = []
            for citation in citations:
                citation_dicts.append({
                    "raw_text": citation.raw_text,
                    "citation_type": citation.citation_type,
                    "confidence": citation.confidence,
                    "matched_document": citation.matched_document
                })
            
            return citation_dicts
        
        except Exception as e:
            logger.error(f"Failed to extract citations: {e}")
            return []
    
    async def _generate_recommendations(
        self,
        case_description: str,
        legal_context: LegalContext,
        analysis_text: str
    ) -> List[str]:
        """Generate action recommendations"""
        try:
            prompt = f"""Berdasarkan analisis hukum berikut, berikan 3-5 rekomendasi tindakan konkret:

Domain: {legal_context.primary_domain.value}

Analisis:
{analysis_text[:1000]}

Berikan rekomendasi dalam format JSON array:
["rekomendasi 1", "rekomendasi 2", ...]

Rekomendasi harus:
- Spesifik dan actionable
- Sesuai dengan domain hukum
- Realistis untuk dijalankan

Hanya kembalikan JSON array."""

            result = await self.consensus_engine.get_consensus(
                query=prompt,
                temperature=0.3
            )
            
            # Parse recommendations
            import json
            try:
                recommendations = json.loads(result.consensus_answer)
                if isinstance(recommendations, list):
                    return recommendations[:5]
            except:
                pass
            
            # Fallback: extract from text
            return [
                line.strip("- ").strip()
                for line in result.consensus_answer.split("\n")
                if line.strip().startswith("-")
            ][:5]
        
        except Exception as e:
            logger.error(f"Failed to generate recommendations: {e}")
            return ["Konsultasikan dengan advokat untuk langkah lebih lanjut"]
    
    async def _identify_risks(
        self,
        case_description: str,
        legal_context: LegalContext,
        analysis_text: str
    ) -> List[str]:
        """Identify potential legal risks"""
        try:
            # Risk keywords to look for
            risk_indicators = [
                "sanksi", "hukuman", "denda", "penjara", "pidana", "gugatan",
                "tuntutan", "kerugian", "tanggung jawab", "pelanggaran"
            ]
            
            # Check if any risk indicators in analysis
            has_risks = any(
                indicator in analysis_text.lower()
                for indicator in risk_indicators
            )
            
            if not has_risks:
                return ["Tidak ada risiko hukum signifikan yang teridentifikasi"]
            
            # Generate risk analysis using AI
            prompt = f"""Identifikasi 2-4 risiko hukum potensial dari kasus ini:

Domain: {legal_context.primary_domain.value}

Analisis:
{analysis_text[:800]}

Format jawaban sebagai JSON array:
["risiko 1", "risiko 2", ...]

Fokus pada risiko yang:
- Realistis dan relevan
- Perlu perhatian khusus
- Dapat dimitigasi

Hanya kembalikan JSON array."""

            result = await self.consensus_engine.get_consensus(
                query=prompt,
                temperature=0.3
            )
            
            # Parse risks
            import json
            try:
                risks = json.loads(result.consensus_answer)
                if isinstance(risks, list):
                    return risks[:5]
            except:
                pass
            
            # Fallback
            return [
                line.strip("- ").strip()
                for line in result.consensus_answer.split("\n")
                if line.strip().startswith("-")
            ][:4]
        
        except Exception as e:
            logger.error(f"Failed to identify risks: {e}")
            return []
    
    async def _suggest_next_steps(
        self,
        legal_context: LegalContext,
        recommendations: List[str]
    ) -> List[str]:
        """Suggest next steps based on domain"""
        # Domain-specific next steps
        domain_steps = {
            "pidana": [
                "Buat laporan polisi (jika belum)",
                "Kumpulkan semua bukti dan dokumen pendukung",
                "Konsultasi dengan advokat pidana",
                "Cari saksi yang dapat memberikan kesaksian",
            ],
            "perdata": [
                "Coba selesaikan secara musyawarah/mediasi",
                "Siapkan dokumen perjanjian dan bukti tertulis",
                "Hitung nilai kerugian secara detail",
                "Konsultasi dengan advokat perdata",
                "Pertimbangkan somasi tertulis",
            ],
            "ketenagakerjaan": [
                "Dokumentasikan semua komunikasi dengan perusahaan",
                "Kumpulkan slip gaji dan kontrak kerja",
                "Laporkan ke Dinas Tenaga Kerja",
                "Pertimbangkan mediasi bipartit",
                "Konsultasi dengan advokat ketenagakerjaan",
            ],
            "keluarga": [
                "Coba mediasi keluarga terlebih dahulu",
                "Konsultasi dengan konselor/psikolog",
                "Siapkan dokumen pernikahan dan lainnya",
                "Pertimbangkan mediasi di pengadilan agama",
                "Konsultasi dengan advokat keluarga",
            ],
        }
        
        # Get domain-specific steps
        steps = domain_steps.get(
            legal_context.primary_domain.value,
            ["Konsultasi dengan advokat profesional",
             "Kumpulkan semua dokumen dan bukti",
             "Catat kronologi kejadian secara detail"]
        )
        
        # Add urgency steps if urgent
        if legal_context.is_urgent:
            steps.insert(0, "🚨 SEGERA: Lakukan langkah ini secepat mungkin")
        
        return steps[:5]
    
    def format_analysis(self, analysis: LegalAnalysis) -> str:
        """
        Format analysis as readable text.
        
        Args:
            analysis: Legal analysis result
        
        Returns:
            Formatted markdown string
        """
        lines = [
            "# Analisis Hukum",
            f"*Analisis ID: {analysis.analysis_id}*",
            f"*Tanggal: {analysis.analysis_date.strftime('%d %B %Y %H:%M')}*",
            f"*Confidence: {analysis.confidence:.0%}*",
            "",
            "## Ringkasan",
            analysis.summary,
            "",
            "## Analisis Detail",
            analysis.detailed_analysis,
            "",
        ]
        
        if analysis.legal_basis:
            lines.extend([
                "## Dasar Hukum",
                ""
            ])
            for basis in analysis.legal_basis:
                lines.append(f"- {basis}")
            lines.append("")
        
        if analysis.recommendations:
            lines.extend([
                "## Rekomendasi",
                ""
            ])
            for i, rec in enumerate(analysis.recommendations, 1):
                lines.append(f"{i}. {rec}")
            lines.append("")
        
        if analysis.risks:
            lines.extend([
                "## ⚠️ Risiko Potensial",
                ""
            ])
            for risk in analysis.risks:
                lines.append(f"- {risk}")
            lines.append("")
        
        if analysis.next_steps:
            lines.extend([
                "## 📋 Langkah Selanjutnya",
                ""
            ])
            for i, step in enumerate(analysis.next_steps, 1):
                lines.append(f"{i}. {step}")
            lines.append("")
        
        if analysis.reference_list:
            lines.extend([
                "## Referensi",
                analysis.reference_list
            ])
        
        return "\n".join(lines)


# Singleton instance
_legal_analyzer_instance: Optional[LegalAnalyzer] = None


def get_legal_analyzer() -> LegalAnalyzer:
    """Get or create singleton legal analyzer instance"""
    global _legal_analyzer_instance
    
    if _legal_analyzer_instance is None:
        _legal_analyzer_instance = LegalAnalyzer()
    
    return _legal_analyzer_instance
