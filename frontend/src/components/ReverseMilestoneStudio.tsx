"use client";

import React, { useState, useEffect } from "react";
import { Target, FastForward, Sparkles, Utensils, Plane, TrendingUp, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { calculateReverseMilestone } from "@/lib/api";

interface ReverseMilestoneProps {
  defaultGoalName?: string;
  defaultTarget?: number;
}

export const ReverseMilestoneStudio: React.FC<ReverseMilestoneProps> = ({
  defaultGoalName = "3BHK Flat Down Payment",
  defaultTarget = 2500000,
}) => {
  const [goalName, setGoalName] = useState(defaultGoalName);
  const [targetAmount, setTargetAmount] = useState(defaultTarget);
  const [currentSavings, setCurrentSavings] = useState(350000);
  const [monthlySip, setMonthlySip] = useState(25000);
  const [diningCut, setDiningCut] = useState(30);
  const [travelCut, setTravelCut] = useState(40);
  const [expectedCagr, setExpectedCagr] = useState(12.5);

  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateReverseMilestone({
        milestone_name: goalName,
        target_amount: targetAmount,
        current_savings_assigned: currentSavings,
        current_monthly_sip: monthlySip,
        dining_out_cut_percent: diningCut,
        travel_pause_percent: travelCut,
        expected_cagr_percent: expectedCagr,
      });
      setResult(data);
    } catch (e) {
      console.error("Reverse milestone error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [goalName, targetAmount, currentSavings, monthlySip, diningCut, travelCut, expectedCagr]);

  return (
    <div id="reverse-milestone" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Reverse Engineering
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                Sacrifice Time-Warp Levers
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              Reverse Milestone Accelerator
            </h2>
            <p className="text-xs text-slate-400">
              Dial lifestyle micro-sacrifices (Zomato cuts, vacation pauses) to snap dream milestone completion dates forward by months.
            </p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-emerald-300 font-mono">
              <span className="text-base font-black leading-none">-{result.months_saved}</span>
              <span className="text-[9px] uppercase text-emerald-400">Mo</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Accelerated Timeline
              </span>
              <p className="text-xs font-bold text-emerald-300">
                Reach Goal in {result.accelerated_months_required} Months
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Target: {result.accelerated_completion_date}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Milestone Target &amp; Sacrifice Dial</span>
            <span className="text-xs font-mono text-amber-400">Real Compounding Math</span>
          </h3>

          {/* Goal selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
              <label className="text-[11px] text-slate-400">Milestone Name</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full bg-[#0c111e] border border-white/[0.1] text-white text-xs rounded-xl p-2 font-bold"
              />
            </div>
            <div className="space-y-1 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Target Corpus:</span>
                <span className="font-mono font-bold text-amber-300">₹{targetAmount.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={500000}
                max={10000000}
                step={50000}
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full cursor-pointer accent-amber-400 mt-2"
              />
            </div>
          </div>

          {/* Baseline allocations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Current Assigned Savings:</span>
                <span className="font-mono font-bold text-white">₹{currentSavings.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={0}
                max={2000000}
                step={25000}
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Baseline Monthly SIP:</span>
                <span className="font-mono font-bold text-white">₹{monthlySip.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={2500}
                value={monthlySip}
                onChange={(e) => setMonthlySip(Number(e.target.value))}
                className="w-full cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Sacrifice Levers */}
          <div className="p-4 rounded-2xl bg-[#080d17] border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <FastForward className="w-4 h-4 text-amber-400" />
                Real-Time Sacrifice Levers
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Direct monthly cash injection into SIP
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-orange-400" /> Dining Out / Swiggy Cut:
                </span>
                <span className="font-mono font-bold text-orange-400">{diningCut}% cut</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                step={5}
                value={diningCut}
                onChange={(e) => setDiningCut(Number(e.target.value))}
                className="w-full cursor-pointer accent-orange-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-blue-400" /> Weekend Travel Pause:
                </span>
                <span className="font-mono font-bold text-blue-400">{travelCut}% cut</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                step={5}
                value={travelCut}
                onChange={(e) => setTravelCut(Number(e.target.value))}
                className="w-full cursor-pointer accent-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Results Screen */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] flex flex-col justify-between space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Comparison Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#0c111e] border border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Baseline Date</span>
                  <span className="text-sm font-bold text-slate-300 block mt-0.5">
                    {result.baseline_completion_date}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {result.baseline_months_required} months
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block">Accelerated Date</span>
                  <span className="text-sm font-bold text-emerald-300 block mt-0.5">
                    {result.accelerated_completion_date}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {result.accelerated_months_required} months
                  </span>
                </div>
              </div>

              {/* Capital Freed Badge */}
              <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Extra Capital Freed</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    +₹{result.additional_monthly_capital_freed.toLocaleString("en-IN")}/mo
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Time Saved</span>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    {result.months_saved} Months
                  </span>
                </div>
              </div>

              {/* Feasibility Verdict */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] text-xs text-slate-300 leading-relaxed space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {result.milestone_feasibility}
                </div>
                <p className="text-[11px] text-slate-400">
                  By cutting {diningCut}% of dining out and {travelCut}% of leisure travel, you convert temporary dopamine into ₹{result.additional_monthly_capital_freed.toLocaleString("en-IN")} extra monthly compounders, achieving your {goalName} early.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-slate-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Simulating reverse milestone trajectories...
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Opportunity Cost Compounder</span>
            <span>Zero Delusional Goals</span>
          </div>
        </div>
      </div>
    </div>
  );
};
