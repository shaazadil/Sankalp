"use client";

import React from "react";
import {
  Shield,
  Heart,
  CreditCard,
  TrendingUp,
  Coffee,
  AlertTriangle,
  Lightbulb,
  Building,
  CheckCircle2,
  Calendar,
  Lock,
} from "lucide-react";
import { Budget5PotsResponse, LivingScenario, SalaryCalculationResponse } from "@/lib/api";

interface SmartPotsDashboardProps {
  potsData: Budget5PotsResponse | null;
  salaryData: SalaryCalculationResponse | null;
  activeScenario?: LivingScenario | null;
  goalCategory: string;
}

export const SmartPotsDashboard: React.FC<SmartPotsDashboardProps> = ({
  potsData,
  salaryData,
  activeScenario,
  goalCategory,
}) => {
  if (!potsData) return null;

  const pots = [
    {
      id: "survival",
      title: "Survival Pot",
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      amount: potsData.survival_pot,
      percent: potsData.survival_percent,
      color: "bg-blue-500",
      lightBg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
      description: "Rent, electricity, groceries, wifi, and commute",
    },
    {
      id: "family",
      title: "Family Care Pot",
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      amount: potsData.family_pot,
      percent: potsData.family_percent,
      color: "bg-rose-500",
      lightBg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60",
      description: "Monthly remittance sent home to parents & siblings",
    },
    {
      id: "obligations",
      title: "Obligations Pot",
      icon: <CreditCard className="w-5 h-5 text-amber-500" />,
      amount: potsData.obligations_pot,
      percent: potsData.obligations_percent,
      color: "bg-amber-500",
      lightBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
      description: "Active education & vehicle EMIs, loans, credit cards",
    },
    {
      id: "growth",
      title: "Growth & Goals",
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      amount: potsData.growth_pot,
      percent: potsData.growth_percent,
      color: "bg-emerald-500",
      lightBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60",
      description: "Mutual fund SIPs, PPF, gold hedge, emergency fund",
    },
    {
      id: "guilt_free",
      title: "Guilt-Free UPI",
      icon: <Coffee className="w-5 h-5 text-purple-500" />,
      amount: potsData.guilt_free_upi_pot,
      percent: potsData.guilt_free_percent,
      color: "bg-purple-500",
      lightBg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60",
      description: "Discretionary spend (Swiggy, dining, weekend outings, shopping)",
      isSpecial: true,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* 1. Header Health Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Real In-Hand */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Real Monthly In-Hand
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              ₹{potsData.monthly_income.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              verified net
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2">
            After EPF, Gratuity, Professional Tax & TDS
          </span>
        </div>

        {/* Emergency Runway */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Emergency Runway
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                potsData.emergency_runway_months >= 3
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
              }`}
            >
              {potsData.emergency_runway_months >= 3 ? "Safe Net" : "Caution"}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {potsData.emergency_runway_months.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              months
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2">
            Survival runway if your income paused tomorrow
          </span>
        </div>

        {/* Financial Health Score */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Health Score
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {potsData.health_score >= 80 ? "Excellent" : potsData.health_score >= 60 ? "Balanced" : "Stretched"}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {potsData.health_score}
            </span>
            <span className="text-sm font-semibold text-zinc-400">/ 100</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-500 ${
                potsData.health_score >= 80
                  ? "bg-emerald-500"
                  : potsData.health_score >= 60
                  ? "bg-blue-500"
                  : "bg-amber-500"
              }`}
              style={{ width: `${potsData.health_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Co-Pilot Advice & Tax Optimizer Callout */}
      {salaryData?.tax_savings_recommendation && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-amber-900 dark:text-amber-200 leading-relaxed">
            {salaryData.tax_savings_recommendation}
          </p>
        </div>
      )}

      {/* 3. The 5 Jupiter-Style Money Pots */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <span>Your 5 Monthly Money Pots</span>
          </h2>
          <span className="text-xs font-medium text-zinc-400">
            Total Allocated: ₹{potsData.monthly_income.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pots.map((pot) => (
            <div
              key={pot.id}
              className={`p-4 rounded-2xl border transition-all hover:shadow-md ${pot.lightBg} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200/60 dark:border-zinc-700/60">
                    {pot.icon}
                  </div>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {pot.percent}%
                  </span>
                </div>
                <h3 className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
                  {pot.title}
                </h3>
                <div className="mt-1">
                  <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    ₹{Math.round(pot.amount).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-zinc-400 block">/ month</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/40 dark:border-zinc-700/40">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  {pot.description}
                </p>
                {pot.isSpecial && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                    ~₹{Math.round(pot.amount / 30).toLocaleString("en-IN")} / day safe
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bengaluru Deposit Shock & Living Scenarios (For Relocation) */}
      {activeScenario && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Active Tier: {activeScenario.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">Locked Deposit:</span>
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                ₹{activeScenario.locked_security_deposit.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {activeScenario.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-[10px] text-zinc-400 block">Monthly Rent</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                ₹{activeScenario.monthly_rent.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-[10px] text-zinc-400 block">Food & Groceries</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                ₹{activeScenario.monthly_food_groceries.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-[10px] text-zinc-400 block">Sunk Moving Cost</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                ₹{activeScenario.sunk_moving_cost.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-[10px] text-zinc-400 block">Deposit Recovery</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {activeScenario.deposit_recovery_months} Months
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Budget Conflicts Warning */}
      {potsData.budget_conflicts && potsData.budget_conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Budget Friction Detected</span>
          </div>
          <ul className="space-y-1 text-xs text-rose-700 dark:text-rose-300/90 pl-6 list-disc">
            {potsData.budget_conflicts.map((conflict, idx) => (
              <li key={idx}>{conflict}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
