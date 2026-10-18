from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.user import User
from app.models.plan import FinancialPlan, PlanScenario
from app.schemas.plan import PlanCreateRequest, PlanResponse
from app.routers.auth import get_current_user

router = APIRouter()

@router.post("/create", response_model=PlanResponse)
async def create_plan(
    req: PlanCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Saves a personalized financial plan with scenarios for the authenticated user."""
    new_plan = FinancialPlan(
        user_id=current_user.id,
        title=req.title,
        goal_category=req.goal_category,
        target_amount=req.target_amount,
        target_months=req.target_months,
        monthly_income=req.monthly_income,
        total_fixed_expenses=req.total_fixed_expenses,
        total_emis=req.total_emis,
        family_support=req.family_support,
        monthly_savings_potential=req.monthly_savings_potential,
        emergency_runway_months=req.emergency_runway_months,
        health_score=req.health_score,
        summary=req.summary,
        assumptions=req.assumptions,
        action_steps=req.action_steps
    )
    db.add(new_plan)
    await db.flush()

    for sc in req.scenarios:
        scenario = PlanScenario(
            plan_id=new_plan.id,
            name=sc.name,
            is_recommended=sc.is_recommended,
            survival_pot=sc.survival_pot,
            family_pot=sc.family_pot,
            obligations_pot=sc.obligations_pot,
            growth_pot=sc.growth_pot,
            guilt_free_upi_pot=sc.guilt_free_upi_pot,
            one_time_cost=sc.one_time_cost,
            locked_deposit=sc.locked_deposit,
            recovery_months=sc.recovery_months,
            notes=sc.notes
        )
        db.add(scenario)

    await db.commit()
    
    # Reload with scenarios
    stmt = select(FinancialPlan).options(selectinload(FinancialPlan.scenarios)).where(FinancialPlan.id == new_plan.id)
    res = await db.execute(stmt)
    saved = res.scalar_one()
    return saved

@router.get("/my-plans", response_model=List[PlanResponse])
async def get_my_plans(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Fetches all saved plans belonging to the current logged-in user."""
    stmt = (
        select(FinancialPlan)
        .options(selectinload(FinancialPlan.scenarios))
        .where(FinancialPlan.user_id == current_user.id)
        .order_by(FinancialPlan.created_at.desc())
    )
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/{plan_id}", response_model=PlanResponse)
async def get_plan_by_id(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Fetches a specific plan, verifying ownership."""
    stmt = (
        select(FinancialPlan)
        .options(selectinload(FinancialPlan.scenarios))
        .where(FinancialPlan.id == plan_id, FinancialPlan.user_id == current_user.id)
    )
    res = await db.execute(stmt)
    plan = res.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

@router.delete("/{plan_id}")
async def delete_plan(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Deletes a saved plan."""
    stmt = select(FinancialPlan).where(FinancialPlan.id == plan_id, FinancialPlan.user_id == current_user.id)
    res = await db.execute(stmt)
    plan = res.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    await db.delete(plan)
    await db.commit()
    return {"status": "success", "message": "Plan deleted successfully"}
