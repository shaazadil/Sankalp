"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FinancialProfileFormValues {
  annual_ctc: number;
  tax_regime: string;
  current_rent: number;
  family_support: number;
  existing_emis: number;
  current_savings: number;
  current_monthly_sip: number;
  current_city: string;
  target_city: string;
  active_goal: string;
}

interface FinancialProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: FinancialProfileFormValues;
  onSave: (values: FinancialProfileFormValues) => void;
}

const INDIAN_CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi-NCR",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Tier-2 / Other City",
];

const LIFE_GOALS = [
  { id: "relocation", tag: "RELOCATION", label: "Metro Relocation & Deposit Shield" },
  { id: "wedding", tag: "WEDDING", label: "₹15L Wedding in 18 Months" },
  { id: "education_loan", tag: "EDU LOAN", label: "₹25L Education Loan EMI & 80E" },
  { id: "vehicle", tag: "FIRST CAR", label: "First Car (Loan vs Cash)" },
  { id: "emergency_runway", tag: "RUNWAY", label: "Build 6-Month Emergency Runway" },
  { id: "wealth_growth", tag: "GROWTH", label: "Maximize Long-Term SIP & Wealth" },
];

export const FinancialProfileModal: React.FC<FinancialProfileModalProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSave,
}) => {
  const [ctc, setCtc] = useState<number>(initialValues.annual_ctc || 900000);
  const [rent, setRent] = useState<number>(initialValues.current_rent || 16000);
  const [family, setFamily] = useState<number>(initialValues.family_support || 10000);
  const [emis, setEmis] = useState<number>(initialValues.existing_emis || 0);
  const [savings, setSavings] = useState<number>(initialValues.current_savings || 150000);
  const [sip, setSip] = useState<number>(initialValues.current_monthly_sip || 12000);
  const [currentCity, setCurrentCity] = useState<string>(initialValues.current_city || "Kolkata");
  const [targetCity, setTargetCity] = useState<string>(initialValues.target_city || "Bengaluru");
  const [taxRegime, setTaxRegime] = useState<string>(initialValues.tax_regime || "new");
  const [activeGoal, setActiveGoal] = useState<string>(initialValues.active_goal || "relocation");

  if (!isOpen) return null;

  const monthlyGross = Math.round(ctc / 12);
  const estimatedTax =
    taxRegime === "new"
      ? Math.max(0, Math.round(((ctc - 775000) * 0.1) / 12))
      : Math.round(monthlyGross * 0.12);
  const epfDeduction = Math.round(Math.min(monthlyGross * 0.5, 15000) * 0.12);
  const liveInHand = Math.max(20000, monthlyGross - estimatedTax - epfDeduction - 200);
  const maxSafeRent = Math.round(liveInHand * 0.3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      annual_ctc: ctc,
      tax_regime: taxRegime,
      current_rent: rent,
      family_support: family,
      existing_emis: emis,
      current_savings: savings,
      current_monthly_sip: sip,
      current_city: currentCity,
      target_city: targetCity,
      active_goal: activeGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-black">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                [INPUT PARAMETERS]
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight font-heading mt-1">
              Customize Your Real Financial Profile
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              Enter your verified salary, cities, and family commitments to run mathematical models.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-mono font-bold text-neutral-500 hover:text-black px-2 py-1 rounded bg-neutral-100 cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>

        {/* Live Calculation Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F8F9FA] border border-neutral-300 font-mono">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">
              ANNUAL SALARY (CTC)
            </span>
            <span className="text-lg font-black text-black">
              ₹{(ctc / 100000).toFixed(1)} LPA
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">
              EST. MONTHLY IN-HAND
            </span>
            <span className="text-lg font-black text-black">
              ₹{liveInHand.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">
              MAX SAFE RENT CAP (30%)
            </span>
            <span className="text-lg font-black text-black">
              ₹{maxSafeRent.toLocaleString("en-IN")}/MO
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5 font-mono">
          {/* Section 1: Income & Tax */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              01 // SALARY &amp; TAX REGIME
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  ANNUAL CTC (₹)
                </label>
                <input
                  type="number"
                  step={25000}
                  min={300000}
                  max={10000000}
                  value={ctc}
                  onChange={(e) => setCtc(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-xs sm:text-sm font-bold text-black focus:outline-none focus:border-black"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[600000, 900000, 1200000, 1500000, 2400000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCtc(val)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer ${
                        ctc === val
                          ? "bg-black text-white border-black font-black"
                          : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                      }`}
                    >
                      ₹{(val / 100000).toFixed(0)}L
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  TAX REGIME PREFERENCE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTaxRegime("new")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                      taxRegime === "new"
                        ? "bg-black text-white border-black"
                        : "bg-[#F8F9FA] border-neutral-300 text-neutral-700 hover:border-black"
                    }`}
                  >
                    NEW REGIME
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxRegime("old")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                      taxRegime === "old"
                        ? "bg-black text-white border-black"
                        : "bg-[#F8F9FA] border-neutral-300 text-neutral-700 hover:border-black"
                    }`}
                  >
                    OLD REGIME (80C)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Cities & Rent */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              02 // CITIES &amp; RENT
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  CURRENT CITY
                </label>
                <select
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-xs font-bold text-black focus:outline-none focus:border-black cursor-pointer"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  TARGET CITY
                </label>
                <select
                  value={targetCity}
                  onChange={(e) => setTargetCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-xs font-bold text-black focus:outline-none focus:border-black cursor-pointer"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  MONTHLY RENT (₹)
                </label>
                <input
                  type="number"
                  step={1000}
                  min={0}
                  max={100000}
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-xs font-bold text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Remittances & EMIs */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              03 // FAMILY REMITTANCE &amp; EMIS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  PARENTS REMITTANCE
                </label>
                <input
                  type="number"
                  step={1000}
                  min={0}
                  max={80000}
                  value={family}
                  onChange={(e) => setFamily(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-xs font-bold text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  ACTIVE EMIS
                </label>
                <input
                  type="number"
                  step={1000}
                  min={0}
                  max={100000}
                  value={emis}
                  onChange={(e) => setEmis(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-xs font-bold text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                  LIQUID SAVINGS (₹)
                </label>
                <input
                  type="number"
                  step={10000}
                  min={0}
                  max={5000000}
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-xs font-bold text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Primary Goal */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              04 // ACTIVE MILESTONE GOAL
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIFE_GOALS.map((goal) => {
                const isSelected = activeGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setActiveGoal(goal.id)}
                    className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-black text-white border-black font-bold"
                        : "bg-[#F8F9FA] border-neutral-300 text-neutral-800 hover:border-black"
                    }`}
                  >
                    <span className="text-[10px] block opacity-75">[{goal.tag}]</span>
                    <span className="text-xs truncate">{goal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer"
            >
              SAVE PROFILE &amp; APPLY NUMBERS →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
