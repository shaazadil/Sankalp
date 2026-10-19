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
      icon: <Building2 className="w-3.5 h-3.5 text-blue-500" />,
      label: "Kolkata ➔ Bengaluru (₹9 LPA)",
      prompt: "I am moving from Kolkata to Bengaluru for a ₹9 LPA job offer. What monthly budget should I plan, and how much can I save?",
      highlight: "Deposit Shock & In-Hand Math",
    },
    {
      id: "wedding",
      icon: <Heart className="w-3.5 h-3.5 text-rose-500" />,
      label: "₹15 Lakh Wedding (18 Months)",
      prompt: "Help me save ₹15 Lakh for a wedding in 18 months with 30% family contribution and a gold hedge.",
      highlight: "Gold / SGB Allocation",
    },
    {
      id: "education",
      icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />,
      label: "₹25L Education Loan (60/40 Split)",
      prompt: "My family pays 60% of my ₹25 Lakh higher education expenses. Help me plan my remaining loan repayment and Section 80E tax deduction.",
      highlight: "Section 80E Tax Savings",
    },
    {
      id: "car",
      icon: <Car className="w-3.5 h-3.5 text-amber-500" />,
      label: "First Car: Buy vs. Loan",
      prompt: "I want to buy a ₹8 Lakh first car without exhausting my savings. Compare buying outright versus auto loan EMI.",
      highlight: "EMI vs. Cash Outright",
    },
    {
      id: "budget",
      icon: <Wallet className="w-3.5 h-3.5 text-emerald-500" />,
      label: "Monthly ₹65k In-Hand Budget",
      prompt: "I earn ₹65,000 per month in-hand and send ₹10,000 home to my parents. How should I allocate my 5 pots?",
      highlight: "Jupiter 5-Pots Model",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      onSelectPrompt(inputVal.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 pb-4 px-4 sm:px-6">
      {/* Title & Tagline */}
      <div className="text-center mb-6 space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tell Sankalp what you&apos;re planning.
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          No jargon. No generic advice. Enter your life goal in plain English, and our deterministic math engine will calculate what you can actually afford.
        </p>
      </div>

      {/* Main Omnibar Input */}
      <form onSubmit={handleSubmit} className="relative mb-4 group">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-emerald-600 dark:text-emerald-400 pointer-events-none">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. Moving from Kolkata to Bengaluru for 9 LPA, or planning a 15L wedding..."
            disabled={isLoading}
            className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-none text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="absolute right-2 px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 text-white disabled:text-zinc-400 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick-Launch Scenario Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-1">
          Scenarios:
        </span>
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setInputVal(preset.prompt);
              onSelectPrompt(preset.prompt);
            }}
            disabled={isLoading}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all active:scale-95 cursor-pointer"
          >
            {preset.icon}
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
