"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calculateCommuteElasticity } from "@/lib/api";

export const CommuteRentElasticity: React.FC = () => {
  const [city, setCity] = useState("Bengaluru");
  const [distanceKm, setDistanceKm] = useState(14);
  const [mode, setMode] = useState("cab_metro");
  const [days, setDays] = useState(4);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateCommuteElasticity({
        destination_city: city,
        distance_from_office_km: distanceKm,
        commute_mode: mode,
        office_days_per_week: days,
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
  }, [city, distanceKm, mode, days]);

  return (
    <div id="commute-elasticity" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [URBAN ELASTICITY // ENGINE 07]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              SANITY VS RENT
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Commute vs. Rent Elasticity
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Living 15km away seems cheaper until you account for cab surges, city congestion, and 300+ wasted hours annually.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
            <div className="h-11 w-11 rounded-lg bg-black text-white flex items-center justify-center font-black font-mono text-base">
              {result.sanity_index_score}
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                SANITY INDEX
              </span>
              <p className="text-xs font-black text-black font-mono">
                {result.annual_hours_lost_in_traffic} HRS/YR IN TRAFFIC
              </p>
              <p className="text-xs text-neutral-700 font-mono font-bold">
                ₹{result.total_monthly_housing_plus_commute.toLocaleString("en-IN")}/MO ALL-IN
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <h3 className="text-sm font-mono font-black text-black uppercase">
            TRANSIT &amp; DISTANCE LEVERS
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold text-neutral-700 block mb-1">CITY HUB</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-neutral-300 text-black text-xs font-mono font-bold rounded-lg p-2.5 outline-none cursor-pointer"
              >
                <option value="Bengaluru">Bengaluru (ORR)</option>
                <option value="Mumbai">Mumbai (BKC)</option>
                <option value="Delhi-NCR">Delhi-NCR (CyberCity)</option>
                <option value="Hyderabad">Hyderabad (Hitec)</option>
                <option value="Pune">Pune (Hinjawadi)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-neutral-700 block mb-1">COMMUTE MODE</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-neutral-300 text-black text-xs font-mono font-bold rounded-lg p-2.5 outline-none cursor-pointer"
              >
                <option value="cab_metro">Metro + Shared Auto</option>
                <option value="cab">Uber / Ola Direct Cab</option>
                <option value="bike">Personal Bike / EV</option>
              </select>
            </div>
          </div>

          {/* Distance Slider */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">DISTANCE TO TECH PARK:</span>
              <span className="text-black">{distanceKm} KM</span>
            </div>
            <input
              type="range"
              min={2}
              max={30}
              step={1}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>2 KM (Walkable)</span>
              <span>15 KM (Suburban)</span>
              <span>30 KM (Periphery)</span>
            </div>
          </div>

          {/* Office Days */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">OFFICE DAYS / WEEK:</span>
              <span className="text-black">{days} DAYS</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4 flex flex-col justify-between">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                    ESTIMATED RENT
                  </span>
                  <span className="text-2xl font-black text-black font-mono tabular-nums">
                    ₹{result.estimated_monthly_rent.toLocaleString("en-IN")}/mo
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                    COMMUTE CASH DRAIN
                  </span>
                  <span className="text-2xl font-black text-black font-mono tabular-nums">
                    +₹{result.estimated_monthly_commute_cost.toLocaleString("en-IN")}/mo
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-mono text-black leading-relaxed">
                <p>
                  <strong>TRUE TOTAL LIVING COST:</strong> Rent (₹{result.estimated_monthly_rent.toLocaleString("en-IN")}) + Transit (₹{result.estimated_monthly_commute_cost.toLocaleString("en-IN")}) ={" "}
                  <strong className="underline">₹{result.total_monthly_housing_plus_commute.toLocaleString("en-IN")}/month</strong>.
                </p>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                {result.recommendation}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-neutral-500 text-xs font-mono">
              CALCULATING COMMUTE ELASTICITY...
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>METRO TRAFFIC CONGESTION INDEX</span>
            <span className="font-bold text-black">[DETERMINISTIC MODEL]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
