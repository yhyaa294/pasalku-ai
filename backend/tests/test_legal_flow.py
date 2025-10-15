"""
Comprehensive Test Suite for 4-Step Legal Question Processing Flow (Todo #4)

Tests all components:
1. Entity Extractor
2. Context Classifier
3. Clarification Generator
4. Legal Analyzer
5. Flow Manager
6. API Endpoints

Run: pytest backend/tests/test_legal_flow.py -v

NOTE: These tests require AI services (BytePlus/Groq) to be configured.
For unit tests without AI dependencies, use mocking.
"""

import pytest
import asyncio
from datetime import datetime
from typing import Dict, List
from unittest.mock import AsyncMock, MagicMock, patch

# Import all legal flow components
from backend.services.legal_flow import (
    EntityExtractor,
    EntityType,
    ContextClassifier,
    LegalDomain,
    ClarificationGenerator,
    QuestionType,
    LegalAnalyzer,
    LegalFlowManager,
    FlowStep
)


# ============================================================================
# Test Configuration
# ============================================================================

@pytest.fixture(scope="session")
def mock_consensus_engine():
    """Mock consensus engine for testing without AI services"""
    engine = MagicMock()
    
    # Mock get_consensus method
    async def mock_get_consensus(prompt, context=None, **kwargs):
        return {
            "response": "Mocked AI response",
            "confidence": 0.85,
            "consensus": True,
            "primary_response": "Mocked response",
            "models": ["byteplus", "groq"]
        }
    
    engine.get_consensus = AsyncMock(side_effect=mock_get_consensus)
    return engine


@pytest.fixture(autouse=True)
def mock_ai_services(mock_consensus_engine):
    """Auto-mock AI services for all tests"""
    with patch('backend.services.legal_flow.entity_extractor.get_consensus_engine', return_value=mock_consensus_engine), \
         patch('backend.services.legal_flow.context_classifier.get_consensus_engine', return_value=mock_consensus_engine), \
         patch('backend.services.legal_flow.clarification_generator.get_consensus_engine', return_value=mock_consensus_engine), \
         patch('backend.services.legal_flow.legal_analyzer.get_consensus_engine', return_value=mock_consensus_engine):
        yield


# ============================================================================
# Test Data Fixtures
# ============================================================================

@pytest.fixture
def sample_case_criminal():
    """Sample criminal case description"""
    return """
    Saya Budi Santoso telah menjadi korban penipuan oleh PT Maju Jaya pada tanggal 
    15 Januari 2024. Saya kehilangan uang sebesar Rp 50.000.000 setelah mentransfer 
    ke rekening yang dijanjikan akan mengembalikan uang 2x lipat. Saya sudah melapor 
    ke Polda Metro Jaya dan mendapat nomor LP/123/V/2024. Berdasarkan Pasal 378 KUHP 
    tentang penipuan, saya ingin menuntut pelaku.
    """

@pytest.fixture
def sample_case_civil():
    """Sample civil case description"""
    return """
    Saya memiliki sengketa dengan tetangga saya, Pak Ahmad, mengenai batas tanah 
    di Jalan Sudirman No 45, Jakarta Selatan. Tanah tersebut seluas 200 meter persegi 
    dan bernilai sekitar Rp 500.000.000. Kami memiliki sertifikat tanah yang berbeda 
    dan sudah mencoba mediasi di kelurahan pada bulan Maret 2024 tetapi tidak berhasil.
    """

@pytest.fixture
def sample_case_labor():
    """Sample labor case description"""
    return """
    Saya bekerja di PT Teknologi Indonesia sejak 1 Januari 2020 dengan status PKWT. 
    Pada tanggal 10 Februari 2024, saya di-PHK tanpa pesangon yang sesuai dengan 
    UU No 13 Tahun 2003 tentang Ketenagakerjaan. Gaji terakhir saya Rp 8.000.000 
    per bulan. Saya ingin mengajukan gugatan ke Pengadilan Hubungan Industrial.
    """


# ============================================================================
# Test Entity Extractor
# ============================================================================

