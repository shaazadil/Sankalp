"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Building2, Heart, GraduationCap, Car, Wallet, Loader2 } from "lucide-react";

interface HeroOmnibarProps {
  onSelectPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export const HeroOmnibar: React.FC<HeroOmnibarProps> = ({ onSelectPrompt, isLoading }) => {
  const [inputVal, setInputVal] = useState("");

  const presets = [
    {
      id: "relocation",
      icon: <Building2 className="w-3.5 h-3.5 text-blue-400" />,
      label: "Kolkata ➔ Bengaluru (₹9 LPA)",
      prompt: "I am moving from Kolkata to Bengaluru for a ₹9 LPA job offer. What monthly budget should I plan, and how much can I save?",
      highlight: "Deposit Shock & In-Hand Math",
    },
    {
      id: "wedding",
      icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
      label: "₹15 Lakh Wedding (18 Months)",
      prompt: "Help me save ₹15 Lakh for a wedding in 18 months with 30% family contribution and a gold hedge.",
      highlight: "Gold / SGB Allocation",
    },
    {
      id: "education",
      icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />,
      label: "₹25L Education Loan (60/40 Split)",
      prompt: "My family pays 60% of my ₹25 Lakh higher education expenses. Help me plan my remaining loan repayment and Section 80E tax deduction.",
      highlight: "Section 80E Tax Savings",
    },
    {
      id: "car",
      icon: <Car className="w-3.5 h-3.5 text-amber-400" />,
      label: "First Car: Buy vs. Loan",
      prompt: "I want to buy a ₹8 Lakh first car without exhausting my savings. Compare buying outright versus auto loan EMI.",
      highlight: "EMI vs. Cash Outright",
    },
    {
      id: "budget",
      icon: <Wallet className="w-3.5 h-3.5 text-emerald-400" />,
      label: "Monthly ₹65k In-Hand 5-Pots",
      prompt: "I earn ₹65,000 per month in-hand and send ₹10,000 home to my parents. How should I allocate my 5 pots?",
      highlight: "5-Pots Zero-Based Model",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      onSelectPrompt(inputVal.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-4 pb-2 px-4 sm:px-6">
      {/* Title & Tagline */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3 h-3" />
          <span>Deterministic Indian Financial Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading">
          Simulate any Indian life milestone.
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          No jargon. No generic advice. Enter your life scenario in plain English, and our deterministic math engine will calculate what you can actually afford.
        </p>
      </div>

      {/* Main Omnibar Input */}
      <form onSubmit={handleSubmit} className="relative mb-4 group">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-emerald-400 pointer-events-none">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. Moving from Kolkata to Bengaluru for 9 LPA, or planning a 15L wedding..."
            disabled={isLoading}
            className="w-full pl-12 pr-28 py-4 rounded-2xl bg-[#0c111e] border border-white/[0.1] shadow-2xl text-sm sm:text-base font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="absolute right-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-white disabled:text-slate-500 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Calculate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Scenario Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-500 mr-1 uppercase tracking-wider">
          Scenarios:
        </span>
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={isLoading}
            onClick={() => onSelectPrompt(preset.prompt)}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] hover:border-emerald-500/30 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {preset.icon}
            <span className="font-medium">{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
