"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardShell } from "@/components/DashboardShell";
import { calculateRelocation, RelocationCalculationResponse } from "@/lib/api";

const CITIES = ["Bengaluru", "Mumbai", "Delhi-NCR", "Hyderabad", "Pune", "Chennai", "Kolkata"];

export default function RelocationPage() {
  const [fromCity, setFromCity] = useState("Kolkata");
  const [toCity, setToCity] = useState("Bengaluru");
  const [annualCtc, setAnnualCtc] = useState(1200000);
  const [expectedRent, setExpectedRent] = useState(24000);
  const [savings, setSavings] = useState(250000);
  const [familySupport, setFamilySupport] = useState(10000);
  const [relocationData, setRelocationData] = useState<RelocationCalculationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateRelocation({
        origin_city: fromCity,
        destination_city: toCity,
        annual_ctc: annualCtc,
        expected_rent: expectedRent,
        family_support: familySupport,
        current_savings: savings,
      });
      setRelocationData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [fromCity, toCity, annualCtc, expectedRent, savings, familySupport]);

  return (
    <DashboardShell
      title="City Relocation & Deposit Shock Radar"
      subtitle="Model landlord 10-month deposit shocks, brokerage fees, moving expenses, and living cost differentials."
      badge="Engine 02"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Controls Grid */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-black shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-4 gap-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-black text-white font-mono font-black text-xs uppercase tracking-wider rounded">
                ROUTE
              </span>
              <div>
                <h3 className="text-lg font-black text-black font-heading uppercase tracking-tight">
                  Relocation Matrix &amp; Parameters
                </h3>
                <p className="text-xs font-medium text-zinc-600">
                  Deterministic cost of living index between Indian tech corridors
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-black bg-[#F4F5F7] px-3 py-1 rounded border border-black/20 self-start sm:self-auto">
              [INDEX: ACTIVE]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5 bg-[#F4F5F7] p-4 rounded-2xl border-2 border-black/10">
              <label className="text-[11px] font-mono font-bold text-zinc-700 block uppercase">
                Origin City
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-white px-3 py-2 rounded-xl border border-black/20 text-black font-mono font-black text-xs outline-none cursor-pointer focus:border-black"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 bg-[#F4F5F7] p-4 rounded-2xl border-2 border-black/10">
              <label className="text-[11px] font-mono font-bold text-zinc-700 block uppercase">
                Destination City
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-white px-3 py-2 rounded-xl border border-black/20 text-black font-mono font-black text-xs outline-none cursor-pointer focus:border-black"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 bg-[#F4F5F7] p-4 rounded-2xl border-2 border-black/10">
              <div className="flex justify-between text-[11px] font-mono font-bold">
                <span className="text-zinc-700 uppercase">Annual CTC:</span>
                <span className="text-black font-black">₹{(annualCtc / 100000).toFixed(1)} LPA</span>
              </div>
              <input
                type="range"
                min={600000}
                max={4500000}
                step={50000}
                value={annualCtc}
                onChange={(e) => setAnnualCtc(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>

            <div className="space-y-1.5 bg-[#F4F5F7] p-4 rounded-2xl border-2 border-black/10">
              <div className="flex justify-between text-[11px] font-mono font-bold">
                <span className="text-zinc-700 uppercase">Target Rent:</span>
                <span className="text-black font-black">₹{expectedRent.toLocaleString("en-IN")}/mo</span>
              </div>
              <input
                type="range"
                min={10000}
                max={60000}
                step={1000}
                value={expectedRent}
                onChange={(e) => setExpectedRent(Number(e.target.value))}
                className="w-full cursor-pointer accent-black"
              />
            </div>
          </div>
        </div>

        {/* Results & Scenarios */}
        {relocationData ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="text-base font-black text-black font-heading uppercase tracking-tight">
                Living Scenarios in {toCity}
              </h3>
              <span className="text-xs font-mono font-bold text-zinc-700">
                Deposit multiplier: <strong className="text-black">{toCity === "Bengaluru" ? "10x" : "2x-4x"} monthly rent</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relocationData.scenarios.map((sc, idx) => (
                <motion.div
                  whileHover={{ y: -3 }}
                  key={idx}
                  className="p-6 rounded-3xl bg-white border-2 border-black/10 hover:border-black shadow-sm space-y-4 flex flex-col justify-between transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b-2 border-black/10 pb-3">
                      <span className="font-black text-base text-black font-heading">{sc.name}</span>
                      <span className="text-xs font-mono font-black text-white bg-black px-2.5 py-1 rounded">
                        ₹{sc.monthly_rent.toLocaleString("en-IN")}/mo
                      </span>
                    </div>
                    <p className="text-xs font-medium text-zinc-600 mb-4">{sc.description}</p>

                    <div className="space-y-2.5 text-xs bg-[#F4F5F7] p-4 rounded-2xl border border-black/10 font-mono font-semibold">
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Locked Deposit:</span>
                        <span className="font-black text-black">
                          ₹{sc.locked_security_deposit.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Sunk Moving &amp; Brokerage:</span>
                        <span className="font-black text-zinc-900">
                          ₹{sc.sunk_moving_cost.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Monthly Grocery &amp; Living:</span>
                        <span className="font-black text-black">
                          ₹{(sc.monthly_food_groceries + sc.monthly_transport_utilities).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-black/10 flex justify-between">
                        <span className="text-black font-black">Deposit Recovery:</span>
                        <span className="font-mono font-black text-black">
                          {sc.deposit_recovery_months} Months
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs text-zinc-700 font-mono">
                    <span className="font-bold">Monthly Savings:</span>
                    <span className="text-black font-black text-sm">
                      ₹{sc.monthly_savings_potential.toLocaleString("en-IN")}/mo
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 text-black font-mono font-bold text-xs bg-white rounded-3xl border-2 border-black">
            [COMPUTING RELOCATION MATRIX...]
          </div>
        )}
      </motion.div>
    </DashboardShell>
  );
}
