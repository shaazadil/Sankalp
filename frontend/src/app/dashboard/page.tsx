"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/AppSidebar";
import { HeroOmnibar } from "@/components/HeroOmnibar";
import { SmartPotsDashboard } from "@/components/SmartPotsDashboard";
import { WhatIfSliders } from "@/components/WhatIfSliders";
import { VisualDemonstration } from "@/components/VisualDemonstration";
import { AiChatDrawer } from "@/components/AiChatDrawer";
import { AuthModal } from "@/components/AuthModal";
import { SavedPlansModal } from "@/components/SavedPlansModal";
import {
  FinancialProfileModal,
  FinancialProfileFormValues,
} from "@/components/FinancialProfileModal";

// 13 Full Real Backend Interactive & Benchmark Engines
import { JobOfferBattleRoyale } from "@/components/JobOfferBattleRoyale";
import { TaxTugOfWar } from "@/components/TaxTugOfWar";
import { FamilyRemittanceCalibrator } from "@/components/FamilyRemittanceCalibrator";
import { LifestyleCreepTimeMachine } from "@/components/LifestyleCreepTimeMachine";
import { CommuteRentElasticity } from "@/components/CommuteRentElasticity";
import { ImpulseCoolingSandbox } from "@/components/ImpulseCoolingSandbox";
import { SabbaticalRunwayTank } from "@/components/SabbaticalRunwayTank";
import { ReverseMilestoneStudio } from "@/components/ReverseMilestoneStudio";
import { EmergencyChaosSimulator } from "@/components/EmergencyChaosSimulator";
import { AnonymousCohortRadar } from "@/components/AnonymousCohortRadar";
import { AccountAggregatorSync } from "@/components/AccountAggregatorSync";
import { OneTapBrokerExecution } from "@/components/OneTapBrokerExecution";
import { SankalpScoreMeter } from "@/components/SankalpScoreMeter";

import {
  calculateSalary,
  calculateRelocation,
  calculate5Pots,
  savePlan,
  getMyPlans,
  getFinancialProfile,
  updateFinancialProfile,
  SalaryCalculationResponse,
  RelocationCalculationResponse,
  Budget5PotsResponse,
  LivingScenario,
} from "@/lib/api";
import {
  Bookmark,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Sliders,
  Edit3,
  UserCheck,
  Building2,
  TrendingUp,
  AlertTriangle,
  Compass,
  Swords,
  Scale,
  Users,
  Flame,
  Zap,
  Target,
  Landmark,
  Layers,
  Award,
} from "lucide-react";

