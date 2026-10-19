"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Building2,
  ShieldAlert,
  Wallet,
  Sliders,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface VisualDemonstrationProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: () => void;
}

export const VisualDemonstration: React.FC<VisualDemonstrationProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      title: "1. The Offer Letter Illusion",
      subtitle: "Why ₹9 LPA is NOT ₹75,000 in your bank account",
      icon: <Building2 className="w-5 h-5 text-blue-500" />,
      tag: "CTC to Take-Home Breakdown",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[11px] font-medium text-zinc-500 uppercase">Gross Illusion</span>
              <p className="text-xl font-bold text-zinc-400 line-through">₹75,000/mo</p>
              <span className="text-[10px] text-zinc-400">(Annual CTC ÷ 12)</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Real In-Hand</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-300">₹67,116/mo</p>
              <span className="text-[10px] text-emerald-600/80 font-medium">(What hits your account)</span>
            </div>
          </div>
          <div className="space-y-2 text-xs bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Employee Provident Fund (EPF 12%)</span>
              <span className="font-semibold text-rose-500">-₹1,800/mo</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Employer PF & Gratuity (CTC component)</span>
              <span className="font-semibold text-rose-500">-₹3,423/mo</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Karnataka State Professional Tax</span>
              <span className="font-semibold text-rose-500">-₹200/mo</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Income Tax TDS (New Regime)</span>
              <span className="font-semibold text-rose-500">-₹2,461/mo</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            💡 Sankalp plans your budget with the money you actually receive, never the marketing CTC on the offer letter.
          </p>
        </div>
      ),
    },
    {
      title: "2. The Bengaluru Deposit Shock",
      subtitle: "Navigating 7 months of locked rent capital upfront",
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      tag: "Locked Capital vs. Sunk Cost",
      content: (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-300">
              <span>Locked Landlord Deposit (7 Months @ ₹16k)</span>
              <span>₹1,12,000</span>
            </div>
            <div className="w-full bg-amber-200 dark:bg-amber-900/60 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[70%]" />
            </div>
            <div className="flex justify-between text-[11px] text-amber-700 dark:text-amber-400">
              <span>Sunk Relocation Costs (Movers, Setup)</span>
              <span>₹45,000</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <span className="text-[10px] text-zinc-400">One-Time Day 1 Reserve</span>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">₹1,57,000</p>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <span className="text-[10px] text-zinc-400">Replenishment Period</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">7.8 Months</p>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            💡 Landlord deposits are not lost money, but they freeze your liquid cash at 0% interest. Sankalp builds an emergency buffer to withstand this shock.
          </p>
        </div>
      ),
    },
    {
      title: "3. The 5 Jupiter-Style Money Pots",
      subtitle: "Balancing survival, mummy-papa, savings, and UPI lifestyle",
      icon: <Wallet className="w-5 h-5 text-emerald-500" />,
      tag: "Monthly Allocation Engine",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {[
              { label: "Survival", amount: "₹29.5k", pct: "44%", color: "bg-blue-500" },
              { label: "Family", amount: "₹10.0k", pct: "15%", color: "bg-rose-500" },
              { label: "EMIs", amount: "₹0", pct: "0%", color: "bg-amber-500" },
              { label: "Growth", amount: "₹19.5k", pct: "29%", color: "bg-emerald-500" },
              { label: "UPI", amount: "₹8.1k", pct: "12%", color: "bg-purple-500" },
            ].map((pot, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 flex flex-col justify-between"
              >
                <div className={`w-2 h-2 rounded-full ${pot.color} mx-auto mb-1`} />
                <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 truncate">{pot.label}</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{pot.amount}</span>
                <span className="text-[9px] text-zinc-400">{pot.pct}</span>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <span>Emergency Runway Buffer:</span>
            <span className="font-extrabold text-sm">4.2 Months Safety Net</span>
          </div>
        </div>
      ),
    },
    {
      title: "4. Interactive 'What-If' Simulation",
      subtitle: "Simulate rent hikes, delay goals, or family contribution changes",
      icon: <Sliders className="w-5 h-5 text-indigo-500" />,
      tag: "Zero-Latency Real-Time Math",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span>What if Rent in HSR goes from ₹16,000 ➔ ₹20,000?</span>
              <span className="text-rose-500 font-bold">+₹4,000/mo</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] text-zinc-400">Guilt-Free UPI Pot</span>
                <p className="font-bold text-rose-500">Shrinks to ₹4,100/mo</p>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] text-zinc-400">Security Deposit</span>
                <p className="font-bold text-amber-500">Jumps to ₹1,40,000</p>
              </div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
            🤖 <strong>Sankalp Co-Pilot Advice:</strong> &quot;Consider a 2BHK flatshare in HSR Layout at ₹14,000/mo. It restores your monthly UPI buffer to ₹10,100 while keeping your parents&apos; support intact.&quot;
          </div>
        </div>
      ),
    },
  ];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isOpen && isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden transition-all">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              Interactive Tour
            </span>
            <span className="text-xs text-zinc-400">Step {currentStep + 1} of {steps.length}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="grid grid-cols-4 gap-1 px-6 pt-3">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentStep(i);
                setIsPlaying(false);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentStep
                  ? "bg-emerald-500 w-full"
                  : i < currentStep
                  ? "bg-emerald-300 dark:bg-emerald-800 w-full"
                  : "bg-zinc-200 dark:bg-zinc-800 w-full"
              }`}
            />
          ))}
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
              {steps[currentStep].icon}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                {steps[currentStep].title}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {steps[currentStep].subtitle}
              </p>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="min-h-[220px] flex flex-col justify-center">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition text-xs font-semibold flex items-center gap-1"
              title={isPlaying ? "Pause auto-tour" : "Play auto-tour"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              onClick={() => {
                setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
                setIsPlaying(false);
              }}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              title="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentStep((prev) => (prev + 1) % steps.length);
                setIsPlaying(false);
              }}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              title="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onApplyPreset();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md shadow-emerald-600/30 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load This Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
