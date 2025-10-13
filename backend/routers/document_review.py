"""
Document Review API Router
Menggunakan AI untuk menganalisis dan meninjau dokumen hukum
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel, Field
import httpx

from ..services.ark_ai_service import ark_ai_service
from ..services.enhanced_ai_service import EnhancedAIService
from ..core.clerk_service import clerk_service
from ..middleware.auth import get_current_user

# Initialize services
enhanced_ai_service = EnhancedAIService()

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/document-review", tags=["Document Review"])

# Pydantic models
class DocumentReviewRequest(BaseModel):
    """Request model for document review"""
    document_text: str = Field(..., description="Full text of the legal document to review")
    document_type: str = Field(..., description="Type of document (contract, agreement, lawsuit, etc.)")
    review_depth: str = Field(default="comprehensive", description="Review depth: basic, comprehensive, expert")
    include_recommendations: bool = Field(default=True, description="Include actionable recommendations")
    check_compliance: bool = Field(default=True, description="Check legal compliance")
    analyze_risks: bool = Field(default=True, description="Perform risk analysis")

class DocumentReviewResponse(BaseModel):
    """Response model for document review"""
    document_type: str
    summary: str
    key_findings: List[str]
    compliance_check: Dict[str, Any]
    risk_analysis: Dict[str, Any]
    recommendations: List[str]
    confidence_score: float
    review_timestamp: datetime
    reviewer: str = "Ark AI Enhanced Analysis"
    processing_time_ms: int

class ComplianceCheckResult(BaseModel):
    """Compliance check results"""
    status: str  # "compliant", "non_compliant", "requires_review"
    issues: List[Dict[str, str]]
    compliance_score: float
    recommended_actions: List[str]

class RiskAssessmentResult(BaseModel):
    """Risk assessment results"""
    risk_level: str  # "low", "medium", "high", "critical"
    risk_score: float
    identified_risks: List[Dict[str, Any]]
    mitigation_strategies: List[str]
    probability_assessment: str

@router.post("/analyze", response_model=DocumentReviewResponse)
async def analyze_document(
    document_text: str = Form(..., description="Full text of the legal document"),
    document_type: str = Form(..., description="Type of document"),
    review_depth: str = Form("comprehensive", description="Review depth"),
    include_recommendations: bool = Form(True, description="Include recommendations"),
    check_compliance: bool = Form(True, description="Check compliance"),
    analyze_risks: bool = Form(True, description="Analyze risks"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Analyze legal document using enhanced AI capabilities
    Combines Ark AI and Groq AI for comprehensive analysis
    """
    import time
    start_time = time.time()

    try:
        # Validate input
        if not document_text.strip():
            raise HTTPException(status_code=400, detail="Document text cannot be empty")

        if len(document_text) > 100000:  # 100KB limit
            raise HTTPException(status_code=400, detail="Document too large (max 100KB)")

        # Initialize results
        compliance_result = None
        risk_result = None

        # Perform compliance check if requested
        if check_compliance:
            compliance_result = await _check_compliance(document_text, document_type)

        # Perform risk analysis if requested
        if analyze_risks:
            risk_result = await _assess_risks(document_text, document_type)

        # Get enhanced AI analysis
        summary_and_findings = await _get_enhanced_analysis(
            document_text,
            document_type,
            review_depth,
            include_recommendations
        )

        processing_time_ms = int((time.time() - start_time) * 1000)

        # Calculate overall confidence
        confidence_factors = []
        if compliance_result:
            confidence_factors.append(compliance_result.get("compliance_score", 0.8))
        if risk_result:
            # Convert risk level to confidence factor
            risk_level = risk_result.get("risk_level", "medium")
            risk_confidence = {"low": 0.9, "medium": 0.7, "high": 0.5, "critical": 0.3}
            confidence_factors.append(risk_confidence.get(risk_level, 0.7))
        if summary_and_findings.get("confidence_score"):
            confidence_factors.append(summary_and_findings["confidence_score"])

        overall_confidence = sum(confidence_factors) / len(confidence_factors) if confidence_factors else 0.8

        response = DocumentReviewResponse(
            document_type=document_type,
            summary=summary_and_findings.get("summary", ""),
            key_findings=summary_and_findings.get("key_findings", []),
            compliance_check=compliance_result or {},
            risk_analysis=risk_result or {},
            recommendations=summary_and_findings.get("recommendations", []),
            confidence_score=round(overall_confidence, 2),
            review_timestamp=datetime.utcnow(),
            reviewer="Ark AI + Groq AI Enhanced Analysis",
            processing_time_ms=processing_time_ms
        )

        # Log analysis completion
        logger.info(f"Document review completed for user {current_user.get('id', 'unknown')} in {processing_time_ms}ms")

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Document review error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

