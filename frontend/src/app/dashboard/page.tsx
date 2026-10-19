"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
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
  Home,
  CheckCircle2,
  Sliders,
  Edit3,
  UserCheck,
  TrendingUp,
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
    setActiveTitle(`${titlePrefix}: ₹${(values.annual_ctc / 100000).toFixed(1)}L (${values.current_city} → ${values.target_city})`);

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
    // Fetch profile
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

  const monthlyInHand = salaryData?.estimated_monthly_in_hand || 62400;
  const totalAllocated =
    (potsData?.survival_pot || 0) +
    (potsData?.obligations_pot || 0) +
    (potsData?.family_pot || 0) +
    (potsData?.growth_pot || 0) +
    (potsData?.guilt_free_upi_pot || 0);

  // If user is NOT logged in, show secure login gate
  if (isAuthChecked && !user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col transition-colors">
        <Navbar
          user={null}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Private Workspace
              </span>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight font-heading">
                Sign In to View Your Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                To keep your monthly salary, landlord deposit calculations, and family support allocations 100% private, please enter your email address to unlock your dashboard.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero passwords — fast 6-digit email code</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Custom financial profile tailored to your real salary</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Save and reload multiple custom life plans</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer font-heading"
              >
                <Mail className="w-4 h-4" />
                <span>Sign In with Email Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Back to Overview</span>
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors">
      {/* 1. Global Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. User Command Bar / Master Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-zinc-900 text-white border-b border-emerald-800/40 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30">
                Zero-Based Cashflow System
              </span>
              {isCustomProfile && (
                <span className="px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 text-[10px] font-bold uppercase tracking-wider border border-teal-400/30 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Your Custom Numbers
                </span>
              )}
              {user && (
                <span className="text-xs text-zinc-300 font-medium">
                  Signed in as <strong className="text-white">{user.email}</strong>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 font-heading">
              <span>{activeTitle}</span>
            </h1>
            <p className="text-xs text-zinc-300 mt-0.5">
              Every rupee of your ₹{(annualCtc / 100000).toFixed(1)}L CTC is assigned according to your real commitments.
            </p>
          </div>

          {/* Action buttons & Stats */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Command Button: Enter Your Numbers */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 font-black text-xs shadow-lg shadow-emerald-400/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer font-heading"
            >
              <Edit3 className="w-4 h-4 text-zinc-950" />
              <span>Input My Exact Numbers</span>
            </button>

            {/* Ready to Assign Meter */}
            <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/30 shadow-lg">
              <div className="pr-3 border-r border-zinc-700/60">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                  In-Hand
                </span>
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  ₹{monthlyInHand.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="pr-3 border-r border-zinc-700/60">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  Allocated
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                  ₹{totalAllocated.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400 block tracking-wider">
                  Runway
                </span>
                <span className="text-base sm:text-lg font-black text-teal-300 font-mono">
                  {potsData?.emergency_runway_months || 5.2} Mo
                </span>
              </div>

              <button
                onClick={handleSavePlan}
                className={`ml-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center gap-1.5 ${
                  saveSuccess
                    ? "bg-emerald-500 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* User Agency Banner */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                Want to calculate based on your real salary slip &amp; rent?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                You are in complete command. Customize your salary, rent, family support, and active loans to see your custom blueprint.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shrink-0 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize My Numbers</span>
          </button>
        </div>

        {/* Omnibar & Milestone Prompt Switcher */}
        <HeroOmnibar onSelectPrompt={handleSelectPrompt} isLoading={isLoading} />

        {/* 4. The 5 Smart Money Pots Dashboard */}
        <SmartPotsDashboard
          potsData={potsData}
          salaryData={salaryData}
          activeScenario={activeScenario}
          goalCategory={goalCategory}
        />

        {/* 5. Interactive What-If Sliders */}
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

        {/* 6. Quick Action Callout to AI Advisor */}
        <div className="bg-gradient-to-r from-teal-950 via-zinc-900 to-emerald-950 border border-teal-800/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-heading">
                24/7 AI Milestone Advisor
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white font-heading">
              Have doubts about rent affordability or Old vs New Tax Regime?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Ask our Indian financial co-pilot anything in simple English—get instant answers on landlord deposits, Section 80E loan deductions, and wedding gold allocations.
            </p>
          </div>

          <Link
            href="/chat"
            className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 font-heading"
          >
            <Sparkles className="w-4 h-4 text-zinc-950 fill-zinc-950" />
            <span>Open AI Co-Pilot Webpage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
