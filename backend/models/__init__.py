# Models package
from enum import Enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Enum as SQLEnum
from database import Base

class UserRole(str, Enum):
    PUBLIC = "public"
    LEGAL_PROFESSIONAL = "legal_professional"
    ADMIN = "admin"

    def __str__(self):
        return self.value

# Note: User model is now defined in user.py with enhanced Clerk integration
# Import the enhanced User model instead
try:
    from .user import User, UserRole as EnhancedUserRole
    __all__ = ['User', 'UserRole', 'EnhancedUserRole']
except ImportError:
    __all__ = ['UserRole']

# Import and export chat models
try:
    from backend.models.chat import ChatSession, AIQueryLog, SessionAnalytics
    __all__.extend(['ChatSession', 'AIQueryLog', 'SessionAnalytics'])
except ImportError:
    pass

# Import and export consultation models
try:
    from backend.models.consultation import ConsultationSession, ConsultationMessage, EvidenceRecord, LegalCategory
    __all__.extend(['ConsultationSession', 'ConsultationMessage', 'EvidenceRecord', 'LegalCategory'])
except ImportError:
    pass