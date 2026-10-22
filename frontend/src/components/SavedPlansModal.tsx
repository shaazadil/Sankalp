"use client";

import React from "react";
import { motion } from "framer-motion";
import { formatINR } from "@/lib/api";

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: any[];
  onLoadPlan: (plan: any) => void;
  onDeletePlan: (planId: string) => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  plans,
  onLoadPlan,
  onDeletePlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm no-print">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-black shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-6 sm:p-7 space-y-6 max-h-[85vh] flex flex-col justify-between"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-black text-white text-xs font-mono font-black uppercase tracking-wider rounded">
              VAULT
            </span>
            <div>
              <h3 className="font-heading font-black text-xl text-black uppercase tracking-tight">
                Saved Life Plans
              </h3>
              <p className="text-xs font-medium text-zinc-600">
                Switch between financial scenarios or print an executive action summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Plans List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {plans.length === 0 ? (
            <div className="text-center py-12 space-y-2 border-2 border-dashed border-zinc-300 rounded-2xl">
              <span className="text-2xl font-mono text-zinc-400 font-black block">[EMPTY]</span>
              <p className="text-base font-black text-black">No saved plans yet</p>
              <p className="text-xs text-zinc-600 max-w-xs mx-auto">
                Generate a plan on the dashboard and click &quot;Save&quot; to bookmark it in your personal vault.
              </p>
            </div>
          ) : (
            plans.map((p) => (
              <motion.div
                whileHover={{ y: -2 }}
                key={p.id}
                className="p-4 rounded-2xl bg-[#F4F5F7] border-2 border-black/10 hover:border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-black font-heading">{p.title}</span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black text-white">
                      {p.goal_category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-700 font-mono font-semibold">
                    <span>Income: {formatINR(p.monthly_income)}</span>
                    <span className="text-black font-black">Growth: {formatINR(p.monthly_savings_potential)}/mo</span>
                    <span>Runway: {p.emergency_runway_months} Mo</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadPlan(p);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm uppercase tracking-wide"
                  >
                    <span>Load</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => onDeletePlan(p.id)}
                    className="px-2.5 py-2 rounded-xl border border-black/20 hover:border-black hover:bg-black hover:text-white text-zinc-600 font-bold text-xs transition cursor-pointer"
                    title="Delete plan"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-black flex justify-between items-center text-xs">
          <span className="text-zinc-600 font-mono font-bold">Vault Storage: {plans.length} Records</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-xs font-black text-black hover:underline cursor-pointer uppercase tracking-wider"
          >
            <span>[PRINT EXECUTIVE SUMMARY]</span>
            <span>↗</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
