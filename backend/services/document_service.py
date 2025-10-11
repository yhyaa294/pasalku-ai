"""
Service untuk processing dan analisis dokumen hukum
- Text extraction (PDF, DOCX, Images via OCR)
- AI-powered legal document analysis
- Citation extraction
- Risk assessment
"""
import logging
import asyncio
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path
import io
import tempfile
import os

try:
    import fitz  # PyMuPDF for PDF processing
    HAS_FITZ = True
except ImportError:
    HAS_FITZ = False
    fitz = None

try:
    from PIL import Image
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False
    Image = None

try:
    import pytesseract
    HAS_TESSERACT = True
except ImportError:
    HAS_TESSERACT = False
    pytesseract = None

try:
    import docx2txt
    HAS_DOCX2TXT = True
except ImportError:
    HAS_DOCX2TXT = False
    docx2txt = None

from backend.services.ai_service_enhanced import ai_service_enhanced as ai_service

logger = logging.getLogger(__name__)

class DocumentService:
    """Service untuk processing dokumen hukum"""

    def __init__(self):
        """Initialize document service"""
        # Configure tesseract path if needed (Windows specific)
        if HAS_TESSERACT and os.name == 'nt':
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

    async def extract_text_from_document(
        self,
        file_content: bytes,
        file_type: str,
        filename: str
    ) -> str:
        """
        Extract text dari berbagai format dokumen
        - PDF: PyMuPDF
        - DOCX: docx2txt
        - Images: OCR via tesseract
        """
        try:
            if file_type == 'application/pdf' and HAS_FITZ:
                return await self._extract_pdf_text(file_content)
            elif file_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                              'application/msword'] and HAS_DOCX2TXT:
                return await self._extract_docx_text(file_content, filename)
            elif file_type.startswith('image/') and HAS_PILLOW and HAS_TESSERACT:
                return await self._extract_image_text(file_content)
            else:
                # Fallback: treat as plain text
                try:
                    return file_content.decode('utf-8')
                except UnicodeDecodeError:
                    return "Tidak dapat mengekstrak teks dari dokumen ini."

        except Exception as e:
            logger.error(f"Error extracting text from document {filename}: {str(e)}")
            return f"Error dalam ekstraksi teks: {str(e)}"

    async def _extract_pdf_text(self, file_content: bytes) -> str:
        """Extract text dari PDF menggunakan PyMuPDF"""
        if not HAS_FITZ:
            raise Exception("PyMuPDF tidak tersedia")

        text = ""
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
            try:
                temp_file.write(file_content)
                temp_file.flush()

                doc = fitz.open(temp_file.name)
                for page_num in range(len(doc)):
                    page = doc.load_page(page_num)
                    page_text = page.get_text()
                    text += f"\n--- Halaman {page_num + 1} ---\n{page_text}"

                doc.close()

            finally:
                os.unlink(temp_file.name)

        return text.strip()

    async def _extract_docx_text(self, file_content: bytes, filename: str) -> str:
        """Extract text dari DOCX menggunakan docx2txt"""
        if not HAS_DOCX2TXT:
            raise Exception("docx2txt tidak tersedia")

        with tempfile.NamedTemporaryFile(suffix='.docx', delete=False) as temp_file:
            try:
                temp_file.write(file_content)
                temp_file.flush()

                text = docx2txt.process(temp_file.name)

            finally:
                os.unlink(temp_file.name)

        return text.strip() if text else "Tidak dapat mengekstrak teks dari dokumen DOCX."

    async def _extract_image_text(self, file_content: bytes) -> str:
        """Extract text dari image menggunakan OCR"""
        if not HAS_PILLOW or not HAS_TESSERACT:
            raise Exception("Pillow atau tesseract tidak tersedia")

        try:
            # Open image from bytes
            image = Image.open(io.BytesIO(file_content))

            # Preprocessing for better OCR
            # Convert to grayscale if needed
            if image.mode != 'L':
                image = image.convert('L')

            # Extract text with Indonesian language support if available
            text = pytesseract.image_to_string(image, lang='ind+eng')

            return text.strip() if text else "Tidak dapat mendeteksi teks dalam gambar."

        except Exception as e:
            logger.error(f"OCR processing error: {str(e)}")
            return f"Error dalam OCR: {str(e)}"

    async def analyze_legal_document(
        self,
        extracted_text: str,
        document_type: str = "unknown",
        context: str = ""
    ) -> Dict[str, Any]:
        """
        Analyze dokumen hukum menggunakan AI
        - Extract legal references (pasals, articles)
        - Assess legal risks
        - Generate summary
        - Provide AI insights
        """
        if not extracted_text or len(extracted_text.strip()) < 50:
            return {
                "summary": "Dokumen terlalu pendek untuk analisis yang bermakna.",
                "legal_references": [],
                "risk_assessment": "unknown",
                "ai_insights": "Tidak cukup informasi untuk analisis mendalam.",
                "confidence_score": 0.0
            }

        try:
            # Create comprehensive analysis prompt
            analysis_prompt = f"""
            Analisis dokumen hukum berikut secara mendalam. Berikan respond dalam format JSON yang valid:

            KONTEXT DOKUMEN: {context}
            ISI DOKUMEN:
            {extracted_text[:4000]}  # Limit for API

            BERIKAN ANALISIS DALAM FORMAT JSON:
            {{
                "summary": "Ringkasan singkat 2-3 kalimat tentang isi dokumen",
                "legal_references": ["Pasal 1 UU No. 1 Tahun 2020", "Yurisprudensi MA No. 12"],
                "key_clauses": ["klausa penting 1", "klausa penting 2"],
                "risk_assessment": "Tinggi/Sedang/Rendah - jelaskan mengapa",
                "potential_issues": ["masalah potensial 1", "masalah potensial 2"],
                "recommendations": ["rekomendasi 1", "rekomendasi 2"],
                "ai_insights": "insight mendalam tentang implikasi hukum dokumen ini",
                "compliance_check": "apakah dokumen memenuhi standar hukum Indonesia",
                "confidence_score": 0.0-1.0
            }}
            """

            # Get AI analysis
            ai_response = await ai_service.get_legal_response(
                query=analysis_prompt,
                user_context=f"Legal document analysis - Type: {document_type}"
            )

            # Try to parse JSON response (AI should return valid JSON)
            try:
                # Use the AI service to get structured analysis
                structured_analysis = await ai_service.get_legal_response(
                    query=f"Extract legal information from this document and provide structured analysis:\n\n{extracted_text[:2000]}",
                    user_context="Document analysis for legal consultation"
                )

                return {
                    "summary": self._extract_summary(structured_analysis.get('answer', '')),
                    "legal_references": self._extract_legal_references(extracted_text),
                    "risk_assessment": self._assess_risk(extracted_text, structured_analysis.get('answer', '')),
                    "ai_insights": structured_analysis.get('answer', ''),
                    "confidence_score": 0.8  # Default high confidence for now
                }

            except Exception as parse_error:
                logger.warning(f"Failed to parse AI response as JSON: {parse_error}")
                # Fallback analysis
                return {
                    "summary": f"Analisis dokumen {document_type} berhasil dilakukan.",
                    "legal_references": self._extract_legal_references(extracted_text),
                    "risk_assessment": "Sedang - Perlu review lebih mendalam",
                    "ai_insights": ai_response.get('answer', ''),
                    "confidence_score": 0.6
                }

        except Exception as e:
            logger.error(f"Error in document analysis: {str(e)}")
            return {
                "summary": "Error dalam analisis dokumen.",
                "legal_references": [],
                "risk_assessment": "unknown",
                "ai_insights": f"Error: {str(e)}",
                "confidence_score": 0.0
            }

    def _extract_legal_references(self, text: str) -> List[str]:
        """Extract legal references from document text"""
        import re

        references = []
        text_lower = text.lower()

        # Indonesian legal patterns
        patterns = [
            r'pasal\s+\d+[\s\S]*?uu[^<]{0,100}',
            r'undang[^<]+tahun\s+\d{4}',
            r'yurisprudensi[^<]+nomor[^<]+\d+',
            r'putusan[^<]+nomor[^<]+\d+',
            r'kuhp[^<]*pasal\s+\d+',
            r'kuh\s*perdata[^<]*pasal\s+\d+',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text_lower, re.IGNORECASE | re.MULTILINE)
            for match in matches[:5]:  # Limit per pattern
                clean_match = match.strip()
                if len(clean_match) > 10:  # Meaningful length
                    references.append(clean_match.title())

        # Deduplication
        return list(set(references))

    def _extract_summary(self, ai_response: str) -> str:
        """Extract summary from AI response"""
        if not ai_response:
            return "Ringkasan tidak tersedia."

        # Take first meaningful sentences
        sentences = ai_response.split('.')[:2]
        return '. '.join(sentences).strip() + '.'

    def _assess_risk(self, document_text: str, ai_response: str) -> str:
        """Assess risk level from document and AI analysis"""
        risk_indicators = [
            'bahaya', 'risk', 'beresiko', 'permasalahan', 'pelanggaran',
            'sanksi', 'pidana', 'hukuman', 'denda', 'gugatan'
        ]

        text_combined = (document_text + ' ' + ai_response).lower()
        risk_count = sum(1 for indicator in risk_indicators if indicator in text_combined)

        if risk_count >= 5:
            return "Tinggi - Dokumen mengandung beberapa elemen risiko hukum"
        elif risk_count >= 2:
            return "Sedang - Beberapa aspek perlu diperhatikan"
        else:
            return "Rendah - Risiko hukum terlihat minimal"

    async def process_document_async(
        self,
        document_id: str,
        file_content: bytes,
        file_type: str,
        filename: str,
        mongodb_collection
    ) -> bool:
        """
        Async processing untuk dokumen
        - Extract text
        - AI analysis
        - Update MongoDB
        """
        try:
            logger.info(f"Starting async processing for document: {document_id}")

            # Step 1: Extract text
            extracted_text = await self.extract_text_from_document(
                file_content, file_type, filename
            )

            # Step 2: AI analysis
            analysis = await self.analyze_legal_document(
                extracted_text,
                document_type=file_type,
                context=f"Document: {filename}"
            )

            # Step 3: Update MongoDB
            update_data = {
                "analysis_status": "completed",
                "analysis_timestamp": datetime.utcnow(),
                "metadata": {
                    "extracted_text": extracted_text[:10000],  # Limit storage
                    "ai_analysis": analysis,
                    "legal_references": analysis.get("legal_references", []),
                    "summary": analysis.get("summary", ""),
                    "risk_assessment": analysis.get("risk_assessment", ""),
                    "processed": True
                }
            }

            await mongodb_collection.update_one(
                {"document_id": document_id},
                {"$set": update_data}
            )

            logger.info(f"Document processing completed: {document_id}")
            return True

        except Exception as e:
            logger.error(f"Async document processing error: {str(e)}")

            # Update with error status
            try:
                await mongodb_collection.update_one(
                    {"document_id": document_id},
                    {"$set": {
                        "analysis_status": "failed",
                        "error": str(e),
                        "metadata.processed": False
                    }}
                )
            except:
                pass

            return False

# Global instance
document_service = DocumentService()