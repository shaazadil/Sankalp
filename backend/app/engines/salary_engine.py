from typing import Dict, Any, List
from app.schemas.financial import SalaryCalculationRequest, SalaryCalculationResponse, DeductionItem

def calculate_new_regime_tax(taxable_income: float) -> float:
    """Calculates income tax under the revised New Tax Regime (FY 2024-25/2025-26)."""
    if taxable_income <= 700000:
        return 0.0  # Full rebate u/s 87A
    
    tax = 0.0
    # Slabs:
    # 0 - 3,00,000: Nil
    # 3,00,001 - 7,00,000: 5%
    # 7,00,001 - 10,00,000: 10%
    # 10,00,001 - 12,00,000: 15%
    # 12,00,001 - 15,00,000: 20%
    # Above 15,00,000: 30%
    if taxable_income > 300000:
        tax += min(taxable_income - 300000, 400000) * 0.05
    if taxable_income > 700000:
        tax += min(taxable_income - 700000, 300000) * 0.10
    if taxable_income > 1000000:
        tax += min(taxable_income - 1000000, 200000) * 0.15
    if taxable_income > 1200000:
        tax += min(taxable_income - 1200000, 300000) * 0.20
    if taxable_income > 1500000:
        tax += (taxable_income - 1500000) * 0.30

    # 4% Health & Education Cess
    tax += tax * 0.04
    return round(tax, 2)

def calculate_old_regime_tax(taxable_income: float) -> float:
    """Calculates income tax under Old Tax Regime."""
    if taxable_income <= 500000:
        return 0.0  # Full rebate u/s 87A
    
    tax = 0.0
    # Slabs:
    # 0 - 2,50,000: Nil
    # 2,50,001 - 5,00,000: 5%
    # 5,00,001 - 10,00,000: 20%
    # Above 10,00,000: 30%
    if taxable_income > 250000:
        tax += min(taxable_income - 250000, 250000) * 0.05
    if taxable_income > 500000:
        tax += min(taxable_income - 500000, 500000) * 0.20
    if taxable_income > 1000000:
        tax += (taxable_income - 1000000) * 0.30
        
    tax += tax * 0.04
    return round(tax, 2)

def compute_hra_exemption(basic_salary: float, actual_rent_paid_annual: float, is_metro: bool = True) -> float:
    """Computes HRA exemption under Section 10(13A)."""
    if actual_rent_paid_annual <= 0:
        return 0.0
    
    # Standard assumption: HRA allowance is ~40-50% of basic
    hra_received = basic_salary * (0.50 if is_metro else 0.40)
    rent_minus_10_percent_basic = max(0.0, actual_rent_paid_annual - (0.10 * basic_salary))
    metro_limit = basic_salary * (0.50 if is_metro else 0.40)
    
    return min(hra_received, rent_minus_10_percent_basic, metro_limit)

