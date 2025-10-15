"""
Test Suite for Prediction System

Comprehensive tests untuk semua komponen prediction system.
"""

import pytest
import asyncio
from datetime import datetime

from backend.services.prediction import (
    get_case_analyzer,
    get_precedent_finder,
    get_outcome_predictor,
    get_explanation_generator,
    CaseType,
    CaseCategory,
    CourtLevel,
    OutcomeType,
    ExplanationStyle
)


# ============================================================================
# Test Data
# ============================================================================

SAMPLE_CASE_PERDATA = """
Gugatan Perdata Nomor 123/Pdt/2024/PN.Jkt

PENGGUGAT: PT ABC Indonesia
TERGUGAT: PT XYZ Corporation

Berdasarkan UU No. 13 Tahun 2003 tentang Ketenagakerjaan dan berdasarkan
Pasal 1365 KUHPerdata tentang Perbuatan Melawan Hukum, Penggugat mengajukan
gugatan wanprestasi atas kontrak kerja sama tertanggal 1 Januari 2023.

Tergugat telah melakukan wanprestasi dengan tidak membayar kewajiban sebesar
Rp 500.000.000 (lima ratus juta rupiah).

Penggugat mengajukan bukti berupa:
1. Surat Perjanjian Kerjasama
2. Invoice yang belum dibayar
3. Surat Peringatan 1, 2, dan 3
4. Bukti komunikasi email dan WhatsApp

Saksi:
1. Budi Santoso, Direktur PT ABC
2. Siti Aminah, Manajer Keuangan
3. Ahmad Yani, Saksi transaksi

Para pihak telah melakukan mediasi pada tanggal 15 Maret 2024 namun tidak
mencapai kesepakatan.
"""

SAMPLE_CASE_PIDANA = """
Putusan Pidana Nomor 456/Pid/2024/PN.Bdg

JAKSA PENUNTUT UMUM
TERDAKWA: Joni Susanto

Terdakwa didakwa melanggar Pasal 378 KUHP tentang Penipuan.

Pada tanggal 10 Februari 2024, Terdakwa telah menipu korban dengan modus
investasi bodong senilai Rp 200.000.000.

Hakim: H. Bambang Sutopo, S.H., M.H.

Terdakwa dihadirkan dengan saksi ahli psikologi forensik.
"""


# ============================================================================
# Test Case Analyzer
# ============================================================================

