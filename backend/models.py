import enum
from sqlalchemy import Column, Integer, String, Enum
from .database import Base

class UserRole(str, enum.Enum):
    PUBLIC = "public"
    LEGAL_PROFESSIONAL = "legal_professional"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.PUBLIC)
