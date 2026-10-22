import math
from typing import Dict, Any, List
from app.schemas.financial import GoalCalculationRequest, GoalCalculationResponse
from app.engines.loan_engine import calculate_emi

def calculate_monthly_sip_required(target_corpus: float, months: int, annual_cagr: float) -> float:
    """Calculates required monthly SIP to reach target corpus with compound interest."""
    if months <= 0 or target_corpus <= 0:
        return 0.0
    if annual_cagr <= 0:
        return round(target_corpus / months, 2)
    
    monthly_rate = (annual_cagr / 100.0) / 12.0
    # Future Value of SIP: FV = P * ((1 + r)^n - 1) / r * (1 + r)
    # => P = FV * r / (((1 + r)^n - 1) * (1 + r))
    factor = (math.pow(1 + monthly_rate, months) - 1) * (1 + monthly_rate)
    sip = (target_corpus * monthly_rate) / factor
    return round(sip, 2)

def calculate_goal(req: GoalCalculationRequest) -> GoalCalculationResponse:
    goal_name = req.goal_name
    target = req.target_amount
    months = req.target_months
    current_savings = req.current_savings or 0.0
    family_gift = req.family_gift_amount or 0.0
    monthly_income = req.monthly_in_hand or req.monthly_income or 0.0
    
    # Net target remaining
    net_target = max(0.0, target - current_savings - family_gift)
    
    # SIP with expected CAGR (e.g., 11% hybrid/equity) vs safe RD/FD (e.g., 7% fixed return)
    sip_required = calculate_monthly_sip_required(net_target, months, req.expected_annual_return or 10.0)
    fd_required = calculate_monthly_sip_required(net_target, months, 6.8)
    
    # Gold & SGB allocation for weddings or traditional milestones
    gold_sgb_allocation = None
    if req.is_wedding_or_gold_goal or "wedding" in goal_name.lower() or "marriage" in goal_name.lower():
        gold_portion = net_target * 0.30
        equity_portion = net_target * 0.45
        debt_portion = net_target * 0.25
        
        gold_sgb_allocation = {
            "gold_allocation_inr": round(gold_portion, 2),
            "gold_allocation_percent": 30,
            "equity_sip_percent": 45,
            "liquid_debt_percent": 25,
            "monthly_gold_sgb_sip": round(calculate_monthly_sip_required(gold_portion, months, 9.0), 2),
            "monthly_equity_sip": round(calculate_monthly_sip_required(equity_portion, months, 12.0), 2),
            "monthly_debt_rd": round(calculate_monthly_sip_required(debt_portion, months, 7.0), 2),
            "insight": "Allocating 30% to Sovereign Gold Bonds (SGB) or Digital Gold protects against jewelry price spikes as your wedding approaches."
        }

    # Loan Alternative (e.g. for car, two-wheeler, or electronics)
    loan_alt = None
    if "car" in goal_name.lower() or "vehicle" in goal_name.lower() or "laptop" in goal_name.lower() or "bike" in goal_name.lower():
        # Typically 20% down payment, 80% loan at 9.5% for 4 years
        down_payment = round(target * 0.20, 2)
        loan_amount = target - down_payment
        car_tenure_years = min(max(int(months / 12), 2), 5)
        monthly_car_emi = calculate_emi(loan_amount, 9.5, car_tenure_years)
        total_loan_paid = round(monthly_car_emi * (car_tenure_years * 12), 2)
        extra_interest = round(total_loan_paid - loan_amount, 2)
        
        loan_alt = {
            "down_payment_required": down_payment,
            "loan_amount": loan_amount,
            "tenure_years": car_tenure_years,
            "interest_rate_percent": 9.5,
            "monthly_emi": monthly_car_emi,
            "total_interest_paid": extra_interest,
            "verdict": (
                f"Taking a loan costs ₹{extra_interest:,.0f} in interest over {car_tenure_years} years. "
                f"If you can save ₹{sip_required:,.0f}/month for {months} months, buying with savings saves you that ₹{extra_interest:,.0f}!"
            )
        }

    # Affordability verdict
    is_feasible = True
    verdict = ""
    adjustments: List[str] = []
    
    if monthly_income > 0:
        sip_ratio = (sip_required / monthly_income) * 100.0
        if sip_ratio > 40.0:
            is_feasible = False
            verdict = f"🔴 Stretched Budget: Required monthly savings of ₹{sip_required:,.0f} represents {sip_ratio:.0f}% of your take-home pay. This could severely strain your emergency fund or living expenses."
            
            # Suggest 3 realistic adjustments:
            # 1. Extend timeline by 6 months
            alt_months = months + 6
            alt_sip = calculate_monthly_sip_required(net_target, alt_months, req.expected_annual_return or 10.0)
            adjustments.append(f"Postpone deadline by 6 months (to {alt_months} months): Drops monthly savings to ₹{alt_sip:,.0f}/month.")
            
            # 2. Moderate target budget
            alt_target = round(target * 0.75, 2)
            alt_sip_target = calculate_monthly_sip_required(max(0.0, alt_target - current_savings - family_gift), months, req.expected_annual_return or 10.0)
            adjustments.append(f"Optimize budget by 25% (target ₹{alt_target:,.0f}): Lowers monthly requirement to ₹{alt_sip_target:,.0f}/month.")
            
            # 3. Request family contribution
            adjustments.append("Explore whether family can sponsor a specific milestone portion (e.g. venue catering or down payment).")
        elif sip_ratio > 25.0:
            verdict = f"🟡 Achievable with Discipline: Monthly savings of ₹{sip_required:,.0f} ({sip_ratio:.0f}% of income) is realistic if you trim dining out and discretionary UPI spending."
            adjustments.append("Automate your SIP deduction on salary day (1st to 5th of each month) to prevent accidental spending.")
        else:
            verdict = f"🟢 Highly Affordable: Monthly savings of ₹{sip_required:,.0f} is only {sip_ratio:.0f}% of your in-hand pay. You can comfortably hit your target without stress."
            adjustments.append("Start a dedicated Recurring Deposit or Flexi-SIP tagged specifically with this goal's name.")
    else:
        verdict = f"To achieve ₹{target:,.0f} in {months} months, you need to save ₹{sip_required:,.0f}/month in a disciplined SIP/RD."

    return GoalCalculationResponse(
        goal_name=goal_name,
        target_amount=target,
        net_target_after_family_help=net_target,
        target_months=months,
        required_monthly_sip=sip_required,
        required_monthly_fd=fd_required,
        gold_sgb_allocation=gold_sgb_allocation,
        loan_alternative=loan_alt,
        is_feasible=is_feasible,
        affordability_verdict=verdict,
        adjustment_suggestions=adjustments
    )
