import os
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from backend.core.config import get_settings

settings = get_settings()
DATABASE_URL = settings.DATABASE_URL  # Ensure this is set in your environment

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, index=True)
    hashed_password = Column(String)

class Consultation(Base):
    __tablename__ = 'consultations'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    description = Column(String)
    created_at = Column(String)

    user = relationship("User", back_populates="consultations")

User.consultations = relationship("Consultation", order_by=Consultation.id, back_populates="user")

class Chat(Base):
    __tablename__ = 'chats'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    message = Column(String)
    timestamp = Column(String)

    user = relationship("User", back_populates="chats")

User.chats = relationship("Chat", order_by=Chat.id, back_populates="user")

def init_db():
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=create_engine(DATABASE_URL))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()