export default function DashboardPage() {
  // User Session State
  const [user, setUser] = useState<{ email: string; token: string; full_name?: string } | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Modal Visibility States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Core Financial Planning State (Fully User-Controlled)
  const [annualCtc, setAnnualCtc] = useState<number>(900000); // 9 LPA default
  const [taxRegime, setTaxRegime] = useState<string>("new");
  const [monthlyRent, setMonthlyRent] = useState<number>(16000);
  const [familySupport, setFamilySupport] = useState<number>(10000);
  const [monthlySip, setMonthlySip] = useState<number>(12000);
  const [activeEmis, setActiveEmis] = useState<number>(0);
  const [liquidSavings, setLiquidSavings] = useState<number>(150000);
  const [currentCity, setCurrentCity] = useState<string>("Kolkata");
  const [targetCity, setTargetCity] = useState<string>("Bengaluru");
  const [goalCategory, setGoalCategory] = useState<string>("relocation");
  const [activeTitle, setActiveTitle] = useState<string>("My Personalized Financial Plan");
  const [isCustomProfile, setIsCustomProfile] = useState<boolean>(false);

  // Computed Real Data from FastAPI Backend
  const [salaryData, setSalaryData] = useState<SalaryCalculationResponse | null>(null);
  const [relocationData, setRelocationData] = useState<RelocationCalculationResponse | null>(null);
  const [activeScenario, setActiveScenario] = useState<LivingScenario | null>(null);
  const [potsData, setPotsData] = useState<Budget5PotsResponse | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Core Mathematical Recalculation Engine
  const runCalculations = useCallback(
    async (
      ctcVal: number,
      rentVal: number,
      familyVal: number,
      sipVal: number,
      regimeVal: string,
      emisVal: number,
      fromCity = currentCity,
      toCity = targetCity
    ) => {
      setIsLoading(true);
      try {
        const salRes = await calculateSalary({
          annual_ctc: ctcVal,
          tax_regime: regimeVal,
          monthly_rent: rentVal,
          is_metro: true,
        });
        setSalaryData(salRes);

        const reloRes = await calculateRelocation({
          origin_city: fromCity,
          destination_city: toCity,
          annual_ctc: ctcVal,
          expected_rent: rentVal,
          family_support: familyVal,
          current_savings: liquidSavings,
        });
        setRelocationData(reloRes);
        setActiveScenario(reloRes.scenarios[1] || reloRes.scenarios[0]);

        const potsRes = await calculate5Pots({
          monthly_income: salRes.estimated_monthly_in_hand,
          rent_and_bills: rentVal + 3500,
          groceries_and_essentials: 8000,
          family_remittance: familyVal,
          active_emis: emisVal,
          existing_sip: sipVal,
          current_emergency_fund: liquidSavings,
        });
        setPotsData(potsRes);
      } catch (err) {
        console.error("Dashboard backend calculation failed:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [liquidSavings, currentCity, targetCity]
  );

  // Initial session & calculation check on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("sankalp_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        getMyPlans(parsed.token).then(setSavedPlans).catch(() => {});

        // Fetch user's saved financial profile from backend
        getFinancialProfile(parsed.token)
          .then((profile) => {
            if (profile) {
              setAnnualCtc(profile.annual_ctc);
              setTaxRegime(profile.tax_regime);
              setMonthlyRent(profile.current_rent);
              setFamilySupport(profile.family_support);
              setMonthlySip(profile.current_monthly_sip);
              setActiveEmis(profile.existing_emis);
              setLiquidSavings(profile.current_savings);
              setCurrentCity(profile.current_city);
              setTargetCity(profile.target_city);
              setGoalCategory(profile.active_goal);
              setIsCustomProfile(true);
              setActiveTitle(
                `${parsed.full_name || "My"} Plan: ₹${(profile.annual_ctc / 100000).toFixed(1)}L in ${profile.target_city}`
              );

              runCalculations(
                profile.annual_ctc,
                profile.current_rent,
                profile.family_support,
                profile.current_monthly_sip,
                profile.tax_regime,
                profile.existing_emis,
                profile.current_city,
                profile.target_city
              );
              return;
            }
          })
          .catch(() => {});
      } catch (e) {
        localStorage.removeItem("sankalp_user");
      }
    }
    setIsAuthChecked(true);

    const appliedPreviewRaw = sessionStorage.getItem("sankalp_applied_preview");
    if (appliedPreviewRaw) {
      try {
        const p = JSON.parse(appliedPreviewRaw);
        sessionStorage.removeItem("sankalp_applied_preview");
        const newCtc = p.annual_ctc || annualCtc;
        const newRent = p.balanced_rent || monthlyRent;
        const newRegime = p.recommended_regime || taxRegime;
        setAnnualCtc(newCtc);
        setMonthlyRent(newRent);
        setTaxRegime(newRegime);
        setIsCustomProfile(true);
        setActiveTitle(`AI Custom Blueprint: ₹${(newCtc / 100000).toFixed(1)}L Plan`);
        runCalculations(newCtc, newRent, familySupport, monthlySip, newRegime, activeEmis);
        return;
      } catch (e) {}
    }

    runCalculations(annualCtc, monthlyRent, familySupport, monthlySip, taxRegime, activeEmis);
  }, []);

  // Handle User Saving Custom Profile Details
  const handleSaveCustomProfile = async (values: FinancialProfileFormValues) => {
    setAnnualCtc(values.annual_ctc);
    setTaxRegime(values.tax_regime);
    setMonthlyRent(values.current_rent);
    setFamilySupport(values.family_support);
    setActiveEmis(values.existing_emis);
    setLiquidSavings(values.current_savings);
    setMonthlySip(values.current_monthly_sip);
    setCurrentCity(values.current_city);
    setTargetCity(values.target_city);
    setGoalCategory(values.active_goal);
    setIsCustomProfile(true);

    const titlePrefix = user?.full_name ? `${user.full_name}'s Plan` : "Personalized Life Plan";
    setActiveTitle(
      `${titlePrefix}: ₹${(values.annual_ctc / 100000).toFixed(1)}L (${values.current_city} → ${values.target_city})`
    );

    // Sync to backend if logged in
    if (user?.token) {
      updateFinancialProfile(values, user.token).catch(() => {});
    }

    // Run custom calculation
    runCalculations(
      values.annual_ctc,
      values.current_rent,
      values.family_support,
      values.current_monthly_sip,
      values.tax_regime,
      values.existing_emis,
      values.current_city,
      values.target_city
    );
  };

  const handleSelectPrompt = async (promptText: string) => {
    const lower = promptText.toLowerCase();

    if (lower.includes("wedding") || lower.includes("marriage")) {
      setGoalCategory("wedding");
      setActiveTitle("₹15 Lakh Wedding Goal (18 Months)");
      setMonthlyRent(15000);
      setFamilySupport(8000);
      setMonthlySip(18000);
      setActiveEmis(0);
      runCalculations(annualCtc, 15000, 8000, 18000, taxRegime, 0);
    } else if (lower.includes("education") || lower.includes("loan")) {
      setGoalCategory("education_loan");
      setActiveTitle("₹25L Higher Education Loan (60/40 Split)");
      setMonthlyRent(12000);
      setFamilySupport(5000);
      setMonthlySip(8000);
      setActiveEmis(16344);
      runCalculations(annualCtc, 12000, 5000, 8000, "old", 16344);
      setTaxRegime("old");
    } else if (lower.includes("car") || lower.includes("vehicle")) {
      setGoalCategory("vehicle");
      setActiveTitle("₹8 Lakh First Car (Loan vs. Cash Outright)");
      setMonthlyRent(16000);
      setFamilySupport(10000);
      setMonthlySip(15000);
      setActiveEmis(12500);
      runCalculations(annualCtc, 16000, 10000, 15000, taxRegime, 12500);
    } else {
      setGoalCategory("relocation");
      setActiveTitle(`${currentCity} to ${targetCity} Plan (@ ₹${(annualCtc / 100000).toFixed(1)} LPA)`);
      runCalculations(annualCtc, monthlyRent, familySupport, monthlySip, taxRegime, activeEmis);
    }
  };

  const handleRentChange = (newRent: number) => {
    setMonthlyRent(newRent);
    runCalculations(annualCtc, newRent, familySupport, monthlySip, taxRegime, activeEmis);
  };

  const handleFamilySupportChange = (newFamily: number) => {
    setFamilySupport(newFamily);
    runCalculations(annualCtc, monthlyRent, newFamily, monthlySip, taxRegime, activeEmis);
  };

  const handleSipChange = (newSip: number) => {
    setMonthlySip(newSip);
    runCalculations(annualCtc, monthlyRent, familySupport, newSip, taxRegime, activeEmis);
  };

  const handleTaxRegimeChange = (newRegime: string) => {
    setTaxRegime(newRegime);
    runCalculations(annualCtc, monthlyRent, familySupport, monthlySip, newRegime, activeEmis);
  };

  const handleReset = () => {
    setMonthlyRent(16000);
    setFamilySupport(10000);
    setMonthlySip(12000);
    setTaxRegime("new");
    setActiveEmis(0);
    runCalculations(annualCtc, 16000, 10000, 12000, "new", 0);
  };

  const handleLoginSuccess = (userData: { email: string; token: string; full_name?: string }) => {
    setUser(userData);
    localStorage.setItem("sankalp_user", JSON.stringify(userData));
    getMyPlans(userData.token).then(setSavedPlans).catch(() => {});
    getFinancialProfile(userData.token)
      .then((profile) => {
        if (profile) {
          handleSaveCustomProfile(profile);
        }
      })
      .catch(() => {});
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("sankalp_user");
    setSavedPlans([]);
  };

  const handleSavePlan = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (!potsData) return;

    try {
      const planPayload = {
        title: activeTitle,
        goal_category: goalCategory,
        monthly_income: potsData.monthly_income,
        total_fixed_expenses: potsData.survival_pot,
        total_emis: potsData.obligations_pot,
        family_support: potsData.family_pot,
        monthly_savings_potential: potsData.growth_pot,
        emergency_runway_months: potsData.emergency_runway_months,
        health_score: potsData.health_score,
        summary: potsData.co_pilot_advice,
        scenarios:
          relocationData?.scenarios.map((sc) => ({
            name: sc.name,
            survival_pot: sc.monthly_rent + sc.monthly_food_groceries + sc.monthly_transport_utilities,
            family_pot: sc.monthly_family_support,
            obligations_pot: 0,
            growth_pot: sc.monthly_savings_potential,
            guilt_free_upi_pot: sc.monthly_guilt_free_upi,
            one_time_cost: sc.sunk_moving_cost,
            locked_deposit: sc.locked_security_deposit,
            recovery_months: sc.deposit_recovery_months,
            notes: sc.description,
          })) || [],
      };

      await savePlan(planPayload, user.token);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      const updated = await getMyPlans(user.token);
      setSavedPlans(updated);
    } catch (err) {
      console.error("Save plan error:", err);
    }
  };

  const monthlyInHand = salaryData?.estimated_monthly_in_hand || 67116;
  const totalAllocated =
    (potsData?.survival_pot || 0) +
    (potsData?.obligations_pot || 0) +
    (potsData?.family_pot || 0) +
    (potsData?.growth_pot || 0) +
    (potsData?.guilt_free_upi_pot || 0);

  // If user is NOT logged in, show secure login gate inside the clean dark shell
  if (isAuthChecked && !user) {
    return (
      <div className="flex min-h-screen bg-[#080c14] text-slate-100">
        <AppSidebar
          user={null}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenPlans={() => setIsPlansOpen(true)}
          onOpenDemo={() => setIsDemoOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
          onLogout={handleLogout}
          currentCtc={annualCtc}
          currentCity={currentCity}
          targetCity={targetCity}
        />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-md w-full bg-[#0d1322] border border-white/[0.08] rounded-3xl p-7 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                Private Financial Workspace
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight font-heading">
                Unlock Your Dashboard
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                To keep your monthly salary, landlord deposit calculations, and family support allocations private, enter your email address for an instant 6-digit access code.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080c14] border border-white/[0.06] text-left space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero bank logins or passwords required</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant deterministic Indian tax calculations</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Save multiple life plans &amp; scenarios securely</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Sign In with Email Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Overview &amp; Public Demo</span>
              </Link>
            </div>
          </div>
        </main>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080c14] text-slate-100 font-sans">
      {/* 1. Desktop & Mobile Modern Sidebar */}
      <AppSidebar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onLogout={handleLogout}
        currentCtc={annualCtc}
        currentCity={currentCity}
        targetCity={targetCity}
      />

      {/* 2. Main Content Flight Deck */}
      <main className="flex-1 min-w-0 pb-20 overflow-y-auto">
        {/* Top Cockpit Command Header */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#080c14]/90 border-b border-white/[0.08] px-4 sm:px-8 py-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/20">
                  Zero-Based Engine
                </span>
                {isCustomProfile && (
                  <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-teal-500/20 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    Custom Profile Loaded
                  </span>
                )}
                {user && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    Signed in as <strong className="text-slate-200">{user.email}</strong>
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2 font-heading">
                <span>{activeTitle}</span>
              </h1>
            </div>

            {/* In-Hand, Allocated, Runway Metrics Ribbon */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-[#0d1322] px-3.5 py-2 rounded-xl border border-white/[0.08] shadow-inner">
                <div className="pr-3 border-r border-white/[0.08]">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
                    In-Hand
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white font-mono tabular-nums">
                    ₹{monthlyInHand.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="pr-3 border-r border-white/[0.08]">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-wider font-mono">
                    Allocated
                  </span>
                  <span className="text-sm sm:text-base font-bold text-emerald-300 font-mono tabular-nums">
                    ₹{totalAllocated.toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold text-teal-400 block tracking-wider font-mono">
                    Runway
                  </span>
                  <span className="text-sm sm:text-base font-bold text-teal-300 font-mono tabular-nums">
                    {potsData?.emergency_runway_months || 5.2} Mo
                  </span>
                </div>

                <button
                  onClick={handleSavePlan}
                  className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    saveSuccess
                      ? "bg-emerald-500 text-white"
                      : "bg-white/[0.08] hover:bg-white/[0.14] text-slate-200"
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3 h-3 text-slate-400" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>

              {/* Edit Profile Quick Trigger */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Adjust Baseline</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace Body */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* Segmented Category Switcher Bar */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0c111e] border border-white/[0.08] overflow-x-auto shadow-inner">
            {[
              { id: "all", label: "All 13 Features" },
              { id: "career", label: "Career & Mobility (3)" },
              { id: "tax_family", label: "Tax & Family Wealth (3)" },
              { id: "behavioral", label: "Behavioral & Goals (3)" },
              { id: "stress", label: "Stress & Resilience (2)" },
              { id: "benchmarks", label: "Industry Benchmarks (3)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ========================================================= */}
          {/* 1. FINANCIAL READINESS SCORE (Benchmark 3: CRED/FICO) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "stress" || activeCategory === "benchmarks") && (
            <div id="readiness-score" className="scroll-mt-24">
              <SankalpScoreMeter
                runwayMonths={Number(potsData?.emergency_runway_months || 5.2)}
                savingsRatePercent={Number(potsData?.growth_percent || 22)}
                taxEfficiency={88}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. CORE ZERO-BASED 5-POTS BUDGETING & WHAT-IF STUDIO */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "behavioral") && (
            <div id="pots-studio" className="space-y-6 scroll-mt-24">
              <HeroOmnibar onSelectPrompt={handleSelectPrompt} isLoading={isLoading} />

              <SmartPotsDashboard
                potsData={potsData}
                salaryData={salaryData}
                activeScenario={activeScenario}
                goalCategory={goalCategory}
              />

              <div id="what-if" className="scroll-mt-24">
                <WhatIfSliders
                  rent={monthlyRent}
                  onRentChange={handleRentChange}
                  familySupport={familySupport}
                  onFamilySupportChange={handleFamilySupportChange}
                  sipInvestment={monthlySip}
                  onSipChange={handleSipChange}
                  taxRegime={taxRegime}
                  onTaxRegimeChange={handleTaxRegimeChange}
                  onReset={handleReset}
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. RELOCATION RADAR (if available) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "career") && relocationData && (
            <div id="relocation" className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-4 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      City Relocation Radar: {currentCity} ➔ {targetCity}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Calculates metro deposit shock, brokerage sunk cost, and recovery runway.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  Cost Multiplier Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {relocationData.scenarios.map((sc, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      activeScenario?.name === sc.name
                        ? "bg-[#0f172a] border-blue-500/40 shadow-lg shadow-blue-500/5"
                        : "bg-[#080d17] border-white/[0.06] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-white">{sc.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ₹{sc.monthly_rent.toLocaleString("en-IN")}/mo rent
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>Locked Deposit:</span>
                        <span className="font-mono text-slate-200">
                          ₹{sc.locked_security_deposit.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunk Moving Cost:</span>
                        <span className="font-mono text-slate-200">
                          ₹{sc.sunk_moving_cost.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recovery Runway:</span>
                        <span className="font-mono text-emerald-400 font-semibold">
                          {sc.deposit_recovery_months} Months
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 1: JOB OFFER BATTLE ROYALE (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "career") && (
            <div id="battle-royale" className="scroll-mt-24">
              <JobOfferBattleRoyale />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 2: TAX REGIME TUG-OF-WAR (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "tax_family") && (
            <div id="tax-tug-of-war" className="scroll-mt-24">
              <TaxTugOfWar annualCtc={annualCtc} />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 3: FAMILY REMITTANCE & SHOCK CALIBRATOR (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "tax_family") && (
            <div id="family-calibrator" className="scroll-mt-24">
              <FamilyRemittanceCalibrator monthlyIncome={monthlyInHand} />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 4: LIFESTYLE CREEP TIME MACHINE (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "tax_family") && (
            <div id="lifestyle-creep" className="scroll-mt-24">
              <LifestyleCreepTimeMachine currentCtc={annualCtc} currentSip={monthlySip} />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 5: COMMUTE-RENT ELASTICITY ENGINE (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "career") && (
            <div id="commute-elasticity" className="scroll-mt-24">
              <CommuteRentElasticity />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 6: IMPULSE BUY 72-HOUR COOLING SANDBOX (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "behavioral") && (
            <div id="impulse-cooling" className="scroll-mt-24">
              <ImpulseCoolingSandbox monthlyIncome={monthlyInHand} />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 7: SABBATICAL & UPSKILLING RUNWAY RESERVOIR (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "career") && (
            <div id="sabbatical-runway" className="scroll-mt-24">
              <SabbaticalRunwayTank initialSavings={liquidSavings} />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 8: REVERSE MILESTONE SACRIFICE ACCELERATOR (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "behavioral") && (
            <div id="reverse-milestone" className="scroll-mt-24">
              <ReverseMilestoneStudio defaultTarget={2500000} />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 9: EMERGENCY DOMINO CHAOS STRESS-TESTER (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "stress") && (
            <div id="chaos-simulator" className="scroll-mt-24">
              <EmergencyChaosSimulator
                monthlyIncome={monthlyInHand}
                liquidSavings={liquidSavings}
                monthlyFixedLiving={monthlyRent + 12000}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 10: ANONYMOUS INDIAN TECH COHORT RADAR (Category-First) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "benchmarks") && (
            <div id="cohort-radar" className="scroll-mt-24">
              <AnonymousCohortRadar initialCtc={annualCtc} initialCity={targetCity} />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 11: RBI ACCOUNT AGGREGATOR INSTANT REAL-BANK SYNC (Benchmark 1) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "benchmarks") && (
            <div id="account-aggregator" className="scroll-mt-24">
              <AccountAggregatorSync />
            </div>
          )}

          {/* ========================================================= */}
          {/* FEATURE 12: 1-TAP BROKER MULTI-BASKET EXECUTION (Benchmark 2) */}
          {/* ========================================================= */}
          {(activeCategory === "all" || activeCategory === "benchmarks") && (
            <div id="broker-execution" className="scroll-mt-24">
              <OneTapBrokerExecution defaultAmount={monthlySip} />
            </div>
          )}

          {/* Sleek AI Financial Advisor Callout */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-[#0c111e] to-slate-900 border border-emerald-500/25 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Real-Time AI Co-Pilot
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                Need guidance navigating these 13 financial engines?
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Chat with Sankalp&apos;s AI agent—deeply grounded in your active salary math, city rent burdens, and family remittance needs.
              </p>
            </div>

            <button
              onClick={() => setIsChatOpen(true)}
              className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Drawer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <FinancialProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        initialValues={{
          annual_ctc: annualCtc,
          tax_regime: taxRegime,
          current_rent: monthlyRent,
          family_support: familySupport,
          existing_emis: activeEmis,
          current_savings: liquidSavings,
          current_monthly_sip: monthlySip,
          current_city: currentCity,
          target_city: targetCity,
          active_goal: goalCategory,
        }}
        onSave={handleSaveCustomProfile}
      />

      <VisualDemonstration
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onApplyPreset={() =>
          handleSelectPrompt("I am moving from Kolkata to Bengaluru for a ₹9 LPA job offer.")
        }
      />

      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        token={user?.token}
        onApplyPlanFromChat={(preview) => {
          if (preview?.annual_ctc) setAnnualCtc(preview.annual_ctc);
          if (preview?.balanced_rent) setMonthlyRent(preview.balanced_rent);
          setIsChatOpen(false);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <SavedPlansModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
        plans={savedPlans}
        onLoadPlan={(plan) => {
          setActiveTitle(plan.title);
          setGoalCategory(plan.goal_category);
          setMonthlyRent(plan.total_fixed_expenses - 3500);
          setFamilySupport(plan.family_support);
          setMonthlySip(plan.monthly_savings_potential);
        }}
        onDeletePlan={(planId) => {
          setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
        }}
      />
    </div>
  );
}