class TestCaseAnalyzer:
    """Test Case Analyzer functionality"""
    
    @pytest.fixture
    def analyzer(self):
        return get_case_analyzer()
    
    @pytest.mark.asyncio
    async def test_analyze_perdata_case(self, analyzer):
        """Test analysis of civil case"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        assert features is not None
        assert features.case_type == CaseType.PERDATA
        assert features.text_length > 0
        assert len(features.parties) > 0
        assert features.confidence > 0
    
    @pytest.mark.asyncio
    async def test_analyze_pidana_case(self, analyzer):
        """Test analysis of criminal case"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PIDANA)
        
        assert features is not None
        assert features.case_type == CaseType.PIDANA
        assert features.case_category in [CaseCategory.PENIPUAN, CaseCategory.LAINNYA]
    
    @pytest.mark.asyncio
    async def test_extract_legal_bases(self, analyzer):
        """Test extraction of legal bases"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        # Should detect UU 13/2003 and Pasal 1365
        assert len(features.legal_bases) > 0
        assert len(features.primary_laws) > 0
    
    @pytest.mark.asyncio
    async def test_extract_parties(self, analyzer):
        """Test party extraction"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        assert features.plaintiff_count > 0 or features.defendant_count > 0
        assert len(features.parties) > 0
    
    @pytest.mark.asyncio
    async def test_extract_claim_amount(self, analyzer):
        """Test claim amount extraction"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        # Should extract Rp 500.000.000
        assert features.claim_amount is not None
        assert features.claim_amount > 0
    
    @pytest.mark.asyncio
    async def test_detect_mediation(self, analyzer):
        """Test mediation detection"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        assert features.has_mediation == True
    
    @pytest.mark.asyncio
    async def test_detect_expert_witness(self, analyzer):
        """Test expert witness detection"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PIDANA)
        
        assert features.has_expert_witness == True


# ============================================================================
# Test Precedent Finder
# ============================================================================

class TestPrecedentFinder:
    """Test Precedent Finder functionality"""
    
    @pytest.fixture
    def finder(self):
        return get_precedent_finder()
    
    @pytest.fixture
    def analyzer(self):
        return get_case_analyzer()
    
    @pytest.mark.asyncio
    async def test_find_similar_cases(self, finder, analyzer):
        """Test finding similar cases"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        similar_cases = await finder.find_similar_cases(
            case_features=features,
            limit=10
        )
        
        # Should find at least some mock cases
        assert isinstance(similar_cases, list)
        # May be empty if database not populated, which is ok for test
    
    @pytest.mark.asyncio
    async def test_similarity_calculation(self, finder, analyzer):
        """Test similarity scoring"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        similar_cases = await finder.find_similar_cases(
            case_features=features,
            limit=5,
            min_similarity=0.0  # Accept all to test scoring
        )
        
        for case in similar_cases:
            assert 0.0 <= case.overall_similarity <= 1.0
            assert hasattr(case, 'type_similarity')
            assert hasattr(case, 'legal_similarity')
    
    @pytest.mark.asyncio
    async def test_find_by_outcome(self, finder, analyzer):
        """Test finding cases with specific outcome"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        won_cases = await finder.find_by_outcome(
            case_features=features,
            desired_outcome="won",
            limit=5
        )
        
        assert isinstance(won_cases, list)


# ============================================================================
# Test Outcome Predictor
# ============================================================================