def calculate_salary(req: SalaryCalculationRequest) -> SalaryCalculationResponse:
    ctc = max(0.0, req.annual_ctc)
    
    if ctc <= 0:
        return SalaryCalculationResponse(
            annual_ctc=0.0,
            monthly_gross=0.0,
            estimated_monthly_in_hand=0.0,
            tax_regime=req.tax_regime,
            annual_tax=0.0,
            monthly_tax=0.0,
            deductions=[],
            tax_savings_recommendation="Zero salary currently (Student / Pre-employment phase). No income tax applies. Once employed, Section 80E provides 100% tax deduction on education loan interest with no upper cap."
        )
    
    # Typical Indian corporate compensation structure:
    # Basic Salary is typically 40% to 50% of CTC
    basic_salary = ctc * 0.45
    monthly_gross = ctc / 12.0
    
    # 1. Employee Provident Fund (EPF)
    # 12% of basic, often capped at statutory ₹1,800/mo (₹21,600/yr) or 12% of basic
    # For CTCs like 9 LPA, many tech companies deduct ₹1,800/mo or 12% of basic
    monthly_epf_employee = min(basic_salary / 12.0 * 0.12, 1800.0 if ctc < 1200000 else basic_salary / 12.0 * 0.12)
    annual_epf_employee = monthly_epf_employee * 12.0
    
    # Employer EPF (included in CTC)
    annual_epf_employer = annual_epf_employee
    
    # 2. Gratuity (Approx 4.81% of basic salary per year, component of CTC)
    annual_gratuity = min(basic_salary * 0.0481, 20000.0)
    
    # 3. Professional Tax (Karnataka, Maharashtra, West Bengal is typically ₹200/mo, ₹2,400/yr)
    annual_pt = 2400.0
    
    # Deductions list
    deductions: List[DeductionItem] = []
    
    deductions.append(DeductionItem(
        name="Employee Provident Fund (EPF)",
        annual_amount=round(annual_epf_employee, 2),
        monthly_amount=round(annual_epf_employee / 12.0, 2),
        description="Statutory retirement savings (goes into your EPF account with ~8.25% interest)"
    ))
    
    deductions.append(DeductionItem(
        name="Employer PF & Gratuity (CTC component)",
        annual_amount=round(annual_epf_employer + annual_gratuity, 2),
        monthly_amount=round((annual_epf_employer + annual_gratuity) / 12.0, 2),
        description="Company benefits included in your annual CTC package, not paid in monthly cash"
    ))
    
    deductions.append(DeductionItem(
        name="Professional Tax (State PT)",
        annual_amount=round(annual_pt, 2),
        monthly_amount=round(annual_pt / 12.0, 2),
        description="Standard state government employment tax"
    ))
    
    # --- TAX CALCULATION (NEW REGIME) ---
    std_deduction_new = 75000.0
    gross_taxable_new = max(0.0, ctc - annual_epf_employer - annual_gratuity - std_deduction_new)
    tax_new = calculate_new_regime_tax(gross_taxable_new)
    
    # --- TAX CALCULATION (OLD REGIME) ---
    std_deduction_old = 50000.0
    annual_rent = (req.monthly_rent or 0.0) * 12.0
    hra_exemption = compute_hra_exemption(basic_salary, annual_rent, req.is_metro)
    sec_80c = min(req.section_80c_investments or 150000.0, 150000.0)
    sec_80e = req.annual_education_loan_interest or 0.0  # Unlimited deduction on education loan interest!
    
    total_old_exemptions = std_deduction_old + hra_exemption + sec_80c + sec_80e + annual_pt
    gross_taxable_old = max(0.0, ctc - annual_epf_employer - annual_gratuity - total_old_exemptions)
    tax_old = calculate_old_regime_tax(gross_taxable_old)
    
    # Active regime selection
    is_new = req.tax_regime.lower() == "new"
    active_tax = tax_new if is_new else tax_old
    monthly_tax = active_tax / 12.0
    
    deductions.append(DeductionItem(
        name=f"Income Tax TDS ({req.tax_regime.upper()} Regime)",
        annual_amount=round(active_tax, 2),
        monthly_amount=round(monthly_tax, 2),
        description="Estimated income tax deducted at source by your employer"
    ))
    
    total_annual_deductions = annual_epf_employee + annual_epf_employer + annual_gratuity + annual_pt + active_tax
    annual_in_hand = ctc - total_annual_deductions
    monthly_in_hand = round(annual_in_hand / 12.0, 2)
    
    # Old Regime Comparison
    monthly_in_hand_new = (ctc - (annual_epf_employee + annual_epf_employer + annual_gratuity + annual_pt + tax_new)) / 12.0
    monthly_in_hand_old = (ctc - (annual_epf_employee + annual_epf_employer + annual_gratuity + annual_pt + tax_old)) / 12.0
    
    diff_monthly = round(monthly_in_hand_old - monthly_in_hand_new, 2)
    
    tax_recommendation = ""
    if diff_monthly > 500:
        tax_recommendation = (
            f"💡 Pro-Tip: Switching to the Old Tax Regime gives you ₹{diff_monthly:,.0f} MORE take-home every month "
            f"(₹{diff_monthly*12:,.0f}/year extra) thanks to your HRA rent exemption and/or Section 80E education loan deduction."
        )
    elif diff_monthly < -500:
        tax_recommendation = (
            f"💡 Pro-Tip: The New Tax Regime is better for you by ₹{abs(diff_monthly):,.0f}/month "
            f"(₹{abs(diff_monthly)*12:,.0f}/year extra) due to lower standard tax slab rates and the ₹75,000 standard deduction."
        )
    else:
        tax_recommendation = "Both New and Old tax regimes yield almost identical take-home for your current profile."

    return SalaryCalculationResponse(
        annual_ctc=ctc,
        monthly_gross=round(monthly_gross, 2),
        estimated_monthly_in_hand=monthly_in_hand,
        tax_regime=req.tax_regime.upper(),
        annual_tax=round(active_tax, 2),
        monthly_tax=round(monthly_tax, 2),
        deductions=deductions,
        old_regime_comparison={
            "new_regime_monthly_in_hand": round(monthly_in_hand_new, 2),
            "old_regime_monthly_in_hand": round(monthly_in_hand_old, 2),
            "monthly_difference": diff_monthly,
            "hra_exemption_annual": round(hra_exemption, 2),
            "section_80e_deduction_annual": round(sec_80e, 2),
            "recommended_regime": "OLD" if diff_monthly > 500 else "NEW"
        },
        tax_savings_recommendation=tax_recommendation
    )
