from typing import List
from app.schemas.financial import Budget5PotsRequest, Budget5PotsResponse

def calculate_budget_5_pots(req: Budget5PotsRequest) -> Budget5PotsResponse:
    income = max(req.monthly_income, 1.0)
    
    # 1. Survival Pot (Rent, Utilities, Groceries, Commute)
    survival = req.rent_and_bills + req.groceries_and_essentials
    survival_pct = round((survival / income) * 100.0, 1)
    
    # 2. Family Care Pot (Parents' remittance, siblings)
    family = req.family_remittance
    family_pct = round((family / income) * 100.0, 1)
    
    # 3. Obligations Pot (Active EMIs, Debt service)
    obligations = req.active_emis
    obligations_pct = round((obligations / income) * 100.0, 1)
    
    # 4. Growth & Goals Pot (SIPs, PPF, Gold, Emergency replenishment)
    growth = req.existing_sip
    growth_pct = round((growth / income) * 100.0, 1)
    
    # 5. Guilt-Free UPI Spend (Discretionary balance)
    # Remaining cash after mandatory needs and investments
    total_allocated = survival + family + obligations + growth
    guilt_free = max(0.0, income - total_allocated)
    guilt_free_pct = round((guilt_free / income) * 100.0, 1)
    
    # Mandatory outflows for survival (if income stops tomorrow)
    mandatory_burn = survival + family + obligations
    runway_months = 0.0
    if mandatory_burn > 0:
        runway_months = round(req.current_emergency_fund / mandatory_burn, 1)
    else:
        runway_months = round(req.current_emergency_fund / max(income * 0.5, 1000.0), 1)

    # Budget Conflicts detection
    conflicts: List[str] = []
    if obligations_pct > 40.0:
        conflicts.append(f"⚠️ Heavy Debt Load: EMIs consume {obligations_pct}% of your in-hand salary (recommended: < 30%).")
    if (survival_pct + obligations_pct) > 70.0:
        conflicts.append(f"⚠️ High Fixed Burden: Fixed costs (Rent + Essentials + EMIs) consume {survival_pct + obligations_pct}% of income.")
    if guilt_free < (income * 0.08):
        conflicts.append("⚠️ UPI Pinch: Discretionary allowance is very tight (< 8% of salary). You risk dipping into investments for daily lifestyle.")
    if runway_months < 3.0:
        conflicts.append(f"⚠️ Low Safety Net: Your emergency fund covers only {runway_months} months of mandatory bills (ideal: 4-6 months).")
    if total_allocated > income:
        deficit = total_allocated - income
        conflicts.append(f"🚨 Budget Deficit: You are over-spending by ₹{deficit:,.0f}/month across your commitments.")

    # Health Score Calculation (0 to 100)
    score = 100
    # Penalty for high debt
    if obligations_pct > 40: score -= 25
    elif obligations_pct > 30: score -= 15
    # Penalty for low savings
    if growth_pct < 10: score -= 20
    elif growth_pct < 20: score -= 10
    # Penalty for low emergency runway
    if runway_months < 1: score -= 30
    elif runway_months < 3: score -= 15
    elif runway_months < 5: score -= 5
    # Penalty for deficit
    if total_allocated > income: score -= 35

    score = max(min(score, 100), 20)

    # Co-pilot friendly advice
    co_pilot_advice = ""
    if score >= 80:
        co_pilot_advice = (
            f"🌟 Stellar Financial Shape! You're balancing ₹{family:,.0f} in family care, investing {growth_pct}% "
            f"in growth, and maintaining a solid {runway_months}-month emergency buffer. Keep this up!"
        )
    elif score >= 60:
        co_pilot_advice = (
            f"👍 Balanced, but room to optimize. Your commitments are steady, but try bumping your emergency runway "
            f"from {runway_months} months to at least 4.5 months before taking on new EMIs."
        )
    else:
        co_pilot_advice = (
            f"⚡ High Pressure Setup: Between EMIs (₹{obligations:,.0f}) and fixed expenses (₹{survival:,.0f}), "
            f"your cash flow is stretched. Prioritize paying off high-interest debt and pause discretionary spikes."
        )

    return Budget5PotsResponse(
        monthly_income=round(income, 2),
        survival_pot=round(survival, 2),
        survival_percent=survival_pct,
        family_pot=round(family, 2),
        family_percent=family_pct,
        obligations_pot=round(obligations, 2),
        obligations_percent=obligations_pct,
        growth_pot=round(growth, 2),
        growth_percent=growth_pct,
        guilt_free_upi_pot=round(guilt_free, 2),
        guilt_free_percent=guilt_free_pct,
        emergency_runway_months=runway_months,
        health_score=score,
        budget_conflicts=conflicts,
        co_pilot_advice=co_pilot_advice
    )