async def _check_compliance(document_text: str, document_type: str) -> Dict[str, Any]:
    """Check legal compliance using AI"""
    try:
        compliance_prompts = {
            "contract": """Analisis kontrak berikut untuk kepatuhan hukum Indonesia:
1. Periksa keberadaan klausul wajib (force majeure, dispute resolution, governing law)
2. Evaluasi kejelasan hak dan kewajiban pihak
3. Identifikasi klausul yang berpotensi tidak sah atau tidak sah
4. Berikan skor kepatuhan (0-1) dan masalah yang ditemukan""",

            "agreement": """Periksa perjanjian ini untuk kepatuhan hukum:
1. Kapasitas pihak-pihak untuk membuat perjanjian
2. Kejelasan objek perjanjian
3. Aspek hukum formal (saksi, materai, dll)
4. Potensi pelanggaran hukum yang berlaku""",

            "lawsuit": """Analisis gugatan untuk kepatuhan prosedur:
1. Kelengkapan formal gugatan
2. Dasar hukum yang digunakan
3. Kompetensi pengadilan
4. Kesesuaian dengan hukum acara"""
        }

        prompt = compliance_prompts.get(document_type, f"Analisis dokumen {document_type} untuk kepatuhan hukum Indonesia")

        messages = [
            {"role": "system", "content": "Anda adalah auditor hukum yang ketat dan teliti. Berikan analisis kepatuhan yang objektif dan akurat."},
            {"role": "user", "content": f"{prompt}\n\nDokumen:\n{document_text}"}
        ]

        # Use enhanced AI service for compliance check
        result = await enhanced_ai_service.analyze_with_fallback(
            messages=messages,
            temperature=0.3,
            max_tokens=1500
        )

        if result["success"]:
            # Parse compliance result from AI response
            content = result["content"]
            return {
                "status": _extract_compliance_status(content),
                "issues": _extract_compliance_issues(content),
                "compliance_score": _calculate_compliance_score(content),
                "recommended_actions": _extract_recommendations(content)
            }
        else:
            return {
                "status": "error",
                "issues": [{"type": "error", "description": "Compliance check failed", "severity": "high"}],
                "compliance_score": 0.0,
                "recommended_actions": ["Manual compliance review required"]
            }

    except Exception as e:
        logger.error(f"Compliance check error: {str(e)}")
        return {
            "status": "error",
            "issues": [{"type": "error", "description": f"Compliance analysis failed: {str(e)}", "severity": "high"}],
            "compliance_score": 0.0,
            "recommended_actions": ["Manual review required"]
        }

async def _assess_risks(document_text: str, document_type: str) -> Dict[str, Any]:
    """Assess legal and business risks"""
    try:
        risk_prompt = f"""Lakukan assessment risiko komprehensif untuk dokumen {document_type} ini:

1. Identifikasi risiko hukum potensial
2. Analisis risiko bisnis dan finansial
3. Evaluasi risiko operasional
4. Berikan penilaian probabilitas dan dampak
5. Sarankan strategi mitigasi

Fokus pada:
- Pelanggaran hukum yang potensial
- Klaim hukum dari pihak lain
- Kerugian finansial
- Risiko reputasi
- Ketidakpastian interpretasi hukum

Berikan skor risiko (0-1) dan level risiko (low/medium/high/critical)."""

        messages = [
            {"role": "system", "content": "Anda adalah risk assessor hukum berpengalaman. Berikan analisis risiko yang realistis dan actionable."},
            {"role": "user", "content": f"{risk_prompt}\n\nDokumen:\n{document_text}"}
        ]

        # Use Ark AI for detailed risk analysis
        result = await ark_ai_service.chat_completion(
            messages=messages,
            temperature=0.4,
            max_tokens=2000
        )

        if result["success"]:
            content = result["content"]
            return {
                "risk_level": _extract_risk_level(content),
                "risk_score": _calculate_risk_score(content),
                "identified_risks": _extract_identified_risks(content),
                "mitigation_strategies": _extract_mitigation_strategies(content),
                "probability_assessment": _assess_probability(content)
            }
        else:
            return {
                "risk_level": "unknown",
                "risk_score": 0.5,
                "identified_risks": [{"type": "error", "description": "Risk analysis failed", "impact": "unknown"}],
                "mitigation_strategies": ["Manual risk assessment required"],
                "probability_assessment": "cannot determine"
            }

    except Exception as e:
        logger.error(f"Risk assessment error: {str(e)}")
        return {
            "risk_level": "unknown",
            "risk_score": 0.5,
            "identified_risks": [{"type": "error", "description": f"Risk analysis failed: {str(e)}", "impact": "unknown"}],
            "mitigation_strategies": ["Manual risk assessment required"],
            "probability_assessment": "cannot determine"
        }

