"""
Test Document Generation System

Comprehensive tests untuk document generation:
- Template management
- Data filling
- Format conversion
- Validation
- API endpoints
"""

import pytest
from datetime import datetime, date
from backend.services.document_gen import (
    TemplateManager,
    DataFiller,
    FormatConverter,
    DocumentValidator,
    DocumentTemplate,
    TemplateField,
    TemplateCategory,
    DocumentFormat,
)


# ============= Test Template Manager =============

def test_template_manager_initialization():
    """Test TemplateManager initializes with default templates"""
    manager = TemplateManager()
    
    templates = manager.list_templates()
    assert len(templates) > 0, "Should have default templates"
    
    # Check default templates exist
    employment_contract = manager.get_template("contract_employment")
    assert employment_contract is not None
    assert employment_contract.name == "Kontrak Kerja Karyawan"
    assert employment_contract.category == TemplateCategory.CONTRACT


def test_get_template():
    """Test getting template by ID"""
    manager = TemplateManager()
    
    template = manager.get_template("contract_employment")
    assert template is not None
    assert template.template_id == "contract_employment"
    assert len(template.fields) > 0


def test_list_templates_filter_by_category():
    """Test filtering templates by category"""
    manager = TemplateManager()
    
    contracts = manager.list_templates(category=TemplateCategory.CONTRACT)
    assert len(contracts) > 0
    assert all(t.category == TemplateCategory.CONTRACT for t in contracts)


def test_list_templates_search():
    """Test searching templates"""
    manager = TemplateManager()
    
    results = manager.list_templates(search="kontrak")
    assert len(results) > 0
    assert any("kontrak" in t.name.lower() for t in results)


def test_list_templates_filter_by_tags():
    """Test filtering templates by tags"""
    manager = TemplateManager()
    
    results = manager.list_templates(tags=["kontrak"])
    assert len(results) > 0


def test_create_template():
    """Test creating new template"""
    manager = TemplateManager()
    
    template = DocumentTemplate(
        template_id="test_template",
        name="Test Template",
        category=TemplateCategory.OTHER,
        content="Hello {{name}}",
        fields=[
            TemplateField("name", "Name", "text", required=True)
        ]
    )
    
    created = manager.create_template(template)
    assert created.template_id == "test_template"
    
    # Verify can retrieve
    retrieved = manager.get_template("test_template")
    assert retrieved is not None
    assert retrieved.name == "Test Template"


def test_update_template():
    """Test updating template"""
    manager = TemplateManager()
    
    # Create template
    template = DocumentTemplate(
        template_id="test_update",
        name="Original Name",
        category=TemplateCategory.OTHER,
        content="Content"
    )
    manager.create_template(template)
    
    # Update
    updated = manager.update_template("test_update", {"name": "Updated Name"})
    assert updated.name == "Updated Name"


def test_delete_template():
    """Test deleting template"""
    manager = TemplateManager()
    
    # Create template
    template = DocumentTemplate(
        template_id="test_delete",
        name="To Delete",
        category=TemplateCategory.OTHER,
        content="Content"
    )
    manager.create_template(template)
    
    # Delete
    success = manager.delete_template("test_delete")
    assert success is True
    
    # Verify deleted
    deleted = manager.get_template("test_delete")
    assert deleted is None


def test_increment_usage():
    """Test incrementing template usage count"""
    manager = TemplateManager()
    
    template = manager.get_template("contract_employment")
    initial_count = template.usage_count
    
    manager.increment_usage("contract_employment")
    
    updated = manager.get_template("contract_employment")
    assert updated.usage_count == initial_count + 1


# ============= Test Data Filler =============

def test_data_filler_simple_substitution():
    """Test simple variable substitution"""
    filler = DataFiller()
    
    template = "Hello {{name}}, welcome to {{company}}!"
    data = {"name": "John", "company": "ACME Corp"}
    
    result = filler.fill_template(template, data)
    
    assert result.success
    assert "John" in result.filled_content
    assert "ACME Corp" in result.filled_content
    assert "{{" not in result.filled_content


