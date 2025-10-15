"""
Localizer

Localization service untuk:
- Date/time formatting per locale
- Currency formatting per locale
- Number formatting per locale
- Legal citation formatting per locale
"""

from dataclasses import dataclass
from typing import Optional
from datetime import datetime, date
from decimal import Decimal
from enum import Enum


class LocaleFormat(Enum):
    """Supported locales"""
    INDONESIAN = "id_ID"
    ENGLISH_US = "en_US"
    ENGLISH_UK = "en_GB"


@dataclass
class LocalizedValue:
    """Localized value"""
    value: any
    formatted: str
    locale: LocaleFormat


class Localizer:
    """
    Localization service untuk format dates, currency, numbers
    """
    
    def __init__(self, default_locale: LocaleFormat = LocaleFormat.INDONESIAN):
        self.default_locale = default_locale
        
        # Month names
        self.month_names = self._load_month_names()
        
        # Day names
        self.day_names = self._load_day_names()
        
        # Currency symbols
        self.currency_symbols = self._load_currency_symbols()
    
    def format_date(
        self,
        value: datetime | date,
        locale: Optional[LocaleFormat] = None,
        format_style: str = "long"
    ) -> str:
        """
        Format date untuk locale tertentu
        
        Args:
            value: Date/datetime object
            locale: Locale format (default: Indonesian)
            format_style: "short", "medium", "long", "full"
        
        Returns:
            Formatted date string
        """
        if locale is None:
            locale = self.default_locale
        
        if isinstance(value, str):
            try:
                value = datetime.fromisoformat(value.replace('Z', '+00:00'))
            except:
                return value
        
        if locale == LocaleFormat.INDONESIAN:
            return self._format_date_indonesian(value, format_style)
        elif locale in [LocaleFormat.ENGLISH_US, LocaleFormat.ENGLISH_UK]:
            return self._format_date_english(value, format_style, locale)
        
        return str(value)
    
    def format_currency(
        self,
        value: int | float | Decimal,
        locale: Optional[LocaleFormat] = None,
        currency_code: Optional[str] = None
    ) -> str:
        """
        Format currency untuk locale tertentu
        
        Args:
            value: Amount
            locale: Locale format
            currency_code: Currency code (IDR, USD, etc.)
        
        Returns:
            Formatted currency string
        """
        if locale is None:
            locale = self.default_locale
        
        # Determine currency code dari locale jika tidak diberikan
        if currency_code is None:
            if locale == LocaleFormat.INDONESIAN:
                currency_code = "IDR"
            elif locale == LocaleFormat.ENGLISH_US:
                currency_code = "USD"
            elif locale == LocaleFormat.ENGLISH_UK:
                currency_code = "GBP"
        
        # Get currency symbol
        symbol = self.currency_symbols.get(currency_code, currency_code)
        
        # Format number
        if locale == LocaleFormat.INDONESIAN:
            # Indonesian: Rp 1.000.000
            amount = int(value)  # IDR doesn't use decimals
            formatted_amount = f"{amount:,}".replace(",", ".")
            return f"Rp {formatted_amount}"
        
        elif locale == LocaleFormat.ENGLISH_US:
            # US: $1,000.00
            formatted_amount = f"{float(value):,.2f}"
            return f"{symbol}{formatted_amount}"
        
        elif locale == LocaleFormat.ENGLISH_UK:
            # UK: £1,000.00
            formatted_amount = f"{float(value):,.2f}"
            return f"{symbol}{formatted_amount}"
        
        return f"{symbol} {value}"
    
    def format_number(
        self,
        value: int | float | Decimal,
        locale: Optional[LocaleFormat] = None,
        decimal_places: int = 2
    ) -> str:
        """
        Format number untuk locale tertentu
        
        Args:
            value: Number
            locale: Locale format
            decimal_places: Number of decimal places
        
        Returns:
            Formatted number string
        """
        if locale is None:
            locale = self.default_locale
        
        if locale == LocaleFormat.INDONESIAN:
            # Indonesian: 1.000.000,50
            if isinstance(value, float) or isinstance(value, Decimal):
                # Has decimals
                int_part = int(value)
                decimal_part = abs(value - int_part)
                
                int_formatted = f"{int_part:,}".replace(",", ".")
                
                if decimal_places > 0 and decimal_part > 0:
                    decimal_formatted = f"{decimal_part:.{decimal_places}f}"[2:]  # Remove "0."
                    return f"{int_formatted},{decimal_formatted}"
                
                return int_formatted
            else:
                # Integer
                return f"{int(value):,}".replace(",", ".")
        
        else:
            # English: 1,000,000.50
            if isinstance(value, float) or isinstance(value, Decimal):
                return f"{float(value):,.{decimal_places}f}"
            else:
                return f"{int(value):,}"
    
    def format_percentage(
        self,
        value: float,
        locale: Optional[LocaleFormat] = None,
        decimal_places: int = 1
    ) -> str:
        """
        Format percentage untuk locale tertentu
        
        Args:
            value: Percentage value (0.0 - 1.0 or 0 - 100)
            locale: Locale format
            decimal_places: Number of decimal places
        
        Returns:
            Formatted percentage string
        """
        if locale is None:
            locale = self.default_locale
        
        # Convert to percentage if 0.0 - 1.0
        if value <= 1.0:
            value = value * 100
        
        formatted_number = self.format_number(value, locale, decimal_places)
        
        return f"{formatted_number}%"
    
    def format_legal_citation(
        self,
        citation: str,
        locale: Optional[LocaleFormat] = None
    ) -> str:
        """
        Format legal citation untuk locale tertentu
        
        Args:
            citation: Citation text
            locale: Locale format
        
        Returns:
            Formatted citation
        """
        if locale is None:
            locale = self.default_locale
        
        if locale == LocaleFormat.INDONESIAN:
            # Indonesian format (already correct)
            return citation
        
        elif locale in [LocaleFormat.ENGLISH_US, LocaleFormat.ENGLISH_UK]:
            # Translate common terms
            translated = citation
            translated = translated.replace("Undang-Undang", "Law")
            translated = translated.replace("UU", "Law")
            translated = translated.replace("Nomor", "No.")
            translated = translated.replace("Tahun", "of")
            translated = translated.replace("Pasal", "Article")
            translated = translated.replace("Ayat", "Paragraph")
            translated = translated.replace("tentang", "regarding")
            
            return translated
        
        return citation
    
    def _format_date_indonesian(self, value: datetime | date, format_style: str) -> str:
        """Format date in Indonesian"""
        day = value.day
        month_idx = value.month - 1
        year = value.year
        
        month_names = self.month_names[LocaleFormat.INDONESIAN]
        month = month_names[month_idx]
        
        if format_style == "short":
            # 15/01/2024
            return f"{day:02d}/{value.month:02d}/{year}"
        
        elif format_style == "medium":
            # 15 Jan 2024
            month_short = month[:3]
            return f"{day} {month_short} {year}"
        
        elif format_style == "long":
            # 15 Januari 2024
            return f"{day} {month} {year}"
        
        elif format_style == "full":
            # Senin, 15 Januari 2024
            if isinstance(value, datetime):
                day_name = self.day_names[LocaleFormat.INDONESIAN][value.weekday()]
                return f"{day_name}, {day} {month} {year}"
            else:
                return f"{day} {month} {year}"
        
        return f"{day} {month} {year}"
    
    def _format_date_english(
        self,
        value: datetime | date,
        format_style: str,
        locale: LocaleFormat
    ) -> str:
        """Format date in English"""
        day = value.day
        month_idx = value.month - 1
        year = value.year
        
        month_names = self.month_names[locale]
        month = month_names[month_idx]
        
        if format_style == "short":
            if locale == LocaleFormat.ENGLISH_US:
                # 01/15/2024 (US)
                return f"{value.month:02d}/{day:02d}/{year}"
            else:
                # 15/01/2024 (UK)
                return f"{day:02d}/{value.month:02d}/{year}"
        
        elif format_style == "medium":
            # Jan 15, 2024 (US) or 15 Jan 2024 (UK)
            month_short = month[:3]
            if locale == LocaleFormat.ENGLISH_US:
                return f"{month_short} {day}, {year}"
            else:
                return f"{day} {month_short} {year}"
        
        elif format_style == "long":
            # January 15, 2024 (US) or 15 January 2024 (UK)
            if locale == LocaleFormat.ENGLISH_US:
                return f"{month} {day}, {year}"
            else:
                return f"{day} {month} {year}"
        
        elif format_style == "full":
            # Monday, January 15, 2024 (US)
            if isinstance(value, datetime):
                day_name = self.day_names[locale][value.weekday()]
                if locale == LocaleFormat.ENGLISH_US:
                    return f"{day_name}, {month} {day}, {year}"
                else:
                    return f"{day_name}, {day} {month} {year}"
            else:
                if locale == LocaleFormat.ENGLISH_US:
                    return f"{month} {day}, {year}"
                else:
                    return f"{day} {month} {year}"
        
        return str(value)
    
    def _load_month_names(self) -> dict:
        """Load month names per locale"""
        return {
            LocaleFormat.INDONESIAN: [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ],
            LocaleFormat.ENGLISH_US: [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ],
            LocaleFormat.ENGLISH_UK: [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ]
        }
    
    def _load_day_names(self) -> dict:
        """Load day names per locale"""
        return {
            LocaleFormat.INDONESIAN: [
                "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
            ],
            LocaleFormat.ENGLISH_US: [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            LocaleFormat.ENGLISH_UK: [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ]
        }
    
    def _load_currency_symbols(self) -> dict:
        """Load currency symbols"""
        return {
            "IDR": "Rp",
            "USD": "$",
            "GBP": "£",
            "EUR": "€",
            "JPY": "¥",
            "SGD": "S$",
            "MYR": "RM",
        }
    
    def get_locale_info(self, locale: LocaleFormat) -> dict:
        """Get information about locale"""
        info = {
            LocaleFormat.INDONESIAN: {
                "name": "Indonesian",
                "native_name": "Bahasa Indonesia",
                "language_code": "id",
                "country_code": "ID",
                "currency": "IDR",
                "date_format": "d/m/Y",
                "time_format": "H:i",
            },
            LocaleFormat.ENGLISH_US: {
                "name": "English (US)",
                "native_name": "English (United States)",
                "language_code": "en",
                "country_code": "US",
                "currency": "USD",
                "date_format": "m/d/Y",
                "time_format": "h:i A",
            },
            LocaleFormat.ENGLISH_UK: {
                "name": "English (UK)",
                "native_name": "English (United Kingdom)",
                "language_code": "en",
                "country_code": "GB",
                "currency": "GBP",
                "date_format": "d/m/Y",
                "time_format": "H:i",
            }
        }
        
        return info.get(locale, {})
