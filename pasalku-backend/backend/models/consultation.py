from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.postgres import Base
from datetime import datetime

class Consultation(Base):
    __tablename__ = 'consultations'

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    problem_description = Column(Text, nullable=False)
    classification = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="consultations")

    def __repr__(self):
        return f"<Consultation(id={self.id}, user_id={self.user_id}, problem_description={self.problem_description})>"