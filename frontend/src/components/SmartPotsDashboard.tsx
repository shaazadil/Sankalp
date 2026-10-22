"use client";

import React from "react";
import { motion } from "framer-motion";
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
      index: "01",
      title: "SURVIVAL & LIVING",
      tag: "FIXED ESSENTIALS",
      amount: potsData.survival_pot,
      percent: potsData.survival_percent,
      barBg: "bg-neutral-800",
      description: "Rent, electricity, groceries, broadband, and daily commute.",
      dailyBurn: Math.round(potsData.survival_pot / 30),
    },
    {
      id: "obligations",
      index: "02",
      title: "OBLIGATIONS & DEBT",
      tag: "CONTRACTUAL EMIS",
      amount: potsData.obligations_pot,
      percent: potsData.obligations_percent,
      barBg: "bg-neutral-700",
      description: "Active student loans, vehicle EMIs, and credit card payments.",
      dailyBurn: Math.round(potsData.obligations_pot / 30),
    },
    {
      id: "family",
      index: "03",
      title: "FAMILY & PARENTS",
      tag: "REMITTANCE POT",
      amount: potsData.family_pot,
      percent: potsData.family_percent,
      barBg: "bg-neutral-600",
      description: "Monthly home transfers, parent medical emergencies & care.",
      dailyBurn: Math.round(potsData.family_pot / 30),
    },
    {
      id: "guilt_free",
      index: "04",
      title: "GUILT-FREE UPI",
      tag: "DISCRETIONARY FUN",
      amount: potsData.guilt_free_upi_pot,
      percent: potsData.guilt_free_percent,
      barBg: "bg-neutral-500",
      description: "Dining out, weekend leisure, movie tickets, and shopping.",
      dailyBurn: Math.round(potsData.guilt_free_upi_pot / 30),
    },
    {
      id: "growth",
      index: "05",
      title: "WEALTH GROWTH & SIP",
      tag: "COMPOUNDING CAPITAL",
      amount: potsData.growth_pot,
      percent: potsData.growth_percent,
      barBg: "bg-black",
      description: "Mutual fund SIPs, PPF, gold allocation, and emergency reserve.",
      dailyBurn: Math.round(potsData.growth_pot / 30),
      isPrimary: true,
    },
  ];

  const totalAllocated =
    potsData.survival_pot +
    potsData.family_pot +
    potsData.obligations_pot +
    potsData.growth_pot +
    potsData.guilt_free_upi_pot;
  const balanceDelta = potsData.monthly_income - totalAllocated;

  return (
    <div id="pots-studio" className="w-full max-w-6xl mx-auto space-y-6">
      {/* 1. Header Health Strip (4 Key Financial Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Take-Home Income */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
              TAKE-HOME INCOME
            </span>
            <span className="text-[10px] text-black bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded uppercase">
              NET IN-HAND
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className="text-3xl font-black text-black font-mono tabular-nums tracking-tight">
              ₹{potsData.monthly_income.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-neutral-500 font-mono">/mo</span>
          </div>
          <p className="text-[11px] text-neutral-600 mt-2 font-medium">
            Actual credited salary after tax &amp; EPF.
          </p>
        </div>

        {/* Metric 2: Total Monthly Allocations */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
              TOTAL ALLOCATED
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-neutral-300 bg-neutral-100 text-black uppercase">
              {Math.abs(balanceDelta) < 10 ? "100% BALANCED" : "ADJUSTING"}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className="text-3xl font-black text-black font-mono tabular-nums tracking-tight">
              ₹{totalAllocated.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-neutral-500 font-mono">/mo</span>
          </div>
          <p className="text-[11px] text-neutral-600 mt-2 font-medium">
            Assigned across 5 independent smart pots.
          </p>
        </div>

        {/* Metric 3: Liquid Emergency Runway */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
              EMERGENCY RUNWAY
            </span>
            <span className="text-[10px] text-black bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded uppercase">
              LIQUID
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className="text-3xl font-black text-black font-mono tabular-nums tracking-tight">
              {potsData.emergency_runway_months || 5.2}
            </span>
            <span className="text-xs text-neutral-500 font-mono">MONTHS</span>
          </div>
          <p className="text-[11px] text-neutral-600 mt-2 font-medium">
            Burn coverage at current fixed living costs.
          </p>
        </div>

        {/* Metric 4: Financial Health Score */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-900 shadow-xs flex flex-col justify-between bg-neutral-50">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-neutral-600 uppercase tracking-wider text-[10px]">
              HEALTH SCORE
            </span>
            <span className="text-[10px] text-white bg-black px-2 py-0.5 rounded uppercase">
              {potsData.health_score >= 75 ? "RESILIENT" : "BALANCED"}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className="text-3xl font-black text-black font-mono tabular-nums tracking-tight">
              {potsData.health_score}
            </span>
            <span className="text-xs text-neutral-500 font-mono">/100</span>
          </div>
          <p className="text-[11px] text-neutral-600 mt-2 font-medium">
            Composite score across savings, debt &amp; runway.
          </p>
        </div>
      </div>

      {/* 2. Visual Macro Allocation Ribbon */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-300 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black block">
              ZERO-BASED ALLOCATION STATUS
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              In-Hand (₹{potsData.monthly_income.toLocaleString("en-IN")}) − Assigned (₹{totalAllocated.toLocaleString("en-IN")}) = {balanceDelta === 0 ? "₹0.00" : `₹${balanceDelta.toLocaleString("en-IN")}`}
            </span>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-neutral-100 border border-neutral-300 font-bold self-start sm:self-auto text-black uppercase">
            {Math.abs(balanceDelta) < 10
              ? "✓ ₹0 PERFECTLY ASSIGNED"
              : balanceDelta > 0
              ? `+₹${balanceDelta.toLocaleString("en-IN")} UNALLOCATED`
              : `-₹${Math.abs(balanceDelta).toLocaleString("en-IN")} DEFICIT`}
          </span>
        </div>

        {/* Multi-segment progress bar with high contrast styling */}
        <div className="h-4 w-full rounded-md bg-neutral-100 overflow-hidden flex border border-neutral-300">
          <div
            style={{ width: `${potsData.survival_percent}%` }}
            className="h-full bg-neutral-900 border-r border-white/20 transition-all duration-500"
            title={`Survival: ${potsData.survival_percent}%`}
          />
          <div
            style={{ width: `${potsData.obligations_percent}%` }}
            className="h-full bg-neutral-700 border-r border-white/20 transition-all duration-500"
            title={`Obligations: ${potsData.obligations_percent}%`}
          />
          <div
            style={{ width: `${potsData.family_percent}%` }}
            className="h-full bg-neutral-500 border-r border-white/20 transition-all duration-500"
            title={`Family: ${potsData.family_percent}%`}
          />
          <div
            style={{ width: `${potsData.guilt_free_percent}%` }}
            className="h-full bg-neutral-400 border-r border-white/20 transition-all duration-500"
            title={`Guilt-Free: ${potsData.guilt_free_percent}%`}
          />
          <div
            style={{ width: `${potsData.growth_percent}%` }}
            className="h-full bg-black transition-all duration-500"
            title={`Growth: ${potsData.growth_percent}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-xs bg-neutral-900" />
            01 SURVIVAL ({potsData.survival_percent}%)
          </span>
          <span className="flex items-center gap-1.5 text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-xs bg-neutral-700" />
            02 OBLIGATIONS ({potsData.obligations_percent}%)
          </span>
          <span className="flex items-center gap-1.5 text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-xs bg-neutral-500" />
            03 FAMILY ({potsData.family_percent}%)
          </span>
          <span className="flex items-center gap-1.5 text-neutral-700">
            <span className="w-2.5 h-2.5 rounded-xs bg-neutral-400" />
            04 GUILT-FREE ({potsData.guilt_free_percent}%)
          </span>
          <span className="flex items-center gap-1.5 text-black font-black">
            <span className="w-2.5 h-2.5 rounded-xs bg-black" />
            05 WEALTH ({potsData.growth_percent}%)
          </span>
        </div>
      </div>

      {/* 3. The 5 Pots Architectural Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pots.map((pot) => (
          <div
            key={pot.id}
            className={`p-6 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between shadow-xs ${
              pot.isPrimary
                ? "border-neutral-900 ring-1 ring-neutral-900"
                : "border-neutral-300"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      [{pot.index}]
                    </span>
                    <h4 className="text-base font-black text-black font-heading tracking-tight">
                      {pot.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase tracking-wider block mt-0.5">
                    {pot.tag}
                  </span>
                </div>

                <span className="text-xs font-mono font-black px-2.5 py-1 rounded bg-neutral-100 text-black border border-neutral-300">
                  {pot.percent}%
                </span>
              </div>

              {/* Amount */}
              <div className="pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-black font-mono tabular-nums tracking-tight">
                    ₹{pot.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">/MO</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1 font-mono">
                  <span>DAILY VELOCITY:</span>
                  <span className="text-black font-bold">
                    ₹{pot.dailyBurn.toLocaleString("en-IN")}/DAY
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                <div
                  style={{ width: `${Math.min(pot.percent, 100)}%` }}
                  className={`h-full ${pot.barBg}`}
                />
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed pt-1 font-medium">
                {pot.description}
              </p>
            </div>

            {/* Bottom Insight Pill */}
            {pot.id === "guilt_free" && (
              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-700">
                <span>SAFE UPI SPEND CAP:</span>
                <span className="font-bold text-black">₹{pot.dailyBurn}/DAY</span>
              </div>
            )}
            {pot.id === "growth" && (
              <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-black font-bold">
                <span>AUTOMATED SIP READY:</span>
                <span>EQUITY + GOLD + RUNWAY</span>
              </div>
            )}
          </div>
        ))}

        {/* 6th Educational Card: Zero-Based Rule */}
        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-300 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-400">[06]</span>
              <h4 className="text-base font-black text-black font-heading tracking-tight">
                ZERO-SUM PROTOCOL
              </h4>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              Every single rupee has an assigned purpose before the month begins. By separating your <strong className="text-black font-bold">Guilt-Free UPI</strong> account from your <strong className="text-black font-bold">Growth SIPs</strong>, buyer&apos;s remorse is eliminated entirely.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-700">
            <span>RULE FORMULA:</span>
            <span className="text-black font-bold">
              INCOME − Σ(5 POTS) = ₹0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
