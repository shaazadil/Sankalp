import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    current_city = Column(String, default="Kolkata")
    target_city = Column(String, default="Bengaluru")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    financial_profile = relationship("FinancialProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    plans = relationship("FinancialPlan", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")

class EmailOTP(Base):
    __tablename__ = "email_otps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, index=True, nullable=False)
    otp_code = Column(String(6), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Income metrics
    annual_ctc = Column(Float, default=900000.0)      # e.g. 9 LPA
    monthly_take_home = Column(Float, default=62400.0)
    tax_regime = Column(String, default="new")        # "new" or "old"
    
    # Commitments & Living
    current_rent = Column(Float, default=15000.0)
    family_support = Column(Float, default=10000.0)    # Sent to parents
    existing_emis = Column(Float, default=0.0)
    current_savings = Column(Float, default=150000.0)  # Emergency fund/savings
    current_monthly_sip = Column(Float, default=10000.0)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="financial_profile")
