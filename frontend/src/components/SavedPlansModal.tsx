"use client";

import React from "react";
import { X, Bookmark, Trash2, Calendar, TrendingUp, Shield, ArrowRight, Printer } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 space-y-6 max-h-[85vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Your Saved Financial Life Plans
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Switch between scenarios or print an action summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plans List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {plans.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bookmark className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No saved plans yet</p>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Generate a plan on the dashboard and click &quot;Save Plan&quot; to bookmark it in your personal account.
              </p>
            </div>
          ) : (
            plans.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/50 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{p.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 uppercase">
                      {p.goal_category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Monthly: ₹{Math.round(p.monthly_income).toLocaleString("en-IN")}</span>
                    <span>Savings: ₹{Math.round(p.monthly_savings_potential).toLocaleString("en-IN")}/mo</span>
                    <span>Runway: {p.emergency_runway_months} Mo</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadPlan(p);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 transition shadow-sm"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePlan(p.id)}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                    title="Delete plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
          <span className="text-zinc-400">Total Plans: {plans.length}</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Current Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
