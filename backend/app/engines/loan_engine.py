import math
from app.schemas.financial import LoanCalculationRequest, LoanCalculationResponse

def calculate_emi(principal: float, annual_rate: float, tenure_years: int) -> float:
    """Standard reducing balance EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1)"""
    if principal <= 0 or tenure_years <= 0:
        return 0.0
    if annual_rate <= 0:
        return round(principal / (tenure_years * 12), 2)
    
    monthly_r = (annual_rate / 100.0) / 12.0
    n = tenure_years * 12
    emi = principal * monthly_r * math.pow(1 + monthly_r, n) / (math.pow(1 + monthly_r, n) - 1)
    return round(emi, 2)

def calculate_loan(req: LoanCalculationRequest) -> LoanCalculationResponse:
    principal = req.principal
    rate = req.annual_interest_rate
    tenure_years = req.tenure_years
    tenure_months = tenure_years * 12
    monthly_income = req.monthly_income or 0.0
    family_split = min(max(req.family_contribution_percent or 0.0, 0.0), 100.0)
    
    total_emi = calculate_emi(principal, rate, tenure_years)
    total_repayment = round(total_emi * tenure_months, 2)
    total_interest = round(total_repayment - principal, 2)
    
    # Family share vs user share
    family_share_emi = round(total_emi * (family_split / 100.0), 2)
    user_share_emi = round(total_emi - family_share_emi, 2)
    
    # Affordability assessment
    emi_to_income = 0.0
    status = "Safe"
    recommendation = ""
    
    if monthly_income > 0:
        emi_to_income = round((user_share_emi / monthly_income) * 100.0, 1)
        if emi_to_income > 45.0:
            status = "Risky"
            recommendation = (
                f"⚠️ High Burden Alert: Your share of this EMI (₹{user_share_emi:,.0f}/mo) takes {emi_to_income}% of your monthly take-home. "
                f"In India, financial planners strongly advise keeping total EMIs under 35-40%. "
                f"Consider extending tenure from {tenure_years} to {tenure_years + 2} years or having family support a larger share."
            )
        elif emi_to_income > 30.0:
            status = "Tight"
            recommendation = (
                f"⚡ Moderate Commitment: Your EMI is {emi_to_income}% of your take-home. "
                f"It is manageable, but keep discretionary spending (UPI & dining out) disciplined."
            )
        else:
            status = "Safe"
            recommendation = (
                f"✅ Very Healthy: Your EMI is only {emi_to_income}% of your take-home. "
                f"You have ample room for living expenses, family support, and monthly SIPs."
            )
    else:
        status = "Unchecked (Income not provided)"
        recommendation = f"Total monthly EMI is ₹{total_emi:,.0f}. With {family_split:.0f}% family support, your contribution is ₹{user_share_emi:,.0f}/month."

    # Section 80E tax savings (for education loans)
    # Average monthly interest during early tenure is approx (Principal * Annual Rate / 12)
    # Tax saved at standard 20% slab under Old Regime:
    approx_annual_interest_early = principal * (rate / 100.0)
    monthly_80e_saving = round((approx_annual_interest_early * 0.208) / 12.0, 2)

    return LoanCalculationResponse(
        principal=principal,
        annual_interest_rate=rate,
        tenure_months=tenure_months,
        monthly_emi=total_emi,
        total_repayment=total_repayment,
        total_interest=total_interest,
        family_share_emi=family_share_emi,
        user_share_emi=user_share_emi,
        affordability_status=status,
        emi_to_income_ratio=emi_to_income,
        section_80e_monthly_tax_saving=monthly_80e_saving,
        recommendation=recommendation
    )
