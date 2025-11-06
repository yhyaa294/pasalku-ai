"""
Report Generator Service - REAL IMPLEMENTATION
Generate professional PDF reports from consultation sessions
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import io


class ReportGenerator:
    """Service to generate professional legal consultation reports"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e3a8a'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#3b82f6'),
            spaceAfter=12,
            spaceBefore=20,
            fontName='Helvetica-Bold'
        ))
        
        # Section header
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading3'],
            fontSize=14,
            textColor=colors.HexColor('#6366f1'),
            spaceAfter=10,
            spaceBefore=15,
            fontName='Helvetica-Bold'
        ))
        
        # Body text with justify
        self.styles.add(ParagraphStyle(
            name='BodyJustify',
            parent=self.styles['BodyText'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12,
            leading=16
        ))
    
    async def generate_consultation_report(
        self,
        session_data: Dict[str, Any],
        analysis_results: Dict[str, Any],
        recommendations: List[Dict[str, Any]]
    ) -> bytes:
        """
        Generate comprehensive consultation report
        
        Args:
            session_data: Session information
            analysis_results: Analysis from orchestrator
            recommendations: List of recommendations
        
        Returns:
            PDF file as bytes
        """
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )
        
        story = []
        
        # Title page
        story.extend(self._build_title_page(session_data))
        story.append(PageBreak())
        
        # Executive Summary
        story.extend(self._build_executive_summary(session_data, analysis_results))
        
        # Case Overview
        story.extend(self._build_case_overview(session_data))
        
        # Legal Analysis
        story.extend(self._build_legal_analysis(analysis_results))
        
        # Recommendations
        story.extend(self._build_recommendations(recommendations))
        
        # Action Plan
        story.extend(self._build_action_plan(recommendations))
        
        # Disclaimer
        story.extend(self._build_disclaimer())
        
        # Build PDF
        doc.build(story)
        
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes
    
    def _build_title_page(self, session_data: Dict[str, Any]) -> List:
        """Build report title page"""
        elements = []
        
        # Spacer to center content
        elements.append(Spacer(1, 2 * inch))
        
        # Title
        title = Paragraph(
            "LAPORAN KONSULTASI HUKUM",
            self.styles['CustomTitle']
        )
        elements.append(title)
        elements.append(Spacer(1, 0.5 * inch))
        
        # Report info
        info_data = [
            ["Tanggal Laporan:", datetime.utcnow().strftime("%d %B %Y")],
            ["Nomor Referensi:", session_data.get("session_id", "N/A")[:12]],
            ["Area Hukum:", session_data.get("legal_area", "Umum").title()],
            ["Status:", "RAHASIA"],
        ]
        
        info_table = Table(info_data, colWidths=[2.5*inch, 3*inch])
        info_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        elements.append(info_table)
        elements.append(Spacer(1, 1 * inch))
        
        # Watermark
        watermark = Paragraph(
            "<i>Generated by Pasalku.AI - AI Legal Assistant</i>",
            self.styles['Normal']
        )
        elements.append(watermark)
        
        return elements
    
    def _build_executive_summary(
        self,
        session_data: Dict[str, Any],
        analysis: Dict[str, Any]
    ) -> List:
        """Build executive summary section"""
        elements = []
        
        elements.append(Paragraph("RINGKASAN EKSEKUTIF", self.styles['CustomSubtitle']))
        
        summary_text = f"""
        Laporan ini merangkum hasil konsultasi hukum yang dilakukan pada {datetime.utcnow().strftime("%d %B %Y")} 
        mengenai kasus {session_data.get('legal_area', 'hukum umum')}. Berdasarkan analisis mendalam terhadap 
        fakta-fakta yang tersedia dan peraturan perundang-undangan yang berlaku di Indonesia, kami telah 
        mengidentifikasi beberapa poin kunci dan memberikan rekomendasi strategis untuk tindak lanjut.
        """
        
        elements.append(Paragraph(summary_text, self.styles['BodyJustify']))
        elements.append(Spacer(1, 0.3 * inch))
        
        # Key findings table
        if analysis.get("summary"):
            summary = analysis["summary"]
            findings_data = [
                ["Total Risiko", str(summary.get("total_risks", 0))],
                ["Risiko Tinggi", str(summary.get("high_risks", 0))],
                ["Issue Compliance", str(summary.get("compliance_issues", 0))],
            ]
            
            findings_table = Table(findings_data, colWidths=[3*inch, 2*inch])
            findings_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f3f4f6')),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('ALIGN', (1, 0), (1, -1), 'CENTER'),
                ('PADDING', (0, 0), (-1, -1), 8),
            ]))
            
            elements.append(findings_table)
        
        elements.append(Spacer(1, 0.5 * inch))
        
        return elements
    
    def _build_case_overview(self, session_data: Dict[str, Any]) -> List:
        """Build case overview section"""
        elements = []
        
        elements.append(Paragraph("GAMBARAN KASUS", self.styles['CustomSubtitle']))
        
        # Extract from conversation
        conversation = session_data.get("conversation", [])
        user_messages = [msg for msg in conversation if msg.get("role") == "user"]
        
        if user_messages:
            case_description = user_messages[0].get("content", "")
            elements.append(Paragraph(
                f"<b>Deskripsi Kasus:</b><br/>{case_description}",
                self.styles['BodyJustify']
            ))
        
        elements.append(Spacer(1, 0.3 * inch))
        
        return elements
    
    def _build_legal_analysis(self, analysis: Dict[str, Any]) -> List:
        """Build legal analysis section"""
        elements = []
        
        elements.append(Paragraph("ANALISIS HUKUM", self.styles['CustomSubtitle']))
        
        # Risk analysis
        if analysis.get("risk_analysis"):
            elements.append(Paragraph("Analisis Risiko", self.styles['SectionHeader']))
            
            risks = analysis["risk_analysis"]
            for i, risk in enumerate(risks[:5], 1):  # Top 5 risks
                risk_text = f"""
                <b>{i}. {risk['severity'].upper()}</b><br/>
                Klausul: "{risk['matched_text']}"<br/>
                Penjelasan: {risk['explanation']}
                """
                elements.append(Paragraph(risk_text, self.styles['BodyText']))
                elements.append(Spacer(1, 0.15 * inch))
        
        # Compliance check
        if analysis.get("compliance_check"):
            elements.append(Paragraph("Kepatuhan Hukum", self.styles['SectionHeader']))
            
            compliance_data = [["Persyaratan", "Status", "Referensi Hukum"]]
            
            for comp in analysis["compliance_check"]:
                status = "✓ Memenuhi" if comp["compliant"] else "✗ Tidak Memenuhi"
                compliance_data.append([
                    comp["requirement"].replace("_", " ").title(),
                    status,
                    comp.get("legal_reference", "")
                ])
            
            compliance_table = Table(compliance_data, colWidths=[2*inch, 1.5*inch, 2*inch])
            compliance_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
            ]))
            
            elements.append(compliance_table)
        
        elements.append(Spacer(1, 0.5 * inch))
        
        return elements
    
    def _build_recommendations(self, recommendations: List[Dict[str, Any]]) -> List:
        """Build recommendations section"""
        elements = []
        
        elements.append(Paragraph("REKOMENDASI", self.styles['CustomSubtitle']))
        
        for i, rec in enumerate(recommendations, 1):
            priority_color = {
                "high": "#ef4444",
                "medium": "#f59e0b",
                "low": "#10b981"
            }.get(rec.get("priority", "medium"), "#6b7280")
            
            rec_text = f"""
            <b>{i}. {rec['title']}</b> 
            <font color="{priority_color}">[Prioritas: {rec.get('priority', 'medium').upper()}]</font><br/>
            {rec['description']}<br/>
            <i>Tindakan: {rec['action']}</i>
            """
            
            elements.append(Paragraph(rec_text, self.styles['BodyText']))
            elements.append(Spacer(1, 0.2 * inch))
        
        return elements
    
    def _build_action_plan(self, recommendations: List[Dict[str, Any]]) -> List:
        """Build action plan section"""
        elements = []
        
        elements.append(Paragraph("RENCANA TINDAK LANJUT", self.styles['CustomSubtitle']))
        
        action_data = [["No", "Tindakan", "Timeline", "Status"]]
        
        high_priority = [r for r in recommendations if r.get("priority") == "high"]
        
        for i, rec in enumerate(high_priority, 1):
            action_data.append([
                str(i),
                rec["action"][:50] + "..." if len(rec["action"]) > 50 else rec["action"],
                "Segera",
                "Pending"
            ])
        
        if len(action_data) > 1:
            action_table = Table(action_data, colWidths=[0.5*inch, 3*inch, 1*inch, 1*inch])
            action_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ]))
            
            elements.append(action_table)
        
        elements.append(Spacer(1, 0.5 * inch))
        
        return elements
    
    def _build_disclaimer(self) -> List:
        """Build disclaimer section"""
        elements = []
        
        elements.append(Paragraph("DISCLAIMER", self.styles['SectionHeader']))
        
        disclaimer_text = """
        Laporan ini dibuat berdasarkan informasi yang diberikan dan analisis AI Pasalku.AI. 
        Informasi yang tercantum bersifat umum dan tidak menggantikan nasihat hukum profesional. 
        Untuk kasus yang kompleks atau memerlukan representasi hukum, sangat disarankan untuk 
        berkonsultasi dengan pengacara atau konsultan hukum yang terdaftar. Pasalku.AI tidak 
        bertanggung jawab atas keputusan yang diambil berdasarkan laporan ini.
        """
        
        elements.append(Paragraph(disclaimer_text, self.styles['BodyText']))
        
        return elements


# Global instance
report_generator = ReportGenerator()
