"""
Predictive Legal Outcomes System

AI-powered system untuk prediksi hasil kasus hukum berdasarkan:
- Historical case data
- Precedent analysis
- Case similarities
- Legal patterns
"""

from .case_analyzer import CaseAnalyzer, CaseFeatures
from .precedent_finder import PrecedentFinder, SimilarCase
from .outcome_predictor import OutcomePredictor, PredictionResult, OutcomeType
from .explanation_generator import ExplanationGenerator, PredictionExplanation

# Singleton instances
_case_analyzer = None
_precedent_finder = None
_outcome_predictor = None
_explanation_generator = None


def get_case_analyzer() -> CaseAnalyzer:
    """Get singleton CaseAnalyzer instance"""
    global _case_analyzer
    if _case_analyzer is None:
        _case_analyzer = CaseAnalyzer()
    return _case_analyzer


def get_precedent_finder() -> PrecedentFinder:
    """Get singleton PrecedentFinder instance"""
    global _precedent_finder
    if _precedent_finder is None:
        _precedent_finder = PrecedentFinder()
    return _precedent_finder


def get_outcome_predictor() -> OutcomePredictor:
    """Get singleton OutcomePredictor instance"""
    global _outcome_predictor
    if _outcome_predictor is None:
        _outcome_predictor = OutcomePredictor()
    return _outcome_predictor


def get_explanation_generator() -> ExplanationGenerator:
    """Get singleton ExplanationGenerator instance"""
    global _explanation_generator
    if _explanation_generator is None:
        _explanation_generator = ExplanationGenerator()
    return _explanation_generator


__all__ = [
    # Classes
    "CaseAnalyzer",
    "CaseFeatures",
    "PrecedentFinder",
    "SimilarCase",
    "OutcomePredictor",
    "PredictionResult",
    "OutcomeType",
    "ExplanationGenerator",
    "PredictionExplanation",
    
    # Factory functions
    "get_case_analyzer",
    "get_precedent_finder",
    "get_outcome_predictor",
    "get_explanation_generator",
]