class TestOutcomePredictor:
    """Test Outcome Predictor functionality"""
    
    @pytest.fixture
    def predictor(self):
        return get_outcome_predictor()
    
    @pytest.fixture
    def analyzer(self):
        return get_case_analyzer()
    
    @pytest.mark.asyncio
    async def test_predict_outcome(self, predictor, analyzer):
        """Test outcome prediction"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        prediction = await predictor.predict_outcome(features)
        
        assert prediction is not None
        assert prediction.predicted_outcome in OutcomeType
        assert 0.0 <= prediction.probability <= 1.0
        assert 0.0 <= prediction.confidence_factors.get("overall", 0) <= 1.0
    
    @pytest.mark.asyncio
    async def test_outcome_probabilities(self, predictor, analyzer):
        """Test outcome probability distribution"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        prediction = await predictor.predict_outcome(features)
        
        assert len(prediction.outcome_probabilities) > 0
        
        # Sum of probabilities should be ~1.0
        total_prob = sum(op.probability for op in prediction.outcome_probabilities)
        assert 0.9 <= total_prob <= 1.1  # Allow small floating point error
    
    @pytest.mark.asyncio
    async def test_confidence_factors(self, predictor, analyzer):
        """Test confidence calculation"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        prediction = await predictor.predict_outcome(features)
        
        assert "overall" in prediction.confidence_factors
        assert "similar_cases" in prediction.confidence_factors
        assert "feature_completeness" in prediction.confidence_factors
    
    @pytest.mark.asyncio
    async def test_factors_identification(self, predictor, analyzer):
        """Test factor identification"""
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        prediction = await predictor.predict_outcome(features)
        
        # Should have at least some factors identified
        total_factors = (
            len(prediction.positive_factors) +
            len(prediction.negative_factors) +
            len(prediction.neutral_factors)
        )
        assert total_factors > 0


# ============================================================================
# Test Explanation Generator
# ============================================================================

class TestExplanationGenerator:
    """Test Explanation Generator functionality"""
    
    @pytest.fixture
    def generator(self):
        return get_explanation_generator()
    
    @pytest.fixture
    async def sample_prediction(self):
        """Generate sample prediction for testing"""
        analyzer = get_case_analyzer()
        predictor = get_outcome_predictor()
        
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        prediction = await predictor.predict_outcome(features)
        
        return prediction
    
    @pytest.mark.asyncio
    async def test_generate_simple_explanation(self, generator, sample_prediction):
        """Test simple explanation generation"""
        explanation = await generator.generate_explanation(
            prediction=sample_prediction,
            style=ExplanationStyle.SIMPLE,
            language="id"
        )
        
        assert explanation is not None
        assert len(explanation.summary) > 0
        assert len(explanation.detailed_explanation) > 0
    
    @pytest.mark.asyncio
    async def test_generate_detailed_explanation(self, generator, sample_prediction):
        """Test detailed explanation generation"""
        explanation = await generator.generate_explanation(
            prediction=sample_prediction,
            style=ExplanationStyle.DETAILED,
            language="id"
        )
        
        assert len(explanation.detailed_explanation) > len(explanation.summary)
        assert len(explanation.key_points) > 0
    
    @pytest.mark.asyncio
    async def test_generate_legal_explanation(self, generator, sample_prediction):
        """Test legal style explanation"""
        explanation = await generator.generate_explanation(
            prediction=sample_prediction,
            style=ExplanationStyle.LEGAL,
            language="id"
        )
        
        # Legal style should be more formal
        assert "ANALISIS" in explanation.detailed_explanation.upper() or \
               "PERTIMBANGAN" in explanation.detailed_explanation.upper()
    
    @pytest.mark.asyncio
    async def test_recommendations(self, generator, sample_prediction):
        """Test recommendation generation"""
        explanation = await generator.generate_explanation(
            prediction=sample_prediction,
            style=ExplanationStyle.SIMPLE,
            language="id"
        )
        
        assert len(explanation.recommendations) > 0
        assert len(explanation.considerations) > 0
    
    @pytest.mark.asyncio
    async def test_scenarios(self, generator, sample_prediction):
        """Test scenario generation"""
        explanation = await generator.generate_explanation(
            prediction=sample_prediction,
            style=ExplanationStyle.SIMPLE,
            language="id"
        )
        
        assert len(explanation.best_case_scenario) > 0
        assert len(explanation.worst_case_scenario) > 0
        assert len(explanation.most_likely_scenario) > 0


# ============================================================================
# Integration Tests
# ============================================================================

class TestPredictionIntegration:
    """Test full prediction pipeline"""
    
    @pytest.mark.asyncio
    async def test_full_pipeline(self):
        """Test complete prediction flow"""
        # 1. Analyze
        analyzer = get_case_analyzer()
        features = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        
        # 2. Find precedents
        finder = get_precedent_finder()
        similar_cases = await finder.find_similar_cases(features, limit=10)
        
        # 3. Predict
        predictor = get_outcome_predictor()
        prediction = await predictor.predict_outcome(features, similar_cases)
        
        # 4. Explain
        generator = get_explanation_generator()
        explanation = await generator.generate_explanation(
            prediction,
            ExplanationStyle.DETAILED
        )
        
        # Verify complete flow
        assert features.confidence > 0
        assert prediction.predicted_outcome in OutcomeType
        assert len(explanation.summary) > 0
    
    @pytest.mark.asyncio
    async def test_multiple_case_types(self):
        """Test with different case types"""
        analyzer = get_case_analyzer()
        predictor = get_outcome_predictor()
        
        # Test perdata
        features_perdata = await analyzer.analyze_case(SAMPLE_CASE_PERDATA)
        pred_perdata = await predictor.predict_outcome(features_perdata)
        assert pred_perdata is not None
        
        # Test pidana
        features_pidana = await analyzer.analyze_case(SAMPLE_CASE_PIDANA)
        pred_pidana = await predictor.predict_outcome(features_pidana)
        assert pred_pidana is not None


# ============================================================================
# Run Tests
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