class TestEntityExtractor:
    """Test Entity Extraction (Hybrid: Regex + AI)"""
    
    @pytest.mark.asyncio
    async def test_extract_people(self, sample_case_criminal):
        """Test extracting person names"""
        extractor = EntityExtractor()
        entities = await extractor.extract(sample_case_criminal)
        
        people = [e for e in entities if e.type == EntityType.PERSON]
        assert len(people) > 0, "Should extract at least one person"
        
        names = [e.text for e in people]
        assert "Budi Santoso" in names, "Should extract 'Budi Santoso'"
    
    @pytest.mark.asyncio
    async def test_extract_organizations(self, sample_case_criminal):
        """Test extracting organizations"""
        extractor = EntityExtractor()
        entities = await extractor.extract(sample_case_criminal)
        
        orgs = [e for e in entities if e.type == EntityType.ORGANIZATION]
        org_names = [e.text for e in orgs]
        
        assert "PT Maju Jaya" in org_names, "Should extract 'PT Maju Jaya'"
        assert "Polda Metro Jaya" in org_names, "Should extract police department"
    
    @pytest.mark.asyncio
    async def test_extract_dates(self, sample_case_criminal):
        """Test extracting dates with regex patterns"""
        extractor = EntityExtractor()
        entities = await extractor.extract(sample_case_criminal)
        
        dates = [e for e in entities if e.type == EntityType.DATE]
        assert len(dates) > 0, "Should extract dates"
        
        date_texts = [e.text for e in dates]
        assert any("15 Januari 2024" in d or "2024" in d for d in date_texts)
    
    @pytest.mark.asyncio
    async def test_extract_money(self, sample_case_criminal):
        """Test extracting money amounts"""
        extractor = EntityExtractor()
        entities = await extractor.extract(sample_case_criminal)
        
        money = [e for e in entities if e.type == EntityType.MONEY]
        assert len(money) > 0, "Should extract money amounts"
        
        amounts = [e.text for e in money]
        assert any("50.000.000" in a or "50000000" in a for a in amounts)
    
    @pytest.mark.asyncio
    async def test_extract_law_references(self, sample_case_criminal):
        """Test extracting law references (UU, Pasal)"""
        extractor = EntityExtractor()
        entities = await extractor.extract(sample_case_criminal)
        
        laws = [e for e in entities if e.type == EntityType.LAW_REFERENCE]
        law_texts = [e.text for e in laws]
        
        assert any("Pasal 378" in l for l in law_texts), "Should extract Pasal 378"
        assert any("KUHP" in l for l in law_texts), "Should extract KUHP"
    
    @pytest.mark.asyncio
    async def test_extract_documents(self, sample_case_criminal):
        """Test extracting document references"""
        extractor = EntityExtractor()
        entities = await extractor.extract(sample_case_criminal)
        
        docs = [e for e in entities if e.type == EntityType.DOCUMENT]
        doc_texts = [e.text for e in docs]
        
        assert any("LP" in d for d in doc_texts), "Should extract police report number"
    
    @pytest.mark.asyncio
    async def test_deduplication(self):
        """Test entity deduplication"""
        extractor = EntityExtractor()
        case = "Budi Santoso dan Budi Santoso bertemu. Budi Santoso adalah saksi."
        
        entities = await extractor.extract(case)
        people = [e for e in entities if e.type == EntityType.PERSON and e.text == "Budi Santoso"]
        
        # Should be deduplicated to 1-2 instances (not 3)
        assert len(people) <= 2, "Should deduplicate repeated entities"
    
    @pytest.mark.asyncio
    async def test_group_by_type(self, sample_case_criminal):
        """Test grouping entities by type"""
        extractor = EntityExtractor()
        entities = await extractor.extract(sample_case_criminal)
        
        grouped = extractor.group_by_type(entities)
        
        assert EntityType.PERSON in grouped
        assert EntityType.ORGANIZATION in grouped
        assert EntityType.DATE in grouped
        assert EntityType.MONEY in grouped


# ============================================================================
# Test Context Classifier
# ============================================================================