def test_data_filler_missing_required_field():
    """Test missing required field"""
    filler = DataFiller()
    
    template = "Hello {{name}}"
    data = {}
    required = ["name"]
    
    result = filler.fill_template(template, data, required_fields=required)
    
    assert not result.success
    assert "name" in result.missing_fields


def test_data_filler_conditional():
    """Test conditional sections"""
    filler = DataFiller()
    
    template = "Hello {{name}}{{#if premium}}, you are a premium member!{{/if}}"
    
    # With premium
    data1 = {"name": "John", "premium": True}
    result1 = filler.fill_template(template, data1)
    assert "premium member" in result1.filled_content
    
    # Without premium
    data2 = {"name": "Jane", "premium": False}
    result2 = filler.fill_template(template, data2)
    assert "premium member" not in result2.filled_content


def test_data_filler_loops():
    """Test loop sections"""
    filler = DataFiller()
    
    template = "Items: {{#each items}}{{items.name}}, {{/each}}"
    data = {
        "items": [
            {"name": "Item 1"},
            {"name": "Item 2"},
            {"name": "Item 3"}
        ]
    }
    
    result = filler.fill_template(template, data)
    
    assert "Item 1" in result.filled_content
    assert "Item 2" in result.filled_content
    assert "Item 3" in result.filled_content


def test_data_filler_date_formatting():
    """Test date formatting"""
    filler = DataFiller()
    
    template = "Date: {{date}}"
    data = {"date": date(2024, 1, 15)}
    
    result = filler.fill_template(template, data)
    
    assert "15 Januari 2024" in result.filled_content


def test_data_filler_currency_formatting():
    """Test currency formatting"""
    filler = DataFiller()
    
    template = "Salary: {{salary}}"
    data = {"salary": 5000000}
    
    result = filler.fill_template(template, data)
    
    # Should format with thousands separator
    assert "5.000.000" in result.filled_content


def test_data_filler_nested_values():
    """Test nested value access"""
    filler = DataFiller()
    
    template = "Company: {{company.name}}, Location: {{company.location}}"
    data = {
        "company": {
            "name": "ACME Corp",
            "location": "Jakarta"
        }
    }
    
    result = filler.fill_template(template, data)
    
    assert "ACME Corp" in result.filled_content
    assert "Jakarta" in result.filled_content


def test_validate_data():
    """Test data validation"""
    filler = DataFiller()
    
    fields = [
        TemplateField("age", "Age", "number", required=True),
        TemplateField("email", "Email", "text", required=True)
    ]
    
    # Valid data
    valid_data = {"age": 25, "email": "test@example.com"}
    is_valid, errors = filler.validate_data(valid_data, fields)
    assert is_valid
    assert len(errors) == 0
    
    # Invalid data (missing required)
    invalid_data = {"age": 25}
    is_valid, errors = filler.validate_data(invalid_data, fields)
    assert not is_valid
    assert len(errors) > 0


# ============= Test Format Converter =============

def test_format_converter_to_txt():
    """Test converting to TXT format"""
    converter = FormatConverter()
    
    content = "This is a test document.\n\nWith multiple paragraphs."
    
    result = converter.convert(content, DocumentFormat.TXT)
    
    assert result.success
    assert result.format == DocumentFormat.TXT
    assert result.file_path is not None


def test_format_converter_to_html():
    """Test converting to HTML format"""
    converter = FormatConverter()
    
    content = "TITLE\n\nThis is content."
    
    result = converter.convert(content, DocumentFormat.HTML, title="Test Document")
    
    assert result.success
    assert result.format == DocumentFormat.HTML
    assert result.file_content is not None
    assert b"<html" in result.file_content
    assert b"Test Document" in result.file_content


