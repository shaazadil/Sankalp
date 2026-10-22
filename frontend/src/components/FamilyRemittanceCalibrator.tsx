"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    <div id="family-calibrator" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [FILIAL ARCHITECTURE // ENGINE 09]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              INDIAN HOUSEHOLD SHIELD
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Family Remittance &amp; Health Shield Calibrator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Balance filial support to parents with personal wealth compounding—protecting your emergency reserve from sudden medical shocks.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-300">
            <div className="h-11 w-11 rounded-lg bg-black text-white flex items-center justify-center font-mono font-black text-base">
              {result.remittance_safety_ratio}%
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                REMITTANCE BURDEN
              </span>
              <p className="text-xs font-black text-black font-mono">
                {result.remittance_safety_ratio <= 20 ? "SUSTAINABLE & BALANCED" : "ELEVATED BURDEN"}
              </p>
              <p className="text-xs text-neutral-600 font-mono">
                ₹{result.annual_remittance.toLocaleString("en-IN")}/YR SENT HOME
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Controls & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Input Panel */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <h3 className="text-sm font-mono font-black text-black uppercase">
            CALIBRATE PARENTAL SUPPORT &amp; PROTECTION
          </h3>

          {/* Monthly Remittance */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">MONTHLY REMITTANCE:</span>
              <span className="text-black">₹{remittance.toLocaleString("en-IN")}/mo</span>
            </div>
            <input
              type="range"
              min={2000}
              max={40000}
              step={1000}
              value={remittance}
              onChange={(e) => setRemittance(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          {/* Parent Age */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">ELDEST PARENT AGE:</span>
              <span className="text-black">{parentAge} YEARS</span>
            </div>
            <input
              type="range"
              min={45}
              max={75}
              step={1}
              value={parentAge}
              onChange={(e) => setParentAge(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
            <span className="text-[10px] text-neutral-500 font-mono block">
              Healthcare inflation for senior parents in India averages 14% p.a.
            </span>
          </div>

          {/* Existing Parent Insurance */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">PARENT HEALTH COVER:</span>
              <span className="text-black">₹{existingCover} LAKHS</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={existingCover}
              onChange={(e) => setExistingCover(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>
        </div>

        {/* Intelligence Result Panel */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4 flex flex-col justify-between">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <span className="text-xs font-mono font-bold text-black uppercase">PARENTAL HEALTH SHIELD MODEL</span>
                <span className="text-[10px] font-mono text-black bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded font-bold uppercase">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200">
                  <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 block">
                    PROJECTED MEDICAL SHOCK
                  </span>
                  <span className="text-xl font-black text-black font-mono tabular-nums">
                    ₹{result.parent_medical_shock_risk_lakhs} LAKHS
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300">
                  <span className="text-[10px] uppercase font-mono font-bold text-black block">
                    RECOMMENDED COVER
                  </span>
                  <span className="text-xl font-black text-black font-mono tabular-nums">
                    ₹{result.suggested_super_topup_cover_lakhs} LAKHS
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-700 leading-relaxed">
                <p>
                  <strong>STRATEGIC PLAYBOOK:</strong> Taking a ₹{result.suggested_super_topup_cover_lakhs}L super top-up policy (estimated annual premium:{" "}
                  <strong className="text-black font-bold">₹{result.estimated_annual_insurance_premium.toLocaleString("en-IN")}/yr</strong>) ensures {result.emergency_fund_protection_percent}% of your emergency fund stays un-depleted if an emergency strikes.
                </p>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                {result.insight}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-neutral-500 text-xs font-mono">
              CALCULATING PARENTAL MEDICAL SHIELD...
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>GUILT-FREE FILIAL DUTY</span>
            <span className="font-bold text-black">[ZERO COMPROMISE]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
