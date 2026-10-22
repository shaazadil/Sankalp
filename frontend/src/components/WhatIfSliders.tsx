"use client";

import React from "react";
import { motion } from "framer-motion";

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
    <div id="what-if" className="w-full max-w-6xl mx-auto">
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-6">
        {/* Title & Engine Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                [WHAT-IF STUDIO]
              </span>
              <span className="text-[10px] font-mono text-black bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-bold uppercase">
                FASTAPI REAL-TIME
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight font-heading mt-0.5">
              Interactive Cashflow Sandbox
            </h3>
            <p className="text-xs text-neutral-600 font-medium">
              Adjust levers to simulate allocation impact. The system recomputes all 5 pots on each change.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="text-xs font-mono font-bold text-black px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition cursor-pointer"
            >
              [RESET BASELINE]
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Rent Slider */}
          <div className="space-y-3 bg-[#F8F9FA] p-5 rounded-xl border border-neutral-200">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-neutral-700 uppercase">MONTHLY RENT</span>
              <span className="text-black text-base font-black tabular-nums bg-white px-2 py-0.5 rounded border border-neutral-300">
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
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>₹8k (1RK)</span>
              <span>₹20k (1BHK)</span>
              <span>₹45k (2BHK)</span>
            </div>
            <p className="text-[11px] text-neutral-600">
              Drives your Survival Pot and locked security deposit buffer.
            </p>
          </div>

          {/* Family Remittance Slider */}
          <div className="space-y-3 bg-[#F8F9FA] p-5 rounded-xl border border-neutral-200">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-neutral-700 uppercase">FAMILY REMITTANCE</span>
              <span className="text-black text-base font-black tabular-nums bg-white px-2 py-0.5 rounded border border-neutral-300">
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
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>₹0</span>
              <span>₹15k (Standard)</span>
              <span>₹30k (High Care)</span>
            </div>
            <p className="text-[11px] text-neutral-600">
              Dedicated parent support ring-fenced so guilt-free spend stays guilt-free.
            </p>
          </div>

          {/* Monthly SIP Wealth Slider */}
          <div className="space-y-3 bg-[#F8F9FA] p-5 rounded-xl border border-neutral-200">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-neutral-700 uppercase">MONTHLY WEALTH SIP</span>
              <span className="text-black text-base font-black tabular-nums bg-white px-2 py-0.5 rounded border border-neutral-300">
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
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>₹2k</span>
              <span>₹20k (Accelerated)</span>
              <span>₹50k (FIRE)</span>
            </div>
            <p className="text-[11px] text-neutral-600 font-mono">
              10-YR EST: ₹{((sipInvestment * 12 * 10 * 1.8) / 100000).toFixed(1)}L
            </p>
          </div>
        </div>

        {/* Tax Regime Selector Strip */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-neutral-800">TAX REGIME CALIBRATION:</span>
            <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
              (Auto-factors Standard Deduction &amp; 87A Rebate)
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-200 p-1 rounded-lg border border-neutral-300">
            <button
              onClick={() => onTaxRegimeChange("new")}
              className={`px-4 py-1.5 rounded font-mono font-bold transition cursor-pointer text-xs ${
                taxRegime === "new"
                  ? "bg-black text-white font-black shadow-xs"
                  : "text-neutral-700 hover:text-black"
              }`}
            >
              NEW REGIME
            </button>
            <button
              onClick={() => onTaxRegimeChange("old")}
              className={`px-4 py-1.5 rounded font-mono font-bold transition cursor-pointer text-xs ${
                taxRegime === "old"
                  ? "bg-black text-white font-black shadow-xs"
                  : "text-neutral-700 hover:text-black"
              }`}
            >
              OLD REGIME (80C / HRA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
