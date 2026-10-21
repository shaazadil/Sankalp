"use client";

import React from "react";
import { Sliders, RefreshCw } from "lucide-react";

interface WhatIfSlidersProps {
  rent: number;
  onRentChange: (val: number) => void;
  familySupport: number;
  onFamilySupportChange: (val: number) => void;
  sipInvestment: number;
  onSipChange: (val: number) => void;
  taxRegime: string;
  onTaxRegimeChange: (regime: string) => void;
  onReset: () => void;
}

export const WhatIfSliders: React.FC<WhatIfSlidersProps> = ({
  rent,
  onRentChange,
  familySupport,
  onFamilySupportChange,
  sipInvestment,
  onSipChange,
  taxRegime,
  onTaxRegimeChange,
  onReset,
}) => {
  return (
    <div id="what-if" className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="p-5 sm:p-7 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl space-y-6">
        {/* Title & Engine Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Interactive &quot;What-If&quot; Studio
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Real-Time Recalculation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dial values to test trade-offs. The FastAPI engine recomputes your 5 pots on every drag.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Rent Slider */}
          <div className="space-y-3 bg-[#080d17] p-5 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Monthly Rent</span>
              <span className="font-mono font-bold text-slate-100 text-sm tabular-nums bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-white/[0.08]">
                ₹{rent.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={8000}
              max={45000}
              step={1000}
              value={rent}
              onChange={(e) => onRentChange(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹8k (PG/1RK)</span>
              <span>₹20k (1BHK)</span>
              <span>₹45k (2BHK Gated)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Impacts your <span className="text-slate-300">Survival Pot</span> and locked security deposit buffer.
            </p>
          </div>

          {/* Family Remittance Slider */}
          <div className="space-y-3 bg-[#080d17] p-5 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Sent Home to Parents</span>
              <span className="font-mono font-bold text-amber-300 text-sm tabular-nums bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-800/40">
                ₹{familySupport.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30000}
              step={1000}
              value={familySupport}
              onChange={(e) => onFamilySupportChange(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹0</span>
              <span>₹15k (Standard)</span>
              <span>₹30k (High Care)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dedicated remittance ring-fenced so guilt-free spend stays guilt-free.
            </p>
          </div>

          {/* Monthly SIP Wealth Slider */}
          <div className="space-y-3 bg-[#080d17] p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-emerald-400">Monthly Wealth SIP</span>
              <span className="font-mono font-bold text-emerald-300 text-sm tabular-nums bg-emerald-950/50 px-2.5 py-0.5 rounded-lg border border-emerald-800/40">
                ₹{sipInvestment.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={50000}
              step={1000}
              value={sipInvestment}
              onChange={(e) => onSipChange(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹2k</span>
              <span>₹20k (Accelerated)</span>
              <span>₹50k (FIRE Pace)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              10-Yr Compounding: <span className="text-emerald-400 font-mono font-bold">₹{((sipInvestment * 12 * 10 * 1.8) / 100000).toFixed(1)}L</span>
            </p>
          </div>
        </div>

        {/* Tax Regime Selector Strip */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Indian Income Tax Regime:</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (Auto-calculates standard deductions &amp; rebates)
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0c111e] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => onTaxRegimeChange("new")}
              className={`px-4 py-1.5 rounded-lg font-semibold transition cursor-pointer text-xs ${
                taxRegime === "new"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              New Regime (Default)
            </button>
            <button
              onClick={() => onTaxRegimeChange("old")}
              className={`px-4 py-1.5 rounded-lg font-semibold transition cursor-pointer text-xs ${
                taxRegime === "old"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Old Regime (80C / HRA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
