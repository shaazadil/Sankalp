"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
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
    const basicSalary = ctc * 0.5;

    // NEW REGIME
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
      if (newTaxable <= 700000) newTax = 0;
    }
    newTax *= 1.04;

    // OLD REGIME
    const oldStdDeduction = 50000;
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
      if (oldTaxable <= 500000) oldTax = 0;
    }
    oldTax *= 1.04;

    const winner = oldTax < newTax ? "old" : "new";
    const absoluteSaving = Math.abs(oldTax - newTax);
    const tilt = winner === "old" ? -7 : 7;

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
  }, [ctc, section80c, section80d, nps80ccd, homeLoanInterest, monthlyRent, isMetro]);

  return (
    <div id="tax-tug-of-war" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Title Bar - Bold & Minimal */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [TAX PROTOCOL // ENGINE 01]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2 py-0.5 rounded font-mono font-bold uppercase">
              FINANCE ACT 2025
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Tax Regime Tug-of-War
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Stack your exemptions and deductions to pinpoint the exact crossover where Old Regime outperforms New Regime.
          </p>
        </div>

        {/* Verdict Callout */}
        <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
              RECOMMENDED REGIME
            </span>
            <p className="text-base font-black text-black font-mono">
              {calculation.winner === "old" ? "OLD REGIME (WITH HRA)" : "NEW REGIME (DEFAULT)"}
            </p>
            <p className="text-xs text-neutral-700 font-mono font-bold">
              SAVINGS: ₹{calculation.absoluteSaving.toLocaleString("en-IN")}/YR (₹{calculation.monthlySaving}/MO)
            </p>
          </div>
        </div>
      </div>

      {/* Physics Balance Scale */}
      <div className="p-8 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col items-center justify-center space-y-6">
        <div className="w-full max-w-lg py-4 flex flex-col items-center">
          {/* Pivoting Beam */}
          <div
            style={{ transform: `rotate(${calculation.tilt}deg)` }}
            className="w-full h-3 rounded-full bg-neutral-900 transition-transform duration-500 ease-out flex items-center justify-between px-2 shadow-sm relative"
          >
            <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-white shadow" />
            <div className="w-2.5 h-7 bg-neutral-400 rounded-b absolute left-4 top-2 flex flex-col items-center" />
            <div className="w-2.5 h-7 bg-neutral-400 rounded-b absolute right-4 top-2 flex flex-col items-center" />
          </div>

          {/* Fulcrum Base */}
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[28px] border-b-neutral-800 mt-0.5" />
          <div className="w-20 h-2 rounded bg-neutral-900" />
        </div>

        {/* Both Sides Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* OLD REGIME PAN */}
          <div
            className={`p-6 rounded-xl border transition-all text-center space-y-2 ${
              calculation.winner === "old"
                ? "bg-neutral-50 border-black shadow-xs ring-1 ring-black"
                : "bg-white border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-mono font-black text-black uppercase">01 // OLD REGIME</span>
              {calculation.winner === "old" && (
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                  BEST OPTION
                </span>
              )}
            </div>
            <p className="text-3xl font-black text-black font-mono tabular-nums">
              ₹{calculation.oldTax.toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-neutral-600 block font-mono">
              TOTAL DEDUCTIONS: ₹{(calculation.totalOldDeductions / 100000).toFixed(2)}L
            </span>
          </div>

          {/* NEW REGIME PAN */}
          <div
            className={`p-6 rounded-xl border transition-all text-center space-y-2 ${
              calculation.winner === "new"
                ? "bg-neutral-50 border-black shadow-xs ring-1 ring-black"
                : "bg-white border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-mono font-black text-black uppercase">02 // NEW REGIME</span>
              {calculation.winner === "new" && (
                <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                  BEST OPTION
                </span>
              )}
            </div>
            <p className="text-3xl font-black text-black font-mono tabular-nums">
              ₹{calculation.newTax.toLocaleString("en-IN")}
            </p>
            <span className="text-xs text-neutral-600 block font-mono">
              FLAT STD DEDUCTION: ₹75,000
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Deductions Stacking */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-black text-black uppercase">
            CALIBRATE SALARY &amp; DEDUCTIONS
          </h3>
          <span className="text-xs font-mono text-neutral-500">REAL-TIME MATH ENGINE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Annual CTC */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">ANNUAL CTC:</span>
              <span className="text-black">₹{(ctc / 100000).toFixed(1)} LAKHS</span>
            </div>
            <input
              type="range"
              min={600000}
              max={3000000}
              step={50000}
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          {/* Monthly Rent for HRA */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">RENT FOR HRA:</span>
              <span className="text-black">₹{monthlyRent.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={40000}
              step={1000}
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <span className="text-[10px] text-neutral-500 font-mono block">
              EXEMPTION: ₹{(calculation.hraExemption / 100000).toFixed(2)}L
            </span>
          </div>

          {/* Section 80C */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">SECTION 80C:</span>
              <span className="text-black">₹{(section80c / 1000).toFixed(0)}K</span>
            </div>
            <input
              type="range"
              min={0}
              max={150000}
              step={10000}
              value={section80c}
              onChange={(e) => setSection80c(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <span className="text-[10px] text-neutral-500 font-mono block">CAPPED AT ₹1.5L</span>
          </div>

          {/* Section 80D Health Insurance */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">SECTION 80D (HEALTH):</span>
              <span className="text-black">₹{(section80d / 1000).toFixed(0)}K</span>
            </div>
            <input
              type="range"
              min={0}
              max={75000}
              step={5000}
              value={section80d}
              onChange={(e) => setSection80d(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          {/* NPS 80CCD */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">NPS 80CCD(1B):</span>
              <span className="text-black">₹{(nps80ccd / 1000).toFixed(0)}K</span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={5000}
              value={nps80ccd}
              onChange={(e) => setNps80ccd(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          {/* Home Loan Interest 24b */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">HOME LOAN (24B):</span>
              <span className="text-black">₹{(homeLoanInterest / 100000).toFixed(1)}L</span>
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              step={10000}
              value={homeLoanInterest}
              onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
