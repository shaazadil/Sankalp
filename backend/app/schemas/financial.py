from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class SalaryCalculationRequest(BaseModel):
    annual_ctc: float = Field(..., description="Annual CTC in INR, e.g., 900000 for 9 LPA")
    tax_regime: str = Field("new", description="'new' or 'old'")
    monthly_rent: Optional[float] = Field(0.0, description="Monthly rent for HRA deduction in old regime")
    is_metro: Optional[bool] = Field(True, description="Metro city for HRA (50% vs 40%)")
    annual_education_loan_interest: Optional[float] = Field(0.0, description="Annual education loan interest for 80E")
    section_80c_investments: Optional[float] = Field(150000.0, description="80C investments for old regime")

class DeductionItem(BaseModel):
    name: str
    annual_amount: float
    monthly_amount: float
    description: str

class SalaryCalculationResponse(BaseModel):
    annual_ctc: float
    monthly_gross: float
    estimated_monthly_in_hand: float
    tax_regime: str
    annual_tax: float
    monthly_tax: float
    deductions: List[DeductionItem]
    old_regime_comparison: Optional[Dict[str, Any]] = None
    tax_savings_recommendation: Optional[str] = None

class LoanCalculationRequest(BaseModel):
    principal: float = Field(..., description="Total loan amount, e.g. 2500000 for 25L")
    annual_interest_rate: float = Field(..., description="Annual interest rate in %, e.g. 9.5")
    tenure_years: int = Field(..., description="Tenure in years, e.g. 7 or 10")
    family_contribution_percent: Optional[float] = Field(0.0, description="Family contribution % (e.g. 50%)")
    monthly_income: Optional[float] = Field(0.0, description="User's monthly in-hand income to test affordability")

class LoanCalculationResponse(BaseModel):
    principal: float
    annual_interest_rate: float
    tenure_months: int
    monthly_emi: float
    total_repayment: float
    total_interest: float
    family_share_emi: float
    user_share_emi: float
    affordability_status: str     # "Safe", "Tight", "Risky"
    emi_to_income_ratio: float    # percentage
    section_80e_monthly_tax_saving: float
    recommendation: str

class RelocationCalculationRequest(BaseModel):
    origin_city: str = Field("Kolkata", description="Origin city")
    destination_city: str = Field("Bengaluru", description="Destination city")
    annual_ctc: float = Field(900000.0, description="Annual CTC in INR")
    expected_rent: Optional[float] = Field(16000.0, description="Expected monthly rent")
    family_support: Optional[float] = Field(10000.0, description="Monthly remittance to parents")
    current_savings: Optional[float] = Field(150000.0, description="Available liquid savings")

class LivingScenario(BaseModel):
    name: str                     # "Conservative (Shared PG)", "Balanced (1BHK)", "Comfort (Gated Society)"
    monthly_rent: float
    monthly_food_groceries: float
    monthly_transport_utilities: float
    monthly_family_support: float
    monthly_guilt_free_upi: float
    monthly_savings_potential: float
    locked_security_deposit: float
    sunk_moving_cost: float
    deposit_recovery_months: float
    description: str

class RelocationCalculationResponse(BaseModel):
    origin_city: str
    destination_city: str
    annual_ctc: float
    estimated_monthly_in_hand: float
    scenarios: List[LivingScenario]
    deposit_shock_insight: str
    action_plan: List[str]

class GoalCalculationRequest(BaseModel):
    goal_name: str = Field(..., description="Wedding, First Car, Home Deposit, etc.")
    target_amount: float = Field(..., description="Target cost in INR")
    target_months: int = Field(..., description="Timeline in months")
    current_savings: Optional[float] = Field(0.0, description="Already saved")
    expected_annual_return: Optional[float] = Field(10.0, description="Expected CAGR % (e.g. 10% for equity/hybrid)")
    family_gift_amount: Optional[float] = Field(0.0, description="Family one-time contribution")
    monthly_in_hand: Optional[float] = Field(0.0, description="Monthly income to test affordability")
    is_wedding_or_gold_goal: Optional[bool] = Field(False, description="Whether to include SGB/Gold allocation")

class GoalCalculationResponse(BaseModel):
    goal_name: str
    target_amount: float
    net_target_after_family_help: float
    target_months: int
    required_monthly_sip: float
    required_monthly_fd: float
    gold_sgb_allocation: Optional[Dict[str, Any]] = None
    loan_alternative: Optional[Dict[str, Any]] = None
    is_feasible: bool
    affordability_verdict: str
    adjustment_suggestions: List[str]

class Budget5PotsRequest(BaseModel):
    monthly_income: float
    rent_and_bills: float
    groceries_and_essentials: float
    family_remittance: float
    active_emis: float
    existing_sip: float
    current_emergency_fund: float

class Budget5PotsResponse(BaseModel):
    monthly_income: float
    survival_pot: float
    survival_percent: float
    family_pot: float
    family_percent: float
    obligations_pot: float
    obligations_percent: float
    growth_pot: float
    growth_percent: float
    guilt_free_upi_pot: float
    guilt_free_percent: float
    emergency_runway_months: float
    health_score: int
    budget_conflicts: List[str]
    co_pilot_advice: str
