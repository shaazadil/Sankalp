import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class FinancialPlan(Base):
    __tablename__ = "financial_plans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable=False)                 # e.g. "Kolkata to Bengaluru Relocation @ ₹9 LPA"
    goal_category = Column(String, nullable=False)         # relocation, education_loan, wedding, vehicle, monthly_budget
    target_amount = Column(Float, default=0.0)             # For milestone goals
    target_months = Column(Integer, default=12)
    
    # Financial snapshots
    monthly_income = Column(Float, nullable=False)
    total_fixed_expenses = Column(Float, default=0.0)
    total_emis = Column(Float, default=0.0)
    family_support = Column(Float, default=0.0)
    monthly_savings_potential = Column(Float, default=0.0)
    
    # Emergency Runway
    emergency_runway_months = Column(Float, default=0.0)
    health_score = Column(Integer, default=85)             # 0 to 100
    
    # AI summary and recommendations
    summary = Column(Text, nullable=True)
    assumptions = Column(JSON, default=list)               # [{"name": "Rent", "value": 16000, "type": "assumption"}]
    action_steps = Column(JSON, default=list)              # ["1. Set aside ₹1.2L deposit", "2. Switch to Old Tax Regime"]
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="plans")
    scenarios = relationship("PlanScenario", back_populates="plan", cascade="all, delete-orphan")

class PlanScenario(Base):
    __tablename__ = "plan_scenarios"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id = Column(String, ForeignKey("financial_plans.id"), nullable=False)
    
    name = Column(String, nullable=False)                  # "Conservative", "Balanced", "Comfort"
    is_recommended = Column(Boolean, default=False)
    
    # Smart Pots Allocation
    survival_pot = Column(Float, default=0.0)              # Rent, Food, Utilities, Commute
    family_pot = Column(Float, default=0.0)                # Parents' support
    obligations_pot = Column(Float, default=0.0)           # EMIs, debts
    growth_pot = Column(Float, default=0.0)                # SIPs, Emergency fund, Gold
    guilt_free_upi_pot = Column(Float, default=0.0)        # Discretionary spending
    
    # Milestone specific
    one_time_cost = Column(Float, default=0.0)             # Sunk moving cost or down payment
    locked_deposit = Column(Float, default=0.0)            # Landlord security deposit
    recovery_months = Column(Float, default=0.0)           # Months to replenish emergency fund
    
    notes = Column(Text, nullable=True)
    
    plan = relationship("FinancialPlan", back_populates="scenarios")
