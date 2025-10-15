"""
Legal Flow Service

Implements the 4-step legal consultation workflow for Pasalku.ai:
1. Uraikan Perkara (Describe Case)
2. Klarifikasi AI (AI Clarification)
3. Upload Bukti (Upload Evidence)
4. Analisis Berdasar Hukum (Legal Analysis)
"""

from .flow_manager import (
    LegalFlowManager,
    get_legal_flow_manager,
    FlowStep,
    FlowSession
)

from .entity_extractor import (
    EntityExtractor,
    get_entity_extractor,
    ExtractedEntity,
    EntityType
)

from .context_classifier import (
    ContextClassifier,
    get_context_classifier,
    LegalContext,
    LegalDomain
)

from .clarification_generator import (
    ClarificationGenerator,
    get_clarification_generator,
    ClarificationQuestion,
    QuestionType
)

from .legal_analyzer import (
    LegalAnalyzer,
    get_legal_analyzer,
    LegalAnalysis
)


__all__ = [
    # Flow Manager
    "LegalFlowManager",
    "get_legal_flow_manager",
    "FlowStep",
    "FlowSession",
    
    # Entity Extractor
    "EntityExtractor",
    "get_entity_extractor",
    "ExtractedEntity",
    "EntityType",
    
    # Context Classifier
    "ContextClassifier",
    "get_context_classifier",
    "LegalContext",
    "LegalDomain",
    
    # Clarification Generator
    "ClarificationGenerator",
    "get_clarification_generator",
    "ClarificationQuestion",
    "QuestionType",
    
    # Legal Analyzer
    "LegalAnalyzer",
    "get_legal_analyzer",
    "LegalAnalysis",
]
