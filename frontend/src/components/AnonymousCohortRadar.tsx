"use client";

import React, { useState, useEffect } from "react";
import { Users, Compass, Award, TrendingUp, ShieldCheck, BarChart3, Loader2 } from "lucide-react";
import { calculateCohortRadar } from "@/lib/api";

interface CohortRadarProps {
  initialCtc?: number;
  initialCity?: string;
}

export const AnonymousCohortRadar: React.FC<CohortRadarProps> = ({
  initialCtc = 1500000,
  initialCity = "Bengaluru",
}) => {
  const [age, setAge] = useState(26);
  const [ctc, setCtc] = useState(initialCtc);
  const [city, setCity] = useState(initialCity);
  const [monthlySip, setMonthlySip] = useState(25000);
  const [monthlyRent, setMonthlyRent] = useState(22000);
  const [savings, setSavings] = useState(350000);

  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateCohortRadar({
        age: age,
        annual_ctc: ctc,
        city: city,
        monthly_sip: monthlySip,
        monthly_rent: monthlyRent,
        liquid_savings: savings,
      });
      setResult(data);
    } catch (e) {
      console.error("Cohort radar error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [age, ctc, city, monthlySip, monthlyRent, savings]);

  const metrics = result
    ? [
        { label: "Savings Rate", value: result.savings_rate_percentile, desc: `Your rate: ${result.user_savings_rate}% (Cohort avg: ${result.cohort_average_savings_rate}%)` },
        { label: "Rent Discipline", value: result.rent_to_income_percentile, desc: "Lower rent/income ratio vs peers" },
        { label: "Runway Security", value: result.runway_months_percentile, desc: "Emergency buffer months vs cohort" },
        { label: "Debt Prudence", value: result.debt_burden_percentile, desc: "Low non-collateral EMI load" },
        { label: "Tax Optimization", value: result.tax_efficiency_percentile, desc: "Effective tax shelter percentile" },
      ]
    : [];

  return (
    <div id="cohort-radar" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Peer Intelligence
              </span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
                100% Zero-Identity Benchmark
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              Anonymous Indian Tech Cohort Radar
            </h2>
            <p className="text-xs text-slate-400">
              Benchmark your savings discipline, rent ratio, and runway against verified software engineers in your salary bracket.
            </p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-indigo-300 font-mono">
              <span className="text-sm font-black leading-none">Top</span>
              <span className="text-xs font-black">{100 - result.savings_rate_percentile}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Cohort Percentile
              </span>
              <p className="text-xs font-bold text-white">
                {result.cohort_label}
              </p>
              <p className="text-[11px] text-indigo-300 font-mono">
                {result.savings_rate_percentile}th Percentile in Savings
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Cohort Demographic Inputs</span>
            <span className="text-xs font-mono text-indigo-400">Tier-1 Tech Data</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 bg-[#080d17] p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[11px] text-slate-400 block">Age</span>
              <input
                type="number"
                min={21}
                max={45}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-transparent text-white font-mono font-bold text-sm outline-none"
              />
            </div>
            <div className="space-y-1 bg-[#080d17] p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[11px] text-slate-400 block">City</span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-white font-mono font-bold text-xs outline-none cursor-pointer"
              >
                <option value="Bengaluru" className="bg-[#0c111e]">Bengaluru</option>
                <option value="Gurugram" className="bg-[#0c111e]">Gurugram</option>
                <option value="Hyderabad" className="bg-[#0c111e]">Hyderabad</option>
                <option value="Pune" className="bg-[#0c111e]">Pune</option>
                <option value="Mumbai" className="bg-[#0c111e]">Mumbai</option>
                <option value="Noida" className="bg-[#0c111e]">Noida</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Annual CTC:</span>
              <span className="font-mono font-bold text-indigo-300">₹{(ctc / 100000).toFixed(1)} LPA</span>
            </div>
            <input
              type="range"
              min={600000}
              max={6000000}
              step={50000}
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              className="w-full cursor-pointer accent-indigo-400"
            />
          </div>

          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Monthly SIP / Investments:</span>
              <span className="font-mono font-bold text-emerald-400">₹{monthlySip.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={150000}
              step={2500}
              value={monthlySip}
              onChange={(e) => setMonthlySip(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-400"
            />
          </div>

          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Monthly Rent:</span>
              <span className="font-mono font-bold text-rose-300">₹{monthlyRent.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={8000}
              max={70000}
              step={1000}
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full cursor-pointer accent-rose-400"
            />
          </div>

          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Liquid Savings (FD/Cash):</span>
              <span className="font-mono font-bold text-cyan-300">₹{savings.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={2000000}
              step={25000}
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              className="w-full cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Radar & Percentile Visualization (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] flex flex-col justify-between space-y-5">
          {result ? (
            <div className="space-y-4">
              {/* Verdict Header */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200">
                <div className="flex items-center gap-2 font-bold mb-1 text-white">
                  <Award className="w-4 h-4 text-indigo-400" />
                  {result.cohort_ranking_summary}
                </div>
                <p className="text-[11px] text-slate-300">
                  Compared against peers in <span className="text-white font-medium">{city}</span> with <span className="text-white font-medium">₹{(ctc / 100000).toFixed(1)} LPA</span> salary.
                </p>
              </div>

              {/* 5 Pillar Radar Bars */}
              <div className="space-y-3 bg-[#0c111e] p-5 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/[0.06]">
                  <span className="text-slate-400 uppercase font-bold">5-Axis Wealth Radar</span>
                  <span className="text-indigo-400">Your Percentile (50 = Cohort Median)</span>
                </div>

                {metrics.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-medium">{m.label}</span>
                      <span className="font-mono font-bold text-indigo-300">{m.value}th %ile</span>
                    </div>

                    {/* Bar with 50% Median marker */}
                    <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5">
                      {/* 50% median line */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 z-10" />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          m.value >= 70
                            ? "bg-gradient-to-r from-emerald-500 to-indigo-500"
                            : m.value >= 50
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                            : "bg-gradient-to-r from-amber-500 to-rose-500"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, m.value))}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">{m.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20 text-slate-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Benchmarking against anonymized Indian tech salaries...
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Zero PII Exposed</span>
            <span>Real Aggregated Benchmarks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
