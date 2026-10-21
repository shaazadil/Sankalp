from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# 1. Job Offer Battle Royale
class OfferDetail(BaseModel):
    company: str = Field(..., description="Company name or offer label")
    ctc_lpa: float = Field(..., description="Headline CTC in LPA (e.g. 15.0)")
    city: str = Field("Bengaluru", description="Job location city")
    fixed_percent: float = Field(85.0, description="Percentage of CTC that is fixed base pay")
    variable_bonus_percent: float = Field(15.0, description="Annual performance variable bonus %")
    esop_annual_value_lakhs: float = Field(0.0, description="Annual ESOP vesting grant value in Lakhs")
    esop_confidence_percent: float = Field(50.0, description="Confidence in ESOP realization (0-100%)")
    joining_bonus_lakhs: float = Field(0.0, description="One-time upfront joining bonus in Lakhs")
    monthly_rent: Optional[float] = Field(None, description="Custom monthly rent or auto-calculated")

class OfferBattleRequest(BaseModel):
    offer_a: OfferDetail
    offer_b: OfferDetail

class OfferBattleMetrics(BaseModel):
    company: str
    city: str
    monthly_gross_fixed: float
    monthly_tax: float
    monthly_epf: float
    monthly_take_home_fixed: float
    monthly_rent: float
    monthly_living_costs: float
    monthly_disposable_cash: float
    annual_variable_expected: float
    risk_weighted_esop_annual: float
    three_year_net_wealth: float
    effective_hourly_rate: float

class OfferBattleResponse(BaseModel):
    metrics_a: OfferBattleMetrics
    metrics_b: OfferBattleMetrics
    winner: str # 'offer_a' or 'offer_b'
    three_year_wealth_difference: float
    monthly_disposable_difference: float
    verdict_summary: str

# 2. Tax Tug-of-War
class TaxTugRequest(BaseModel):
    annual_ctc: float = Field(..., description="Annual CTC in INR")
    monthly_rent: float = Field(0.0, description="Monthly rent paid for HRA deduction")
    is_metro: bool = Field(True, description="Metro city for 50% basic HRA cap")
    section_80c: float = Field(150000.0, description="EPF, PPF, ELSS (max 1.5L)")
    section_80d: float = Field(25000.0, description="Health insurance (self + parents)")
    nps_80ccd: float = Field(0.0, description="NPS 80CCD(1B) additional deduction (max 50k)")
    home_loan_interest_24b: float = Field(0.0, description="Home loan interest Section 24b (max 2L)")
    education_loan_interest_80e: float = Field(0.0, description="Section 80E interest")

class TaxTugResponse(BaseModel):
    annual_ctc: float
    new_regime_tax: float
    old_regime_tax: float
    total_old_deductions: float
    hra_exemption: float
    winning_regime: str # 'new' or 'old'
    annual_tax_saving: float
    monthly_tax_saving: float
    scale_tilt_degrees: float
    breakeven_deduction_required: float
    recommendation: str

# 3. Family Remittance Calibrator
class FamilyCalibratorRequest(BaseModel):
    monthly_in_hand: float = Field(..., description="Net monthly income")
    monthly_family_support: float = Field(..., description="Current remittance sent home")
    parent_age: int = Field(58, description="Age of eldest parent")
    parents_existing_insurance: float = Field(0.0, description="Existing health insurance cover in Lakhs")
    user_emergency_fund: float = Field(150000.0, description="Current emergency buffer")

class FamilyCalibratorResponse(BaseModel):
    monthly_remittance: float
    annual_remittance: float
    parent_medical_shock_risk_lakhs: float
    suggested_super_topup_cover_lakhs: float
    estimated_annual_insurance_premium: float
    emergency_fund_protection_percent: float
    remittance_safety_ratio: float
    insight: str

# 4. Lifestyle Creep Time Machine
class LifestyleCreepRequest(BaseModel):
    current_annual_ctc: float = Field(..., description="Current CTC")
    hike_percent: float = Field(15.0, description="Appraisal hike in %")
    current_age: int = Field(26, description="User current age")
    current_monthly_sip: float = Field(12000.0, description="Current monthly SIP")
    current_savings: float = Field(200000.0, description="Current net savings")
    sip_allocation_of_hike_percent: float = Field(50.0, description="% of hike directed to SIP (rest to lifestyle)")

