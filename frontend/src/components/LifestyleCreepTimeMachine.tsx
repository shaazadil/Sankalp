"use client";

import React, { useState, useEffect } from "react";
import { Clock, TrendingUp, Sparkles, Award, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { calculateLifestyleCreep } from "@/lib/api";

interface LifestyleCreepProps {
  currentCtc?: number;
  currentAge?: number;
  currentSip?: number;
  currentSavings?: number;
}

export const LifestyleCreepTimeMachine: React.FC<LifestyleCreepProps> = ({
  currentCtc = 1200000,
  currentAge = 26,
  currentSip = 15000,
  currentSavings = 250000,
}) => {
  const [ctc, setCtc] = useState<number>(currentCtc);
  const [hike, setHike] = useState<number>(18);
  const [sipShare, setSipShare] = useState<number>(60);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateLifestyleCreep({
        current_annual_ctc: ctc,
        hike_percent: hike,
        current_age: currentAge,
        current_monthly_sip: currentSip,
        current_savings: currentSavings,
        sip_allocation_of_hike_percent: sipShare,
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
  }, [ctc, hike, sipShare]);

  return (
    <div id="lifestyle-creep" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Compounding Physics
              </span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
                FIRE Accelerator
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              Lifestyle Creep Time Machine
            </h2>
            <p className="text-xs text-slate-400">
              When you get an appraisal hike, lifestyle inflation silently swallows it. See the exact retirement years saved by splitting your increment.
            </p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
              -{result.years_saved}Y
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Freedom Age
              </span>
              <p className="text-sm font-bold text-emerald-400">
                Retire at Age {result.accelerated_freedom_age} (vs. {result.baseline_freedom_age})
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                +{result.years_saved} Years of Life Freedom
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white">Appraisal Increment &amp; Allocation Scrubber</h3>

          {/* Appraisal Hike Slider */}
          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Expected Appraisal Hike:</span>
              <span className="font-mono font-bold text-indigo-400 text-sm">+{hike}% Increment</span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={hike}
              onChange={(e) => setHike(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5% (Inflation)</span>
              <span>18% (Standard)</span>
              <span>50% (Promo/Job Switch)</span>
            </div>
          </div>

          {/* Split Dial */}
          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-emerald-500/20">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-400 font-semibold">Allocate to Wealth SIP:</span>
              <span className="font-mono font-bold text-emerald-300 text-sm">
                {sipShare}% to SIP / {100 - sipShare}% to Lifestyle
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={sipShare}
              onChange={(e) => setSipShare(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (Live Large)</span>
              <span>50% (Balanced)</span>
              <span>90% (FIRE Beast Mode)</span>
            </div>
          </div>
        </div>

        {/* Intelligence Result Display */}
        <div className="p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] shadow-inner space-y-4 flex flex-col justify-between">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0c111e] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Net Monthly Increment
                  </span>
                  <span className="text-xl font-black text-white font-mono tabular-nums">
                    +₹{result.monthly_in_hand_increase.toLocaleString("en-IN")}/mo
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0c111e] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block font-mono">
                    Added to Compounding
                  </span>
                  <span className="text-xl font-black text-emerald-400 font-mono tabular-nums">
                    +₹{result.additional_monthly_sip.toLocaleString("en-IN")}/mo
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                <p>
                  <strong>Wealth at 60 Impact:</strong> Your projected retirement corpus leaps from{" "}
                  <strong className="text-white">₹{(result.projected_wealth_at_60_baseline / 10000000).toFixed(2)} Cr</strong> to{" "}
                  <strong className="text-emerald-400">₹{(result.projected_wealth_at_60_accelerated / 10000000).toFixed(2)} Cr</strong>.
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {result.lifestyle_inflation_warning}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-slate-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Computing compounding physics...
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Deterministic 12% CAGR Model</span>
            <span>Zero Inflation Hallucination</span>
          </div>
        </div>
      </div>
    </div>
  );
};
