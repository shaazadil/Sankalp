"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { SmartPotsDashboard } from "@/components/SmartPotsDashboard";
import { WhatIfSliders } from "@/components/WhatIfSliders";
import { HeroOmnibar } from "@/components/HeroOmnibar";
import { calculate5Pots, calculateSalary, Budget5PotsResponse, SalaryCalculationResponse } from "@/lib/api";

export default function BudgetPotsPage() {
  const [annualCtc, setAnnualCtc] = useState<number>(900000);
  const [monthlyRent, setMonthlyRent] = useState<number>(16000);
  const [familySupport, setFamilySupport] = useState<number>(10000);
  const [monthlySip, setMonthlySip] = useState<number>(12000);
  const [taxRegime, setTaxRegime] = useState<string>("new");
  const [activeEmis, setActiveEmis] = useState<number>(0);
  const [liquidSavings, setLiquidSavings] = useState<number>(150000);

  const [salaryData, setSalaryData] = useState<SalaryCalculationResponse | null>(null);
  const [potsData, setPotsData] = useState<Budget5PotsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCalculation = async (
    ctcVal: number,
    rentVal: number,
    familyVal: number,
    sipVal: number,
    regimeVal: string,
    emisVal: number
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCalculation(annualCtc, monthlyRent, familySupport, monthlySip, taxRegime, activeEmis);
  }, []);

  const handleSelectPrompt = (promptText: string) => {
    const lower = promptText.toLowerCase();
    if (lower.includes("wedding")) {
      setMonthlyRent(15000);
      setFamilySupport(8000);
      setMonthlySip(18000);
      runCalculation(annualCtc, 15000, 8000, 18000, taxRegime, 0);
    } else if (lower.includes("loan")) {
      setMonthlyRent(12000);
      setFamilySupport(5000);
      setMonthlySip(8000);
      setActiveEmis(16000);
      runCalculation(annualCtc, 12000, 5000, 8000, "old", 16000);
    } else {
      runCalculation(annualCtc, monthlyRent, familySupport, monthlySip, taxRegime, activeEmis);
    }
  };

  return (
    <DashboardShell
      title="Budget Studio & Zero-Based 5-Pots"
      subtitle="Guaranteed zero rupees left unaccounted: Survival, Obligations, Filial Family, Growth, and Guilt-Free UPI."
      badge="Core Engine 3"
    >
      <div className="space-y-6">
        <HeroOmnibar onSelectPrompt={handleSelectPrompt} isLoading={isLoading} />

        <SmartPotsDashboard
          potsData={potsData}
          salaryData={salaryData}
          goalCategory="budget"
        />

        <WhatIfSliders
          rent={monthlyRent}
          onRentChange={(val) => {
            setMonthlyRent(val);
            runCalculation(annualCtc, val, familySupport, monthlySip, taxRegime, activeEmis);
          }}
          familySupport={familySupport}
          onFamilySupportChange={(val) => {
            setFamilySupport(val);
            runCalculation(annualCtc, monthlyRent, val, monthlySip, taxRegime, activeEmis);
          }}
          sipInvestment={monthlySip}
          onSipChange={(val) => {
            setMonthlySip(val);
            runCalculation(annualCtc, monthlyRent, familySupport, val, taxRegime, activeEmis);
          }}
          taxRegime={taxRegime}
          onTaxRegimeChange={(val) => {
            setTaxRegime(val);
            runCalculation(annualCtc, monthlyRent, familySupport, monthlySip, val, activeEmis);
          }}
          onReset={() => {
            setMonthlyRent(16000);
            setFamilySupport(10000);
            setMonthlySip(12000);
            setTaxRegime("new");
            setActiveEmis(0);
            runCalculation(annualCtc, 16000, 10000, 12000, "new", 0);
          }}
        />
      </div>
    </DashboardShell>
  );
}
