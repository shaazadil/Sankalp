from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ScenarioSchema(BaseModel):
    name: str
    is_recommended: bool = False
    survival_pot: float
    family_pot: float
    obligations_pot: float
    growth_pot: float
    guilt_free_upi_pot: float
    one_time_cost: float = 0.0
    locked_deposit: float = 0.0
    recovery_months: float = 0.0
    notes: Optional[str] = None

class PlanCreateRequest(BaseModel):
    title: str
    goal_category: str
    target_amount: Optional[float] = 0.0
    target_months: Optional[int] = 12
    monthly_income: float
    total_fixed_expenses: float
    total_emis: float
    family_support: float
    monthly_savings_potential: float
    emergency_runway_months: float
    health_score: int
    summary: str
    assumptions: List[Dict[str, Any]] = []
    action_steps: List[str] = []
    scenarios: List[ScenarioSchema] = []

class PlanResponse(BaseModel):
    id: str
    user_id: str
    title: str
    goal_category: str
    target_amount: float
    target_months: int
    monthly_income: float
    total_fixed_expenses: float
    total_emis: float
    family_support: float
    monthly_savings_potential: float
    emergency_runway_months: float
    health_score: int
    summary: Optional[str]
    assumptions: List[Dict[str, Any]]
    action_steps: List[str]
    scenarios: List[ScenarioSchema]
    created_at: datetime
    
    class Config:
        from_attributes = True