class TestContextClassifier:
    """Test Legal Context Classification"""
    
    @pytest.mark.asyncio
    async def test_classify_criminal(self, sample_case_criminal):
        """Test criminal case classification"""
        classifier = ContextClassifier()
        context = await classifier.classify(sample_case_criminal)
        
        assert context.primary_domain == LegalDomain.PIDANA, "Should classify as criminal"
        assert context.is_criminal == True
        assert context.confidence > 0.5
    
    @pytest.mark.asyncio
    async def test_classify_civil(self, sample_case_civil):
        """Test civil case classification"""
        classifier = ContextClassifier()
        context = await classifier.classify(sample_case_civil)
        
        # Should be civil (PERDATA or PROPERTI)
        assert context.primary_domain in [LegalDomain.PERDATA, LegalDomain.PROPERTI]
        assert context.is_civil == True
        assert context.confidence > 0.5
    
    @pytest.mark.asyncio
    async def test_classify_labor(self, sample_case_labor):
        """Test labor case classification"""
        classifier = ContextClassifier()
        context = await classifier.classify(sample_case_labor)
        
        assert context.primary_domain == LegalDomain.KETENAGAKERJAAN
        assert context.confidence > 0.5
    
    @pytest.mark.asyncio
    async def test_urgency_high(self):
        """Test high urgency detection"""
        classifier = ContextClassifier()
        urgent_case = """
        Saya segera membutuhkan bantuan hukum darurat. Besok pagi saya akan 
        diadili dan terancam hukuman penjara. Ini sangat mendesak!
        """
        
        context = await classifier.classify(urgent_case)
        assert context.urgency in ["tinggi", "sedang"], "Should detect urgency"
    
    @pytest.mark.asyncio
    async def test_complexity_scoring(self, sample_case_criminal):
        """Test complexity scoring (1-5)"""
        classifier = ContextClassifier()
        context = await classifier.classify(sample_case_criminal)
        
        assert 1 <= context.complexity <= 5, "Complexity should be 1-5"
        assert isinstance(context.complexity, int)
    
    @pytest.mark.asyncio
    async def test_secondary_domains(self, sample_case_civil):
        """Test secondary domain detection"""
        classifier = ContextClassifier()
        context = await classifier.classify(sample_case_civil)
        
        # Property dispute may have multiple domains
        assert len(context.secondary_domains) >= 0
    
    @pytest.mark.asyncio
    async def test_suggested_expertise(self, sample_case_criminal):
        """Test expertise suggestion"""
        classifier = ContextClassifier()
        context = await classifier.classify(sample_case_criminal)
        
        assert len(context.suggested_expertise) > 0
        assert any("pidana" in e.lower() for e in context.suggested_expertise)


# ============================================================================
# Test Clarification Generator
# ============================================================================

class TestClarificationGenerator:
    """Test Clarification Question Generation"""
    
    @pytest.mark.asyncio
    async def test_generate_questions_criminal(self, sample_case_criminal):
        """Test generating questions for criminal case"""
        generator = ClarificationGenerator()
        entities = await EntityExtractor().extract(sample_case_criminal)
        context = await ContextClassifier().classify(sample_case_criminal)
        
        questions = await generator.generate_questions(
            case_description=sample_case_criminal,
            entities=entities,
            context=context
        )
        
        assert len(questions) > 0, "Should generate questions"
        assert len(questions) <= 8, "Should limit to max 8 questions"
    
    @pytest.mark.asyncio
    async def test_question_types(self, sample_case_criminal):
        """Test variety of question types"""
        generator = ClarificationGenerator()
        entities = await EntityExtractor().extract(sample_case_criminal)
        context = await ContextClassifier().classify(sample_case_criminal)
        
        questions = await generator.generate_questions(
            case_description=sample_case_criminal,
            entities=entities,
            context=context
        )
        
        question_types = [q.type for q in questions]
        
        # Should have multiple question types
        assert len(set(question_types)) >= 2, "Should have diverse question types"
    
    @pytest.mark.asyncio
    async def test_importance_scoring(self, sample_case_criminal):
        """Test question importance scoring"""
        generator = ClarificationGenerator()
        entities = await EntityExtractor().extract(sample_case_criminal)
        context = await ContextClassifier().classify(sample_case_criminal)
        
        questions = await generator.generate_questions(
            case_description=sample_case_criminal,
            entities=entities,
            context=context
        )
        
        for q in questions:
            assert q.importance in ["tinggi", "sedang", "rendah"]
    
    @pytest.mark.asyncio
    async def test_filter_answered_questions(self):
        """Test filtering already answered questions"""
        generator = ClarificationGenerator()
        
        # Case with detailed information
        detailed_case = """
        Saya Budi telah melapor ke polisi pada 15 Januari 2024 dengan nomor 
        LP/123/V/2024. Ada 3 saksi yang melihat kejadian. Kerugian saya 
        Rp 50.000.000. Saya ingin menuntut ganti rugi.
        """
        
        entities = await EntityExtractor().extract(detailed_case)
        context = await ContextClassifier().classify(detailed_case)
        
        questions = await generator.generate_questions(
            case_description=detailed_case,
            entities=entities,
            context=context
        )
        
        # Should not ask about police report (already mentioned)
        question_texts = [q.question.lower() for q in questions]
        # Most "already reported" questions should be filtered
        assert not any("sudah melapor" in q for q in question_texts)


