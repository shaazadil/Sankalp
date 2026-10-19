"use client";

import React from "react";
import { Sliders, RefreshCw, Zap } from "lucide-react";

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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="p-5 sm:p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Interactive &quot;What-If&quot; Simulator
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Adjust figures below to simulate budget trade-offs in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Zap className="w-3 h-3 fill-emerald-600" />
              <span>Deterministic Python Math</span>
            </span>
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-2 py-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rent Slider */}
          <div className="space-y-2 bg-white dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Monthly Rent</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                ₹{rent.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={8000}
              max={40000}
              step={1000}
              value={rent}
              onChange={(e) => onRentChange(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>₹8k (PG/Shared)</span>
              <span>₹20k (1BHK)</span>
              <span>₹40k (Gated 2BHK)</span>
            </div>
          </div>

          {/* Family Remittance Slider */}
          <div className="space-y-2 bg-white dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Sent Home to Parents</span>
              <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">
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
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>₹0</span>
              <span>₹15k</span>
              <span>₹30k</span>
            </div>
          </div>

          {/* SIP Investment Slider */}
          <div className="space-y-2 bg-white dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Monthly SIP / Savings</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                ₹{sipInvestment.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={35000}
              step={1000}
              value={sipInvestment}
              onChange={(e) => onSipChange(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>₹2k</span>
              <span>₹18k</span>
              <span>₹35k</span>
            </div>
          </div>
        </div>

        {/* Tax Regime Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Tax Regime Mode:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTaxRegimeChange("new")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                taxRegime === "new"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300"
              }`}
            >
              New Tax Regime (₹75k Std Deduction)
            </button>
            <button
              onClick={() => onTaxRegimeChange("old")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                taxRegime === "old"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300"
              }`}
            >
              Old Tax Regime (HRA &amp; 80E Deductions)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