async def _get_enhanced_analysis(
    document_text: str,
    document_type: str,
    review_depth: str,
    include_recommendations: bool
) -> Dict[str, Any]:
    """Get enhanced AI analysis and findings"""
    try:
        depth_settings = {
            "basic": {
                "max_tokens": 800,
                "temperature": 0.6,
                "focus": "Ringkasan penting dan poin krusial"
            },
            "comprehensive": {
                "max_tokens": 1500,
                "temperature": 0.5,
                "focus": "Analisis detail dengan konteks hukum"
            },
            "expert": {
                "max_tokens": 2500,
                "temperature": 0.3,
                "focus": "Analisis ahli dengan perspektif multidimensi"
            }
        }

        settings = depth_settings.get(review_depth, depth_settings["comprehensive"])
        focus = settings["focus"]

        analysis_prompt = f"""Lakukan {focus} untuk dokumen {document_type} berikut:

1. Berikan ringkasan eksekutif yang jelas dan ringkas
2. Identifikasi temuan-temuan kunci dan aspek penting
3. Analisis konteks hukum yang relevan
4. Evaluasi kekuatan dan kelemahan dokumen
{f'5. Berikan rekomendasi praktis untuk perbaikan atau pengembangan' if include_recommendations else ''}

Fokus pada aspek hukum, bisnis, dan praktis."""

        messages = [
            {"role": "system", "content": f"Anda adalah analis hukum {review_depth} level. Berikan analisis yang akurat, objektif, dan berguna."},
            {"role": "user", "content": f"{analysis_prompt}\n\nDokumen:\n{document_text}"}
        ]

        # Use enhanced AI service for comprehensive analysis
        result = await enhanced_ai_service.analyze_with_fallback(
            messages=messages,
            temperature=settings["temperature"],
            max_tokens=settings["max_tokens"]
        )

        if result["success"]:
            content = result["content"]
            confidence_score = min(0.95, 0.7 + (len(content) / 2000) * 0.2)  # Simple confidence heuristic

            return {
                "summary": _extract_summary(content),
                "key_findings": _extract_key_findings(content),
                "recommendations": _extract_recommendations(content) if include_recommendations else [],
                "confidence_score": confidence_score
            }
        else:
            return {
                "summary": "Analysis could not be completed due to AI service error",
                "key_findings": ["Service temporarily unavailable"],
                "recommendations": ["Please try again later"],
                "confidence_score": 0.0
            }

    except Exception as e:
        logger.error(f"Enhanced analysis error: {str(e)}")
        return {
            "summary": f"Analysis failed: {str(e)}",
            "key_findings": ["Error occurred during analysis"],
            "recommendations": ["Manual review required"],
            "confidence_score": 0.0
        }

# Helper functions for parsing AI responses
def _extract_compliance_status(content: str) -> str:
    """Extract compliance status from AI response"""
    content_lower = content.lower()
    if "patuh" in content_lower or "compliant" in content_lower:
        return "compliant"
    elif "tidak patuh" in content_lower or "non-compliant" in content_lower:
        return "non_compliant"
    else:
        return "requires_review"

def _extract_compliance_issues(content: str) -> List[Dict[str, str]]:
    """Extract compliance issues from AI response"""
    issues = []
    lines = content.split('\n')
    for line in lines:
        if any(keyword in line.lower() for keyword in ['masalah', 'issue', 'perlu', 'kurang']):
            issues.append({
                "type": "compliance",
                "description": line.strip(),
                "severity": "medium"
            })
    return issues[:5]  # Limit to 5 issues

def _calculate_compliance_score(content: str) -> float:
    """Calculate compliance score from AI response"""
    content_lower = content.lower()
    score = 0.8  # Default good score

    # Reduce score for negative indicators
    negative_indicators = ['tidak patuh', 'bermasalah', 'kurang lengkap', 'tidak sah']
    for indicator in negative_indicators:
        if indicator in content_lower:
            score -= 0.2

    # Increase score for positive indicators
    positive_indicators = ['patuh', 'lengkap', 'sesuai', 'sah']
    for indicator in positive_indicators:
        if indicator in content_lower:
            score += 0.1

    return max(0.0, min(1.0, score))

def _extract_risk_level(content: str) -> str:
    """Extract risk level from AI response"""
    content_lower = content.lower()
    if any(word in content_lower for word in ['kritis', 'critical', 'sangat tinggi']):
        return "critical"
    elif any(word in content_lower for word in ['tinggi', 'high', 'berbahaya']):
        return "high"
    elif any(word in content_lower for word in ['sedang', 'medium', 'moderat']):
        return "medium"
    else:
        return "low"