class LifestyleCreepResponse(BaseModel):
    new_annual_ctc: float
    monthly_in_hand_increase: float
    additional_monthly_sip: float
    additional_lifestyle_spend: float
    baseline_freedom_age: int
    accelerated_freedom_age: int
    years_saved: int
    projected_wealth_at_60_baseline: float
    projected_wealth_at_60_accelerated: float
    lifestyle_inflation_warning: str

# 5. Commute vs Rent Elasticity Sandbox
class CommuteElasticityRequest(BaseModel):
    destination_city: str = Field("Bengaluru", description="Metro city")
    distance_from_office_km: float = Field(12.0, description="Distance from tech park in KM")
    commute_mode: str = Field("cab_metro", description="'cab', 'metro', 'bike', 'cab_metro'")
    office_days_per_week: int = Field(4, description="Days travelling to office")

class CommuteElasticityResponse(BaseModel):
    city: str
    distance_km: float
    estimated_monthly_rent: float
    estimated_monthly_commute_cost: float
    monthly_travel_hours: float
    annual_hours_lost_in_traffic: float
    total_monthly_housing_plus_commute: float
    sanity_index_score: int # 0 to 100
    recommendation: str

# 6. Impulse Buy 72-Hour Cooling Sandbox
class ImpulseCoolingRequest(BaseModel):
    item_name: str = Field(..., description="Name of gadget or purchase")
    item_cost: float = Field(..., description="Price of item in INR")
    monthly_in_hand: float = Field(..., description="User's monthly take-home salary")
    cooling_days: int = Field(30, description="Cooling period in days (30, 60, 90)")

class ImpulseCoolingResponse(BaseModel):
    item_name: str
    item_cost: float
    work_days_required: float
    opportunity_cost_arbitrage_30d: float
    opportunity_cost_10yr_equity: float
    carbon_and_regret_index: str
    cooling_verdict: str

# 7. Sabbatical / Career Pivot Runway Tank
class SabbaticalRunwayRequest(BaseModel):
    liquid_savings: float = Field(..., description="Available cash/FDs")
    monthly_survival_rent_bills: float = Field(..., description="Non-negotiable living cost")
    monthly_family_support: float = Field(0.0, description="Parent remittance")
    monthly_active_emis: float = Field(0.0, description="Active loans")
    pause_discretionary: bool = Field(True, description="Cut Swiggy/travel during sabbatical")
    discretionary_spend: float = Field(10000.0, description="Discretionary fun spend if unpaused")

class SabbaticalRunwayResponse(BaseModel):
    monthly_burn_rate: float
    runway_months: float
    runway_days: int
    max_sabbatical_date: str
    burn_reduction_tips: List[str]
    sustainability_verdict: str

# 8. Reverse Milestone Architecture
class ReverseMilestoneRequest(BaseModel):
    milestone_name: str = Field("3BHK Down Payment", description="Dream milestone")
    target_amount: float = Field(2000000.0, description="Target corpus in INR")
    current_savings_assigned: float = Field(200000.0, description="Currently saved for this")
    current_monthly_sip: float = Field(15000.0, description="Current monthly allocation")
    dining_out_cut_percent: float = Field(20.0, description="Sacrifice lever: Cut eating out %")
    travel_pause_percent: float = Field(50.0, description="Sacrifice lever: Cut weekend trips %")
    expected_cagr_percent: float = Field(12.0, description="Investment CAGR")

class ReverseMilestoneResponse(BaseModel):
    milestone_name: str
    target_amount: float
    baseline_months_required: int
    accelerated_months_required: int
    months_saved: int
    additional_monthly_capital_freed: float
    baseline_completion_date: str
    accelerated_completion_date: str
    milestone_feasibility: str

