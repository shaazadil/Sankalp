from fastapi import APIRouter
from app.schemas.financial import (
    SalaryCalculationRequest, SalaryCalculationResponse,
    LoanCalculationRequest, LoanCalculationResponse,
    RelocationCalculationRequest, RelocationCalculationResponse,
    GoalCalculationRequest, GoalCalculationResponse,
    Budget5PotsRequest, Budget5PotsResponse
)
from app.engines.salary_engine import calculate_salary
from app.engines.loan_engine import calculate_loan
from app.engines.relocation_engine import calculate_relocation
from app.engines.goal_engine import calculate_goal
from app.engines.budget_engine import calculate_budget_5_pots

router = APIRouter()

@router.post("/salary", response_model=SalaryCalculationResponse)
async def compute_salary_endpoint(req: SalaryCalculationRequest):
    """Calculates Indian CTC to monthly take-home, line-by-line deductions, and New vs Old regime."""
    return calculate_salary(req)

@router.post("/loan", response_model=LoanCalculationResponse)
async def compute_loan_endpoint(req: LoanCalculationRequest):
    """Calculates EMI, family share split, Section 80E tax savings, and affordability status."""
    return calculate_loan(req)

@router.post("/relocation", response_model=RelocationCalculationResponse)
async def compute_relocation_endpoint(req: RelocationCalculationRequest):
    """Calculates city relocation (e.g. Kolkata to Bengaluru), deposit shock, and 3 living tiers."""
    return calculate_relocation(req)

@router.post("/goal", response_model=GoalCalculationResponse)
async def compute_goal_endpoint(req: GoalCalculationRequest):
    """Calculates wedding, vehicle or major milestone SIP, Gold/SGB allocation, and buy vs loan."""
    return calculate_goal(req)

@router.post("/5pots", response_model=Budget5PotsResponse)
async def compute_5pots_endpoint(req: Budget5PotsRequest):
    """Calculates 5 Smart Pots, emergency runway months, and budget conflict detection."""
    return calculate_budget_5_pots(req)
