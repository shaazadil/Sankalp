"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VisualDemonstrationProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset?: () => void;
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
      tag: "CTC TO IN-HAND BREAKDOWN",
      content: (
        <div className="space-y-4 font-mono">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300">
              <span className="text-[10px] text-neutral-500 uppercase block">GROSS ILLUSION</span>
              <p className="text-lg font-bold text-neutral-400 line-through">₹75,000/mo</p>
              <span className="text-[10px] text-neutral-500">(Annual CTC ÷ 12)</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 text-white border border-black">
              <span className="text-[10px] text-neutral-300 uppercase block font-bold">REAL IN-HAND</span>
              <p className="text-xl font-black">₹67,116/mo</p>
              <span className="text-[10px] text-neutral-300">(Net credited)</span>
            </div>
          </div>
          <div className="space-y-2 text-xs bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-neutral-700">
              <span>Employee Provident Fund (EPF 12%)</span>
              <span className="font-bold text-black">-₹1,800/mo</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Employer PF &amp; Gratuity</span>
              <span className="font-bold text-black">-₹3,423/mo</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>State Professional Tax</span>
              <span className="font-bold text-black">-₹200/mo</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Income Tax TDS (New Regime)</span>
              <span className="font-bold text-black">-₹2,461/mo</span>
            </div>
          </div>
          <p className="text-xs text-neutral-600 font-sans">
            Sankalp calculates your budget strictly with money that hits your bank, never inflated CTC marketing numbers.
          </p>
        </div>
      ),
    },
    {
      title: "2. The Bengaluru Deposit Shock",
      subtitle: "Navigating 7 months of locked rent capital upfront",
      tag: "LOCKED CAPITAL VS SUNK COST",
      content: (
        <div className="space-y-4 font-mono">
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-300 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-black">
              <span>LOCKED DEPOSIT (7 MO @ ₹16K):</span>
              <span>₹1,12,000</span>
            </div>
            <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden border border-neutral-300">
              <div className="bg-black h-full w-[70%]" />
            </div>
            <div className="flex justify-between text-xs text-neutral-600">
              <span>SUNK RELOCATION (MOVERS/BROKER)</span>
              <span className="text-black font-bold">₹45,000</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 rounded-lg bg-white border border-neutral-300">
              <span className="text-[10px] text-neutral-500 uppercase">DAY 1 CASH DRAIN</span>
              <p className="font-black text-black text-sm mt-0.5">₹1,57,000</p>
            </div>
            <div className="p-3 rounded-lg bg-neutral-100 border border-neutral-300">
              <span className="text-[10px] text-neutral-600 uppercase">RECOVERY PERIOD</span>
              <p className="font-black text-black text-sm mt-0.5">7.8 MONTHS</p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 font-sans">
            Landlord deposits freeze liquid cash at 0% interest. Sankalp builds an amortized runway buffer to withstand this shock.
          </p>
        </div>
      ),
    },
    {
      title: "3. The 5 Smart Money Pots",
      subtitle: "Balancing living essentials, parents, savings, and guilt-free UPI",
      tag: "ZERO-BASED ALLOCATION ENGINE",
      content: (
        <div className="space-y-3 font-mono">
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {[
              { label: "SURVIVAL", amount: "₹29.5k", pct: "44%" },
              { label: "FAMILY", amount: "₹10.0k", pct: "15%" },
              { label: "EMIS", amount: "₹0", pct: "0%" },
              { label: "GROWTH", amount: "₹19.5k", pct: "29%" },
              { label: "UPI", amount: "₹8.1k", pct: "12%" },
            ].map((pot, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-[#F8F9FA] border border-neutral-200 flex flex-col justify-between"
              >
                <span className="text-[9px] font-bold text-neutral-500 truncate">{pot.label}</span>
                <span className="text-xs font-black text-black">{pot.amount}</span>
                <span className="text-[9px] text-neutral-500">{pot.pct}</span>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-xs text-black flex items-center justify-between">
            <span className="font-bold">EMERGENCY RUNWAY BUFFER:</span>
            <span className="font-black text-sm">4.2 MONTHS BUFFER</span>
          </div>
        </div>
      ),
    },
    {
      title: "4. Interactive 'What-If' Simulation",
      subtitle: "Simulate rent hikes, delay milestones, or adjust parent remittances",
      tag: "REAL-TIME FASTAPI ENGINE",
      content: (
        <div className="space-y-3 font-mono">
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-300 space-y-2">
            <div className="flex justify-between text-xs font-bold text-black">
              <span>RENT INCREASE (₹16K ➔ ₹20K):</span>
              <span>+₹4,000/MO</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-neutral-300">
                <span className="text-[10px] text-neutral-500 uppercase">GUILT-FREE UPI</span>
                <p className="font-black text-black mt-0.5">₹4,100/MO</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-neutral-300">
                <span className="text-[10px] text-neutral-500 uppercase">DEPOSIT REQUIRED</span>
                <p className="font-black text-black mt-0.5">₹1,40,000</p>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-neutral-100 border border-neutral-300 text-xs text-neutral-800 font-sans">
            <strong>CO-PILOT ADVICE:</strong> &ldquo;Consider a 2BHK flatshare in HSR Layout at ₹14,000/mo to restore your monthly UPI buffer while preserving parents&apos; support.&rdquo;
          </div>
        </div>
      ),
    },
  ];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-neutral-300 shadow-2xl overflow-hidden text-neutral-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-neutral-200 text-black text-xs font-mono font-bold uppercase">
              [TOUR // STEP {currentStep + 1} OF {steps.length}]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-mono font-bold text-neutral-600 hover:text-black px-2 py-1 rounded bg-neutral-200 cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="grid grid-cols-4 gap-1.5 px-6 pt-3">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentStep(i);
                setIsPlaying(false);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentStep
                  ? "bg-black w-full"
                  : i < currentStep
                  ? "bg-neutral-400 w-full"
                  : "bg-neutral-200 w-full"
              }`}
            />
          ))}
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-black text-black font-heading tracking-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-xs text-neutral-600 font-medium">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Dynamic Content */}
          <div className="min-h-[220px] flex flex-col justify-center">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 bg-[#F8F9FA] font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-neutral-200 text-black hover:bg-neutral-300 transition font-bold cursor-pointer"
            >
              {isPlaying ? "[PAUSE]" : "[PLAY]"}
            </button>
            <button
              onClick={() => {
                setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
                setIsPlaying(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-200 text-black hover:bg-neutral-300 transition font-bold cursor-pointer"
            >
              ← PREV
            </button>
            <button
              onClick={() => {
                setCurrentStep((prev) => (prev + 1) % steps.length);
                setIsPlaying(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-200 text-black hover:bg-neutral-300 transition font-bold cursor-pointer"
            >
              NEXT →
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onApplyPreset?.();
            }}
            className="px-4 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white font-mono font-bold uppercase transition cursor-pointer"
          >
            APPLY THIS PLAN →
          </button>
        </div>
      </div>
    </div>
  );
};
