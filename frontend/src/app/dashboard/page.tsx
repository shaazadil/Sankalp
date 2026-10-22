"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

interface EngineCardDef {
  id: string;
  num: string;
  title: string;
  category: "all" | "core" | "career" | "family" | "behavioral" | "execution";
  categoryLabel: string;
  badge: string;
  description: string;
  href: string;
}

const ENGINE_CARDS: EngineCardDef[] = [
  // Core Decision Engines
  {
    id: "tax-tug-of-war",
    num: "01",
    title: "Salary & Tax Regime Tug-of-War",
    category: "core",
    categoryLabel: "Core Engine 1",
    badge: "80C / 80D / New vs Old",
    description: "Compare Old Regime with deductions against New Simplified Tax Regime in real-time.",
    href: "/engines/tax-tug-of-war",
  },
  {
    id: "relocation",
    num: "02",
    title: "City Relocation & Deposit Shock",
    category: "core",
    categoryLabel: "Core Engine 2",
    badge: "10-Month Deposit Shock",
    description: "Model metro deposit shock, brokerage sunk costs, and cost of living adjustments.",
    href: "/engines/relocation",
  },
  {
    id: "budget-pots",
    num: "03",
    title: "Zero-Based 5-Pots Budget Studio",
    category: "core",
    categoryLabel: "Core Engine 3",
    badge: "Zero Rupees Left Behind",
    description: "Automate cashflow routing into Survival, Obligations, Family, Growth, and Guilt-Free pots.",
    href: "/engines/budget-pots",
  },
  {
    id: "education-loans",
    num: "04",
    title: "Education Loan & 80E Family Splitter",
    category: "core",
    categoryLabel: "Core Engine 4",
    badge: "Section 80E Tax Shield",
    description: "Model degree debt, 60/40 parent co-payment splits, and 100% tax-free interest deductions.",
    href: "/engines/education-loans",
  },
  {
    id: "goals-milestones",
    num: "05",
    title: "Life Milestone & Wedding Goal Planner",
    category: "core",
    categoryLabel: "Core Engine 5",
    badge: "SGB Gold Hedge",
    description: "Calculate exact monthly SIP required for weddings and home purchases factoring parent gifts.",
    href: "/engines/goals-milestones",
  },

  // Career & Mobility
  {
    id: "offer-battle",
    num: "06",
    title: "Job Offer Battle Royale",
    category: "career",
    categoryLabel: "Career & Mobility",
    badge: "Dual-Screen CTC Arena",
    description: "Compare headline CTC against true in-hand cash, rent deductions, ESOP probability, and 3-year net wealth.",
    href: "/engines/offer-battle",
  },
  {
    id: "commute-elasticity",
    num: "07",
    title: "Commute vs. Rent Elasticity Sandbox",
    category: "career",
    categoryLabel: "Career & Mobility",
    badge: "Sanity vs. Rent",
    description: "Factor in cab surges, metro links, and 300+ hours lost per year in Indian metro traffic.",
    href: "/engines/commute-elasticity",
  },
  {
    id: "sabbatical-runway",
    num: "08",
    title: "Sabbatical & Career Break Runway Tank",
    category: "career",
    categoryLabel: "Career & Mobility",
    badge: "Runway Reservoir",
    description: "Plan startup attempts, upskilling, and sabbatical breaks without liquidating long-term equity.",
    href: "/engines/sabbatical-runway",
  },

  // Tax & Family Wealth
  {
    id: "family-remittance",
    num: "09",
    title: "Family Remittance Guilt-Free Calibrator",
    category: "family",
    categoryLabel: "Tax & Family",
    badge: "Filial Care Shield",
    description: "Balance filial support to parents with retirement compounding, safeguarding against medical shocks.",
    href: "/engines/family-remittance",
  },
  {
    id: "lifestyle-creep",
    num: "10",
    title: "Lifestyle Creep FIRE Time Machine",
    category: "family",
    categoryLabel: "Tax & Family",
    badge: "FIRE Accelerator",
    description: "Calculate exact retirement years saved by splitting your appraisal hike into wealth SIPs.",
    href: "/engines/lifestyle-creep",
  },
  {
    id: "cohort-radar",
    num: "11",
    title: "Anonymous Indian Tech Cohort Radar",
    category: "family",
    categoryLabel: "Tax & Family",
    badge: "Peer Benchmark",
    description: "Benchmark your savings discipline, rent ratio, and runway against verified software engineers in your salary bracket.",
    href: "/engines/cohort-radar",
  },

  // Behavioral & Stress
  {
    id: "impulse-cooling",
    num: "12",
    title: "Impulse Buy 72-Hour Cooling Sandbox",
    category: "behavioral",
    categoryLabel: "Behavioral & Risk",
    badge: "Psychology Lens",
    description: "Convert impulsive purchases into human working days and 10-year compounding freedom.",
    href: "/engines/impulse-cooling",
  },
  {
    id: "reverse-milestone",
    num: "13",
    title: "Reverse Milestone Accelerator",
    category: "behavioral",
    categoryLabel: "Behavioral & Risk",
    badge: "Sacrifice Levers",
    description: "Dial dining out and travel micro-cuts to pull forward dream milestone dates by months.",
    href: "/engines/reverse-milestone",
  },
  {
    id: "chaos-simulator",
    num: "14",
    title: "Emergency Domino Chaos Stress-Tester",
    category: "behavioral",
    categoryLabel: "Behavioral & Risk",
    badge: "Stress-Testing Sandbox",
    description: "Trigger layoffs, medical emergencies, and deposit disputes to test 5-pots blast resilience.",
    href: "/engines/chaos-simulator",
  },

  // Execution & Benchmarks
  {
    id: "account-aggregator",
    num: "15",
    title: "Instant RBI Account Aggregator Bank Sync",
    category: "execution",
    categoryLabel: "Live Execution",
    badge: "RBI AA Framework",
    description: "Zero manual CSV uploads. Securely fetch live balances, salary credits, and auto-route them into your 5 Pots.",
    href: "/execution/account-aggregator",
  },
  {
    id: "broker-orders",
    num: "16",
    title: "1-Tap Broker Multi-Basket Execution",
    category: "execution",
    categoryLabel: "Live Execution",
    badge: "UPI AutoPay 2.0",
    description: "Dispatch SIP orders directly to Zerodha, Groww, or Smallcase via UPI AutoPay.",
    href: "/execution/broker-orders",
  },
  {
    id: "readiness-score",
    num: "17",
    title: "Financial Readiness Index",
    category: "execution",
    categoryLabel: "Live Execution",
    badge: "CRED/FICO Benchmark",
    description: "Multi-factor index analyzing emergency runway resilience, savings velocity, and tax efficiency.",
    href: "/engines/readiness-score",
  },
];

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

  // Core Financial Planning State
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
  const [activeTitle, setActiveTitle] = useState<string>("Executive Financial Plan");
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

  useEffect(() => {
    const savedUser = localStorage.getItem("sankalp_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        getMyPlans(parsed.token).then(setSavedPlans).catch(() => {});

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
                `${parsed.full_name || "My"} Plan: ₹${(profile.annual_ctc / 100000).toFixed(1)}L (${profile.target_city})`
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

    runCalculations(annualCtc, monthlyRent, familySupport, monthlySip, taxRegime, activeEmis);
  }, []);

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

    if (user?.token) {
      updateFinancialProfile(values, user.token).catch(() => {});
    }

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

  const filteredCards = ENGINE_CARDS.filter((card) => {
    if (activeCategory === "all") return true;
    return card.category === activeCategory;
  });

  // Auth Gate
  if (isAuthChecked && !user) {
    return (
      <div className="flex min-h-screen bg-[#F4F5F7] text-[#09090B] font-sans">
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
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full bg-white border border-neutral-300 rounded-3xl p-8 shadow-sm text-center space-y-6"
          >
            <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-300 text-black flex items-center justify-center mx-auto font-mono font-black text-sm">
              LOCK
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
                Private Workspace
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading">
                Unlock Dashboard
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Enter your email address to receive an instant access code and view your financial cockpit.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-2.5 text-xs sm:text-sm text-neutral-700 font-medium">
              <div className="flex items-center gap-2">
                <span className="font-mono text-black font-bold">—</span>
                <span>Zero bank logins or passwords required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-black font-bold">—</span>
                <span>Deterministic Indian tax &amp; salary algorithms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-black font-bold">—</span>
                <span>Save multiple life milestone plans</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-4 rounded-full bg-black text-white hover:bg-neutral-800 font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>SIGN IN WITH EMAIL</span>
                <span className="font-mono">→</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition"
              >
                <span>Explore Overview &amp; Public Demo →</span>
              </Link>
            </div>
          </motion.div>
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
    <div className="flex min-h-screen bg-[#F4F5F7] text-[#09090B] font-sans selection:bg-neutral-900 selection:text-white">
      {/* 1. Desktop & Mobile Sidebar */}
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

      {/* 2. Main Executive Flight Deck - Smooth Fluid Window Scrolling */}
      <main className="flex-1 min-w-0 pb-20">
        {/* Top Header */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-white/95 border-b border-neutral-200 px-4 sm:px-8 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-neutral-100 text-black text-xs font-mono font-bold uppercase tracking-wider border border-neutral-300">
                  EXECUTIVE COCKPIT
                </span>
                {isCustomProfile && (
                  <span className="px-3 py-1 rounded-full bg-neutral-200 text-black border border-neutral-400 text-xs font-mono font-black uppercase tracking-wider">
                    CUSTOM PROFILE
                  </span>
                )}
                {user && (
                  <span className="text-xs text-neutral-500 font-mono font-semibold">
                    USER: {user.email}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black font-heading">
                {activeTitle}
              </h1>
            </div>

            {/* Metrics Ribbon - Large Bold High-Contrast Numbers */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-neutral-50 px-5 py-2.5 rounded-full border border-neutral-200">
                <div className="pr-3 border-r border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block font-mono">
                    MONTHLY IN-HAND
                  </span>
                  <span className="text-base sm:text-xl font-black text-black font-mono tabular-nums">
                    ₹{monthlyInHand.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="pr-3 border-r border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block font-mono">
                    ALLOCATED
                  </span>
                  <span className="text-base sm:text-xl font-black text-black font-mono tabular-nums">
                    ₹{totalAllocated.toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block font-mono">
                    RUNWAY
                  </span>
                  <span className="text-base sm:text-xl font-black text-black font-mono tabular-nums">
                    {potsData?.emergency_runway_months || 5.2} MO
                  </span>
                </div>

                <button
                  onClick={handleSavePlan}
                  className={`ml-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer font-mono ${
                    saveSuccess
                      ? "bg-black text-white"
                      : "bg-white hover:bg-neutral-100 border border-neutral-300 text-black"
                  }`}
                >
                  {saveSuccess ? "SAVED ✓" : "SAVE PLAN"}
                </button>
              </div>

              {/* Adjust Baseline Trigger */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-extrabold transition shadow-sm cursor-pointer"
              >
                <span>ADJUST BASELINE</span>
                <span className="font-mono">→</span>
              </button>
            </div>
          </div>
        </header>

        {/* Executive Dashboard Body */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* Section 1: Financial Health Readiness Index */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SankalpScoreMeter
              runwayMonths={Number(potsData?.emergency_runway_months || 5.2)}
              savingsRatePercent={Number(potsData?.growth_percent || 22)}
              taxEfficiency={88}
            />
          </motion.div>

          {/* Section 2: Zero-Based 5-Pots Budget Cockpit */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-black font-heading">
                  Active Cashflow &amp; Zero-Based 5 Pots
                </h2>
                <p className="text-sm text-neutral-600 font-medium">
                  Deterministic routing across Survival, Obligations, Filial Family, Growth, and Guilt-Free UPI.
                </p>
              </div>
              <Link
                href="/engines/budget-pots"
                className="text-xs font-black text-black hover:underline flex items-center gap-1 transition font-mono uppercase"
              >
                <span>OPEN FULL STUDIO →</span>
              </Link>
            </div>

            <SmartPotsDashboard
              potsData={potsData}
              salaryData={salaryData}
              activeScenario={activeScenario}
              goalCategory={goalCategory}
            />

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

          {/* Section 3: Specialized Decision Engines Directory & Launchpad */}
          <div className="space-y-5 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <h2 className="text-2xl font-black text-black font-heading">
                  Dedicated Decision Engines (17 Specialized Modules)
                </h2>
                <p className="text-sm text-neutral-600 font-medium">
                  Select any engine below for an un-clustered, dedicated analysis workspace.
                </p>
              </div>

              {/* Category Filter Tabs - Rounded Full Pills */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-neutral-300 overflow-x-auto shadow-xs">
                {[
                  { id: "all", label: "ALL (17)" },
                  { id: "core", label: "CORE (5)" },
                  { id: "career", label: "CAREER (3)" },
                  { id: "family", label: "FAMILY (3)" },
                  { id: "behavioral", label: "BEHAVIOR (3)" },
                  { id: "execution", label: "EXECUTION (3)" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer font-mono ${
                      activeCategory === cat.id
                        ? "text-white bg-black font-black"
                        : "text-neutral-700 hover:text-black hover:bg-neutral-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Dedicated Engine Cards - Minimalist, Bold & Icon-Free */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCards.map((card) => {
                return (
                  <motion.div
                    key={card.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="p-6 rounded-3xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between space-y-4 hover:border-black transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-black bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-full">
                          {card.num}
                        </span>
                        <span className="text-xs font-mono font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                          {card.badge}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider font-mono block">
                          {card.categoryLabel}
                        </span>
                        <h3 className="text-lg font-black text-black font-heading mt-1 group-hover:underline">
                          {card.title}
                        </h3>
                        <p className="text-sm text-neutral-600 leading-relaxed mt-1.5 font-normal">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={card.href}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-black font-mono uppercase hover:underline"
                      >
                        <span>LAUNCH MODULE</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* AI Financial Advisor Callout */}
          <div className="bg-white border border-neutral-300 rounded-3xl p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-black" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  REAL-TIME AI FINANCIAL CO-PILOT
                </span>
              </div>
              <h3 className="text-xl font-black text-black font-heading">
                Need guidance navigating these 17 financial engines?
              </h3>
              <p className="text-sm text-neutral-600 font-medium max-w-xl">
                Chat with Sankalp&apos;s AI advisor—grounded in your active salary math, city rent burdens, and family remittance needs.
              </p>
            </div>

            <button
              onClick={() => setIsChatOpen(true)}
              className="shrink-0 flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white hover:bg-neutral-800 font-extrabold text-xs transition shadow-sm cursor-pointer font-sans"
            >
              <span>LAUNCH AI ADVISOR</span>
              <span className="font-mono">→</span>
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
