"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calculateImpulseCooling } from "@/lib/api";

interface ImpulseCoolingProps {
  monthlyIncome?: number;
}

export const ImpulseCoolingSandbox: React.FC<ImpulseCoolingProps> = ({ monthlyIncome = 67000 }) => {
  const [itemName, setItemName] = useState("Apple iPhone 16 Pro");
  const [cost, setCost] = useState(119900);
  const [coolingDays, setCoolingDays] = useState(30);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateImpulseCooling({
        item_name: itemName,
        item_cost: cost,
        monthly_in_hand: monthlyIncome,
        cooling_days: coolingDays,
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [itemName, cost, coolingDays, monthlyIncome]);

  return (
    <div id="impulse-cooling" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [BEHAVIORAL PSYCHOLOGY // ENGINE 12]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              OPPORTUNITY COST LENS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Impulse Buy 72-Hour Cooling Sandbox
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Convert impulse desires into human working days and 10-year compounding freedom. Delay the impulse to grow your net worth.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
            <div className="h-11 w-11 rounded-lg bg-black text-white flex items-center justify-center font-mono font-black text-base">
              {result.work_days_required}D
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                LABOR EQUIVALENT
              </span>
              <p className="text-xs font-black text-black font-mono">
                {result.work_days_required} FULL WORK DAYS
              </p>
              <p className="text-xs text-neutral-600 font-mono">
                {result.carbon_and_regret_index} REGRET RISK
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <h3 className="text-sm font-mono font-black text-black uppercase">
            DESIRE &amp; DELAY PARAMETERS
          </h3>

          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <label className="text-xs font-mono font-bold text-neutral-700 block">ITEM OR EXPERIENCE</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-white border border-neutral-300 text-black text-xs font-mono font-bold rounded-lg p-2.5 outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">PRICE IN RUPEES:</span>
              <span className="text-black">₹{cost.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={250000}
              step={1000}
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>₹5k (AirPods)</span>
              <span>₹60k (Trip)</span>
              <span>₹2.5L (MacBook)</span>
            </div>
          </div>

          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">COOLING DELAY:</span>
              <span className="text-black">{coolingDays} DAYS</span>
            </div>
            <input
              type="range"
              min={7}
              max={90}
              step={7}
              value={coolingDays}
              onChange={(e) => setCoolingDays(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>
        </div>

        {/* Intelligence Result */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4 flex flex-col justify-between">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                    DELAY ARBITRAGE GAIN
                  </span>
                  <span className="text-xl font-black text-black font-mono tabular-nums">
                    +₹{result.opportunity_cost_arbitrage_30d.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono block">IN 8.5% LIQUID POT</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300">
                  <span className="text-[10px] uppercase font-mono font-bold text-black block">
                    10-YEAR OPPORTUNITY COST
                  </span>
                  <span className="text-xl font-black text-black font-mono tabular-nums">
                    ₹{result.opportunity_cost_10yr_equity.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-neutral-600 font-mono block">IF INVESTED @ 12%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-700 leading-relaxed">
                <p>{result.cooling_verdict}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-neutral-500 text-xs font-mono">
              COMPUTING OPPORTUNITY COST...
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>SPENDING FILTER</span>
            <span className="font-bold text-black">[ZERO BUYER REMORSE]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
