"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        { label: "SAVINGS RATE", value: result.savings_rate_percentile, desc: `Your rate: ${result.user_savings_rate}% (Cohort avg: ${result.cohort_average_savings_rate}%)` },
        { label: "RENT DISCIPLINE", value: result.rent_to_income_percentile, desc: "Lower rent/income ratio vs peers" },
        { label: "RUNWAY BUFFER", value: result.runway_months_percentile, desc: "Emergency buffer months vs cohort" },
        { label: "DEBT PRUDENCE", value: result.debt_burden_percentile, desc: "Low non-collateral EMI load" },
        { label: "TAX EFFICIENCY", value: result.tax_efficiency_percentile, desc: "Effective tax shelter percentile" },
      ]
    : [];

  return (
    <div id="cohort-radar" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [PEER BENCHMARK // ENGINE 11]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              100% ANONYMOUS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Anonymous Tech Cohort Radar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Benchmark your savings discipline, rent ratio, and runway against verified software engineers in your salary bracket.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
            <div className="h-11 w-11 rounded-lg bg-black text-white flex flex-col items-center justify-center font-mono">
              <span className="text-xs uppercase text-neutral-300 font-bold">TOP</span>
              <span className="text-sm font-black leading-none">{100 - result.savings_rate_percentile}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                COHORT POSITION
              </span>
              <p className="text-xs font-black text-black font-mono">
                {result.cohort_label}
              </p>
              <p className="text-xs text-neutral-600 font-mono">
                {result.savings_rate_percentile}TH PERCENTILE IN SAVINGS
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-black text-black uppercase">
              COHORT INPUTS
            </h3>
            <span className="text-xs font-mono text-neutral-500">[ANONYMOUS DATA]</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200">
              <span className="text-xs font-mono font-bold text-neutral-700 block">AGE</span>
              <input
                type="number"
                min={21}
                max={45}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-white border border-neutral-300 rounded p-1 text-black font-mono font-bold text-sm outline-none"
              />
            </div>
            <div className="space-y-1 bg-[#F8F9FA] p-3 rounded-xl border border-neutral-200">
              <span className="text-xs font-mono font-bold text-neutral-700 block">CITY</span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded p-1 text-black font-mono font-bold text-xs outline-none cursor-pointer"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Noida">Noida</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">ANNUAL CTC:</span>
              <span className="text-black">₹{(ctc / 100000).toFixed(1)} LPA</span>
            </div>
            <input
              type="range"
              min={600000}
              max={6000000}
              step={50000}
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">MONTHLY SIP:</span>
              <span className="text-black">₹{monthlySip.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={150000}
              step={2500}
              value={monthlySip}
              onChange={(e) => setMonthlySip(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">MONTHLY RENT:</span>
              <span className="text-black">₹{monthlyRent.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={8000}
              max={70000}
              step={1000}
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">LIQUID SAVINGS:</span>
              <span className="text-black">₹{savings.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={2000000}
              step={25000}
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>
        </div>

        {/* Radar & Percentile Visualization */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-mono">
                <div className="font-black text-black uppercase mb-1">
                  {result.cohort_ranking_summary}
                </div>
                <p className="text-neutral-600">
                  Compared against peers in {city} with ₹{(ctc / 100000).toFixed(1)} LPA CTC.
                </p>
              </div>

              {/* 5 Pillar Radar Bars */}
              <div className="space-y-3 bg-[#F8F9FA] p-5 rounded-xl border border-neutral-200 font-mono">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200">
                  <span className="text-black font-black uppercase">5-AXIS WEALTH RADAR</span>
                  <span className="text-neutral-500">PERCENTILE (50 = MEDIAN)</span>
                </div>

                {metrics.map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-800 font-bold">{m.label}</span>
                      <span className="font-mono font-black text-black">{m.value}TH %ILE</span>
                    </div>

                    <div className="relative w-full h-3 bg-neutral-200 rounded-md overflow-hidden p-0.5 border border-neutral-300">
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/40 z-10" />
                      <div
                        className="h-full rounded-xs bg-black transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, m.value))}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-500 block">{m.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20 text-neutral-500 text-xs font-mono">
              BENCHMARKING AGAINST ANONYMOUS SALARIES...
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>ZERO PII STORED</span>
            <span className="font-bold text-black">[AGGREGATED BENCHMARKS]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