def test_format_converter_to_markdown():
    """Test converting to Markdown format"""
    converter = FormatConverter()
    
    content = "HEADING\n\nThis is content."
    
    result = converter.convert(content, DocumentFormat.MARKDOWN, title="Test")
    
    assert result.success
    assert result.format == DocumentFormat.MARKDOWN
    assert b"# Test" in result.file_content


# Note: DOCX and PDF tests require external libraries
# They are skipped if libraries not available

def test_format_converter_docx_unavailable():
    """Test DOCX conversion when library not available"""
    converter = FormatConverter()
    converter.docx_available = False
    
    content = "Test content"
    
    result = converter.convert(content, DocumentFormat.DOCX)
    
    if not converter.docx_available:
        assert not result.success
        assert "python-docx" in result.error


def test_format_converter_pdf_unavailable():
    """Test PDF conversion when library not available"""
    converter = FormatConverter()
    converter.pdf_available = False
    
    content = "Test content"
    
    result = converter.convert(content, DocumentFormat.PDF)
    
    if not converter.pdf_available:
        assert not result.success
        assert "reportlab" in result.error


# ============= Test Document Validator =============

def test_validator_required_fields():
    """Test validation of required fields"""
    validator = DocumentValidator()
    
    content = "Hello {{name}}"  # name not filled
    fields = [
        TemplateField("name", "Name", "text", required=True)
    ]
    data = {}
    
    result = validator.validate_document(content, fields, data)
    
    assert not result.is_valid
    errors = result.get_errors()
    assert len(errors) > 0
    assert any("name" in e.field for e in errors if e.field)


def test_validator_unfilled_placeholders():
    """Test detection of unfilled placeholders"""
    validator = DocumentValidator()
    
    content = "Hello {{name}}, your code is {{code}}"
    fields = []
    data = {}
    
    result = validator.validate_document(content, fields, data, check_compliance=False)
    
    warnings = result.get_warnings()
    assert len(warnings) > 0


def test_validator_data_types():
    """Test validation of data types"""
    validator = DocumentValidator()
    
    content = "Age: 25"
    fields = [
        TemplateField("age", "Age", "number", required=True)
    ]
    data = {"age": "not a number"}
    
    result = validator.validate_document(content, fields, data, check_compliance=False)
    
    errors = result.get_errors()
    assert len(errors) > 0


def test_validator_compliance_contract_date():
    """Test legal compliance - contract must have date"""
    validator = DocumentValidator()
    
    content = "KONTRAK KERJA\n\nThis is a contract without date."
    fields = []
    data = {}
    
    result = validator.validate_document(content, fields, data, check_compliance=True)
    
    errors = result.get_errors()
    assert any("date" in e.message.lower() for e in errors)


def test_validator_compliance_warning_letter():
    """Test legal compliance - warning letter must specify violation"""
    validator = DocumentValidator()
    
    content = "SURAT PERINGATAN\n\nThis is a warning letter."
    fields = []
    data = {}
    
    result = validator.validate_document(content, fields, data, check_compliance=True)
    
    errors = result.get_errors()
    assert any("violation" in e.message.lower() for e in errors)


def test_validator_nik_format():
    """Test NIK format validation"""
    validator = DocumentValidator()
    
    content = "NIK: 12345"  # Invalid NIK (should be 16 digits)
    fields = []
    data = {}
    
    result = validator.validate_document(content, fields, data, check_compliance=True)
    
    warnings = result.get_warnings()
    assert any("nik" in w.message.lower() for w in warnings)


def test_validator_score_calculation():
    """Test validation score calculation"""
    validator = DocumentValidator()
    
    # Perfect document
    content1 = "15 Januari 2024\n\nThis is a perfect document."
    result1 = validator.validate_document(content1, [], {}, check_compliance=False)
    assert result1.score == 1.0
    
    # Document with issues
    content2 = "{{name}} {{email}} {{phone}}"  # Many unfilled placeholders
    result2 = validator.validate_document(content2, [], {}, check_compliance=False)
    assert result2.score < 1.0