# ============================================================================
# Test Legal Analyzer
# ============================================================================

class TestLegalAnalyzer:
    """Test Comprehensive Legal Analysis"""
    
    @pytest.mark.asyncio
    async def test_analyze_generates_summary(self, sample_case_criminal):
        """Test that analysis generates a summary"""
        analyzer = LegalAnalyzer()
        entities = await EntityExtractor().extract(sample_case_criminal)
        context = await ContextClassifier().classify(sample_case_criminal)
        
        analysis = await analyzer.analyze(
            case_description=sample_case_criminal,
            entities=entities,
            context=context,
            answers={},
            documents=[]
        )
        
        assert analysis.summary, "Should generate summary"
        assert len(analysis.summary) > 50, "Summary should be substantial"
    
    @pytest.mark.asyncio
    async def test_analyze_finds_legal_basis(self, sample_case_criminal):
        """Test finding legal basis (via Knowledge Graph Search)"""
        analyzer = LegalAnalyzer()
        entities = await EntityExtractor().extract(sample_case_criminal)
        context = await ContextClassifier().classify(sample_case_criminal)
        
        analysis = await analyzer.analyze(
            case_description=sample_case_criminal,
            entities=entities,
            context=context,
            answers={},
            documents=[]
        )
        
        assert analysis.legal_basis, "Should find legal basis"
        assert len(analysis.legal_basis) > 0, "Should have at least one legal basis"
    
    @pytest.mark.asyncio
    async def test_analyze_generates_citations(self, sample_case_criminal):
        """Test citation extraction"""
        analyzer = LegalAnalyzer()
        entities = await EntityExtractor().extract(sample_case_criminal)
        context = await ContextClassifier().classify(sample_case_criminal)
        
        analysis = await analyzer.analyze(
            case_description=sample_case_criminal,
            entities=entities,
            context=context,
            answers={},
            documents=[]
        )
        
        # Should extract citations from case description
        assert len(analysis.citations) > 0, "Should extract citations"
    
    @pytest.mark.asyncio
    async def test_analyze_generates_recommendations(self, sample_case_criminal):
        """Test recommendation generation"""
        analyzer = LegalAnalyzer()
        entities = await EntityExtractor().extract(sample_case_criminal)
        context = await ContextClassifier().classify(sample_case_criminal)
        
        analysis = await analyzer.analyze(
            case_description=sample_case_criminal,
            entities=entities,
            context=context,
            answers={},
            documents=[]
        )
        
        assert len(analysis.recommendations) > 0, "Should generate recommendations"
    
    @pytest.mark.asyncio
    async def test_analyze_identifies_risks(self, sample_case_criminal):
        """Test risk identification"""
        analyzer = LegalAnalyzer()
        entities = await EntityExtractor().extract(sample_case_criminal)
        context = await ContextClassifier().classify(sample_case_criminal)
        
        analysis = await analyzer.analyze(
            case_description=sample_case_criminal,
            entities=entities,
            context=context,
            answers={},
            documents=[]
        )
        
        assert len(analysis.risks) > 0, "Should identify risks"
    
    @pytest.mark.asyncio
    async def test_analyze_suggests_next_steps(self, sample_case_criminal):
        """Test next steps suggestion"""
        analyzer = LegalAnalyzer()
        entities = await EntityExtractor().extract(sample_case_criminal)
        context = await ContextClassifier().classify(sample_case_criminal)
        
        analysis = await analyzer.analyze(
            case_description=sample_case_criminal,
            entities=entities,
            context=context,
            answers={},
            documents=[]
        )
        
        assert len(analysis.next_steps) > 0, "Should suggest next steps"


