"""
Data Filler - Fill template dengan data

Mengisi template dengan data yang diberikan:
- Variable substitution ({{variable}})
- Conditional sections ({{#if}})
- Loops ({{#each}})
- Date/currency formatting
- Citation integration
"""

from dataclasses import dataclass
from typing import Dict, Any, Optional, List
from datetime import datetime, date
import re
from decimal import Decimal


@dataclass
class FillingResult:
    """Result of template filling"""
    success: bool
    filled_content: str
    missing_fields: List[str] = None
    warnings: List[str] = None
    errors: List[str] = None
    
    def __post_init__(self):
        if self.missing_fields is None:
            self.missing_fields = []
        if self.warnings is None:
            self.warnings = []
        if self.errors is None:
            self.errors = []


class DataFiller:
    """
    Fill document templates dengan data
    """
    
    def __init__(self):
        # Citation system integration (optional)
        self.citation_formatter = None
        try:
            from backend.services.citation.citation_formatter import CitationFormatter
            self.citation_formatter = CitationFormatter()
        except ImportError:
            pass
    
    def fill_template(
        self,
        template_content: str,
        data: Dict[str, Any],
        required_fields: Optional[List[str]] = None
    ) -> FillingResult:
        """
        Fill template dengan data yang diberikan
        
        Args:
            template_content: Template dengan placeholders
            data: Data untuk mengisi template
            required_fields: Field yang wajib diisi
        
        Returns:
            FillingResult dengan status dan content
        """
        result = FillingResult(success=True, filled_content=template_content)
        
        # Check required fields
        if required_fields:
            missing = [f for f in required_fields if f not in data or not data[f]]
            if missing:
                result.missing_fields = missing
                result.success = False
                result.errors.append(f"Missing required fields: {', '.join(missing)}")
                return result
        
        # Process template
        try:
            # 1. Process conditionals ({{#if}})
            content = self._process_conditionals(template_content, data)
            
            # 2. Process loops ({{#each}})
            content = self._process_loops(content, data)
            
            # 3. Process variable substitutions ({{variable}})
            content, warnings = self._substitute_variables(content, data)
            result.warnings.extend(warnings)
            
            result.filled_content = content
            
        except Exception as e:
            result.success = False
            result.errors.append(f"Error filling template: {str(e)}")
        
        return result
    
    def _process_conditionals(self, content: str, data: Dict[str, Any]) -> str:
        """
        Process conditional sections
        Format: {{#if variable}}content{{/if}}
        """
        # Pattern untuk if block
        if_pattern = r'\{\{#if\s+(\w+)\}\}(.*?)\{\{/if\}\}'
        
        def replace_if(match):
            var_name = match.group(1)
            block_content = match.group(2)
            
            # Check if variable exists and is truthy
            value = data.get(var_name)
            if value and (isinstance(value, bool) or (isinstance(value, str) and value.strip()) or value):
                return block_content
            return ""
        
        return re.sub(if_pattern, replace_if, content, flags=re.DOTALL)
    
    def _process_loops(self, content: str, data: Dict[str, Any]) -> str:
        """
        Process loop sections
        Format: {{#each items}}{{item.field}}{{/each}}
        """
        # Pattern untuk each block
        each_pattern = r'\{\{#each\s+(\w+)\}\}(.*?)\{\{/each\}\}'
        
        def replace_each(match):
            var_name = match.group(1)
            block_content = match.group(2)
            
            items = data.get(var_name, [])
            if not isinstance(items, list):
                return ""
            
            result_parts = []
            for idx, item in enumerate(items):
                # Create context for this item
                item_context = {
                    "index": idx,
                    "first": idx == 0,
                    "last": idx == len(items) - 1,
                }
                
                # If item is dict, merge with context
                if isinstance(item, dict):
                    item_context.update(item)
                else:
                    item_context["item"] = item
                
                # Replace variables in block
                block = block_content
                for key, value in item_context.items():
                    placeholder = f"{{{{{var_name}.{key}}}}}"
                    block = block.replace(placeholder, str(value))
                
                result_parts.append(block)
            
            return "".join(result_parts)
        
        return re.sub(each_pattern, replace_each, content, flags=re.DOTALL)
    
    def _substitute_variables(self, content: str, data: Dict[str, Any]) -> tuple:
        """
        Substitute {{variable}} dengan nilai dari data
        
        Returns:
            (filled_content, warnings)
        """
        warnings = []
        
        # Find all placeholders
        placeholders = re.findall(r'\{\{(\w+(?:\.\w+)*)\}\}', content)
        
        for placeholder in placeholders:
            # Get value from data (support nested: company.name)
            value = self._get_nested_value(data, placeholder)
            
            if value is None:
                warnings.append(f"Placeholder {{{{{{placeholder}}}}}} tidak ditemukan dalam data")
                # Keep placeholder or replace with empty
                content = content.replace(f"{{{{{placeholder}}}}}", f"[{placeholder}]")
            else:
                # Format value based on type
                formatted_value = self._format_value(value, placeholder)
                content = content.replace(f"{{{{{placeholder}}}}}", formatted_value)
        
        return content, warnings
    
    def _get_nested_value(self, data: Dict[str, Any], key_path: str) -> Any:
        """Get nested value from data (e.g., 'company.name')"""
        keys = key_path.split('.')
        value = data
        
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key)
            else:
                return None
            
            if value is None:
                return None
        
        return value
    
    def _format_value(self, value: Any, field_name: str) -> str:
        """Format value based on type and field name"""
        # Date fields
        if isinstance(value, (datetime, date)):
            return self._format_date(value, field_name)
        
        # Currency fields
        if "salary" in field_name.lower() or "fee" in field_name.lower() or "amount" in field_name.lower():
            if isinstance(value, (int, float, Decimal)):
                return self._format_currency(value)
        
        # Number fields
        if isinstance(value, (int, float, Decimal)):
            return self._format_number(value)
        
        # Citation fields
        if "citation" in field_name.lower() or "legal_basis" in field_name.lower():
            return self._format_citation(value)
        
        # Default: convert to string
        return str(value)
    
    def _format_date(self, value: datetime | date, field_name: str) -> str:
        """Format date untuk dokumen legal Indonesia"""
        if isinstance(value, str):
            try:
                value = datetime.fromisoformat(value.replace('Z', '+00:00'))
            except:
                return value
        
        # Indonesian month names
        months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ]
        
        if isinstance(value, datetime):
            day = value.day
            month = months[value.month - 1]
            year = value.year
        else:
            day = value.day
            month = months[value.month - 1]
            year = value.year
        
        return f"{day} {month} {year}"
    
    def _format_currency(self, value: int | float | Decimal) -> str:
        """Format currency IDR"""
        # Convert to int for IDR (no decimals)
        amount = int(value)
        
        # Format with thousands separator
        formatted = f"{amount:,}".replace(",", ".")
        
        return formatted
    
    def _format_number(self, value: int | float | Decimal) -> str:
        """Format number"""
        if isinstance(value, float):
            # If has decimals, format with 2 decimal places
            if value % 1 != 0:
                return f"{value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
        
        # Integer
        return f"{int(value):,}".replace(",", ".")
    
    def _format_citation(self, value: str) -> str:
        """Format legal citation"""
        if self.citation_formatter:
            # Use citation formatter if available
            try:
                # Detect and format citation
                from backend.services.citation.citation_detector import CitationDetector
                detector = CitationDetector()
                citations = detector.detect_citations(value)
                
                if citations:
                    for citation in citations:
                        formatted = self.citation_formatter.format_citation(
                            citation,
                            format_type="apa"
                        )
                        value = value.replace(citation.text, formatted)
            except Exception:
                pass
        
        return value
    
    def validate_data(
        self,
        data: Dict[str, Any],
        field_definitions: List[Any]  # TemplateField list
    ) -> tuple:
        """
        Validate data against field definitions
        
        Returns:
            (is_valid, errors)
        """
        errors = []
        
        for field in field_definitions:
            field_name = field.name
            field_type = field.type
            required = field.required
            
            # Check required
            if required and (field_name not in data or not data[field_name]):
                errors.append(f"Field '{field.label}' is required")
                continue
            
            # Skip if not present and not required
            if field_name not in data:
                continue
            
            value = data[field_name]
            
            # Type validation
            if field_type == "number":
                try:
                    float(value)
                except (ValueError, TypeError):
                    errors.append(f"Field '{field.label}' must be a number")
            
            elif field_type == "date":
                if not isinstance(value, (datetime, date)):
                    try:
                        datetime.fromisoformat(str(value))
                    except:
                        errors.append(f"Field '{field.label}' must be a valid date")
            
            elif field_type == "select":
                if value not in field.options:
                    errors.append(f"Field '{field.label}' must be one of: {', '.join(field.options)}")
            
            # Validation rules
            if field.validation_rules:
                validation_errors = self._validate_rules(value, field.validation_rules, field.label)
                errors.extend(validation_errors)
        
        return len(errors) == 0, errors
    
    def _validate_rules(self, value: Any, rules: Dict[str, Any], field_label: str) -> List[str]:
        """Validate value against rules"""
        errors = []
        
        if "min_length" in rules:
            if len(str(value)) < rules["min_length"]:
                errors.append(f"{field_label} must be at least {rules['min_length']} characters")
        
        if "max_length" in rules:
            if len(str(value)) > rules["max_length"]:
                errors.append(f"{field_label} must be at most {rules['max_length']} characters")
        
        if "min_value" in rules:
            try:
                if float(value) < rules["min_value"]:
                    errors.append(f"{field_label} must be at least {rules['min_value']}")
            except (ValueError, TypeError):
                pass
        
        if "max_value" in rules:
            try:
                if float(value) > rules["max_value"]:
                    errors.append(f"{field_label} must be at most {rules['max_value']}")
            except (ValueError, TypeError):
                pass
        
        if "pattern" in rules:
            pattern = rules["pattern"]
            if not re.match(pattern, str(value)):
                errors.append(f"{field_label} format is invalid")
        
        return errors
    
    def preview_template(
        self,
        template_content: str,
        data: Dict[str, Any],
        max_length: int = 1000
    ) -> str:
        """
        Generate preview of filled template
        """
        result = self.fill_template(template_content, data)
        
        content = result.filled_content
        
        # Truncate if too long
        if len(content) > max_length:
            content = content[:max_length] + "\n...[truncated]"
        
        return content
