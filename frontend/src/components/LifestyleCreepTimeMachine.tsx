"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calculateLifestyleCreep } from "@/lib/api";

interface LifestyleCreepProps {
  currentCtc?: number;
  currentAge?: number;
  currentSip?: number;
  currentSavings?: number;
}

export const LifestyleCreepTimeMachine: React.FC<LifestyleCreepProps> = ({
  currentCtc = 1200000,
  currentAge = 26,
  currentSip = 15000,
  currentSavings = 250000,
}) => {
  const [ctc, setCtc] = useState<number>(currentCtc);
  const [hike, setHike] = useState<number>(18);
  const [sipShare, setSipShare] = useState<number>(60);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateLifestyleCreep({
        current_annual_ctc: ctc,
        hike_percent: hike,
        current_age: currentAge,
        current_monthly_sip: currentSip,
        current_savings: currentSavings,
        sip_allocation_of_hike_percent: sipShare,
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [ctc, hike, sipShare]);

  return (
    <div id="lifestyle-creep" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [FIRE PHYSICS // ENGINE 10]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              INCREMENT ALLOCATION MODEL
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Lifestyle Creep Time Machine
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            When you receive an appraisal hike, lifestyle inflation quietly swallows it. See the exact retirement years reclaimed by ring-fencing your increment.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
            <div className="h-11 w-11 rounded-lg bg-black text-white flex items-center justify-center font-mono font-black text-sm">
              -{result.years_saved}Y
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                FREEDOM AGE ACCELERATION
              </span>
              <p className="text-xs font-black text-black font-mono">
                RETIRE AT AGE {result.accelerated_freedom_age} (VS. {result.baseline_freedom_age})
              </p>
              <p className="text-xs text-neutral-600 font-mono">
                +{result.years_saved} YEARS OF LIFETIME FREEDOM
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <h3 className="text-sm font-mono font-black text-black uppercase">
            INCREMENT &amp; ALLOCATION SCRUBBER
          </h3>

          {/* Appraisal Hike Slider */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">APPRAISAL HIKE:</span>
              <span className="text-black text-sm">+{hike}% INCREMENT</span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={hike}
              onChange={(e) => setHike(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>5% (Cost of Living)</span>
              <span>18% (Standard)</span>
              <span>50% (Switch)</span>
            </div>
          </div>

          {/* Split Dial */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">ALLOCATE TO SIP:</span>
              <span className="text-black text-sm">
                {sipShare}% TO SIP / {100 - sipShare}% LIFESTYLE
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={sipShare}
              onChange={(e) => setSipShare(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>10% (Live Large)</span>
              <span>50% (Balanced)</span>
              <span>90% (FIRE Mode)</span>
            </div>
          </div>
        </div>

        {/* Intelligence Result Display */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4 flex flex-col justify-between">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                    NET MONTHLY INCREMENT
                  </span>
                  <span className="text-xl font-black text-black font-mono tabular-nums">
                    +₹{result.monthly_in_hand_increase.toLocaleString("en-IN")}/mo
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300">
                  <span className="text-[10px] uppercase font-mono font-bold text-black block">
                    ADDED TO COMPOUNDING
                  </span>
                  <span className="text-xl font-black text-black font-mono tabular-nums">
                    +₹{result.additional_monthly_sip.toLocaleString("en-IN")}/mo
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-700 leading-relaxed">
                <p>
                  <strong>WEALTH AT AGE 60:</strong> Baseline projection leaps from{" "}
                  <strong className="text-black font-mono">₹{(result.projected_wealth_at_60_baseline / 10000000).toFixed(2)} Cr</strong> to{" "}
                  <strong className="text-black font-bold font-mono">₹{(result.projected_wealth_at_60_accelerated / 10000000).toFixed(2)} Cr</strong>.
                </p>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                {result.lifestyle_inflation_warning}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-neutral-500 text-xs font-mono">
              COMPUTING COMPOUNDING PHYSICS...
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>DETERMINISTIC 12% CAGR MODEL</span>
            <span className="font-bold text-black">[ZERO HALLUCINATION]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
