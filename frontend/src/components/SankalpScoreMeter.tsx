"use client";

import React from "react";
import { ShieldCheck, Award, Gift, Zap, ArrowUpRight, CheckCircle2, Lock } from "lucide-react";

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

  // Tier determination
  let tier = "Balanced";
  let tierColor = "text-teal-400";
  let tierBg = "bg-teal-500/10 border-teal-500/20";
  if (totalScore >= 850) {
    tier = "Bulletproof";
    tierColor = "text-emerald-400";
    tierBg = "bg-emerald-500/10 border-emerald-500/20";
  } else if (totalScore < 600) {
    tier = "Vulnerable";
    tierColor = "text-amber-400";
    tierBg = "bg-amber-500/10 border-amber-500/20";
  }

  // Percentage for SVG circle dash
  const strokeDashoffset = 440 - (440 * (totalScore / 1000));

  const perks = [
    {
      title: "1-on-1 Chartered Accountant Tax Consultation",
      tag: "Unlocked @ 750+",
      unlocked: totalScore >= 750,
      desc: "Free 30-min strategy session to optimize Old vs New Regime exemptions.",
    },
    {
      title: "Zero-Brokerage Smallcase Investment Routing",
      tag: "Unlocked @ 800+",
      unlocked: totalScore >= 800,
      desc: "Direct 1-click execution of your Growth Pot SIP into low-cost index baskets.",
    },
    {
      title: "WeWork / Co-Working Day Pass Voucher",
      tag: "Unlocked @ 850+",
      unlocked: totalScore >= 850,
      desc: "Exclusive remote worker perk for maintaining a 6-month liquid runway.",
    },
  ];

  return (
    <div id="readiness-score" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Circular Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Meter */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-emerald-400 transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Score in Center */}
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white font-mono tabular-nums tracking-tight">
                {totalScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                / 1000
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierBg} ${tierColor}`}
              >
                {tier} Portfolio
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Top 12% in BLR</span>
            </div>
            <h3 className="text-xl font-black text-white font-heading">
              Sankalp Readiness Index
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              Evaluates your liquidity runway, tax minimization, parent support buffer, and zero-based discipline.
            </p>
          </div>
        </div>

        {/* 4 Pillars Mini-Badges */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-xl bg-[#080d17] border border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Liquid Runway</span>
            <span className="text-sm font-bold text-white font-mono">{runwayPoints}/250 pts</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080d17] border border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Savings Pace</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{savingsPoints}/250 pts</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080d17] border border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Tax Optimization</span>
            <span className="text-sm font-bold text-teal-400 font-mono">{taxPoints}/250 pts</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080d17] border border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Zero-Based Habit</span>
            <span className="text-sm font-bold text-purple-400 font-mono">200/200 pts</span>
          </div>
        </div>
      </div>

      {/* Milestone Unlocks & Perks */}
      <div className="p-6 rounded-3xl bg-[#080d17] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2 text-xs">
            <Gift className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Milestone Partner Perks</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            {perks.filter((p) => p.unlocked).length} of 3 Perks Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {perks.map((perk, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                perk.unlocked
                  ? "bg-[#0c111e] border-emerald-500/30 shadow-md"
                  : "bg-[#080d17] border-white/[0.06] opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    perk.unlocked
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {perk.tag}
                </span>
                {perk.unlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{perk.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
