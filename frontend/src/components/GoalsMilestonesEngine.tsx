"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calculateGoal, formatINR, GoalCalculationResponse } from "@/lib/api";

interface GoalsEngineProps {
  monthlyIncome?: number;
}

export const GoalsMilestonesEngine: React.FC<GoalsEngineProps> = ({ monthlyIncome = 67000 }) => {
  const [goalName, setGoalName] = useState("₹15 Lakh Wedding Fund");
  const [targetAmount, setTargetAmount] = useState(1500000);
  const [targetMonths, setTargetMonths] = useState(18);
  const [currentSavings, setCurrentSavings] = useState(250000);
  const [familyGift, setFamilyGift] = useState(300000);
  const [isWeddingOrGold, setIsWeddingOrGold] = useState(true);
  const [expectedReturn, setExpectedReturn] = useState(12.0);

  const [result, setResult] = useState<GoalCalculationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateGoal({
        goal_name: goalName,
        target_amount: targetAmount,
        target_months: targetMonths,
        current_savings: currentSavings,
        expected_annual_return: expectedReturn,
        family_gift_amount: familyGift,
        monthly_income: monthlyIncome,
        is_wedding_or_gold_goal: isWeddingOrGold,
      });
      setResult(data);
    } catch (e) {
      console.error("Goal calculation error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [goalName, targetAmount, targetMonths, currentSavings, familyGift, isWeddingOrGold, expectedReturn, monthlyIncome]);

  return (
    <div id="goals-milestones" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [MILESTONES // ENGINE 05]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              INDIAN MILESTONE ACCUMULATOR
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Life Milestone &amp; Wedding Goal Planner
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Calculate exact monthly SIP required for weddings, car down payments, or home purchases factoring in parent gifts &amp; Sovereign Gold Bonds.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
            <div className="h-11 w-11 rounded-lg bg-black text-white flex flex-col items-center justify-center font-mono">
              <span className="text-sm font-black leading-none">{targetMonths}</span>
              <span className="text-[9px] uppercase text-neutral-300 font-bold">MONTHS</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                REQUIRED MONTHLY SIP
              </span>
              <p className="text-sm font-black text-black font-mono">
                {formatINR(result.required_monthly_sip)}/MO
              </p>
              <p className="text-xs text-neutral-600 font-mono">
                SAFE RD/FD: {formatINR(result.required_monthly_fd)}/MO
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-black text-black uppercase">
              MILESTONE SPECIFICATIONS
            </h3>
            <span className="text-xs font-mono text-neutral-500">[DETERMINISTIC SIP]</span>
          </div>

          <div className="space-y-1 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <label className="text-xs font-mono font-bold text-neutral-700 block">MILESTONE NAME</label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="w-full bg-white border border-neutral-300 text-black text-xs font-mono font-bold rounded-lg p-2.5 outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">TARGET CORPUS:</span>
              <span className="text-black">{formatINR(targetAmount)}</span>
            </div>
            <input
              type="range"
              min={300000}
              max={5000000}
              step={25000}
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">TIMELINE:</span>
                <span className="text-black">{targetMonths} MO</span>
              </div>
              <input
                type="range"
                min={6}
                max={60}
                step={3}
                value={targetMonths}
                onChange={(e) => setTargetMonths(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>

            <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">FAMILY GIFT:</span>
                <span className="text-black">{formatINR(familyGift)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1500000}
                step={25000}
                value={familyGift}
                onChange={(e) => setFamilyGift(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>
          </div>

          {/* SGB Gold Hedge Checkbox */}
          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-black block">
                SOVEREIGN GOLD BOND (SGB) HEDGE
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">
                Locks wedding jewelry inflation at RBI coupon rate
              </span>
            </div>
            <input
              type="checkbox"
              checked={isWeddingOrGold}
              onChange={(e) => setIsWeddingOrGold(e.target.checked)}
              className="w-4 h-4 rounded accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Results & SGB Breakdown */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">NET CORPUS NEEDED</span>
                  <span className="text-xl font-black text-black font-mono mt-0.5 block">
                    {formatINR(result.net_target_after_family_help)}
                  </span>
                  <span className="text-[11px] text-neutral-600 font-mono">
                    AFTER {formatINR(familyGift)} GIFT
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300">
                  <span className="text-[10px] font-mono uppercase text-black font-bold block">MONTHLY EQUITY SIP</span>
                  <span className="text-xl font-black text-black font-mono mt-0.5 block">
                    {formatINR(result.required_monthly_sip)}/MO
                  </span>
                  <span className="text-[11px] text-neutral-600 font-mono font-bold">
                    @ {expectedReturn}% CAGR
                  </span>
                </div>
              </div>

              {/* Gold SGB Allocation */}
              {result.gold_sgb_allocation && (
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 space-y-2.5">
                  <span className="text-[11px] uppercase font-mono font-bold text-black block">
                    WEDDING GOLD HEDGE ASSET SPLIT
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 rounded-lg bg-white border border-neutral-300">
                      <span className="text-[9px] text-neutral-500 block">GOLD SGB</span>
                      <span className="text-xs font-bold text-black">
                        {formatINR(result.gold_sgb_allocation.monthly_gold_sgb_sip)}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-neutral-300">
                      <span className="text-[9px] text-neutral-500 block">EQUITY SIP</span>
                      <span className="text-xs font-bold text-black">
                        {formatINR(result.gold_sgb_allocation.monthly_equity_sip)}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-neutral-300">
                      <span className="text-[9px] text-neutral-500 block">DEBT RD</span>
                      <span className="text-xs font-bold text-black">
                        {formatINR(result.gold_sgb_allocation.monthly_debt_rd)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed font-mono">
                    {result.gold_sgb_allocation.insight}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-neutral-500 text-xs font-mono">
              COMPUTING TARGET COMPOUNDING...
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>GUARANTEED VS EQUITY ALLOCATION</span>
            <span className="font-bold text-black">[ZERO HALLUCINATION]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
