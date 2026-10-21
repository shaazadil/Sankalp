"use client";

import React, { useState, useEffect } from "react";
import { Navigation, Clock, ShieldCheck, MapPin, AlertCircle, Loader2 } from "lucide-react";
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
    <div id="commute-elasticity" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                Urban Elasticity
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">
                Sanity vs. Rent
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              Commute vs. Rent Elasticity Sandbox
            </h2>
            <p className="text-xs text-slate-400">
              Living 15km away looks cheaper on 99acres until you factor in cab surges, Bangalore traffic, and 300+ hours lost per year.
            </p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm ${
                result.sanity_index_score >= 70
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : result.sanity_index_score >= 45
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
              }`}
            >
              {result.sanity_index_score}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Sanity Index
              </span>
              <p className="text-xs font-bold text-slate-200">
                {result.annual_hours_lost_in_traffic} Hours/Year in Traffic
              </p>
              <p className="text-[11px] text-blue-400 font-mono">
                ₹{result.total_monthly_housing_plus_commute.toLocaleString("en-IN")}/mo All-In
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white">Distance &amp; Transit Variables</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">City Hub</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#080d17] border border-white/[0.08] text-slate-200 text-xs rounded-xl p-2.5"
              >
                <option value="Bengaluru">Bengaluru (Bellandur/ORR)</option>
                <option value="Mumbai">Mumbai (BKC / Andheri)</option>
                <option value="Delhi-NCR">Delhi-NCR (Cyber City)</option>
                <option value="Hyderabad">Hyderabad (Hitec City)</option>
                <option value="Pune">Pune (Hinjawadi)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Commute Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-[#080d17] border border-white/[0.08] text-slate-200 text-xs rounded-xl p-2.5"
              >
                <option value="cab_metro">Metro + Auto / Shared</option>
                <option value="cab">Uber / Ola Direct Cab</option>
                <option value="bike">Personal Bike / Scooter</option>
              </select>
            </div>
          </div>

          {/* Distance Slider */}
          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Distance from Office Tech Park:</span>
              <span className="font-mono font-bold text-blue-400">{distanceKm} KM</span>
            </div>
            <input
              type="range"
              min={2}
              max={30}
              step={1}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2 KM (Walking)</span>
              <span>15 KM (Suburban)</span>
              <span>30 KM (Far Out)</span>
            </div>
          </div>

          {/* Office Days */}
          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Office Days per Week:</span>
              <span className="font-mono font-bold text-white">{days} Days/Week</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] shadow-inner space-y-4 flex flex-col justify-between">
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0c111e] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Estimated Rent
                  </span>
                  <span className="text-xl font-black text-white font-mono tabular-nums">
                    ₹{result.estimated_monthly_rent.toLocaleString("en-IN")}/mo
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0c111e] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-rose-400 block font-mono">
                    Commute Cash Drain
                  </span>
                  <span className="text-xl font-black text-rose-400 font-mono tabular-nums">
                    +₹{result.estimated_monthly_commute_cost.toLocaleString("en-IN")}/mo
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200 leading-relaxed">
                <p>
                  <strong>True Total Cost of Housing:</strong> Rent (₹{result.estimated_monthly_rent.toLocaleString("en-IN")}) + Travel (₹{result.estimated_monthly_commute_cost.toLocaleString("en-IN")}) ={" "}
                  <strong className="text-white">₹{result.total_monthly_housing_plus_commute.toLocaleString("en-IN")}/month</strong>.
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-slate-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Calculating commute elasticity...
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Realistic Indian Metro Congestion Index</span>
            <span>Deterministic Model</span>
          </div>
        </div>
      </div>
    </div>
  );
};
