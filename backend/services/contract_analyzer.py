"""
Contract Analysis Service - REAL IMPLEMENTATION
Analyze legal documents and extract key clauses, risks, and compliance issues
"""

from typing import Dict, List, Any, Optional
import re
from datetime import datetime
import PyPDF2
import io
from core.config import get_settings

settings = get_settings()


class ContractAnalyzer:
    """Service to analyze contract documents"""
    
    def __init__(self):
        self.risk_patterns = {
            "high": [
                r"dapat diberhentikan sewaktu-waktu",
                r"tanpa kompensasi",
                r"tidak ada pesangon",
                r"tidak berlaku ketentuan",
                r"dikecualikan dari",
                r"tidak berhak atas",
                r"melepaskan hak",
                r"tidak dapat menuntut",
            ],
            "medium": [
                r"berdasarkan kebijakan perusahaan",
                r"sepenuhnya menjadi wewenang",
                r"dapat diubah sewaktu-waktu",
                r"tidak terbatas pada",
                r"termasuk namun tidak terbatas",
            ],
            "low": [
                r"sesuai peraturan yang berlaku",
                r"mengacu pada undang-undang",
                r"berdasarkan kesepakatan",
            ]
        }
        
        self.compliance_checks = {
            "upah_minimum": r"upah|gaji|kompensasi",
            "jam_kerja": r"jam kerja|waktu kerja|lembur",
            "cuti": r"cuti|izin|libur",
            "pesangon": r"pesangon|kompensasi|pemutusan hubungan kerja",
            "jamsostek": r"jamsostek|bpjs|asuransi",
            "thr": r"thr|tunjangan hari raya",
        }
    
    async def analyze_document(
        self,
        file_content: bytes,
        file_name: str,
        contract_type: str = "employment"
    ) -> Dict[str, Any]:
        """
        Main analysis function
        
        Args:
            file_content: PDF file bytes
            file_name: Name of the file
            contract_type: Type of contract (employment, business, etc)
        
        Returns:
            Analysis results with risks, clauses, and recommendations
        """
        
        # Extract text from PDF
        text = await self._extract_text_from_pdf(file_content)
        
        if not text:
            return {
                "success": False,
                "error": "Could not extract text from document"
            }
        
        # Perform analysis
        risk_analysis = self._analyze_risks(text)
        compliance_check = self._check_compliance(text, contract_type)
        key_clauses = self._extract_key_clauses(text, contract_type)
        recommendations = self._generate_recommendations(
            risk_analysis, 
            compliance_check,
            contract_type
        )
        
        return {
            "success": True,
            "file_name": file_name,
            "contract_type": contract_type,
            "analyzed_at": datetime.utcnow().isoformat(),
            "summary": {
                "total_risks": len(risk_analysis),
                "high_risks": len([r for r in risk_analysis if r["severity"] == "high"]),
                "compliance_issues": len([c for c in compliance_check if not c["compliant"]]),
                "key_clauses_found": len(key_clauses),
            },
            "risk_analysis": risk_analysis,
            "compliance_check": compliance_check,
            "key_clauses": key_clauses,
            "recommendations": recommendations,
            "text_preview": text[:500] + "..." if len(text) > 500 else text,
        }
    
    async def _extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            return text.strip()
        except Exception as e:
            print(f"Error extracting PDF text: {e}")
            return ""
    
    def _analyze_risks(self, text: str) -> List[Dict[str, Any]]:
        """Analyze text for risky clauses"""
        text_lower = text.lower()
        risks = []
        
        for severity, patterns in self.risk_patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text_lower, re.IGNORECASE)
                for match in matches:
                    # Get context around match
                    start = max(0, match.start() - 50)
                    end = min(len(text), match.end() + 50)
                    context = text[start:end].strip()
                    
                    risks.append({
                        "severity": severity,
                        "pattern": pattern,
                        "matched_text": match.group(),
                        "context": context,
                        "position": match.start(),
                        "explanation": self._explain_risk(pattern, severity)
                    })
        
        # Sort by severity and position
        severity_order = {"high": 0, "medium": 1, "low": 2}
        risks.sort(key=lambda x: (severity_order[x["severity"]], x["position"]))
        
        return risks
    
    def _check_compliance(self, text: str, contract_type: str) -> List[Dict[str, Any]]:
        """Check compliance with Indonesian labor laws"""
        text_lower = text.lower()
        compliance_results = []
        
        if contract_type == "employment":
            for requirement, pattern in self.compliance_checks.items():
                found = bool(re.search(pattern, text_lower, re.IGNORECASE))
                
                compliance_results.append({
                    "requirement": requirement,
                    "compliant": found,
                    "description": self._get_compliance_description(requirement),
                    "legal_reference": self._get_legal_reference(requirement),
                    "severity": "high" if not found and requirement in ["pesangon", "upah_minimum"] else "medium"
                })
        
        return compliance_results
    
    def _extract_key_clauses(self, text: str, contract_type: str) -> List[Dict[str, Any]]:
        """Extract key clauses from contract"""
        clauses = []
        
        # Common clause markers
        clause_patterns = [
            r"pasal\s+\d+",
            r"ayat\s+\(\d+\)",
            r"ketentuan\s+\w+",
            r"klausul\s+\w+",
        ]
        
        for pattern in clause_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                start = match.start()
                end = min(len(text), start + 300)
                clause_text = text[start:end].strip()
                
                # Get next period as end
                period_pos = clause_text.find(".")
                if period_pos > 0:
                    clause_text = clause_text[:period_pos + 1]
                
                clauses.append({
                    "type": match.group(),
                    "text": clause_text,
                    "position": start,
                })
        
        return clauses[:10]  # Return top 10
    
    def _generate_recommendations(
        self,
        risks: List[Dict],
        compliance: List[Dict],
        contract_type: str
    ) -> List[Dict[str, str]]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Risk-based recommendations
        high_risks = [r for r in risks if r["severity"] == "high"]
        if high_risks:
            recommendations.append({
                "priority": "high",
                "title": "Klausul Berisiko Tinggi Ditemukan",
                "description": f"Terdapat {len(high_risks)} klausul dengan risiko tinggi yang dapat merugikan Anda.",
                "action": "Negosiasikan ulang klausul-klausul tersebut atau konsultasikan dengan pengacara sebelum menandatangani."
            })
        
        # Compliance recommendations
        non_compliant = [c for c in compliance if not c["compliant"]]
        if non_compliant:
            recommendations.append({
                "priority": "high",
                "title": "Potensi Pelanggaran Hukum Ketenagakerjaan",
                "description": f"Kontrak tidak memenuhi {len(non_compliant)} persyaratan hukum ketenagakerjaan Indonesia.",
                "action": "Minta perusahaan untuk menambahkan klausul yang memenuhi persyaratan UU Ketenagakerjaan."
            })
        
        # General recommendations
        recommendations.append({
            "priority": "medium",
            "title": "Dokumentasi dan Backup",
            "description": "Simpan salinan kontrak yang sudah ditandatangani dan semua komunikasi terkait.",
            "action": "Buat folder khusus untuk menyimpan semua dokumen penting terkait pekerjaan."
        })
        
        return recommendations
    
    def _explain_risk(self, pattern: str, severity: str) -> str:
        """Explain why a pattern is risky"""
        explanations = {
            "dapat diberhentikan sewaktu-waktu": "Klausul ini memberikan hak sepihak kepada perusahaan untuk memberhentikan Anda tanpa proses yang jelas.",
            "tanpa kompensasi": "Anda mungkin kehilangan hak atas pesangon dan kompensasi yang seharusnya Anda terima.",
            "tidak ada pesangon": "Bertentangan dengan UU Ketenagakerjaan yang mewajibkan pesangon untuk PHK.",
            "melepaskan hak": "Anda diminta melepaskan hak-hak yang dilindungi undang-undang.",
        }
        return explanations.get(pattern, f"Klausul ini berpotensi merugikan dengan tingkat risiko {severity}.")
    
    def _get_compliance_description(self, requirement: str) -> str:
        """Get description for compliance requirement"""
        descriptions = {
            "upah_minimum": "Kontrak harus mencantumkan besaran upah yang minimal sesuai UMR/UMP",
            "jam_kerja": "Jam kerja dan aturan lembur harus sesuai UU (max 8 jam/hari, 40 jam/minggu)",
            "cuti": "Hak cuti tahunan minimal 12 hari per tahun",
            "pesangon": "Ketentuan pesangon jika terjadi PHK",
            "jamsostek": "Kewajiban perusahaan mendaftarkan ke BPJS Ketenagakerjaan",
            "thr": "Hak menerima THR minimal 1 bulan gaji",
        }
        return descriptions.get(requirement, "")
    
    def _get_legal_reference(self, requirement: str) -> str:
        """Get legal reference for requirement"""
        references = {
            "upah_minimum": "UU No. 13 Tahun 2003 Pasal 88-98",
            "jam_kerja": "UU No. 13 Tahun 2003 Pasal 77-85",
            "cuti": "UU No. 13 Tahun 2003 Pasal 79",
            "pesangon": "PP No. 35 Tahun 2021",
            "jamsostek": "UU No. 24 Tahun 2011",
            "thr": "Permenaker No. 6 Tahun 2016",
        }
        return references.get(requirement, "")


# Global instance
contract_analyzer = ContractAnalyzer()