def test_quick_validate():
    """Test quick validation"""
    validator = DocumentValidator()
    
    # Valid (no placeholders)
    assert validator.quick_validate("This is complete") is True
    
    # Invalid (has placeholders)
    assert validator.quick_validate("Hello {{name}}") is False


# ============= Integration Tests =============

def test_full_document_generation_workflow():
    """Test complete workflow: template -> fill -> validate -> convert"""
    manager = TemplateManager()
    filler = DataFiller()
    validator = DocumentValidator()
    converter = FormatConverter()
    
    # 1. Get template
    template = manager.get_template("contract_employment")
    assert template is not None
    
    # 2. Prepare data
    data = {
        "company_name": "ACME Corporation",
        "company_address": "Jl. Sudirman No. 123, Jakarta",
        "company_npwp": "01.234.567.8-901.000",
        "employee_name": "John Doe",
        "employee_nik": "3171234567890001",
        "employee_address": "Jl. Merdeka No. 456, Jakarta",
        "position": "Software Engineer",
        "start_date": date(2024, 1, 1),
        "salary": 10000000,
        "probation_period": "3",
        "contract_type": "PKWTT",
        "location": "Jakarta",
        "date": date(2024, 1, 1)
    }
    
    # 3. Fill template
    fill_result = filler.fill_template(
        template.content,
        data,
        required_fields=[f.name for f in template.fields if f.required]
    )
    
    assert fill_result.success
    filled_content = fill_result.filled_content
    
    # 4. Validate
    validation = validator.validate_document(
        filled_content,
        template.fields,
        data
    )
    
    assert validation.is_valid or len(validation.get_errors()) == 0
    
    # 5. Convert to HTML (always available)
    conversion = converter.convert(
        filled_content,
        DocumentFormat.HTML,
        title=template.name
    )
    
    assert conversion.success
    assert conversion.file_path is not None
    
    # 6. Increment usage
    manager.increment_usage(template.template_id)


def test_service_agreement_workflow():
    """Test service agreement generation"""
    manager = TemplateManager()
    filler = DataFiller()
    
    template = manager.get_template("agreement_service")
    
    data = {
        "client_name": "PT ABCD",
        "client_address": "Jakarta",
        "provider_name": "PT XYZ",
        "provider_address": "Bandung",
        "service_description": "Jasa konsultasi IT",
        "service_fee": 50000000,
        "payment_terms": "50% DP, 50% pelunasan",
        "duration": "6",
        "start_date": date(2024, 1, 1),
        "date": date(2024, 1, 1)
    }
    
    result = filler.fill_template(
        template.content,
        data,
        required_fields=[f.name for f in template.fields if f.required]
    )
    
    assert result.success
    assert "PT ABCD" in result.filled_content
    assert "konsultasi IT" in result.filled_content


def test_warning_letter_workflow():
    """Test warning letter generation"""
    manager = TemplateManager()
    filler = DataFiller()
    validator = DocumentValidator()
    
    template = manager.get_template("letter_warning")
    
    data = {
        "company_name": "ACME Corp",
        "company_address": "Jakarta",
        "employee_name": "Jane Doe",
        "employee_position": "Staff",
        "warning_level": "SP 1",
        "violation_date": date(2024, 1, 10),
        "violation_description": "Terlambat 3 kali dalam seminggu",
        "consequences": "SP 2 jika terulang",
        "date": date(2024, 1, 15),
        "signatory_name": "HR Manager",
        "signatory_position": "Manager"
    }
    
    result = filler.fill_template(
        template.content,
        data,
        required_fields=[f.name for f in template.fields if f.required]
    )
    
    assert result.success
    
    # Validate - should pass compliance check
    validation = validator.validate_document(
        result.filled_content,
        template.fields,
        data,
        check_compliance=True
    )
    
    # Should have violation description, so compliance check passes
    assert validation.is_valid or len(validation.get_errors()) == 0


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
