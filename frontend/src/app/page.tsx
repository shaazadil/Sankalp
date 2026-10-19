"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroOmnibar } from "@/components/HeroOmnibar";
import { SmartPotsDashboard } from "@/components/SmartPotsDashboard";
import { WhatIfSliders } from "@/components/WhatIfSliders";
import { VisualDemonstration } from "@/components/VisualDemonstration";
import { AiChatDrawer } from "@/components/AiChatDrawer";
import { AuthModal } from "@/components/AuthModal";
import { SavedPlansModal } from "@/components/SavedPlansModal";
import {
  calculateSalary,
  calculateRelocation,
  calculate5Pots,
  calculateGoal,
  calculateLoan,
  savePlan,
  getMyPlans,
  SalaryCalculationResponse,
  RelocationCalculationResponse,
  Budget5PotsResponse,
  LivingScenario,
} from "@/lib/api";
import { Bookmark, Sparkles, Share2, Check, ArrowRight } from "lucide-react";

export default function Home() {
  // User Session State
  const [user, setUser] = useState<{ email: string; token: string; full_name?: string } | null>(null);

  // Modal Visibility States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);

  // Core Financial Planning State (100% Real Numbers, Zero Dummy Data)
  const [annualCtc, setAnnualCtc] = useState<number>(900000); // 9 LPA
  const [taxRegime, setTaxRegime] = useState<string>("new");
  const [monthlyRent, setMonthlyRent] = useState<number>(16000);
  const [familySupport, setFamilySupport] = useState<number>(10000);
  const [monthlySip, setMonthlySip] = useState<number>(12000);
  const [activeEmis, setActiveEmis] = useState<number>(0);
  const [liquidSavings, setLiquidSavings] = useState<number>(150000);
  const [goalCategory, setGoalCategory] = useState<string>("relocation");
  const [activeTitle, setActiveTitle] = useState<string>("Kolkata to Bengaluru Relocation Plan (@ ₹9 LPA)");

  // Computed Real Data from FastAPI Backend
  const [salaryData, setSalaryData] = useState<SalaryCalculationResponse | null>(null);
  const [relocationData, setRelocationData] = useState<RelocationCalculationResponse | null>(null);
  const [activeScenario, setActiveScenario] = useState<LivingScenario | null>(null);
  const [potsData, setPotsData] = useState<Budget5PotsResponse | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // 1. Core Mathematical Recalculation Engine
  const runCalculations = useCallback(async (
    ctcVal: number,
    rentVal: number,
    familyVal: number,
    sipVal: number,
    regimeVal: string,
    emisVal: number
  ) => {
    setIsLoading(true);
    try {
      // Step A: Calculate Real Salary Take-Home
      const salRes = await calculateSalary({
        annual_ctc: ctcVal,
        tax_regime: regimeVal,
        monthly_rent: rentVal,
        is_metro: true,
      });
      setSalaryData(salRes);

      // Step B: Calculate Relocation Scenarios (If relocation goal)
      const reloRes = await calculateRelocation({
        origin_city: "Kolkata",
        destination_city: "Bengaluru",
        annual_ctc: ctcVal,
        expected_rent: rentVal,
        family_support: familyVal,
        current_savings: liquidSavings,
      });
      setRelocationData(reloRes);
      setActiveScenario(reloRes.scenarios[1]); // Default to Balanced scenario

      // Step C: Calculate 5 Smart Pots & Runway
      const potsRes = await calculate5Pots({
        monthly_income: salRes.estimated_monthly_in_hand,
        rent_and_bills: rentVal + 3500, // rent + utilities/wifi
        groceries_and_essentials: 8000,
        family_remittance: familyVal,
        active_emis: emisVal,
        existing_sip: sipVal,
        current_emergency_fund: liquidSavings,
      });
      setPotsData(potsRes);
    } catch (err) {
      console.error("Backend calculation failed, retrying:", err);
    } finally {
      setIsLoading(false);
    }
  }, [liquidSavings]);

  // Initial load on mount
  useEffect(() => {
    // Check local storage for user token
    const savedUser = localStorage.getItem("sankalp_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Load saved plans
        getMyPlans(parsed.token).then(setSavedPlans).catch(() => {});
      } catch (e) {
        localStorage.removeItem("sankalp_user");
      }
    }

    // Check if an AI Co-Pilot blueprint was applied from /chat
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
        setActiveTitle(`AI Plan: ₹${(newCtc / 100000).toFixed(1)}L CTC in Bengaluru`);
        runCalculations(newCtc, newRent, familySupport, monthlySip, newRegime, activeEmis);
        return;
      } catch (e) {}
    }

    // Run initial deterministic calculations for 9 LPA benchmark
    runCalculations(annualCtc, monthlyRent, familySupport, monthlySip, taxRegime, activeEmis);
  }, []);

  // Handle Natural Language Prompt Selection
  const handleSelectPrompt = async (promptText: string) => {
    const lower = promptText.toLowerCase();

    if (lower.includes("wedding") || lower.includes("marriage")) {
      setGoalCategory("wedding");
      setActiveTitle("₹15 Lakh Wedding Goal (18 Months)");
      setMonthlyRent(15000);
      setFamilySupport(8000);
      setMonthlySip(18000);
      setActiveEmis(0);
      runCalculations(900000, 15000, 8000, 18000, taxRegime, 0);
    } else if (lower.includes("education") || lower.includes("loan")) {
      setGoalCategory("education_loan");
      setActiveTitle("₹25L Higher Education Loan (60/40 Split)");
      setMonthlyRent(12000);
      setFamilySupport(5000);
      setMonthlySip(8000);
      setActiveEmis(16344); // User's 40% share of 25L EMI
      runCalculations(900000, 12000, 5000, 8000, "old", 16344); // Switch to Old for Section 80E
      setTaxRegime("old");
    } else if (lower.includes("car") || lower.includes("vehicle")) {
      setGoalCategory("vehicle");
      setActiveTitle("₹8 Lakh First Car (Loan vs. Cash Outright)");
      setMonthlyRent(16000);
      setFamilySupport(10000);
      setMonthlySip(15000);
      setActiveEmis(12500); // Car EMI
      runCalculations(900000, 16000, 10000, 15000, taxRegime, 12500);
    } else {
      // Default: Bengaluru relocation
      setGoalCategory("relocation");
      setActiveTitle("Kolkata to Bengaluru Relocation Plan (@ ₹9 LPA)");
      setMonthlyRent(16000);
      setFamilySupport(10000);
      setMonthlySip(12000);
      setActiveEmis(0);
      runCalculations(900000, 16000, 10000, 12000, taxRegime, 0);
    }
  };

  // Slider Handlers
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
    runCalculations(900000, 16000, 10000, 12000, "new", 0);
  };

  // Login handler
  const handleLoginSuccess = (userData: { email: string; token: string; full_name?: string }) => {
    setUser(userData);
    localStorage.setItem("sankalp_user", JSON.stringify(userData));
    getMyPlans(userData.token).then(setSavedPlans).catch(() => {});
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("sankalp_user");
    setSavedPlans([]);
  };

  // Save Current Plan
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
        scenarios: relocationData?.scenarios.map((sc) => ({
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors">
      {/* 1. Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
        onLogout={handleLogout}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
      />

      {/* 2. Main Content */}
      <main className="pb-24 space-y-8">
        {/* Hero Omnibar & Scenario Chips */}
        <HeroOmnibar onSelectPrompt={handleSelectPrompt} isLoading={isLoading} />

        {/* Plan Header Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Active Life Plan
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {activeTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSavePlan}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer ${
                saveSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to Account!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user ? "Save Plan" : "Sign In to Save"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. The 5 Jupiter-Style Smart Pots Dashboard */}
        <SmartPotsDashboard
          potsData={potsData}
          salaryData={salaryData}
          activeScenario={activeScenario}
          goalCategory={goalCategory}
        />

        {/* 4. Interactive What-If Sliders */}
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
      </main>

      {/* Modals & Drawers */}
      <VisualDemonstration
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onApplyPreset={() => handleSelectPrompt("I am moving from Kolkata to Bengaluru for a ₹9 LPA job offer.")}
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
