"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calculateLoan, formatINR, LoanCalculationResponse } from "@/lib/api";

interface EducationLoanProps {
  monthlyIncome?: number;
}

export const EducationLoanEngine: React.FC<EducationLoanProps> = ({ monthlyIncome = 67000 }) => {
  const [principal, setPrincipal] = useState(2500000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(7);
  const [familySplit, setFamilySplit] = useState(40);
  const [result, setResult] = useState<LoanCalculationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateLoan({
        principal,
        annual_interest_rate: interestRate,
        tenure_years: tenureYears,
        family_contribution_percent: familySplit,
        monthly_income: monthlyIncome,
      });
      setResult(data);
    } catch (e) {
      console.error("Loan calculation error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [principal, interestRate, tenureYears, familySplit, monthlyIncome]);

  return (
    <div id="education-loans" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [DEBT SHIELD // ENGINE 04]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              SECTION 80E TAX DEDUCTION
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Education Loan &amp; Family EMI Splitter
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Model domestic and international degree debt, parent co-payment splits, and 100% tax-free interest under Section 80E.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
            <div className="h-11 w-11 rounded-lg bg-black text-white flex flex-col items-center justify-center font-mono">
              <span className="text-sm font-black leading-none">{Math.round(result.emi_to_income_ratio)}%</span>
              <span className="text-[9px] uppercase text-neutral-300 font-bold">RATIO</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                YOUR MONTHLY SHARE
              </span>
              <p className="text-sm font-black text-black font-mono">
                {formatINR(result.user_share_emi)}/MO
              </p>
              <p className="text-xs text-neutral-600 font-mono">
                FAMILY PAYS: {formatINR(result.family_share_emi)}/MO
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-black text-black uppercase">
              LOAN VARIABLES &amp; SPLIT
            </h3>
            <span className="text-xs font-mono text-neutral-500">[SBI / HDFC MODEL]</span>
          </div>

          {/* Principal Slider */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">LOAN PRINCIPAL:</span>
              <span className="text-black">{formatINR(principal)}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={8000000}
              step={50000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>₹5 Lakh (Domestic)</span>
              <span>₹40 Lakh (Overseas)</span>
              <span>₹80 Lakh (Ivy/MBA)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Interest Rate */}
            <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">RATE:</span>
                <span className="text-black">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={7.5}
                max={14.0}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>

            {/* Tenure */}
            <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">TENURE:</span>
                <span className="text-black">{tenureYears} YRS</span>
              </div>
              <input
                type="range"
                min={3}
                max={15}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>
          </div>

          {/* Family Contribution Split */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-black uppercase">FAMILY CO-PAY SHARE:</span>
              <span className="text-black">
                {familySplit}% FAMILY / {100 - familySplit}% YOU
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={familySplit}
              onChange={(e) => setFamilySplit(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>0% (Solo)</span>
              <span>50% (Halves)</span>
              <span>100% (Sponsored)</span>
            </div>
          </div>
        </div>

        {/* Results & Section 80E Math */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">TOTAL EMI</span>
                  <span className="text-xl font-black text-black font-mono mt-0.5 block">
                    {formatINR(result.monthly_emi)}/MO
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    TOTAL: {formatINR(result.total_repayment)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300">
                  <span className="text-[10px] font-mono uppercase text-black font-bold block">80E TAX SHIELD</span>
                  <span className="text-xl font-black text-black font-mono mt-0.5 block">
                    -{formatINR(result.section_80e_monthly_tax_saving)}/MO
                  </span>
                  <span className="text-[11px] text-neutral-600 font-mono font-bold">
                    TAX-FREE INTEREST (8 YRS)
                  </span>
                </div>
              </div>

              {/* Split Bar */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-black">YOU: {formatINR(result.user_share_emi)}</span>
                  <span className="text-neutral-600">PARENTS: {formatINR(result.family_share_emi)}</span>
                </div>
                <div className="w-full h-3 bg-neutral-200 rounded-md overflow-hidden flex border border-neutral-300">
                  <div className="bg-black h-full transition-all" style={{ width: `${100 - familySplit}%` }} />
                  <div className="bg-neutral-400 h-full transition-all" style={{ width: `${familySplit}%` }} />
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-700 space-y-1">
                <div className="font-black text-black uppercase">
                  {result.affordability_status}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {result.recommendation}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-neutral-500 text-xs font-mono">
              CALCULATING LOAN AMORTIZATION...
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>NO UPPER CAP ON 80E INTEREST</span>
            <span className="font-bold text-black">[INDIAN BANKING ACT]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