# 9. Emergency Domino Chaos Simulator
class ChaosTestRequest(BaseModel):
    monthly_income: float = Field(..., description="Monthly in-hand")
    liquid_savings: float = Field(..., description="Current liquid reserve")
    monthly_fixed_living: float = Field(..., description="Monthly fixed cost")
    active_shocks: List[str] = Field(..., description="List of shock IDs: 'layoff', 'medical', 'deposit_dispute', 'car_breakdown'")

class ChaosTestResponse(BaseModel):
    total_shock_damage: float
    remaining_liquid_buffer: float
    shortfall: float
    sip_liquidation_risk: bool
    resilience_score: int # 0-100
    domino_status: str # 'Absorbed', 'Strained', 'Broken'
    recovery_playbook: List[str]

# 10. Anonymous Cohort Radar
class CohortRadarRequest(BaseModel):
    age: int = Field(26, description="User age")
    annual_ctc: float = Field(1200000.0, description="Annual CTC in INR")
    city: str = Field("Bengaluru", description="Current city")
    monthly_sip: float = Field(15000.0, description="Monthly SIP")
    monthly_rent: float = Field(18000.0, description="Monthly rent")
    liquid_savings: float = Field(200000.0, description="Emergency reserve")

class CohortRadarResponse(BaseModel):
    cohort_label: str # e.g. "25-28 yo Software Dev in Bengaluru (10-15 LPA)"
    savings_rate_percentile: int # 0 to 100
    rent_to_income_percentile: int
    runway_months_percentile: int
    debt_burden_percentile: int
    tax_efficiency_percentile: int
    cohort_average_savings_rate: float
    user_savings_rate: float
    cohort_ranking_summary: str

# 11. Account Aggregator (AA) Auto-Sync Simulator
class AccountAggregatorSyncRequest(BaseModel):
    phone_number: str = Field(..., description="User mobile linked to bank")
    fiu_id: str = Field("onemoney", description="RBI Account Aggregator FIU")

class BankAccountSummary(BaseModel):
    bank_name: str
    account_type: str
    masked_account_number: str
    balance: float
    detected_monthly_salary_credit: float
    last_synced: str

class AccountAggregatorSyncResponse(BaseModel):
    sync_status: str
    consent_id: str
    accounts: List[BankAccountSummary]
    total_liquid_balance: float
    detected_monthly_cashflow: float
    auto_assigned_5pots: Dict[str, float]
    sync_timestamp: str

# 12. 1-Tap Broker / UPI Mandate Order Dispatch
class BrokerOrderExecutionRequest(BaseModel):
    broker_id: str = Field("zerodha", description="'zerodha', 'groww', 'smallcase', 'upstox'")
    pot_type: str = Field("growth", description="Which pot to execute")
    monthly_amount: float = Field(..., description="Monthly SIP amount to auto-mandate")
    basket_type: str = Field("nifty50_gold_hedge", description="Index / Smallcase asset basket")
    upi_vpa: str = Field("user@okhdfcbank", description="User UPI ID")

class BrokerOrderExecutionResponse(BaseModel):
    order_id: str
    broker: str
    mandate_status: str # 'Mandate_Created_Pending_Approval'
    upi_autopay_url: str
    basket_allocation: Dict[str, float]
    execution_verdict: str

# 13. Gamified Readiness Score & Perks
class ReadinessScoreRequest(BaseModel):
    annual_ctc: float = Field(..., description="Annual CTC")
    liquid_savings: float = Field(..., description="Liquid savings")
    monthly_fixed_expenses: float = Field(..., description="Rent + bills")
    monthly_sip: float = Field(..., description="Monthly SIP")
    has_parent_health_cover: bool = Field(False, description="Whether parent health cover is active")
    zero_based_adherence_percent: float = Field(95.0, description="Adherence to zero-based budget")

class MilestonePerk(BaseModel):
    title: str
    unlocked: bool
    threshold: int
    voucher_code: Optional[str] = None
    description: str

class ReadinessScoreResponse(BaseModel):
    total_score: int # 0 to 1000
    tier_label: str # 'Fragile', 'Balanced', 'Resilient', 'Bulletproof'
    pillar_scores: Dict[str, int]
    perks: List[MilestonePerk]
    recommendation: str
