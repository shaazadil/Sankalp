"use client";

import React from "react";
import { motion } from "framer-motion";

interface SankalpScoreMeterProps {
  runwayMonths?: number;
  savingsRatePercent?: number;
  taxEfficiency?: number;
}

export const SankalpScoreMeter: React.FC<SankalpScoreMeterProps> = ({
  runwayMonths = 5.2,
  savingsRatePercent = 22,
  taxEfficiency = 88,
}) => {
  // Compute composite score (0 to 1000)
  const runwayPoints = Math.min(250, Math.round((runwayMonths / 6) * 250));
  const savingsPoints = Math.min(250, Math.round((savingsRatePercent / 30) * 250));
  const taxPoints = Math.min(250, Math.round((taxEfficiency / 100) * 250));
  const zeroBasedBonus = 200; // points for keeping ₹0 unassigned

  const totalScore = Math.min(1000, runwayPoints + savingsPoints + taxPoints + zeroBasedBonus);

  let tier = "BALANCED";
  if (totalScore >= 850) {
    tier = "RESILIENT SOVEREIGN";
  } else if (totalScore < 600) {
    tier = "VULNERABLE RUNWAY";
  }

  const strokeDashoffset = 440 - (440 * (totalScore / 1000));

  const perks = [
    {
      title: "1-on-1 Chartered Accountant Tax Consultation",
      tag: "LEVEL 750+",
      unlocked: totalScore >= 750,
      desc: "30-min strategy session to optimize Old vs New Regime exemptions.",
    },
    {
      title: "Direct Index / SGB Investment Routing",
      tag: "LEVEL 800+",
      unlocked: totalScore >= 800,
      desc: "Direct execution of your Growth Pot SIP into low-cost index funds.",
    },
    {
      title: "6-Month Liquid Runway Milestone Verification",
      tag: "LEVEL 850+",
      unlocked: totalScore >= 850,
      desc: "Audit-ready financial health certification for rental leases.",
    },
  ];

  return (
    <div id="readiness-score" className="w-full max-w-6xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Circular Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-neutral-200"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-black transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Score in Center */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-black font-mono tabular-nums tracking-tight">
                {totalScore}
              </span>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500">
                / 1000
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-black text-white">
                {tier}
              </span>
              <span className="text-xs text-neutral-500 font-mono">TOP 12% IN METRO</span>
            </div>
            <h3 className="text-2xl font-black text-black font-heading tracking-tight">
              Sankalp Readiness Index
            </h3>
            <p className="text-xs text-neutral-600 max-w-md font-medium">
              Deterministic evaluation of liquid runway, tax minimization, family support buffer, and zero-based discipline.
            </p>
          </div>
        </div>

        {/* 4 Pillars Mini-Badges */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200 text-center">
            <span className="text-[10px] text-neutral-500 uppercase font-mono block">RUNWAY PTS</span>
            <span className="text-base font-black text-black font-mono">{runwayPoints}/250</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200 text-center">
            <span className="text-[10px] text-neutral-500 uppercase font-mono block">SAVINGS PTS</span>
            <span className="text-base font-black text-black font-mono">{savingsPoints}/250</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200 text-center">
            <span className="text-[10px] text-neutral-500 uppercase font-mono block">TAX OPTIM</span>
            <span className="text-base font-black text-black font-mono">{taxPoints}/250</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-neutral-200 text-center">
            <span className="text-[10px] text-neutral-500 uppercase font-mono block">ZERO-SUM</span>
            <span className="text-base font-black text-black font-mono">200/200</span>
          </div>
        </div>
      </div>

      {/* Milestone Unlocks & Perks */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <span className="font-mono font-black text-xs text-black uppercase">
            READINESS MILESTONE UNLOCKS
          </span>
          <span className="text-xs font-mono text-neutral-600 font-bold">
            [{perks.filter((p) => p.unlocked).length} OF 3 ACTIVE]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {perks.map((perk, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border transition-all ${
                perk.unlocked
                  ? "bg-[#F8F9FA] border-neutral-900"
                  : "bg-white border-neutral-200 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-200 text-black">
                  {perk.tag}
                </span>
                <span className="text-xs font-mono font-bold text-black">
                  {perk.unlocked ? "[UNLOCKED]" : "[LOCKED]"}
                </span>
              </div>
              <h4 className="text-sm font-black text-black font-heading mb-1">{perk.title}</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
