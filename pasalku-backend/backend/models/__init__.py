from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from .user import User
from .consultation import Consultation
from .chat import Chat

# Import all models to ensure they are registered with SQLAlchemy
__all__ = ["User", "Consultation", "Chat"]