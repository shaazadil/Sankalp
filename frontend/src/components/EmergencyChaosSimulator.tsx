"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface EmergencyChaosSimulatorProps {
  monthlyIncome?: number;
  liquidSavings?: number;
  monthlyFixedLiving?: number;
}

interface LifeShock {
  id: string;
  tag: string;
  title: string;
  category: string;
  cost: number;
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
      tag: "INCOME SHOCK",
      title: "Sudden Layoff (3 Months)",
      category: "90-Day Freeze",
      cost: monthlyIncome * 3,
      durationMonths: 3,
      description: "Zero salary for 90 days during a corporate hiring freeze or restructuring.",
    },
    {
      id: "medical",
      tag: "HEALTHCARE",
      title: "Parent Medical Shock (₹2.5L)",
      category: "Emergency Care",
      cost: 250000,
      durationMonths: 1,
      description: "Unplanned hospital admission for aging parents not fully covered by basic insurance.",
    },
    {
      id: "deposit_dispute",
      tag: "HOUSING",
      title: "Landlord Forfeits Deposit",
      category: "Security Lock",
      cost: 120000,
      durationMonths: 1,
      description: "Landlord delays or refuses to return security deposit when vacating, forcing you to fund the next deposit.",
    },
    {
      id: "car_breakdown",
      tag: "LOGISTICS",
      title: "Vehicle Transmission Repair",
      category: "Asset Repair",
      cost: 45000,
      durationMonths: 1,
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

  const totalShockCost = activeShocks.reduce((acc, id) => {
    const shock = SHOCK_EVENTS.find((s) => s.id === id);
    return acc + (shock ? shock.cost : 0);
  }, 0);

  const remainingLiquidSavings = Math.max(0, liquidSavings - totalShockCost);
  const shortfall = Math.max(0, totalShockCost - liquidSavings);
  const survives = shortfall === 0;

  const resilienceScore = Math.max(
    10,
    Math.min(100, Math.round(((liquidSavings - totalShockCost * 0.7) / (liquidSavings || 1)) * 100))
  );

  return (
    <div id="chaos-simulator" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [STRESS TESTING // ENGINE 14]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              DOMINO SIMULATOR
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Emergency Domino Chaos Simulator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Trigger simultaneous real-world financial shocks to test whether your 5 pots absorb the blast or if compounding SIPs get liquidated.
          </p>
        </div>

        {/* Resilience Badge */}
        <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
          <div className="h-11 w-11 rounded-lg bg-black text-white flex items-center justify-center font-mono font-black text-sm">
            {resilienceScore}%
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
              PORTFOLIO RESILIENCE
            </span>
            <p className="text-xs font-black text-black font-mono">
              {survives ? "BULLETPROOF" : "DEFICIT WARNING"}
            </p>
            <p className="text-xs text-neutral-600 font-mono">
              LIQUID RESERVE: ₹{(liquidSavings / 100000).toFixed(1)}L
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
              className={`p-5 rounded-xl border text-left transition-all cursor-pointer relative ${
                isTriggered
                  ? "bg-neutral-900 text-white border-black shadow-xs ring-1 ring-black"
                  : "bg-white text-black border-neutral-300 hover:border-black"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isTriggered ? "bg-white text-black" : "bg-neutral-100 text-neutral-800"
                }`}>
                  [{shock.tag}]
                </span>
                <span className="text-[10px] font-mono font-bold">
                  {isTriggered ? "● ACTIVE" : "○ INACTIVE"}
                </span>
              </div>
              <h4 className={`text-sm font-black font-heading ${isTriggered ? "text-white" : "text-black"}`}>
                {shock.title}
              </h4>
              <p className={`text-xs mt-1 leading-relaxed ${isTriggered ? "text-neutral-300" : "text-neutral-600"}`}>
                {shock.description}
              </p>
              <div className={`mt-3 pt-2 border-t flex justify-between text-xs font-mono font-bold ${
                isTriggered ? "border-neutral-700 text-neutral-200" : "border-neutral-200 text-black"
              }`}>
                <span>SHOCK IMPACT:</span>
                <span>-₹{shock.cost.toLocaleString("en-IN")}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual Domino Impact Panel */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="font-bold text-neutral-700">TOTAL SIMULATED SHOCK:</span>
            <span className="text-black font-black text-sm">
              ₹{totalShockCost.toLocaleString("en-IN")}
            </span>
          </div>

          {activeShocks.length > 0 && (
            <button
              onClick={resetChaos}
              className="text-xs font-mono font-bold text-black px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition cursor-pointer"
            >
              [CLEAR SHOCKS]
            </button>
          )}
        </div>

        {/* Balance Impact Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">
              RESERVE BUFFER
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-black tabular-nums">
                ₹{remainingLiquidSavings.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-neutral-500">REMAINING</span>
            </div>
            <div className="h-2 w-full bg-neutral-200 rounded-md overflow-hidden mt-3 border border-neutral-300">
              <div
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, (remainingLiquidSavings / (liquidSavings || 1)) * 100)
                  )}%`,
                }}
                className={`h-full transition-all duration-500 ${survives ? "bg-black" : "bg-neutral-500"}`}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">
              SIP LIQUIDATION RISK
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-black tabular-nums">
                {shortfall > 0 ? `₹${shortfall.toLocaleString("en-IN")}` : "₹0 (PROTECTED)"}
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-2 font-sans font-medium">
              {shortfall > 0
                ? "Emergency reserve breached. You would be forced to break your long-term compounding SIPs."
                : "Your liquid emergency pot absorbed 100% of the shock. Compounding survives uninterrupted."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300">
            <span className="text-[10px] uppercase font-bold text-black block">
              ACTIONABLE PLAYBOOK
            </span>
            <p className="text-xs text-neutral-700 mt-1 leading-relaxed font-sans font-medium">
              {survives
                ? "Your portfolio is resilient. Maintain ₹35,000 monthly fixed living runway to stay completely sheltered."
                : `Increase emergency fund by ₹${(shortfall / 100000).toFixed(1)} Lakhs or take parent super top-up health cover.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
