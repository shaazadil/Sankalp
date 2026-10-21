"use client";

import React, { useState, useEffect } from "react";
import { Coffee, DollarSign, Clock, Sparkles, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
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
    <div id="impulse-cooling" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                Behavioral Psychology
              </span>
              <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono">
                Opportunity Cost Lens
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              Impulse Buy 72-Hour Cooling Sandbox
            </h2>
            <p className="text-xs text-slate-400">
              Convert impulsive desires into human working days and 10-year compounding freedom. Delay the impulse to earn cash.
            </p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold font-mono text-sm">
              {result.work_days_required}d
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Labor Equivalent
              </span>
              <p className="text-xs font-bold text-slate-200">
                {result.work_days_required} Full Work Days
              </p>
              <p className="text-[11px] text-purple-300 font-mono">
                {result.carbon_and_regret_index} Regret Probability
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white">Item Desire &amp; Delay Parameters</h3>

          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <label className="text-[11px] text-slate-400 block">Item or Experience</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-[#0c111e] border border-white/[0.1] text-white text-xs rounded-xl p-2.5 font-bold"
            />
          </div>

          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Price in Rupees:</span>
              <span className="font-mono font-bold text-purple-300">₹{cost.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={250000}
              step={1000}
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹5k (AirPods)</span>
              <span>₹60k (Goa Trip)</span>
              <span>₹2.5L (MacBook/Bike)</span>
            </div>
          </div>

          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Cooling Delay:</span>
              <span className="font-mono font-bold text-white">{coolingDays} Days</span>
            </div>
            <input
              type="range"
              min={7}
              max={90}
              step={7}
              value={coolingDays}
              onChange={(e) => setCoolingDays(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>

        {/* Intelligence Result */}
        <div className="p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] shadow-inner space-y-4 flex flex-col justify-between">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0c111e] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Delay Arbitrage Gain
                  </span>
                  <span className="text-xl font-black text-emerald-400 font-mono tabular-nums">
                    +₹{result.opportunity_cost_arbitrage_30d.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-500 block">in 8.5% liquid pot</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0c111e] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-purple-300 block font-mono">
                    10-Year Opportunity Cost
                  </span>
                  <span className="text-xl font-black text-purple-300 font-mono tabular-nums">
                    ₹{result.opportunity_cost_10yr_equity.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-500 block">if invested @ 12%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                <p>{result.cooling_verdict}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-slate-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Computing opportunity cost...
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Guilt-Free Spending Filter</span>
            <span>Zero Buyer Remorse</span>
          </div>
        </div>
      </div>
    </div>
  );
};