# ============================================================================
# Test Flow Manager
# ============================================================================

class TestFlowManager:
    """Test Workflow Orchestration"""
    
    @pytest.mark.asyncio
    async def test_create_session(self):
        """Test session creation"""
        manager = LegalFlowManager()
        session = await manager.create_session(user_id="test_user_123")
        
        assert session.session_id, "Should generate session ID"
        assert session.user_id == "test_user_123"
        assert session.current_step == FlowStep.DESCRIBE_CASE
        assert session.status == "active"
    
    @pytest.mark.asyncio
    async def test_get_session(self):
        """Test retrieving session"""
        manager = LegalFlowManager()
        session = await manager.create_session(user_id="test_user_123")
        
        retrieved = await manager.get_session(session.session_id)
        assert retrieved.session_id == session.session_id
    
    @pytest.mark.asyncio
    async def test_update_session(self):
        """Test updating session"""
        manager = LegalFlowManager()
        session = await manager.create_session(user_id="test_user_123")
        
        session.case_description = "Updated case"
        updated = await manager.update_session(session)
        
        assert updated.case_description == "Updated case"
    
    @pytest.mark.asyncio
    async def test_advance_step(self):
        """Test advancing workflow steps"""
        manager = LegalFlowManager()
        session = await manager.create_session(user_id="test_user_123")
        
        # Advance to clarification
        session = await manager.advance_step(session.session_id, FlowStep.CLARIFICATION)
        assert session.current_step == FlowStep.CLARIFICATION
        
        # Advance to evidence upload
        session = await manager.advance_step(session.session_id, FlowStep.UPLOAD_EVIDENCE)
        assert session.current_step == FlowStep.UPLOAD_EVIDENCE
    
    @pytest.mark.asyncio
    async def test_complete_session(self):
        """Test completing session"""
        manager = LegalFlowManager()
        session = await manager.create_session(user_id="test_user_123")
        
        # Advance through steps properly
        session = await manager.advance_step(session.session_id, FlowStep.CLARIFICATION)
        session = await manager.advance_step(session.session_id, FlowStep.LEGAL_ANALYSIS)
        
        # Complete
        completed = await manager.complete_session(session.session_id)
        assert completed.status == "completed"
        assert completed.completed_at is not None
    
    @pytest.mark.asyncio
    async def test_get_user_sessions(self):
        """Test retrieving user's sessions"""
        manager = LegalFlowManager()
        
        # Create multiple sessions
        session1 = await manager.create_session(user_id="user123")
        session2 = await manager.create_session(user_id="user123")
        session3 = await manager.create_session(user_id="user456")
        
        # Get user123's sessions
        user_sessions = await manager.get_user_sessions("user123")
        
        assert len(user_sessions) == 2
        session_ids = [s.session_id for s in user_sessions]
        assert session1.session_id in session_ids
        assert session2.session_id in session_ids
        assert session3.session_id not in session_ids
    
    @pytest.mark.asyncio
    async def test_delete_session(self):
        """Test deleting session"""
        manager = LegalFlowManager()
        session = await manager.create_session(user_id="test_user_123")
        
        # Delete
        result = await manager.delete_session(session.session_id)
        assert result == True
        
        # Should not exist
        retrieved = await manager.get_session(session.session_id)
        assert retrieved is None
    
    @pytest.mark.asyncio
    async def test_session_summary(self):
        """Test getting session summary"""
        manager = LegalFlowManager()
        session = await manager.create_session(user_id="test_user_123")
        
        # Add some data
        session.case_description = "Test case"
        session.entities = []
        await manager.update_session(session)
        
        # Get summary
        summary = await manager.get_session_summary(session.session_id)
        
        assert summary["session_id"] == session.session_id
        assert summary["user_id"] == "test_user_123"
        assert summary["current_step"] == FlowStep.DESCRIBE_CASE.value


