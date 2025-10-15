"""
Document Validator - Validate generated documents

Validasi dokumen yang sudah diisi:
- Required fields completeness
- Legal compliance
- Citation validation
- Format validation
- Business rule validation
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from enum import Enum
import re


class ValidationLevel(Enum):
    """Level validasi"""
    ERROR = "error"  # Must be fixed
    WARNING = "warning"  # Should be reviewed
    INFO = "info"  # Nice to know


@dataclass
class ValidationIssue:
    """Issue yang ditemukan saat validasi"""
    level: ValidationLevel
    field: Optional[str]
    message: str
    suggestion: Optional[str] = None


@dataclass
class ValidationResult:
    """Result of document validation"""
    is_valid: bool
    issues: List[ValidationIssue]
    score: float  # 0.0 - 1.0
    
    def __post_init__(self):
        if not self.issues:
            self.issues = []
        
        # Calculate score if not provided
        if not hasattr(self, '_score_calculated'):
            self._calculate_score()
    
    def _calculate_score(self):
        """Calculate validation score"""
        if not self.issues:
            self.score = 1.0
            return
        
        # Deduct points based on issue severity
        deductions = {
            ValidationLevel.ERROR: 0.2,
            ValidationLevel.WARNING: 0.05,
            ValidationLevel.INFO: 0.01
        }
        
        total_deduction = sum(deductions[issue.level] for issue in self.issues)
        self.score = max(0.0, 1.0 - total_deduction)
    
    def get_errors(self) -> List[ValidationIssue]:
        """Get only errors"""
        return [i for i in self.issues if i.level == ValidationLevel.ERROR]
    
    def get_warnings(self) -> List[ValidationIssue]:
        """Get only warnings"""
        return [i for i in self.issues if i.level == ValidationLevel.WARNING]


class DocumentValidator:
    """
    Validate generated legal documents
    """
    
    def __init__(self):
        # Citation system integration (optional)
        self.citation_detector = None
        try:
            from backend.services.citation.citation_detector import CitationDetector
            self.citation_detector = CitationDetector()
        except ImportError:
            pass
        
        # Legal compliance rules
        self.compliance_rules = self._load_compliance_rules()
    
    def validate_document(
        self,
        content: str,
        template_fields: List[Any],  # TemplateField list
        data: Dict[str, Any],
        check_compliance: bool = True
    ) -> ValidationResult:
        """
        Comprehensive document validation
        
        Args:
            content: Filled document content
            template_fields: Template field definitions
            data: Data used to fill template
            check_compliance: Whether to check legal compliance
        
        Returns:
            ValidationResult
        """
        issues = []
        
        # 1. Check required fields
        issues.extend(self._check_required_fields(content, template_fields))
        
        # 2. Check placeholders not filled
        issues.extend(self._check_unfilled_placeholders(content))
        
        # 3. Validate data types
        issues.extend(self._validate_data_types(data, template_fields))
        
        # 4. Check citations
        if self.citation_detector:
            issues.extend(self._validate_citations(content))
        
        # 5. Check legal compliance
        if check_compliance:
            issues.extend(self._check_legal_compliance(content, data))
        
        # 6. Check formatting
        issues.extend(self._check_formatting(content))
        
        # Determine if valid (no errors)
        is_valid = not any(i.level == ValidationLevel.ERROR for i in issues)
        
        result = ValidationResult(is_valid=is_valid, issues=issues, score=0.0)
        result._calculate_score()
        
        return result
    
    def _check_required_fields(self, content: str, template_fields: List[Any]) -> List[ValidationIssue]:
        """Check if required fields are filled"""
        issues = []
        
        for field in template_fields:
            if field.required:
                # Check if field placeholder still exists (not filled)
                placeholder = f"{{{{{field.name}}}}}"
                if placeholder in content:
                    issues.append(ValidationIssue(
                        level=ValidationLevel.ERROR,
                        field=field.name,
                        message=f"Required field '{field.label}' is not filled",
                        suggestion=f"Please provide value for {field.label}"
                    ))
        
        return issues
    
    def _check_unfilled_placeholders(self, content: str) -> List[ValidationIssue]:
        """Check for unfilled placeholders"""
        issues = []
        
        # Find all {{...}} patterns
        placeholders = re.findall(r'\{\{(\w+(?:\.\w+)*)\}\}', content)
        
        for placeholder in set(placeholders):
            issues.append(ValidationIssue(
                level=ValidationLevel.WARNING,
                field=placeholder,
                message=f"Placeholder {{{{{{placeholder}}}}}} was not filled",
                suggestion=f"Provide value for {placeholder} or remove from template"
            ))
        
        return issues
    
    def _validate_data_types(self, data: Dict[str, Any], template_fields: List[Any]) -> List[ValidationIssue]:
        """Validate data types match field definitions"""
        issues = []
        
        for field in template_fields:
            if field.name not in data:
                continue
            
            value = data[field.name]
            field_type = field.type
            
            # Type checks
            if field_type == "number":
                try:
                    float(value)
                except (ValueError, TypeError):
                    issues.append(ValidationIssue(
                        level=ValidationLevel.ERROR,
                        field=field.name,
                        message=f"{field.label} must be a number",
                        suggestion="Provide a valid numeric value"
                    ))
            
            elif field_type == "date":
                from datetime import datetime, date
                if not isinstance(value, (datetime, date)):
                    try:
                        datetime.fromisoformat(str(value))
                    except:
                        issues.append(ValidationIssue(
                            level=ValidationLevel.ERROR,
                            field=field.name,
                            message=f"{field.label} must be a valid date",
                            suggestion="Use ISO format: YYYY-MM-DD"
                        ))
            
            elif field_type == "select":
                if value not in field.options:
                    issues.append(ValidationIssue(
                        level=ValidationLevel.ERROR,
                        field=field.name,
                        message=f"{field.label} must be one of: {', '.join(field.options)}",
                        suggestion=f"Choose from: {', '.join(field.options)}"
                    ))
        
        return issues
    
    def _validate_citations(self, content: str) -> List[ValidationIssue]:
        """Validate legal citations in document"""
        issues = []
        
        if not self.citation_detector:
            return issues
        
        try:
            # Detect citations
            citations = self.citation_detector.detect_citations(content)
            
            # Check if legal document has citations
            if not citations:
                # Check if it's a legal document that should have citations
                legal_keywords = ["pasal", "undang-undang", "peraturan", "dasar hukum"]
                has_legal_keywords = any(kw in content.lower() for kw in legal_keywords)
                
                if has_legal_keywords:
                    issues.append(ValidationIssue(
                        level=ValidationLevel.WARNING,
                        field=None,
                        message="Document mentions legal basis but no proper citations detected",
                        suggestion="Add proper legal citations (e.g., 'UU No. 13 Tahun 2003')"
                    ))
            
            # Validate each citation format
            for citation in citations:
                # Check if citation is complete
                if not citation.law_number or not citation.year:
                    issues.append(ValidationIssue(
                        level=ValidationLevel.WARNING,
                        field=None,
                        message=f"Incomplete citation: {citation.text}",
                        suggestion="Provide complete citation with law number and year"
                    ))
        
        except Exception as e:
            issues.append(ValidationIssue(
                level=ValidationLevel.INFO,
                field=None,
                message=f"Could not validate citations: {str(e)}"
            ))
        
        return issues
    
    def _check_legal_compliance(self, content: str, data: Dict[str, Any]) -> List[ValidationIssue]:
        """Check legal compliance based on rules"""
        issues = []
        
        # Check compliance rules
        for rule in self.compliance_rules:
            rule_issues = rule["check"](content, data)
            issues.extend(rule_issues)
        
        return issues
    
    def _load_compliance_rules(self) -> List[Dict[str, Any]]:
        """Load legal compliance rules"""
        rules = []
        
        # Rule 1: Employment contract must mention probation period
        def check_employment_probation(content: str, data: Dict[str, Any]) -> List[ValidationIssue]:
            issues = []
            if "kontrak kerja" in content.lower():
                if "masa percobaan" not in content.lower() and "probation" not in content.lower():
                    issues.append(ValidationIssue(
                        level=ValidationLevel.WARNING,
                        field=None,
                        message="Employment contract should mention probation period",
                        suggestion="Add probation period clause (max 3 months per UU Ketenagakerjaan)"
                    ))
            return issues
        
        rules.append({
            "name": "Employment Probation",
            "check": check_employment_probation
        })
        
        # Rule 2: Contract must have date
        def check_contract_date(content: str, data: Dict[str, Any]) -> List[ValidationIssue]:
            issues = []
            if any(kw in content.lower() for kw in ["kontrak", "perjanjian", "surat"]):
                # Check for date patterns
                date_patterns = [
                    r'\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+\d{4}',
                    r'\d{4}-\d{2}-\d{2}'
                ]
                has_date = any(re.search(pattern, content) for pattern in date_patterns)
                
                if not has_date:
                    issues.append(ValidationIssue(
                        level=ValidationLevel.ERROR,
                        field="date",
                        message="Document must have a date",
                        suggestion="Add document creation date"
                    ))
            return issues
        
        rules.append({
            "name": "Contract Date",
            "check": check_contract_date
        })
        
        # Rule 3: Warning letter must specify violation
        def check_warning_violation(content: str, data: Dict[str, Any]) -> List[ValidationIssue]:
            issues = []
            if "surat peringatan" in content.lower() or "warning letter" in content.lower():
                if not any(kw in content.lower() for kw in ["pelanggaran", "violation", "melanggar"]):
                    issues.append(ValidationIssue(
                        level=ValidationLevel.ERROR,
                        field="violation_description",
                        message="Warning letter must specify the violation",
                        suggestion="Add clear description of the violation"
                    ))
            return issues
        
        rules.append({
            "name": "Warning Violation",
            "check": check_warning_violation
        })
        
        # Rule 4: Power of attorney must specify powers
        def check_power_of_attorney_powers(content: str, data: Dict[str, Any]) -> List[ValidationIssue]:
            issues = []
            if "surat kuasa" in content.lower() or "power of attorney" in content.lower():
                if not any(kw in content.lower() for kw in ["kuasa", "power", "berwenang", "authorized"]):
                    issues.append(ValidationIssue(
                        level=ValidationLevel.ERROR,
                        field="powers_granted",
                        message="Power of attorney must specify the powers granted",
                        suggestion="Add clear description of powers/authority granted"
                    ))
            return issues
        
        rules.append({
            "name": "Power of Attorney Powers",
            "check": check_power_of_attorney_powers
        })
        
        # Rule 5: Check NIK format (16 digits)
        def check_nik_format(content: str, data: Dict[str, Any]) -> List[ValidationIssue]:
            issues = []
            nik_pattern = r'\bNIK[:\s]+(\d+)'
            niks = re.findall(nik_pattern, content)
            
            for nik in niks:
                if len(nik) != 16:
                    issues.append(ValidationIssue(
                        level=ValidationLevel.WARNING,
                        field="nik",
                        message=f"NIK should be 16 digits, found: {nik} ({len(nik)} digits)",
                        suggestion="Verify NIK format (16 digits)"
                    ))
            return issues
        
        rules.append({
            "name": "NIK Format",
            "check": check_nik_format
        })
        
        return rules
    
    def _check_formatting(self, content: str) -> List[ValidationIssue]:
        """Check document formatting"""
        issues = []
        
        # Check if document is too short
        if len(content.strip()) < 100:
            issues.append(ValidationIssue(
                level=ValidationLevel.WARNING,
                field=None,
                message="Document seems too short",
                suggestion="Verify all sections are included"
            ))
        
        # Check for common formatting issues
        # Excessive whitespace
        if re.search(r'\n{4,}', content):
            issues.append(ValidationIssue(
                level=ValidationLevel.INFO,
                field=None,
                message="Document has excessive blank lines",
                suggestion="Remove extra blank lines for better formatting"
            ))
        
        # Check for all caps sections (might need formatting)
        all_caps_lines = re.findall(r'^[A-Z\s]{20,}$', content, re.MULTILINE)
        if len(all_caps_lines) > 10:
            issues.append(ValidationIssue(
                level=ValidationLevel.INFO,
                field=None,
                message="Document has many all-caps sections",
                suggestion="Consider using proper heading formatting"
            ))
        
        return issues
    
    def quick_validate(self, content: str) -> bool:
        """Quick validation - just check if document is fillable"""
        # Check for unfilled placeholders
        placeholders = re.findall(r'\{\{(\w+)\}\}', content)
        return len(placeholders) == 0