def _calculate_risk_score(content: str) -> float:
    """Calculate risk score from AI response"""
    risk_level = _extract_risk_level(content)
    risk_scores = {
        "low": 0.2,
        "medium": 0.5,
        "high": 0.8,
        "critical": 0.95
    }
    return risk_scores.get(risk_level, 0.5)

def _extract_identified_risks(content: str) -> List[Dict[str, Any]]:
    """Extract identified risks from AI response"""
    risks = []
    lines = content.split('\n')
    for line in lines:
        if any(keyword in line.lower() for keyword in ['risiko', 'bahaya', 'potensi', 'kemungkinan']):
            risks.append({
                "type": "legal",
                "description": line.strip(),
                "impact": "medium"
            })
    return risks[:5]  # Limit to 5 risks

def _extract_mitigation_strategies(content: str) -> List[str]:
    """Extract mitigation strategies from AI response"""
    strategies = []
    lines = content.split('\n')
    for line in lines:
        if any(keyword in line.lower() for keyword in ['mitigasi', 'solusi', 'rekomendasi', 'penanganan']):
            if len(line.strip()) > 10:  # Filter out short lines
                strategies.append(line.strip())
    return strategies[:5]  # Limit to 5 strategies

def _assess_probability(content: str) -> str:
    """Assess probability from AI response"""
    content_lower = content.lower()
    if any(word in content_lower for word in ['sangat tinggi', 'almost certain', 'hampir pasti']):
        return "very high"
    elif any(word in content_lower for word in ['tinggi', 'likely', 'kemungkinan besar']):
        return "high"
    elif any(word in content_lower for word in ['sedang', 'possible', 'mungkin']):
        return "medium"
    else:
        return "low"

def _extract_summary(content: str) -> str:
    """Extract summary from AI response"""
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if any(keyword in line.lower() for keyword in ['ringkasan', 'summary', 'kesimpulan']):
            # Get the next few lines as summary
            summary_lines = []
            for j in range(i + 1, min(i + 4, len(lines))):
                if lines[j].strip() and not any(keyword in lines[j].lower() for keyword in ['1.', '2.', '3.']):
                    summary_lines.append(lines[j].strip())
                else:
                    break
            if summary_lines:
                return ' '.join(summary_lines)

    # Fallback: first paragraph or first few sentences
    sentences = content.split('.')
    return '.'.join(sentences[:3]) + '.' if len(sentences) > 3 else content[:300]

def _extract_key_findings(content: str) -> List[str]:
    """Extract key findings from AI response"""
    findings = []
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if line and len(line) > 10 and any(keyword in line.lower() for keyword in ['•', '-', '1.', '2.', '3.', 'temuan', 'finding']):
            # Clean up bullet points and numbering
            cleaned = line.lstrip('•-123456789. ')
            if len(cleaned) > 10:  # Filter out very short findings
                findings.append(cleaned)

    return findings[:8]  # Limit to 8 findings

def _extract_recommendations(content: str) -> List[str]:
    """Extract recommendations from AI response"""
    recommendations = []
    lines = content.split('\n')
    in_recommendations = False

    for line in lines:
        line = line.strip()
        if not in_recommendations:
            if any(keyword in line.lower() for keyword in ['rekomendasi', 'recommendation', 'saran']):
                in_recommendations = True
                continue

        if in_recommendations and line and len(line) > 10:
            if any(keyword in line.lower() for keyword in ['1.', '2.', '3.', '•', '-']) or not line[0].isdigit():
                # Clean up formatting
                cleaned = line.lstrip('•-123456789. ')
                if len(cleaned) > 5:  # Filter out very short recommendations
                    recommendations.append(cleaned)

        # Stop if we hit another section
        if in_recommendations and any(keyword in line.lower() for keyword in ['kesimpulan', 'conclusion', 'analisis lengkap']):
            break

    return recommendations[:6]  # Limit to 6 recommendations

@router.get("/health")
async def health_check():
    """Check if document review service is healthy"""
    try:
        # Test Ark AI service
        ark_status = await ark_ai_service.chat_completion(
            messages=[{"role": "user", "content": "Test"}],
            max_tokens=10
        )

        # Test enhanced AI service
        enhanced_status = await enhanced_ai_service.analyze_with_fallback(
            messages=[{"role": "user", "content": "Test"}],
            max_tokens=10
        )

        return {
            "status": "healthy",
            "services": {
                "ark_ai": "operational" if ark_status["success"] else "degraded",
                "enhanced_ai": "operational" if enhanced_status["success"] else "degraded"
            },
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow()
        }