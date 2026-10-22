"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface HeroOmnibarProps {
  onSelectPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export const HeroOmnibar: React.FC<HeroOmnibarProps> = ({ onSelectPrompt, isLoading }) => {
  const [inputVal, setInputVal] = useState("");

  const presets = [
    {
      id: "relocation",
      tag: "BLR // 9 LPA",
      label: "Kolkata ➔ Bengaluru (₹9 LPA)",
      prompt: "I am moving from Kolkata to Bengaluru for a ₹9 LPA job offer. What monthly budget should I plan, and how much can I save?",
    },
    {
      id: "wedding",
      tag: "WEDDING // 15L",
      label: "₹15 Lakh Wedding (18 Months)",
      prompt: "Help me save ₹15 Lakh for a wedding in 18 months with 30% family contribution and a gold hedge.",
    },
    {
      id: "education",
      tag: "EDU LOAN // 25L",
      label: "₹25L Education Loan (60/40 Split)",
      prompt: "My family pays 60% of my ₹25 Lakh higher education expenses. Help me plan my remaining loan repayment and Section 80E tax deduction.",
    },
    {
      id: "car",
      tag: "CAR // BUY VS LOAN",
      label: "First Car: Buy vs. Loan",
      prompt: "I want to buy a ₹8 Lakh first car without exhausting my savings. Compare buying outright versus auto loan EMI.",
    },
    {
      id: "budget",
      tag: "5-POTS // 65K IN-HAND",
      label: "Monthly ₹65k In-Hand 5-Pots",
      prompt: "I earn ₹65,000 per month in-hand and send ₹10,000 home to my parents. How should I allocate my 5 pots?",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      onSelectPrompt(inputVal.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-4 pb-2">
      {/* Title & Tagline */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-mono font-bold uppercase mb-1">
          <span>[DETERMINISTIC CASHFLOW SIMULATOR]</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black font-heading">
          Simulate any Indian life milestone.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-medium">
          Deterministic cashflow calculations. Enter your real scenario in plain English to see exact take-home, rental impact, and compounding runway.
        </p>
      </div>

      {/* Main Omnibar Input */}
      <form onSubmit={handleSubmit} className="relative mb-4 group">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (inputVal.trim() && !isLoading) {
                  onSelectPrompt(inputVal.trim());
                }
              }
            }}
            placeholder="e.g. Moving from Kolkata to Bengaluru for 9 LPA, or planning a 15L wedding..."
            disabled={isLoading}
            className="w-full pl-4 pr-36 py-3.5 rounded-xl bg-white border border-neutral-300 shadow-xs text-sm sm:text-base font-medium text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-sans"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            {inputVal && !isLoading && (
              <button
                type="button"
                onClick={() => setInputVal("")}
                className="px-2 py-1 text-xs font-mono font-bold text-neutral-500 hover:text-black transition cursor-pointer"
              >
                [CLEAR]
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-4 py-2 rounded-lg bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white disabled:text-neutral-500 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? "CALCULATING..." : "RUN MATH →"}
            </button>
          </div>
        </div>
      </form>

      {/* Preset Scenario Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="text-[11px] font-mono font-bold text-neutral-500 mr-1 uppercase">
          SCENARIOS:
        </span>
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={isLoading}
            onClick={() => onSelectPrompt(preset.prompt)}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-300 text-xs font-mono font-bold text-black transition-all cursor-pointer"
          >
            <span>[{preset.tag}]</span> {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};
