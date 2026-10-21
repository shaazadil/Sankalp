"use client";

import React, { useState, useEffect } from "react";
import { Heart, ShieldCheck, AlertCircle, ArrowRight, Loader2, Sparkles, UserCheck } from "lucide-react";
import { calculateFamilyCalibrator } from "@/lib/api";

interface FamilyRemittanceCalibratorProps {
  monthlyIncome?: number;
  familySupport?: number;
  emergencyFund?: number;
}

export const FamilyRemittanceCalibrator: React.FC<FamilyRemittanceCalibratorProps> = ({
  monthlyIncome = 67000,
  familySupport = 12000,
  emergencyFund = 150000,
}) => {
  const [income, setIncome] = useState<number>(monthlyIncome);
  const [remittance, setRemittance] = useState<number>(familySupport);
  const [parentAge, setParentAge] = useState<number>(58);
  const [existingCover, setExistingCover] = useState<number>(0);
  const [eFund, setEFund] = useState<number>(emergencyFund);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const data = await calculateFamilyCalibrator({
        monthly_in_hand: income,
        monthly_family_support: remittance,
        parent_age: parentAge,
        parents_existing_insurance: existingCover,
        user_emergency_fund: eFund,
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
  }, [income, remittance, parentAge, existingCover, eFund]);

  return (
    <div id="family-calibrator" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Title Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Filial Care Architecture
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                Indian Household Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              The Family Remittance Guilt-Free Calibrator
            </h2>
            <p className="text-xs text-slate-400">
              Balance filial support to parents with your retirement compounding—protecting your emergency buffer against medical shocks.
            </p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-3 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.08]">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-mono text-sm">
              {result.remittance_safety_ratio}%
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Remittance Burden
              </span>
              <p className="text-xs font-bold text-slate-200">
                {result.remittance_safety_ratio <= 20 ? "Balanced & Sustainable" : "High Burden Level"}
              </p>
              <p className="text-[11px] text-amber-400 font-mono">
                ₹{result.annual_remittance.toLocaleString("en-IN")}/yr sent home
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Controls & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Input Panel */}
        <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Calibrate Parental Support &amp; Health Protection</span>
          </h3>

          {/* Monthly Remittance */}
          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Monthly Remittance Sent Home:</span>
              <span className="font-mono font-bold text-amber-300">₹{remittance.toLocaleString("en-IN")}/mo</span>
            </div>
            <input
              type="range"
              min={2000}
              max={40000}
              step={1000}
              value={remittance}
              onChange={(e) => setRemittance(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Parent Age */}
          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Eldest Parent Age:</span>
              <span className="font-mono font-bold text-white">{parentAge} Years</span>
            </div>
            <input
              type="range"
              min={45}
              max={75}
              step={1}
              value={parentAge}
              onChange={(e) => setParentAge(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono block">
              Parent healthcare inflation in India averages 14% p.a.
            </span>
          </div>

          {/* Existing Parent Insurance */}
          <div className="space-y-1.5 bg-[#080d17] p-4 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Existing Parent Health Cover:</span>
              <span className="font-mono font-bold text-white">₹{existingCover} Lakhs</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={existingCover}
              onChange={(e) => setExistingCover(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>

        {/* Real Backend Intelligence Result Panel */}
        <div className="p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] shadow-inner space-y-5 flex flex-col justify-between">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-xs font-bold text-slate-300">Parental Health Shield Math</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  FastAPI Engine Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0c111e] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                    Projected Medical Shock
                  </span>
                  <span className="text-lg font-black text-rose-400 font-mono tabular-nums">
                    ₹{result.parent_medical_shock_risk_lakhs} Lakhs
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0c111e] border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block font-mono">
                    Recommended Cover
                  </span>
                  <span className="text-lg font-black text-emerald-300 font-mono tabular-nums">
                    ₹{result.suggested_super_topup_cover_lakhs} Lakhs
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                <p>
                  <strong>Strategic Playbook:</strong> Taking a ₹{result.suggested_super_topup_cover_lakhs}L super top-up policy (estimated annual premium:{" "}
                  <strong className="text-white">₹{result.estimated_annual_insurance_premium.toLocaleString("en-IN")}/yr</strong>) guarantees that {result.emergency_fund_protection_percent}% of your emergency fund stays un-depleted if an emergency strikes.
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {result.insight}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-slate-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Computing parental medical shield...
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Guilt-Free Filial Duty</span>
            <span>Zero Emotional Compromise</span>
          </div>
        </div>
      </div>
    </div>
  );
};
