"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    <div id="reverse-milestone" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [REVERSE ENGINEERING // ENGINE 13]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              SACRIFICE TIME-WARP
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Reverse Milestone Accelerator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Dial lifestyle micro-sacrifices (dining reductions, vacation pauses) to snap dream milestone completion dates forward by months.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
            <div className="h-11 w-11 rounded-lg bg-black text-white flex flex-col items-center justify-center font-mono">
              <span className="text-base font-black leading-none">-{result.months_saved}</span>
              <span className="text-[9px] uppercase text-neutral-300 font-bold">MO</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                ACCELERATED TIMELINE
              </span>
              <p className="text-xs font-black text-black font-mono">
                REACH GOAL IN {result.accelerated_months_required} MONTHS
              </p>
              <p className="text-xs text-neutral-600 font-mono">
                TARGET: {result.accelerated_completion_date}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-black text-black uppercase">
              TARGET &amp; SACRIFICE DIAL
            </h3>
            <span className="text-xs font-mono text-neutral-500">[COMPOUNDING ENGINE]</span>
          </div>

          {/* Goal selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <label className="text-xs font-mono font-bold text-neutral-700 block">MILESTONE NAME</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full bg-white border border-neutral-300 text-black text-xs font-mono font-bold rounded-lg p-2 outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">TARGET:</span>
                <span className="text-black">₹{targetAmount.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={500000}
                max={10000000}
                step={50000}
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full cursor-pointer accent-black mt-2"
              />
            </div>
          </div>

          {/* Baseline allocations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">ASSIGNED SAVINGS:</span>
                <span className="text-black">₹{currentSavings.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={0}
                max={2000000}
                step={25000}
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>

            <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">BASELINE SIP:</span>
                <span className="text-black">₹{monthlySip.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={100000}
                step={2500}
                value={monthlySip}
                onChange={(e) => setMonthlySip(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>
          </div>

          {/* Sacrifice Levers */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-black uppercase">
                SACRIFICE LEVERS (CONVERT TO SIP)
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                DIRECT CASH INJECTION
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">DINING OUT / DELIVERY REDUCTION:</span>
                <span className="text-black">{diningCut}% CUT</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                step={5}
                value={diningCut}
                onChange={(e) => setDiningCut(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">WEEKEND TRAVEL PAUSE:</span>
                <span className="text-black">{travelCut}% CUT</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                step={5}
                value={travelCut}
                onChange={(e) => setTravelCut(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>
          </div>
        </div>

        {/* Results Screen */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Comparison Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">BASELINE DATE</span>
                  <span className="text-xs font-bold text-neutral-700 block mt-0.5 font-mono">
                    {result.baseline_completion_date}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {result.baseline_months_required} MO
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-300">
                  <span className="text-[10px] font-mono uppercase text-black font-bold block">ACCELERATED DATE</span>
                  <span className="text-xs font-black text-black block mt-0.5 font-mono">
                    {result.accelerated_completion_date}
                  </span>
                  <span className="text-[10px] font-mono text-black font-bold">
                    {result.accelerated_months_required} MO
                  </span>
                </div>
              </div>

              {/* Capital Freed Badge */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">EXTRA CAPITAL FREED</span>
                  <span className="text-lg font-black text-black">
                    +₹{result.additional_monthly_capital_freed.toLocaleString("en-IN")}/MO
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-neutral-500 block">TOTAL TIME SAVED</span>
                  <span className="text-lg font-black text-black">
                    {result.months_saved} MONTHS
                  </span>
                </div>
              </div>

              {/* Feasibility Verdict */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-700 leading-relaxed space-y-1">
                <div className="font-black text-black uppercase">
                  {result.milestone_feasibility}
                </div>
                <p className="text-xs text-neutral-600 font-sans">
                  By cutting {diningCut}% of dining out and {travelCut}% of leisure travel, you convert temporary impulses into ₹{result.additional_monthly_capital_freed.toLocaleString("en-IN")} extra monthly compounders, achieving your {goalName} early.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-neutral-500 text-xs font-mono">
              SIMULATING REVERSE MILESTONES...
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>OPPORTUNITY COST ACCELERATOR</span>
            <span className="font-bold text-black">[DETERMINISTIC MATH]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
