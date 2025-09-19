from sqlalchemy import Column, Integer, DateTime, ForeignKey, Float, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Purchase(Base):
    __tablename__ = "purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sweet_id = Column(Integer, ForeignKey("sweets.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String(50), default="completed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="purchases")
    sweet = relationship("Sweet", back_populates="purchases")