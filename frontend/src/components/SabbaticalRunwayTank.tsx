"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calculateSabbaticalRunway } from "@/lib/api";

interface SabbaticalRunwayProps {
  initialSavings?: number;
}

export const SabbaticalRunwayTank: React.FC<SabbaticalRunwayProps> = ({ initialSavings = 600000 }) => {
  const [savings, setSavings] = useState(initialSavings);
  const [rentAndBills, setRentAndBills] = useState(25000);
  const [familySupport, setFamilySupport] = useState(8000);
  const [emis, setEmis] = useState(4000);
  const [pauseDiscretionary, setPauseDiscretionary] = useState(true);
  const [discretionarySpend, setDiscretionarySpend] = useState(12000);

  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateSabbaticalRunway({
        liquid_savings: savings,
        monthly_survival_rent_bills: rentAndBills,
        monthly_family_support: familySupport,
        monthly_active_emis: emis,
        pause_discretionary: pauseDiscretionary,
        discretionary_spend: discretionarySpend,
      });
      setResult(data);
    } catch (e) {
      console.error("Sabbatical calculation error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [savings, rentAndBills, familySupport, emis, pauseDiscretionary, discretionarySpend]);

  return (
    <div id="sabbatical-runway" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [FREEDOM RESERVOIR // ENGINE 08]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              ZERO-INCOME BURN MODEL
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Sabbatical &amp; Upskilling Runway Tank
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Calculate exact days of zero-income survival before taking a startup plunge, higher studies, or career break.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
            <div className="h-11 w-11 rounded-lg bg-black text-white flex flex-col items-center justify-center font-mono">
              <span className="text-base font-black leading-none">{result.runway_months}</span>
              <span className="text-[9px] font-mono uppercase text-neutral-300 font-bold">MONTHS</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                SURVIVAL CAPACITY
              </span>
              <p className="text-sm font-black text-black font-mono">
                {result.runway_days} CONTINUOUS DAYS
              </p>
              <p className="text-xs text-neutral-600 font-mono">
                UNTIL {result.max_sabbatical_date}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-black text-black uppercase">
              RESERVOIR &amp; SURVIVAL BURN
            </h3>
            <span className="text-xs font-mono text-neutral-500">[FASTAPI ENGINE]</span>
          </div>

          {/* Liquid Savings */}
          <div className="space-y-2 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">LIQUID SAVINGS RESERVOIR:</span>
              <span className="text-black">₹{savings.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={2500000}
              step={25000}
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>₹1 Lakh</span>
              <span>₹10 Lakh</span>
              <span>₹25 Lakh</span>
            </div>
          </div>

          {/* Fixed Survival Costs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">RENT &amp; FOOD:</span>
                <span className="text-black">₹{rentAndBills.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={80000}
                step={1000}
                value={rentAndBills}
                onChange={(e) => setRentAndBills(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>

            <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-700">FAMILY SUPPORT:</span>
                <span className="text-black">₹{familySupport.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={0}
                max={40000}
                step={1000}
                value={familySupport}
                onChange={(e) => setFamilySupport(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>
          </div>

          {/* Active EMIs */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">ACTIVE EMIS (CANNOT PAUSE):</span>
              <span className="text-black">₹{emis.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={emis}
              onChange={(e) => setEmis(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          {/* Discretionary Pause Switch */}
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-black block">AUSTERITY MODE: PAUSE DISCRETIONARY</span>
              <span className="text-[11px] text-neutral-500 font-mono">
                Pause Swiggy, leisure &amp; weekend trips during sabbatical
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPauseDiscretionary(!pauseDiscretionary)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors border cursor-pointer ${
                pauseDiscretionary
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              {pauseDiscretionary ? "[PAUSED: +2.5 MO]" : "[ACTIVE: -₹12K/MO]"}
            </button>
          </div>
        </div>

        {/* Intelligence Tank Display */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between space-y-5">
          {result ? (
            <div className="space-y-4">
              {/* Runway Gauge Card */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-500 uppercase">MONTHLY BURN RATE</span>
                  <span className="font-bold text-black">
                    ₹{result.monthly_burn_rate.toLocaleString("en-IN")} / MO
                  </span>
                </div>

                <div className="w-full h-3.5 bg-neutral-200 rounded-md overflow-hidden p-0.5 border border-neutral-300">
                  <div
                    className="h-full rounded-xs bg-black transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, (result.runway_months / 24) * 100))}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>CRITICAL (&lt;3MO)</span>
                  <span>SAFE (6-12MO)</span>
                  <span>FORTRESS (&gt;18MO)</span>
                </div>
              </div>

              {/* Status Verdict */}
              <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300 text-xs leading-relaxed font-mono">
                <div className="font-black text-black uppercase mb-1">
                  {result.sustainability_verdict}
                </div>
                <p className="text-xs text-neutral-600 font-sans">
                  With your current fixed obligations (including family remittance and active EMIs), your liquid reservoir sustains you cleanly until <strong className="underline text-black font-mono">{result.max_sabbatical_date}</strong>.
                </p>
              </div>

              {/* Runway Extension Playbook */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-black block">
                  ACTIONABLE RUNWAY MULTIPLIERS
                </span>
                <div className="space-y-1.5 font-mono">
                  {result.burn_reduction_tips?.map((tip: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 bg-[#F8F9FA] p-2.5 rounded-lg border border-neutral-200">
                      <span className="text-black font-bold shrink-0">[{idx + 1}]</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-neutral-500 text-xs font-mono">
              CALCULATING RUNWAY RESERVOIR...
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>BURN RATE GOVERNANCE</span>
            <span className="font-bold text-black">[ZERO-INCOME SIM]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
