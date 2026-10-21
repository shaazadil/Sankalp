from fastapi import APIRouter
from app.schemas.features import (
    OfferBattleRequest, OfferBattleResponse,
    TaxTugRequest, TaxTugResponse,
    FamilyCalibratorRequest, FamilyCalibratorResponse,
    LifestyleCreepRequest, LifestyleCreepResponse,
    CommuteElasticityRequest, CommuteElasticityResponse,
    ImpulseCoolingRequest, ImpulseCoolingResponse,
    SabbaticalRunwayRequest, SabbaticalRunwayResponse,
    ReverseMilestoneRequest, ReverseMilestoneResponse,
    ChaosTestRequest, ChaosTestResponse,
    CohortRadarRequest, CohortRadarResponse,
    AccountAggregatorSyncRequest, AccountAggregatorSyncResponse,
    BrokerOrderExecutionRequest, BrokerOrderExecutionResponse,
    ReadinessScoreRequest, ReadinessScoreResponse
)
from app.engines.advanced_engines import (
    compute_offer_battle,
    compute_tax_tug,
    compute_family_calibrator,
    compute_lifestyle_creep,
    compute_commute_elasticity,
    compute_impulse_cooling,
    compute_sabbatical_runway,
    compute_reverse_milestone,
    compute_chaos_test,
    compute_cohort_radar,
    compute_account_aggregator_sync,
    compute_broker_execution,
    compute_readiness_score
)

router = APIRouter()

# 1. Offer Battle Royale
@router.post("/offer-battle", response_model=OfferBattleResponse)
async def offer_battle_endpoint(req: OfferBattleRequest):
    return compute_offer_battle(req)

# 2. Tax Tug-of-War
@router.post("/tax-tug", response_model=TaxTugResponse)
async def tax_tug_endpoint(req: TaxTugRequest):
    return compute_tax_tug(req)

# 3. Family Remittance Calibrator
@router.post("/family-calibrator", response_model=FamilyCalibratorResponse)
async def family_calibrator_endpoint(req: FamilyCalibratorRequest):
    return compute_family_calibrator(req)

# 4. Lifestyle Creep Time Machine
@router.post("/lifestyle-creep", response_model=LifestyleCreepResponse)
async def lifestyle_creep_endpoint(req: LifestyleCreepRequest):
    return compute_lifestyle_creep(req)

# 5. Commute vs Rent Elasticity Sandbox
@router.post("/commute-elasticity", response_model=CommuteElasticityResponse)
async def commute_elasticity_endpoint(req: CommuteElasticityRequest):
    return compute_commute_elasticity(req)

# 6. Impulse Buy 72-Hour Cooling Sandbox
@router.post("/impulse-cooling", response_model=ImpulseCoolingResponse)
async def impulse_cooling_endpoint(req: ImpulseCoolingRequest):
    return compute_impulse_cooling(req)

# 7. Sabbatical / Career Pivot Runway Tank
@router.post("/sabbatical-runway", response_model=SabbaticalRunwayResponse)
async def sabbatical_runway_endpoint(req: SabbaticalRunwayRequest):
    return compute_sabbatical_runway(req)

# 8. Reverse Milestone Architecture
@router.post("/reverse-milestone", response_model=ReverseMilestoneResponse)
async def reverse_milestone_endpoint(req: ReverseMilestoneRequest):
    return compute_reverse_milestone(req)

# 9. Emergency Domino Chaos Simulator
@router.post("/chaos-test", response_model=ChaosTestResponse)
async def chaos_test_endpoint(req: ChaosTestRequest):
    return compute_chaos_test(req)

# 10. Anonymous Cohort Radar
@router.post("/cohort-radar", response_model=CohortRadarResponse)
async def cohort_radar_endpoint(req: CohortRadarRequest):
    return compute_cohort_radar(req)

# 11. RBI Account Aggregator (AA) Auto-Sync
@router.post("/account-aggregator", response_model=AccountAggregatorSyncResponse)
async def account_aggregator_endpoint(req: AccountAggregatorSyncRequest):
    return compute_account_aggregator_sync(req)

# 12. 1-Tap Broker / Mandate Execution
@router.post("/broker-execution", response_model=BrokerOrderExecutionResponse)
async def broker_execution_endpoint(req: BrokerOrderExecutionRequest):
    return compute_broker_execution(req)

# 13. Gamified Readiness Score & Perks
@router.post("/readiness-score", response_model=ReadinessScoreResponse)
async def readiness_score_endpoint(req: ReadinessScoreRequest):
    return compute_readiness_score(req)
