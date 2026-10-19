"use client";

import React, { useState } from "react";
import {
  X,
  Sliders,
  DollarSign,
  Building2,
  HeartHandshake,
  CreditCard,
  PiggyBank,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  MapPin,
  TrendingUp,
} from "lucide-react";

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
  { id: "relocation", label: "Metro Relocation & Deposit Shield", icon: Building2 },
  { id: "wedding", label: "₹15L Wedding in 18 Months", icon: HeartHandshake },
  { id: "education_loan", label: "₹25L Education Loan EMI & 80E", icon: CreditCard },
  { id: "vehicle", label: "First Car (Loan vs Cash)", icon: TrendingUp },
  { id: "emergency_runway", label: "Build 6-Month Emergency Runway", icon: PiggyBank },
  { id: "wealth_growth", label: "Maximize Long-Term SIP & Wealth", icon: Sparkles },
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

  // Live quick estimated monthly take-home
  const monthlyGross = Math.round(ctc / 12);
  const estimatedTax =
    taxRegime === "new"
      ? Math.max(0, Math.round(((ctc - 775000) * 0.1) / 12))
      : Math.round(monthlyGross * 0.12);
  const epfDeduction = Math.round(Math.min(monthlyGross * 0.5, 15000) * 0.12);
  const liveInHand = Math.max(20000, monthlyGross - estimatedTax - epfDeduction - 200);

  // Maximum recommended safe rent (30% of take-home)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-7 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-heading">
                Take Full Control
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight font-heading">
              Customize Your Real Financial Numbers
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Tell us your actual income, cities, and commitments. We calculate what is mathematically optimal for your life.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Calculation Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider">
              Annual Salary (CTC)
            </span>
            <span className="text-lg font-black text-zinc-900 dark:text-zinc-100 font-mono font-heading">
              ₹{(ctc / 100000).toFixed(1)} LPA
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block tracking-wider">
              Est. Monthly In-Hand
            </span>
            <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 font-mono font-heading">
              ₹{liveInHand.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 block tracking-wider">
              Max Safe Rent Cap
            </span>
            <span className="text-lg font-black text-teal-700 dark:text-teal-300 font-mono font-heading">
              ₹{maxSafeRent.toLocaleString("en-IN")}/mo
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Income & Tax */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-heading">
              1. Salary &amp; Tax Regime
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Your Annual CTC (₹)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-zinc-400">₹</span>
                  <input
                    type="number"
                    step={25000}
                    min={300000}
                    max={10000000}
                    value={ctc}
                    onChange={(e) => setCtc(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                {/* CTC Quick Chips */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[600000, 900000, 1200000, 1500000, 2400000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCtc(val)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                        ctc === val
                          ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                      }`}
                    >
                      ₹{(val / 100000).toFixed(0)}L
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Tax Regime Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTaxRegime("new")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      taxRegime === "new"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    New Regime (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxRegime("old")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                      taxRegime === "old"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    Old Regime (HRA &amp; 80E)
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                  We verify both regimes to maximize your cash in hand.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Cities & Rent */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-heading">
              2. Cities &amp; Rent Commitments
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Current City
                </label>
                <select
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Target Relocation City
                </label>
                <select
                  value={targetCity}
                  onChange={(e) => setTargetCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Monthly Rent (₹)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-zinc-400">₹</span>
                  <input
                    type="number"
                    step={1000}
                    min={0}
                    max={100000}
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Family Remittance, EMIs & Savings */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-heading">
              3. Family Remittances &amp; Fixed EMIs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Parents Support / Remittance
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-zinc-400">₹</span>
                  <input
                    type="number"
                    step={1000}
                    min={0}
                    max={80000}
                    value={family}
                    onChange={(e) => setFamily(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Active Loan EMIs
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-zinc-400">₹</span>
                  <input
                    type="number"
                    step={1000}
                    min={0}
                    max={100000}
                    value={emis}
                    onChange={(e) => setEmis(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Current Liquid Savings (₹)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-zinc-400">₹</span>
                  <input
                    type="number"
                    step={10000}
                    min={0}
                    max={5000000}
                    value={savings}
                    onChange={(e) => setSavings(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Primary Milestone Goal */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-heading">
              4. Choose Your Active Milestone Goal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIFE_GOALS.map((goal) => {
                const IconComponent = goal.icon;
                const isSelected = activeGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setActiveGoal(goal.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold"
                        : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-emerald-600" : "text-zinc-400"
                      }`}
                    />
                    <span className="text-xs truncate">{goal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition hover:scale-102 active:scale-98 cursor-pointer font-heading"
            >
              <Sparkles className="w-4 h-4" />
              <span>Calculate What&apos;s Best For My Numbers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
