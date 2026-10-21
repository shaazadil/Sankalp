"use client";

import React, { useState, useEffect } from "react";
import { Compass, BatteryCharging, ShieldAlert, Sparkles, AlertCircle, Calendar, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
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
    <div id="sabbatical-runway" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Career Pivot &amp; Freedom
              </span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
                Real Burn Reservoir
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              Sabbatical &amp; Upskilling Runway Tank
            </h2>
            <p className="text-xs text-slate-400">
              Calculate exact days of zero-income survival before taking a startup plunge, higher studies, or mental break.
            </p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center text-cyan-300">
              <span className="text-base font-black font-mono leading-none">{result.runway_months}</span>
              <span className="text-[9px] font-mono uppercase text-cyan-400/80">Months</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Survival Capacity
              </span>
              <p className="text-xs font-bold text-white">
                {result.runway_days} Continuous Days
              </p>
              <p className="text-[11px] text-cyan-400 font-mono">
                Until {result.max_sabbatical_date}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Liquid Reserves &amp; Survival Cash Burn</span>
            <span className="text-xs font-mono text-cyan-400">Deterministic Engine</span>
          </h3>

          {/* Liquid Savings */}
          <div className="space-y-2 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Liquid Savings Reservoir (Cash + FDs):</span>
              <span className="font-mono font-bold text-cyan-300">₹{savings.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={2500000}
              step={25000}
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              className="w-full cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹1 Lakh</span>
              <span>₹10 Lakh</span>
              <span>₹25 Lakh</span>
            </div>
          </div>

          {/* Fixed Survival Costs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Survival Rent &amp; Food:</span>
                <span className="font-mono font-bold text-white">₹{rentAndBills.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={80000}
                step={1000}
                value={rentAndBills}
                onChange={(e) => setRentAndBills(Number(e.target.value))}
                className="w-full cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Parent Support / Remittance:</span>
                <span className="font-mono font-bold text-amber-300">₹{familySupport.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={0}
                max={40000}
                step={1000}
                value={familySupport}
                onChange={(e) => setFamilySupport(Number(e.target.value))}
                className="w-full cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Active EMIs */}
          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Active EMIs (Education/Gadgets - cannot pause):</span>
              <span className="font-mono font-bold text-rose-300">₹{emis.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={emis}
              onChange={(e) => setEmis(Number(e.target.value))}
              className="w-full cursor-pointer accent-rose-400"
            />
          </div>

          {/* Discretionary Pause Switch */}
          <div className="p-4 rounded-2xl bg-[#080d17] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Austerity Mode: Pause Discretionary Spend</span>
              <span className="text-[11px] text-slate-400">
                Swiggy, weekend getaways, and dining out paused during career pause
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPauseDiscretionary(!pauseDiscretionary)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-colors border ${
                pauseDiscretionary
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border-white/10"
              }`}
            >
              {pauseDiscretionary ? "PAUSED (+2.5 mo)" : "ACTIVE (-₹12k/mo)"}
            </button>
          </div>
        </div>

        {/* Intelligence Tank Display (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] flex flex-col justify-between space-y-5">
          {result ? (
            <div className="space-y-4">
              {/* Runway Gauge Card */}
              <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/[0.08] relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Reservoir Depletion Speed</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    ₹{result.monthly_burn_rate.toLocaleString("en-IN")} / mo
                  </span>
                </div>

                {/* Reservoir Tank Bar */}
                <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, (result.runway_months / 24) * 100))}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                  <span>Critical (&lt;3mo)</span>
                  <span>Target Safe (6-12mo)</span>
                  <span>Fortress (&gt;18mo)</span>
                </div>
              </div>

              {/* Status Verdict */}
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                result.runway_months >= 9
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                  : result.runway_months >= 4
                  ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-200"
                  : "bg-rose-950/20 border-rose-500/30 text-rose-200"
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <BatteryCharging className="w-4 h-4" />
                  {result.sustainability_verdict}
                </div>
                <p className="text-[11px] opacity-90">
                  With your current fixed obligations (including family support and active debt), your liquid net worth sustains you cleanly until <strong className="underline">{result.max_sabbatical_date}</strong>.
                </p>
              </div>

              {/* Runway Extension Playbook */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                  Actionable Runway Multipliers
                </span>
                <div className="space-y-1.5">
                  {result.burn_reduction_tips?.map((tip: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 bg-[#0c111e] p-2.5 rounded-xl border border-white/[0.05]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-slate-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Calculating runway reservoir...
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Burn Rate Protection</span>
            <span>Zero-Income Simulation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