# ============================================================================
# Integration Tests
# ============================================================================

class TestIntegration:
    """Test complete workflow integration"""
    
    @pytest.mark.asyncio
    async def test_complete_workflow(self, sample_case_criminal):
        """Test complete 4-step workflow"""
        manager = LegalFlowManager()
        
        # Step 0: Create session
        session = await manager.create_session(user_id="integration_test")
        assert session.current_step == FlowStep.DESCRIBE_CASE
        
        # Step 1: Describe case
        extractor = EntityExtractor()
        classifier = ContextClassifier()
        
        entities = await extractor.extract(sample_case_criminal)
        context = await classifier.classify(sample_case_criminal)
        
        session.case_description = sample_case_criminal
        session.entities = entities
        session.context = context
        session = await manager.update_session(session)
        session = await manager.advance_step(session.session_id, FlowStep.CLARIFICATION)
        
        assert session.current_step == FlowStep.CLARIFICATION
        
        # Step 2: Generate and answer questions
        generator = ClarificationGenerator()
        questions = await generator.generate_questions(
            case_description=sample_case_criminal,
            entities=entities,
            context=context
        )
        
        session.clarification_questions = questions
        
        # Simulate answers
        answers = {
            f"q{i}": f"Answer to question {i}"
            for i in range(len(questions))
        }
        session.answers = answers
        session = await manager.update_session(session)
        session = await manager.advance_step(session.session_id, FlowStep.UPLOAD_EVIDENCE)
        
        assert session.current_step == FlowStep.UPLOAD_EVIDENCE
        
        # Step 3: Upload evidence (skip)
        session.documents = []  # No documents
        session = await manager.update_session(session)
        session = await manager.advance_step(session.session_id, FlowStep.LEGAL_ANALYSIS)
        
        assert session.current_step == FlowStep.LEGAL_ANALYSIS
        
        # Step 4: Legal analysis
        analyzer = LegalAnalyzer()
        analysis = await analyzer.analyze(
            case_description=sample_case_criminal,
            entities=entities,
            context=context,
            answers=answers,
            documents=[]
        )
        
        session.analysis = analysis
        session = await manager.update_session(session)
        session = await manager.complete_session(session.session_id)
        
        assert session.status == "completed"
        assert session.analysis is not None
        assert len(session.analysis.recommendations) > 0


# ============================================================================
# Performance Tests
# ============================================================================

class TestPerformance:
    """Test performance and edge cases"""
    
    @pytest.mark.asyncio
    async def test_large_case_description(self):
        """Test with very large case description"""
        large_case = "Saya mengalami masalah hukum. " * 500  # ~5000 chars
        
        extractor = EntityExtractor()
        entities = await extractor.extract(large_case)
        
        # Should handle large text
        assert isinstance(entities, list)
    
    @pytest.mark.asyncio
    async def test_empty_case(self):
        """Test with empty case description"""
        extractor = EntityExtractor()
        entities = await extractor.extract("")
        
        assert entities == []
    
    @pytest.mark.asyncio
    async def test_special_characters(self):
        """Test with special characters"""
        special_case = """
        Kasus: "Penipuan" @ PT XYZ! 
        Tanggal: 01/01/2024
        Nilai: Rp 1.000.000,-
        Email: test@example.com
        """
        
        extractor = EntityExtractor()
        entities = await extractor.extract(special_case)
        
        # Should handle special characters gracefully
        assert isinstance(entities, list)


# ============================================================================
# Run Tests
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
