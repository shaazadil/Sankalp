from typing import List, Dict, Any
from app.schemas.financial import RelocationCalculationRequest, RelocationCalculationResponse, LivingScenario
from app.engines.salary_engine import calculate_salary
from app.schemas.financial import SalaryCalculationRequest

CITY_DEPOSIT_MULTIPLIERS = {
    "bengaluru": 7.0,     # Typical 6 - 8 months rent locked
    "bangalore": 7.0,
    "mumbai": 5.0,        # 4 - 6 months
    "pune": 3.0,          # 2 - 3 months
    "hyderabad": 2.5,     # 2 - 3 months
    "gurgaon": 2.5,       # 2 months
    "delhi": 2.0,
    "kolkata": 2.0,
    "chennai": 6.0
}

def calculate_relocation(req: RelocationCalculationRequest) -> RelocationCalculationResponse:
    # 1. Calculate Estimated In-Hand Salary
    salary_res = calculate_salary(SalaryCalculationRequest(
        annual_ctc=req.annual_ctc,
        tax_regime="new",
        monthly_rent=req.expected_rent or 16000.0,
        is_metro=True
    ))
    in_hand = salary_res.estimated_monthly_in_hand
    family_support = req.family_support or 0.0
    current_savings = req.current_savings or 0.0
    dest_city_clean = req.destination_city.lower().strip()
    
    deposit_multiplier = CITY_DEPOSIT_MULTIPLIERS.get(dest_city_clean, 3.0)
    
    # 2. Build 3 Realistic Scenarios
    # Scenario A: Conservative (Shared Flat / Premium PG)
    rent_a = 12000.0
    food_a = 6000.0
    transit_a = 3500.0
    upi_a = 5000.0
    fixed_a = rent_a + food_a + transit_a + family_support
    savings_a = max(0.0, in_hand - fixed_a - upi_a)
    deposit_a = rent_a * (deposit_multiplier * 0.5 if "pg" in dest_city_clean else deposit_multiplier) # PG has lower deposit
    moving_sunk_a = 28000.0  # Train/flight, basic movers, 0 brokerage for PG
    rec_months_a = round((deposit_a + moving_sunk_a) / max(savings_a, 1000.0), 1)

    scenario_a = LivingScenario(
        name="Conservative (Shared Flat / Premium PG in HSR or Indiranagar)",
        monthly_rent=rent_a,
        monthly_food_groceries=food_a,
        monthly_transport_utilities=transit_a,
        monthly_family_support=family_support,
        monthly_guilt_free_upi=upi_a,
        monthly_savings_potential=round(savings_a, 2),
        locked_security_deposit=round(deposit_a, 2),
        sunk_moving_cost=round(moving_sunk_a, 2),
        deposit_recovery_months=rec_months_a,
        description="Ideal for the first 6 months. Low initial deposit, walk/metro to office, maximizing savings to build emergency cash."
    )

    # Scenario B: Balanced (Independent 1BHK in good locality)
    rent_b = req.expected_rent if req.expected_rent and req.expected_rent > 0 else 18000.0
    food_b = 9000.0
    transit_b = 4500.0
    upi_b = 7500.0
    fixed_b = rent_b + food_b + transit_b + family_support
    savings_b = max(0.0, in_hand - fixed_b - upi_b)
    deposit_b = rent_b * deposit_multiplier
    moving_sunk_b = 45000.0  # Packers, 1 month brokerage, 1 week temporary stay, room setup
    rec_months_b = round((deposit_b + moving_sunk_b) / max(savings_b, 1000.0), 1)

    scenario_b = LivingScenario(
        name="Balanced (Independent 1BHK / 2BHK Master Bed)",
        monthly_rent=rent_b,
        monthly_food_groceries=food_b,
        monthly_transport_utilities=transit_b,
        monthly_family_support=family_support,
        monthly_guilt_free_upi=upi_b,
        monthly_savings_potential=round(savings_b, 2),
        locked_security_deposit=round(deposit_b, 2),
        sunk_moving_cost=round(moving_sunk_b, 2),
        deposit_recovery_months=rec_months_b,
        description="Great balance of privacy and affordability. Requires upfront landlord deposit, but leaves a comfortable monthly cushion."
    )

    # Scenario C: Comfort (Gated Community Flat / Prime Location)
    rent_c = 26000.0
    food_c = 12000.0
    transit_c = 6500.0
    upi_c = 10000.0
    fixed_c = rent_c + food_c + transit_c + family_support
    savings_c = max(0.0, in_hand - fixed_c - upi_c)
    deposit_c = rent_c * deposit_multiplier
    moving_sunk_c = 60000.0  # Full packers, 1 month brokerage, appliance rental/purchase
    rec_months_c = round((deposit_c + moving_sunk_c) / max(savings_c, 1000.0), 1)

    scenario_c = LivingScenario(
        name="Comfort (Gated Society / Indiranagar / Koramangala)",
        monthly_rent=rent_c,
        monthly_food_groceries=food_c,
        monthly_transport_utilities=transit_c,
        monthly_family_support=family_support,
        monthly_guilt_free_upi=upi_c,
        monthly_savings_potential=round(savings_c, 2),
        locked_security_deposit=round(deposit_c, 2),
        sunk_moving_cost=round(moving_sunk_c, 2),
        deposit_recovery_months=rec_months_c,
        description="High convenience, clubhouse/gym amenities and easy commute, but higher deposit shock and tighter monthly savings buffer."
    )

    deposit_shock_insight = (
        f"🚨 The {req.destination_city} Deposit Shock: In {req.destination_city}, landlords typically demand "
        f"{deposit_multiplier:,.0f} months rent upfront as an interest-free security deposit. "
        f"For a ₹{rent_b:,.0f}/mo flat, that locks up ₹{deposit_b:,.0f} of liquid cash at 0% return! "
        f"Treat this as locked capital (not lost money), and keep at least ₹{deposit_b + moving_sunk_b:,.0f} ready for moving month."
    )

    action_plan = [
        f"Confirm in-hand salary of ~₹{in_hand:,.0f}/month with HR (avoid assuming gross ₹{req.annual_ctc/12:,.0f}).",
        f"Budget a one-time moving reserve of ₹{deposit_b + moving_sunk_b:,.0f} for {req.destination_city} (deposit + movers + brokerage).",
        f"Start with Scenario B (Balanced); it allows you to send ₹{family_support:,.0f} home while still saving ₹{savings_b:,.0f}/month.",
        f"Claim HRA on your rent receipts to reduce annual tax TDS by ₹18,000 – ₹24,000."
    ]

    return RelocationCalculationResponse(
        origin_city=req.origin_city,
        destination_city=req.destination_city,
        annual_ctc=req.annual_ctc,
        estimated_monthly_in_hand=in_hand,
        scenarios=[scenario_a, scenario_b, scenario_c],
        deposit_shock_insight=deposit_shock_insight,
        action_plan=action_plan
    )
