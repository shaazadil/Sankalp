# Deterministic Financial Engine Unit Tests
from app.engines.salary_engine import calculate_salary
from app.engines.loan_engine import calculate_loan, calculate_emi
from app.engines.relocation_engine import calculate_relocation
from app.engines.goal_engine import calculate_goal
from app.engines.budget_engine import calculate_budget_5_pots
from app.schemas.financial import (
    SalaryCalculationRequest, LoanCalculationRequest,
    RelocationCalculationRequest, GoalCalculationRequest, Budget5PotsRequest
)

def test_salary_ctc_9_lpa():
    # Specification check: ₹9 LPA CTC is NOT ₹75,000 monthly take-home
    req = SalaryCalculationRequest(annual_ctc=900000.0, tax_regime="new", monthly_rent=16000.0)
    res = calculate_salary(req)
    
    assert res.annual_ctc == 900000.0
    assert res.monthly_gross == 75000.0
    # In-hand must reflect deductions (EPF, PT, standard deduction, tax) and be less than gross
    assert res.estimated_monthly_in_hand < res.monthly_gross
    assert 60000.0 <= res.estimated_monthly_in_hand <= 70000.0
    assert len(res.deductions) >= 3
    print(f"Test Passed: 9 LPA in-hand is Rs. {res.estimated_monthly_in_hand:,.2f}/mo (Gross: Rs. {res.monthly_gross:,.2f})")

def test_zero_interest_loan():
    # Edge case: zero interest loan
    emi = calculate_emi(principal=120000.0, annual_rate=0.0, tenure_years=1)
    assert emi == 10000.0
    print("Test Passed: Zero-interest loan EMI matches principal/months")

def test_education_loan_family_split_and_80e():
    req = LoanCalculationRequest(
        principal=2500000.0,
        annual_interest_rate=9.5,
        tenure_years=7,
        family_contribution_percent=60.0,
        monthly_income=70000.0
    )
    res = calculate_loan(req)
    assert res.monthly_emi > 0.0
    assert res.family_share_emi == round(res.monthly_emi * 0.60, 2)
    assert res.user_share_emi == round(res.monthly_emi * 0.40, 2)
    assert res.section_80e_monthly_tax_saving > 0.0
    print(f"Test Passed: Education loan split: Family=Rs. {res.family_share_emi}, Student=Rs. {res.user_share_emi}")

def test_relocation_kolkata_to_bengaluru():
    req = RelocationCalculationRequest(
        origin_city="Kolkata",
        destination_city="Bengaluru",
        annual_ctc=900000.0,
        expected_rent=16000.0,
        family_support=10000.0,
        current_savings=150000.0
    )
    res = calculate_relocation(req)
    assert len(res.scenarios) == 3
    # Check Bangalore deposit shock calculation
    balanced = res.scenarios[1]
    assert balanced.locked_security_deposit > 50000.0 # 6-8 months rent locked
    assert balanced.sunk_moving_cost > 0.0
    assert balanced.deposit_recovery_months > 0.0
    print(f"Test Passed: Bengaluru deposit shock: Rs. {balanced.locked_security_deposit} locked, recovery: {balanced.deposit_recovery_months} months")

def test_budget_5_pots_and_conflicts():
    # Stressed budget case: high EMI + high rent leaving deficit
    req = Budget5PotsRequest(
        monthly_income=65000.0,
        rent_and_bills=30000.0,
        groceries_and_essentials=15000.0,
        family_remittance=10000.0,
        active_emis=25000.0,
        existing_sip=5000.0,
        current_emergency_fund=50000.0
    )
    res = calculate_budget_5_pots(req)
    assert len(res.budget_conflicts) > 0
    assert res.health_score < 70
    print(f"Test Passed: Stressed budget flagged with {len(res.budget_conflicts)} conflicts, health score: {res.health_score}")

if __name__ == "__main__":
    test_salary_ctc_9_lpa()
    test_zero_interest_loan()
    test_education_loan_family_split_and_80e()
    test_relocation_kolkata_to_bengaluru()
    test_budget_5_pots_and_conflicts()
    print("ALL FINANCIAL ENGINE TESTS PASSED SUCCESSFULLY! [100% ACCURACY]")
