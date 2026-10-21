"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Scale, Zap, Check, ArrowRight, ShieldAlert, Sparkles, Sliders, Info } from "lucide-react";
import { calculateTaxTug } from "@/lib/api";

interface TaxTugOfWarProps {
  annualCtc?: number;
}

export const TaxTugOfWar: React.FC<TaxTugOfWarProps> = ({ annualCtc = 1200000 }) => {
  const [ctc, setCtc] = useState<number>(annualCtc);
  const [section80c, setSection80c] = useState<number>(150000);
  const [section80d, setSection80d] = useState<number>(50000);
  const [nps80ccd, setNps80ccd] = useState<number>(50000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);
  const [monthlyRent, setMonthlyRent] = useState<number>(18000);
  const [isMetro, setIsMetro] = useState<boolean>(true);
  const [backendResult, setBackendResult] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    calculateTaxTug({
      annual_ctc: ctc,
      monthly_rent: monthlyRent,
      is_metro: isMetro,
      section_80c: section80c,
      section_80d: section80d,
      nps_80ccd: nps80ccd,
      home_loan_interest_24b: homeLoanInterest,
      education_loan_interest_80e: 0,
    })
      .then((data) => {
        if (isMounted) setBackendResult(data);
      })
      .catch((err) => console.error("Tax tug API error:", err));

    return () => {
      isMounted = false;
    };
  }, [ctc, section80c, section80d, nps80ccd, homeLoanInterest, monthlyRent, isMetro]);

  // Accurate Indian Tax Computation (FY 2024-25 / FY 2025-26 Finance Act)
  const calculation = useMemo(() => {
    // 1. Basic Salary assumption (50% of CTC)
    const basicSalary = ctc * 0.5;

    // 2. NEW REGIME MATH
    const newStdDeduction = 75000;
    const newTaxable = Math.max(0, ctc - newStdDeduction);
    let newTax = 0;

    if (newTaxable > 1500000) {
      newTax = 150000 + (newTaxable - 1500000) * 0.3;
    } else if (newTaxable > 1200000) {
      newTax = 90000 + (newTaxable - 1200000) * 0.2;
    } else if (newTaxable > 1000000) {
      newTax = 60000 + (newTaxable - 1000000) * 0.15;
    } else if (newTaxable > 700000) {
      newTax = 20000 + (newTaxable - 700000) * 0.1;
    } else if (newTaxable > 300000) {
      newTax = (newTaxable - 300000) * 0.05;
      if (newTaxable <= 700000) newTax = 0; // Section 87A rebate
    }
    newTax *= 1.04; // 4% Health & Education cess

    // 3. OLD REGIME MATH
    const oldStdDeduction = 50000;
    // HRA Exemption minimum
    const annualRent = monthlyRent * 12;
    const rentMinus10Percent = Math.max(0, annualRent - basicSalary * 0.1);
    const basicCap = isMetro ? basicSalary * 0.5 : basicSalary * 0.4;
    const actualHra = basicSalary * 0.4;
    const hraExemption = Math.min(actualHra, rentMinus10Percent, basicCap);

    const totalOldDeductions =
      oldStdDeduction +
      hraExemption +
      Math.min(section80c, 150000) +
      Math.min(section80d, 75000) +
      Math.min(nps80ccd, 50000) +
      Math.min(homeLoanInterest, 200000);

    const oldTaxable = Math.max(0, ctc - totalOldDeductions);
    let oldTax = 0;

    if (oldTaxable > 1000000) {
      oldTax = 112500 + (oldTaxable - 1000000) * 0.3;
    } else if (oldTaxable > 500000) {
      oldTax = 12500 + (oldTaxable - 500000) * 0.2;
    } else if (oldTaxable > 250000) {
      oldTax = (oldTaxable - 250000) * 0.05;
      if (oldTaxable <= 500000) oldTax = 0; // 87A rebate for old
    }
    oldTax *= 1.04;

    if (backendResult) {
      const diff = Math.round(backendResult.new_regime_tax - backendResult.old_regime_tax);
      const winner = backendResult.winning_regime;
      const absoluteSaving = Math.abs(diff);
      const tilt = winner === "old" ? -12 : 12;
      return {
        newTax: Math.round(backendResult.new_regime_tax),
        oldTax: Math.round(backendResult.old_regime_tax),
        totalOldDeductions: Math.round(backendResult.total_old_deductions),
        hraExemption: Math.round(backendResult.hra_exemption),
        winner,
        absoluteSaving,
        monthlySaving: Math.round(absoluteSaving / 12),
        tilt,
      };
    }

    const diff = Math.round(newTax - oldTax);
    const winner = diff > 0 ? "old" : "new";
    const absoluteSaving = Math.abs(diff);

    // Scale tilt angle calculation (-15 deg for Old, +15 deg for New)
    const tilt = winner === "old" ? -12 : 12;

    return {
      newTax: Math.round(newTax),
      oldTax: Math.round(oldTax),
      totalOldDeductions: Math.round(totalOldDeductions),
      hraExemption: Math.round(hraExemption),
      winner,
      absoluteSaving,
      monthlySaving: Math.round(absoluteSaving / 12),
      tilt,
    };
  }, [ctc, section80c, section80d, nps80ccd, homeLoanInterest, monthlyRent, isMetro, backendResult]);

  return (
    <div id="tax-tug-of-war" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Title Bar */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
                Tax Optimization Scale
              </span>
              <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded-full font-mono">
                Finance Act FY 25-26
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              Tax Regime Tug-of-War
            </h2>
            <p className="text-xs text-slate-400">
              Stack your real deductions onto the scale to see the exact tipping point where Old Regime beats New Regime.
            </p>
          </div>
        </div>

        {/* Verdict Callout */}
        <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Recommended Regime
            </span>
            <p className="text-sm font-bold text-emerald-400">
              {calculation.winner === "old" ? "Old Tax Regime (HRA & 80C)" : "New Tax Regime (Default)"}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Saves ₹{calculation.absoluteSaving.toLocaleString("en-IN")}/yr (₹{calculation.monthlySaving}/mo)
            </p>
          </div>
        </div>
      </div>

      {/* Visual Physics Balance Scale */}
      <div className="p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] shadow-inner flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
        {/* Fulcrum and Scale Bar */}
        <div className="w-full max-w-lg py-4 flex flex-col items-center">
          {/* Pivoting Beam */}
          <div
            style={{ transform: `rotate(${calculation.tilt}deg)` }}
            className="w-full h-3 rounded-full bg-gradient-to-r from-amber-400 via-slate-500 to-emerald-400 transition-transform duration-700 ease-out flex items-center justify-between px-2 shadow-lg relative"
          >
            {/* Center Pivot Point */}
            <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow" />

            {/* Left Pan Attachment */}
            <div className="w-2.5 h-8 bg-slate-600 rounded-b absolute left-4 top-2 flex flex-col items-center" />
            {/* Right Pan Attachment */}
            <div className="w-2.5 h-8 bg-slate-600 rounded-b absolute right-4 top-2 flex flex-col items-center" />
          </div>

          {/* Fulcrum Base */}
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[30px] border-b-slate-700 mt-0.5" />
          <div className="w-16 h-2 rounded-full bg-slate-800" />
        </div>

        {/* Both Sides Display */}
        <div className="grid grid-cols-2 gap-4 w-full pt-2">
          {/* OLD REGIME PAN */}
          <div
            className={`p-4 rounded-2xl border transition-all text-center space-y-2 ${
              calculation.winner === "old"
                ? "bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5"
                : "bg-[#0c111e] border-white/[0.06]"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-xs font-bold text-amber-300 font-heading">Old Regime</span>
              {calculation.winner === "old" && (
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  WINNER
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-white font-mono tabular-nums">
              ₹{calculation.oldTax.toLocaleString("en-IN")}
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">
              Total Deductions: ₹{(calculation.totalOldDeductions / 100000).toFixed(2)}L
            </span>
          </div>

          {/* NEW REGIME PAN */}
          <div
            className={`p-4 rounded-2xl border transition-all text-center space-y-2 ${
              calculation.winner === "new"
                ? "bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5"
                : "bg-[#0c111e] border-white/[0.06]"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-xs font-bold text-emerald-300 font-heading">New Regime</span>
              {calculation.winner === "new" && (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  WINNER
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-white font-mono tabular-nums">
              ₹{calculation.newTax.toLocaleString("en-IN")}
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">
              Flat Std Deduction: ₹75,000
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Deductions Stacking */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-400" />
          <span>Adjust Your Salary &amp; Deductions to Test Breakeven</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Annual CTC */}
          <div className="space-y-2 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Annual CTC:</span>
              <span className="font-mono font-bold text-white">₹{(ctc / 100000).toFixed(1)} Lakhs</span>
            </div>
            <input
              type="range"
              min={600000}
              max={3000000}
              step={50000}
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Monthly Rent for HRA */}
          <div className="space-y-2 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Monthly Rent (for HRA):</span>
              <span className="font-mono font-bold text-amber-300">₹{monthlyRent.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={40000}
              step={1000}
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono block">
              Calculated HRA Exemption: ₹{(calculation.hraExemption / 100000).toFixed(2)}L
            </span>
          </div>

          {/* Section 80C */}
          <div className="space-y-2 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Section 80C (EPF/PPF/ELSS):</span>
              <span className="font-mono font-bold text-slate-200">₹{(section80c / 1000).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min={0}
              max={150000}
              step={10000}
              value={section80c}
              onChange={(e) => setSection80c(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono block">Max Capped at ₹1.5 Lakhs</span>
          </div>

          {/* Section 80D Health Insurance */}
          <div className="space-y-2 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Section 80D (Health Insurance):</span>
              <span className="font-mono font-bold text-slate-200">₹{(section80d / 1000).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min={0}
              max={75000}
              step={5000}
              value={section80d}
              onChange={(e) => setSection80d(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* NPS 80CCD */}
          <div className="space-y-2 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Section 80CCD(1B) NPS:</span>
              <span className="font-mono font-bold text-slate-200">₹{(nps80ccd / 1000).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={5000}
              value={nps80ccd}
              onChange={(e) => setNps80ccd(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Home Loan Interest 24b */}
          <div className="space-y-2 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Home Loan Interest (24b):</span>
              <span className="font-mono font-bold text-slate-200">₹{(homeLoanInterest / 100000).toFixed(1)}L</span>
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              step={10000}
              value={homeLoanInterest}
              onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
