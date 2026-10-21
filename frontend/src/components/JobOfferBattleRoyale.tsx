"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Swords,
  TrendingUp,
  Building2,
  DollarSign,
  Percent,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Flame,
} from "lucide-react";

interface OfferState {
  company: string;
  ctc: number; // in LPA
  city: string;
  expectedRent: number;
  fixedPercent: number; // e.g. 85%
  variableBonusPercent: number; // e.g. 15%
  esopAnnualValue: number; // in Lakhs
  esopConfidence: number; // 0 to 100%
  joiningBonus: number; // Lakhs
}

const INDIAN_CITIES_RENT: Record<string, number> = {
  Bengaluru: 22000,
  Mumbai: 28000,
  "Delhi-NCR": 20000,
  Hyderabad: 17000,
  Pune: 16000,
  Chennai: 15000,
  Kolkata: 12000,
  Remote: 8000,
};

import { calculateOfferBattle } from "@/lib/api";

export const JobOfferBattleRoyale: React.FC = () => {
  const [offerA, setOfferA] = useState<OfferState>({
    company: "Current Company / Offer A",
    ctc: 12.0,
    city: "Kolkata",
    expectedRent: 12000,
    fixedPercent: 90,
    variableBonusPercent: 10,
    esopAnnualValue: 1.0,
    esopConfidence: 50,
    joiningBonus: 0,
  });

  const [offerB, setOfferB] = useState<OfferState>({
    company: "Unicorn / Offer B",
    ctc: 16.5,
    city: "Bengaluru",
    expectedRent: 24000,
    fixedPercent: 80,
    variableBonusPercent: 20,
    esopAnnualValue: 3.0,
    esopConfidence: 40,
    joiningBonus: 1.5,
  });

  const [apiResult, setApiResult] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    calculateOfferBattle({
      offer_a: {
        company: offerA.company,
        ctc_lpa: offerA.ctc,
        city: offerA.city,
        fixed_percent: offerA.fixedPercent,
        variable_bonus_percent: offerA.variableBonusPercent,
        esop_annual_value_lakhs: offerA.esopAnnualValue,
        esop_confidence_percent: offerA.esopConfidence,
        joining_bonus_lakhs: offerA.joiningBonus,
        monthly_rent: offerA.expectedRent,
      },
      offer_b: {
        company: offerB.company,
        ctc_lpa: offerB.ctc,
        city: offerB.city,
        fixed_percent: offerB.fixedPercent,
        variable_bonus_percent: offerB.variableBonusPercent,
        esop_annual_value_lakhs: offerB.esopAnnualValue,
        esop_confidence_percent: offerB.esopConfidence,
        joining_bonus_lakhs: offerB.joiningBonus,
        monthly_rent: offerB.expectedRent,
      },
    })
      .then((data) => {
        if (isMounted) setApiResult(data);
      })
      .catch((err) => console.error("Offer battle API err:", err));

    return () => {
      isMounted = false;
    };
  }, [offerA, offerB]);

  // Fallback / instant computation while API returns
  const computeMetrics = (offer: OfferState) => {
    const annualCtc = offer.ctc * 100000;
    const fixedCtc = annualCtc * (offer.fixedPercent / 100);

    const standardDeduction = 75000;
    const taxableFixed = Math.max(0, fixedCtc - standardDeduction);
    let tax = 0;
    if (taxableFixed > 1500000) {
      tax = 150000 + (taxableFixed - 1500000) * 0.3;
    } else if (taxableFixed > 1200000) {
      tax = 90000 + (taxableFixed - 1200000) * 0.2;
    } else if (taxableFixed > 1000000) {
      tax = 60000 + (taxableFixed - 1000000) * 0.15;
    } else if (taxableFixed > 700000) {
      tax = 20000 + (taxableFixed - 700000) * 0.1;
    } else if (taxableFixed > 300000) {
      tax = (taxableFixed - 300000) * 0.05;
      if (taxableFixed <= 700000) tax = 0;
    }
    tax *= 1.04;

    const monthlyGrossFixed = fixedCtc / 12;
    const epfMonthly = Math.min(monthlyGrossFixed * 0.5 * 0.12, 5000);
    const monthlyTakeHomeFixed = Math.round(monthlyGrossFixed - tax / 12 - epfMonthly);
    const foodAndCommute = 10000;
    const monthlyDisposable = Math.max(0, monthlyTakeHomeFixed - offer.expectedRent - foodAndCommute);
    const expectedVariableAnnual = annualCtc * (offer.variableBonusPercent / 100) * 0.8 * 0.7;
    const riskWeightedEsop = offer.esopAnnualValue * 100000 * (offer.esopConfidence / 100);

    const threeYearWealth =
      monthlyDisposable * 12 * 3 +
      expectedVariableAnnual * 3 +
      riskWeightedEsop * 3 +
      offer.joiningBonus * 100000 * 0.7;

    return {
      monthlyTakeHomeFixed,
      monthlyDisposable,
      expectedVariableAnnual,
      riskWeightedEsop,
      threeYearWealth,
      effectiveHourlyRate: Math.round(monthlyTakeHomeFixed / (22 * 8)),
    };
  };

  const metricsA = useMemo(() => {
    if (apiResult?.metrics_a) {
      return {
        monthlyTakeHomeFixed: apiResult.metrics_a.monthly_take_home_fixed,
        monthlyDisposable: apiResult.metrics_a.monthly_disposable_cash,
        expectedVariableAnnual: apiResult.metrics_a.annual_variable_expected,
        riskWeightedEsop: apiResult.metrics_a.risk_weighted_esop_annual,
        threeYearWealth: apiResult.metrics_a.three_year_net_wealth,
        effectiveHourlyRate: apiResult.metrics_a.effective_hourly_rate,
      };
    }
    return computeMetrics(offerA);
  }, [offerA, apiResult]);

  const metricsB = useMemo(() => {
    if (apiResult?.metrics_b) {
      return {
        monthlyTakeHomeFixed: apiResult.metrics_b.monthly_take_home_fixed,
        monthlyDisposable: apiResult.metrics_b.monthly_disposable_cash,
        expectedVariableAnnual: apiResult.metrics_b.annual_variable_expected,
        riskWeightedEsop: apiResult.metrics_b.risk_weighted_esop_annual,
        threeYearWealth: apiResult.metrics_b.three_year_net_wealth,
        effectiveHourlyRate: apiResult.metrics_b.effective_hourly_rate,
      };
    }
    return computeMetrics(offerB);
  }, [offerB, apiResult]);

  const winner = apiResult?.winner
    ? (apiResult.winner === "offer_b" ? "offerB" : "offerA")
    : (metricsB.threeYearWealth > metricsA.threeYearWealth ? "offerB" : "offerA");
  const wealthDiff = apiResult?.three_year_wealth_difference ?? Math.abs(metricsB.threeYearWealth - metricsA.threeYearWealth);
  const disposableDiff = apiResult?.monthly_disposable_difference ?? Math.abs(metricsB.monthlyDisposable - metricsA.monthlyDisposable);

  return (
    <div id="battle-royale" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Title Ribbon */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1424] via-[#090d18] to-[#0d1424] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Decision Intelligence
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                Dual-Screen Arena
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              The Job Offer Battle Royale
            </h2>
            <p className="text-xs text-slate-400">
              Stop falling for headline CTC. Compare real take-home cash, rent deductions, ESOP probability, and 3-year net worth.
            </p>
          </div>
        </div>

        {/* Winner Badge Callout */}
        <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Winning Choice
            </span>
            <p className="text-sm font-bold text-emerald-400">
              {winner === "offerB" ? offerB.company : offerA.company}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              +₹{(wealthDiff / 100000).toFixed(1)}L 3-Yr Net Wealth
            </p>
          </div>
        </div>
      </div>

      {/* Dual Arena Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OFFER A CARD */}
        <div
          className={`p-6 rounded-3xl bg-[#0c111e] border transition-all space-y-5 ${
            winner === "offerA"
              ? "border-emerald-500/40 shadow-xl shadow-emerald-500/5"
              : "border-white/[0.08]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="space-y-1">
              <input
                type="text"
                value={offerA.company}
                onChange={(e) => setOfferA({ ...offerA, company: e.target.value })}
                className="text-base font-bold text-white bg-transparent border-b border-dashed border-white/20 focus:border-emerald-400 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500" />
                <select
                  value={offerA.city}
                  onChange={(e) => {
                    const c = e.target.value;
                    setOfferA({
                      ...offerA,
                      city: c,
                      expectedRent: INDIAN_CITIES_RENT[c] || 15000,
                    });
                  }}
                  className="bg-[#080d17] border border-white/[0.08] text-slate-300 text-xs rounded-lg px-2 py-0.5"
                >
                  {Object.keys(INDIAN_CITIES_RENT).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {winner === "offerA" && (
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                👑 Top Choice
              </span>
            )}
          </div>

          {/* Headline Numbers Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#080d17] border border-white/[0.06]">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Headline CTC
              </span>
              <span className="text-xl font-black text-white font-mono tabular-nums">
                ₹{offerA.ctc.toFixed(1)} LPA
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block font-mono">
                Monthly In-Hand
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono tabular-nums">
                ₹{metricsA.monthlyTakeHomeFixed.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Rent in {offerA.city}
              </span>
              <span className="text-sm font-bold text-rose-300 font-mono tabular-nums">
                -₹{offerA.expectedRent.toLocaleString("en-IN")}/mo
              </span>
            </div>
            <div className="pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] uppercase font-bold text-amber-300 block font-mono">
                Free Disposable
              </span>
              <span className="text-sm font-bold text-amber-300 font-mono tabular-nums">
                ₹{metricsA.monthlyDisposable.toLocaleString("en-IN")}/mo
              </span>
            </div>
          </div>

          {/* Interactive Sliders for Offer A */}
          <div className="space-y-4 pt-1">
            {/* CTC Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total CTC Package:</span>
                <span className="font-mono font-bold text-white">₹{offerA.ctc.toFixed(1)} Lakhs</span>
              </div>
              <input
                type="range"
                min={6}
                max={45}
                step={0.5}
                value={offerA.ctc}
                onChange={(e) => setOfferA({ ...offerA, ctc: Number(e.target.value) })}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Fixed vs Variable Split */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Fixed Base Pay:</span>
                <span className="font-mono text-slate-300">
                  {offerA.fixedPercent}% Fixed / {100 - offerA.fixedPercent}% Variable
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={100}
                step={5}
                value={offerA.fixedPercent}
                onChange={(e) =>
                  setOfferA({
                    ...offerA,
                    fixedPercent: Number(e.target.value),
                    variableBonusPercent: 100 - Number(e.target.value),
                  })
                }
                className="w-full cursor-pointer"
              />
            </div>

            {/* ESOP Annual Grant & Confidence */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">ESOP Value / Year:</span>
                <span className="font-mono text-slate-300">
                  ₹{offerA.esopAnnualValue}L @ {offerA.esopConfidence}% Risk Confidence
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={0.5}
                value={offerA.esopAnnualValue}
                onChange={(e) => setOfferA({ ...offerA, esopAnnualValue: Number(e.target.value) })}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          {/* 3-Year Projected Wealth Footer */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-400">3-Yr Cumulative Wealth:</span>
            <span className="text-base font-black text-white font-mono tabular-nums">
              ₹{(metricsA.threeYearWealth / 100000).toFixed(1)} Lakhs
            </span>
          </div>
        </div>

        {/* OFFER B CARD */}
        <div
          className={`p-6 rounded-3xl bg-[#0c111e] border transition-all space-y-5 ${
            winner === "offerB"
              ? "border-emerald-500/40 shadow-xl shadow-emerald-500/5"
              : "border-white/[0.08]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="space-y-1">
              <input
                type="text"
                value={offerB.company}
                onChange={(e) => setOfferB({ ...offerB, company: e.target.value })}
                className="text-base font-bold text-white bg-transparent border-b border-dashed border-white/20 focus:border-emerald-400 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500" />
                <select
                  value={offerB.city}
                  onChange={(e) => {
                    const c = e.target.value;
                    setOfferB({
                      ...offerB,
                      city: c,
                      expectedRent: INDIAN_CITIES_RENT[c] || 15000,
                    });
                  }}
                  className="bg-[#080d17] border border-white/[0.08] text-slate-300 text-xs rounded-lg px-2 py-0.5"
                >
                  {Object.keys(INDIAN_CITIES_RENT).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {winner === "offerB" && (
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                👑 Top Choice
              </span>
            )}
          </div>

          {/* Headline Numbers Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#080d17] border border-white/[0.06]">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Headline CTC
              </span>
              <span className="text-xl font-black text-white font-mono tabular-nums">
                ₹{offerB.ctc.toFixed(1)} LPA
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block font-mono">
                Monthly In-Hand
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono tabular-nums">
                ₹{metricsB.monthlyTakeHomeFixed.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Rent in {offerB.city}
              </span>
              <span className="text-sm font-bold text-rose-300 font-mono tabular-nums">
                -₹{offerB.expectedRent.toLocaleString("en-IN")}/mo
              </span>
            </div>
            <div className="pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] uppercase font-bold text-amber-300 block font-mono">
                Free Disposable
              </span>
              <span className="text-sm font-bold text-amber-300 font-mono tabular-nums">
                ₹{metricsB.monthlyDisposable.toLocaleString("en-IN")}/mo
              </span>
            </div>
          </div>

          {/* Interactive Sliders for Offer B */}
          <div className="space-y-4 pt-1">
            {/* CTC Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total CTC Package:</span>
                <span className="font-mono font-bold text-white">₹{offerB.ctc.toFixed(1)} Lakhs</span>
              </div>
              <input
                type="range"
                min={6}
                max={45}
                step={0.5}
                value={offerB.ctc}
                onChange={(e) => setOfferB({ ...offerB, ctc: Number(e.target.value) })}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Fixed vs Variable Split */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Fixed Base Pay:</span>
                <span className="font-mono text-slate-300">
                  {offerB.fixedPercent}% Fixed / {100 - offerB.fixedPercent}% Variable
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={100}
                step={5}
                value={offerB.fixedPercent}
                onChange={(e) =>
                  setOfferB({
                    ...offerB,
                    fixedPercent: Number(e.target.value),
                    variableBonusPercent: 100 - Number(e.target.value),
                  })
                }
                className="w-full cursor-pointer"
              />
            </div>

            {/* ESOP Annual Grant & Confidence */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">ESOP Value / Year:</span>
                <span className="font-mono text-slate-300">
                  ₹{offerB.esopAnnualValue}L @ {offerB.esopConfidence}% Risk Confidence
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={0.5}
                value={offerB.esopAnnualValue}
                onChange={(e) => setOfferB({ ...offerB, esopAnnualValue: Number(e.target.value) })}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          {/* 3-Year Projected Wealth Footer */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-400">3-Yr Cumulative Wealth:</span>
            <span className="text-base font-black text-white font-mono tabular-nums">
              ₹{(metricsB.threeYearWealth / 100000).toFixed(1)} Lakhs
            </span>
          </div>
        </div>
      </div>

      {/* Battle Comparison Takeaway Strip */}
      <div className="p-4 rounded-2xl bg-[#080d17] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-slate-300">
            <strong>Verdict:</strong> {winner === "offerB" ? offerB.company : offerA.company} delivers{" "}
            <span className="text-emerald-400 font-bold font-mono">
              ₹{disposableDiff.toLocaleString("en-IN")}/mo
            </span>{" "}
            more in true disposable cash after real city rent and living overheads.
          </p>
        </div>

        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
          Deterministic Cost Indexing Active
        </span>
      </div>
    </div>
  );
};
