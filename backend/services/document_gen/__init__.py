"""
Legal Document Generator System

Sistem untuk generate dokumen hukum dari template:
- Template management dengan versioning
- Data filling dengan validation
- Legal citation integration
- Export ke berbagai format (PDF, DOCX, HTML)
"""

# Core components
from .template_manager import (
    TemplateManager,
    DocumentTemplate,
    TemplateField,
    TemplateCategory
)

from .data_filler import (
    DataFiller,
    FillingResult
)

from .format_converter import (
    FormatConverter,
    DocumentFormat,
    ConversionResult
)

from .validator import (
    DocumentValidator,
    ValidationResult,
    ValidationIssue,
    ValidationLevel
)

# Singleton instances
_template_manager = None
_data_filler = None
_format_converter = None
_document_validator = None


def get_template_manager() -> TemplateManager:
    """Get singleton TemplateManager instance"""
    global _template_manager
    if _template_manager is None:
        _template_manager = TemplateManager()
    return _template_manager


def get_data_filler() -> DataFiller:
    """Get singleton DataFiller instance"""
    global _data_filler
    if _data_filler is None:
        _data_filler = DataFiller()
    return _data_filler


def get_format_converter() -> FormatConverter:
    """Get singleton FormatConverter instance"""
    global _format_converter
    if _format_converter is None:
        _format_converter = FormatConverter()
    return _format_converter


def get_document_validator() -> DocumentValidator:
    """Get singleton DocumentValidator instance"""
    global _document_validator
    if _document_validator is None:
        _document_validator = DocumentValidator()
    return _document_validator


__all__ = [
    # Template management
    "TemplateManager",
    "DocumentTemplate",
    "TemplateField",
    "TemplateCategory",
    
    # Data filling
    "DataFiller",
    "FillingResult",
    
    # Format conversion
    "FormatConverter",
    "DocumentFormat",
    "ConversionResult",
    
    # Validation
    "DocumentValidator",
    "ValidationResult",
    "ValidationIssue",
    "ValidationLevel",
    
    # Singletons
    "get_template_manager",
    "get_data_filler",
    "get_format_converter",
    "get_document_validator",
]

    "DocumentTemplate",
    "TemplateCategory",
    "DocumentGenerator",
    "GeneratedDocument",
    "DocumentCustomizer",
    "CustomField",
    "DocumentExporter",
    "ExportFormat",
    
    # Factory functions
    "get_template_manager",
    "get_document_generator",
    "get_document_customizer",
    "get_document_exporter",
]
