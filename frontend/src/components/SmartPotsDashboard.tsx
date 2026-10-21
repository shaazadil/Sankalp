"use client";

import React from "react";
import {
  Shield,
  Heart,
  CreditCard,
  TrendingUp,
  Coffee,
  CheckCircle2,
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
      title: "Survival & Living",
      tag: "Core Fixed",
      icon: <Shield className="w-4 h-4 text-slate-300" />,
      amount: potsData.survival_pot,
      percent: potsData.survival_percent,
      color: "from-slate-400 to-slate-200",
      accentBg: "bg-slate-400",
      pillBg: "bg-slate-800/80 text-slate-200 border-slate-700/60",
      description: "Rent, electricity, groceries, broadband, and daily commute.",
      dailyBurn: Math.round(potsData.survival_pot / 30),
    },
    {
      id: "family",
      title: "Family Care & Parents",
      tag: "Filial Duty",
      icon: <Heart className="w-4 h-4 text-amber-300" />,
      amount: potsData.family_pot,
      percent: potsData.family_percent,
      color: "from-amber-400 to-amber-200",
      accentBg: "bg-amber-400",
      pillBg: "bg-amber-950/50 text-amber-300 border-amber-800/40",
      description: "Monthly remittance sent home to parents, medical care & siblings.",
      dailyBurn: Math.round(potsData.family_pot / 30),
    },
    {
      id: "obligations",
      title: "Obligations & Debt",
      tag: "Contractual",
      icon: <CreditCard className="w-4 h-4 text-rose-300" />,
      amount: potsData.obligations_pot,
      percent: potsData.obligations_percent,
      color: "from-rose-500 to-rose-300",
      accentBg: "bg-rose-500",
      pillBg: "bg-rose-950/50 text-rose-300 border-rose-800/40",
      description: "Active student loans, vehicle EMIs, and credit card balances.",
      dailyBurn: Math.round(potsData.obligations_pot / 30),
    },
    {
      id: "growth",
      title: "Growth & Wealth SIP",
      tag: "Compounding",
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      amount: potsData.growth_pot,
      percent: potsData.growth_percent,
      color: "from-emerald-400 to-teal-300",
      accentBg: "bg-emerald-400",
      pillBg: "bg-emerald-950/60 text-emerald-300 border-emerald-800/40",
      description: "Mutual fund SIPs, PPF, gold hedge, and liquid emergency fund.",
      dailyBurn: Math.round(potsData.growth_pot / 30),
      isPrimary: true,
    },
    {
      id: "guilt_free",
      title: "Guilt-Free UPI",
      tag: "Discretionary",
      icon: <Coffee className="w-4 h-4 text-purple-300" />,
      amount: potsData.guilt_free_upi_pot,
      percent: potsData.guilt_free_percent,
      color: "from-purple-400 to-violet-300",
      accentBg: "bg-purple-400",
      pillBg: "bg-purple-950/50 text-purple-300 border-purple-800/40",
      description: "Dining out, weekend leisure, movie tickets, coffee & impulse fun.",
      dailyBurn: Math.round(potsData.guilt_free_upi_pot / 30),
      isSpecial: true,
    },
  ];

  const totalFixed = potsData.survival_pot + potsData.family_pot + potsData.obligations_pot;
  const fixedPercent = Math.round((totalFixed / (potsData.monthly_income || 1)) * 100);

  return (
    <div id="pots-studio" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* 1. Header Health Strip (Consolidated Net In-Hand & Allocation Velocity) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Real In-Hand */}
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Net Monthly In-Hand
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              After Tax &amp; EPF
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              ₹{potsData.monthly_income.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-500 font-medium">/month</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Deterministic zero-based pool allocated to 5 specialized pots.
          </p>
        </div>

        {/* Fixed Commitments */}
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/[0.08] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Fixed Commitments
            </span>
            <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
              {fixedPercent}% of Income
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-200 font-mono tabular-nums tracking-tight">
              ₹{totalFixed.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-500 font-medium">/month</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Survival living costs, parents remittance, and active EMIs.
          </p>
        </div>

        {/* Wealth Accumulation Potential */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-[#0d1322] border border-emerald-500/25 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">
              Wealth Compounding
            </span>
            <span className="text-[10px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              {potsData.growth_percent}% Saved
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums tracking-tight">
              ₹{potsData.growth_pot.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-emerald-500/70 font-medium">/month</span>
          </div>
          <p className="text-[11px] text-emerald-300/70 mt-2">
            Projected 10-Yr Corpus: ₹{((potsData.growth_pot * 12 * 10 * 1.8) / 100000).toFixed(1)} Lakhs @ 12% CAGR.
          </p>
        </div>
      </div>

      {/* 2. Visual Macro Allocation Ribbon (100% Segmented Strip) */}
      <div className="p-4 rounded-2xl bg-[#0b101c] border border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            100% Zero-Based Capital Distribution
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            ₹0 Unassigned Rupee
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden flex p-[1px] border border-white/[0.06]">
          <div
            style={{ width: `${potsData.survival_percent}%` }}
            className="h-full bg-slate-400 transition-all duration-500"
            title={`Survival: ${potsData.survival_percent}%`}
          />
          <div
            style={{ width: `${potsData.family_percent}%` }}
            className="h-full bg-amber-400 transition-all duration-500"
            title={`Family: ${potsData.family_percent}%`}
          />
          <div
            style={{ width: `${potsData.obligations_percent}%` }}
            className="h-full bg-rose-500 transition-all duration-500"
            title={`Obligations: ${potsData.obligations_percent}%`}
          />
          <div
            style={{ width: `${potsData.growth_percent}%` }}
            className="h-full bg-emerald-400 transition-all duration-500"
            title={`Growth: ${potsData.growth_percent}%`}
          />
          <div
            style={{ width: `${potsData.guilt_free_percent}%` }}
            className="h-full bg-purple-400 transition-all duration-500"
            title={`Guilt-Free: ${potsData.guilt_free_percent}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Survival ({potsData.survival_percent}%)
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Family ({potsData.family_percent}%)
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Obligations ({potsData.obligations_percent}%)
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Wealth Growth ({potsData.growth_percent}%)
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Guilt-Free ({potsData.guilt_free_percent}%)
          </span>
        </div>
      </div>

      {/* 3. The 5 Pots Architectural Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pots.map((pot) => (
          <div
            key={pot.id}
            className={`p-5 rounded-2xl bg-[#0c111e] border transition-all duration-300 hover:border-white/[0.18] flex flex-col justify-between relative group ${
              pot.isPrimary
                ? "border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-[#0c111e]"
                : "border-white/[0.08]"
            }`}
          >
            {/* Top row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-white/[0.08]">
                    {pot.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {pot.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                      {pot.tag}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${pot.pillBg}`}
                >
                  {pot.percent}%
                </span>
              </div>

              {/* Amount */}
              <div className="pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-100 font-mono tabular-nums tracking-tight">
                    ₹{pot.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 font-mono">
                  <span>Daily velocity:</span>
                  <span className="text-slate-200 font-semibold">
                    ₹{pot.dailyBurn.toLocaleString("en-IN")}/day
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(pot.percent, 100)}%` }}
                  className={`h-full ${pot.accentBg}`}
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {pot.description}
              </p>
            </div>

            {/* Bottom Insight Pill */}
            {pot.id === "guilt_free" && (
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-purple-300/80">
                <span>Safe to spend on UPI without stress</span>
                <span className="font-mono font-semibold">₹{pot.dailyBurn}/day</span>
              </div>
            )}
            {pot.id === "growth" && (
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-emerald-400">
                <span>Automated SIP Ready</span>
                <span className="font-mono font-semibold">Equity + Emergency</span>
              </div>
            )}
          </div>
        ))}

        {/* 6th Educational Card: Zero-Based Rule */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0b101c] border border-white/[0.08] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">The Zero-Sum Rule</h4>
                <p className="text-[10px] text-slate-400">Deterministic Indian Framework</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Every single rupee has an assigned purpose before the month begins. By separating your <strong className="text-purple-300">Guilt-Free UPI</strong> account from your <strong className="text-emerald-300">Growth SIPs</strong>, you eliminate buyer&apos;s remorse completely.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>Formula</span>
            <span className="font-mono text-[11px] text-slate-300">
              Income - Sum(5 Pots) = ₹0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
