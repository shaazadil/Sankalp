"use client";

import React, { useState } from "react";
import {
  Flame,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Briefcase,
  Building2,
  Car,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

interface EmergencyChaosSimulatorProps {
  monthlyIncome?: number;
  liquidSavings?: number;
  monthlyFixedLiving?: number;
}

interface LifeShock {
  id: string;
  title: string;
  category: string;
  cost: number;
  icon: React.ReactNode;
  durationMonths: number;
  description: string;
}

export const EmergencyChaosSimulator: React.FC<EmergencyChaosSimulatorProps> = ({
  monthlyIncome = 67000,
  liquidSavings = 200000,
  monthlyFixedLiving = 35000,
}) => {
  const [activeShocks, setActiveShocks] = useState<string[]>([]);

  const SHOCK_EVENTS: LifeShock[] = [
    {
      id: "layoff",
      title: "Sudden Layoff (3 Months)",
      category: "Income Shock",
      cost: monthlyIncome * 3,
      durationMonths: 3,
      icon: <Briefcase className="w-4 h-4 text-rose-400" />,
      description: "Zero salary for 90 days during a hiring freeze or restructuring.",
    },
    {
      id: "medical",
      title: "Parent Medical Shock (₹2.5L)",
      category: "Healthcare",
      cost: 250000,
      durationMonths: 1,
      icon: <HeartPulse className="w-4 h-4 text-amber-400" />,
      description: "Unplanned hospital stay for aging parents not fully covered by basic insurance.",
    },
    {
      id: "deposit_dispute",
      title: "Landlord Forfeits Deposit",
      category: "Housing Shock",
      cost: 120000,
      durationMonths: 1,
      icon: <Building2 className="w-4 h-4 text-blue-400" />,
      description: "Landlord refuses to return security deposit when vacating, forcing you to fund next deposit out of pocket.",
    },
    {
      id: "car_breakdown",
      title: "Vehicle Transmission Repair",
      category: "Logistics",
      cost: 45000,
      durationMonths: 1,
      icon: <Car className="w-4 h-4 text-purple-400" />,
      description: "Immediate gearbox and engine overhaul required to commute to work.",
    },
  ];

  const toggleShock = (id: string) => {
    setActiveShocks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetChaos = () => {
    setActiveShocks([]);
  };

  // Compute Impact
  const totalShockCost = activeShocks.reduce((acc, id) => {
    const shock = SHOCK_EVENTS.find((s) => s.id === id);
    return acc + (shock ? shock.cost : 0);
  }, 0);

  const remainingLiquidSavings = Math.max(0, liquidSavings - totalShockCost);
  const shortfall = Math.max(0, totalShockCost - liquidSavings);
  const survives = shortfall === 0;

  // Resilience Score
  const resilienceScore = Math.max(
    10,
    Math.min(100, Math.round(((liquidSavings - totalShockCost * 0.7) / (liquidSavings || 1)) * 100))
  );

  return (
    <div id="chaos-simulator" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Title Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                Stress-Testing Sandbox
              </span>
              <span className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded-full font-mono">
                Chaos Mode
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              Emergency Domino Chaos Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Trigger life shocks to test whether your 5 pots absorb the blast or if compounding SIPs get liquidated.
            </p>
          </div>
        </div>

        {/* Resilience Badge */}
        <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              survives
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
            }`}
          >
            {survives ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Resilience Score
            </span>
            <p
              className={`text-sm font-bold font-mono ${
                survives ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {resilienceScore}/100 • {survives ? "Bulletproof" : "Deficit Warning"}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Baseline Liquid Reserve: ₹{(liquidSavings / 100000).toFixed(1)}L
            </p>
          </div>
        </div>
      </div>

      {/* Trigger Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SHOCK_EVENTS.map((shock) => {
          const isTriggered = activeShocks.includes(shock.id);
          return (
            <button
              key={shock.id}
              onClick={() => toggleShock(shock.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isTriggered
                  ? "bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-500/10"
                  : "bg-[#0c111e] border-white/[0.08] hover:border-white/[0.18]"
              }`}
            >
              {isTriggered && (
                <div className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full uppercase">
                  Triggered
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-slate-800 border border-white/[0.06]">
                  {shock.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{shock.title}</h4>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{shock.category}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {shock.description}
              </p>
              <div className="flex items-baseline justify-between pt-2 border-t border-white/[0.06] text-xs">
                <span className="text-slate-500">Damage:</span>
                <span className="font-mono font-bold text-rose-400 tabular-nums">
                  -₹{shock.cost.toLocaleString("en-IN")}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual Domino Blast Impact Panel */}
      <div className="p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] shadow-inner space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="font-bold">Total Simulated Life Shock:</span>
            <span className="font-mono text-rose-400 font-bold text-sm">
              ₹{totalShockCost.toLocaleString("en-IN")}
            </span>
          </div>

          {activeShocks.length > 0 && (
            <button
              onClick={resetChaos}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Shocks</span>
            </button>
          )}
        </div>

        {/* Balance Impact Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/[0.06]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Emergency Reserve Buffer
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-white font-mono tabular-nums">
                ₹{remainingLiquidSavings.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-500">remaining</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
              <div
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, (remainingLiquidSavings / (liquidSavings || 1)) * 100)
                  )}%`,
                }}
                className={`h-full ${survives ? "bg-emerald-400" : "bg-rose-500"}`}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/[0.06]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              SIP Liquidation Risk
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-xl font-black font-mono tabular-nums ${
                  shortfall > 0 ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {shortfall > 0 ? `₹${shortfall.toLocaleString("en-IN")}` : "₹0 (Safe)"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {shortfall > 0
                ? "Your liquid buffer broke! You will be forced to break your mutual fund SIPs."
                : "Your liquid emergency pot absorbed 100% of the shock. Compounding survives!"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/[0.06]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Actionable Playbook
            </span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {survives
                ? "Your portfolio is resilient. Maintain ₹35,000 monthly fixed living runway to stay in the green."
                : `Increase emergency fund by ₹${(shortfall / 100000).toFixed(1)} Lakhs or take parent super top-up health cover.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
