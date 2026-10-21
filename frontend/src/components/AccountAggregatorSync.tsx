"use client";

import React, { useState } from "react";
import { Landmark, ShieldCheck, RefreshCw, CheckCircle2, Lock, ArrowRight, Loader2, Wallet, Building2 } from "lucide-react";
import { syncAccountAggregator } from "@/lib/api";

interface AccountAggregatorProps {
  onSyncComplete?: (data: any) => void;
}

export const AccountAggregatorSync: React.FC<AccountAggregatorProps> = ({ onSyncComplete }) => {
  const [phone, setPhone] = useState("9876543210");
  const [fiuProvider, setFiuProvider] = useState("finvu");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncData, setSyncData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const data = await syncAccountAggregator({
        phone_number: phone,
        fiu_id: fiuProvider,
      });
      setSyncData(data);
      if (onSyncComplete) {
        onSyncComplete(data);
      }
    } catch (e: any) {
      setError(e.message || "Failed to establish RBI Account Aggregator session");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div id="account-aggregator" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
                Industry Benchmark: Monarch / Setu
              </span>
              <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded-full font-mono">
                RBI-Regulated AA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              Instant Account Aggregator Bank Sync
            </h2>
            <p className="text-xs text-slate-400">
              Zero manual CSV uploads. Securely fetch live balances, salary credits, and auto-route them into your 5 Pots.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.06] text-xs font-mono text-slate-400">
          <Lock className="w-3.5 h-3.5 text-teal-400" />
          <span>256-Bit Financial Encryption</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Consent Form (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>RBI Consent Mandate</span>
            <span className="text-xs font-mono text-teal-400">No Netbanking Password</span>
          </h3>

          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <label className="text-[11px] text-slate-400 block font-mono">Mobile Linked to Bank Accounts</label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">+91</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="w-full bg-transparent text-white font-mono font-bold text-sm outline-none"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <label className="text-[11px] text-slate-400 block font-mono">Select RBI-Approved AA Gateway</label>
            <select
              value={fiuProvider}
              onChange={(e) => setFiuProvider(e.target.value)}
              className="w-full bg-transparent text-white font-mono font-bold text-xs outline-none cursor-pointer"
            >
              <option value="finvu" className="bg-[#0c111e]">Finvu (Cookiejar Technologies)</option>
              <option value="onemoney" className="bg-[#0c111e]">OneMoney (Finsec AA)</option>
              <option value="setu" className="bg-[#0c111e]">Setu AA (Pine Labs)</option>
              <option value="anumati" className="bg-[#0c111e]">Anumati AA</option>
            </select>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-950/20 border border-teal-500/20 text-[11px] text-teal-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Direct-from-Bank Consent
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              We never ask for your debit card PIN or NetBanking password. Consent is cryptographically signed via RBI AA guidelines.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Querying RBI AA Network...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Fetch Live Bank Balances
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Live Aggregated Accounts & Pots Distribution (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] flex flex-col justify-between space-y-5">
          {syncData ? (
            <div className="space-y-4">
              {/* Summary Banner */}
              <div className="p-4 rounded-2xl bg-[#0c111e] border border-teal-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Synced Liquid Net Worth</span>
                  <span className="text-xl font-black text-teal-300 font-mono">
                    ₹{syncData.total_liquid_balance.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Detected Monthly Credit: ₹{syncData.detected_monthly_cashflow.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {syncData.sync_status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">
                    Consent: {syncData.consent_id.slice(0, 15)}...
                  </span>
                </div>
              </div>

              {/* Bank Accounts List */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                  Connected Bank Accounts
                </span>
                <div className="space-y-2">
                  {syncData.accounts?.map((acc: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#0c111e] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 text-teal-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{acc.bank_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {acc.account_type} • {acc.masked_account_number}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-white">
                          ₹{acc.balance.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[9px] text-slate-500 block font-mono">
                          Synced just now
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto Assigned 5 Pots */}
              <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/[0.06] space-y-3">
                <span className="text-[10px] uppercase font-bold text-teal-400 font-mono block">
                  Auto-Assigned 5 Pots Routing
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(syncData.auto_assigned_5pots || {}).map(([pot, val]: any, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#080d17] border border-white/[0.05]">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block capitalize">
                        {pot.replace("_", " ")}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        ₹{Number(val).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-xs space-y-2 text-center">
              <Landmark className="w-8 h-8 text-slate-600" />
              <p>Ready to sync with 14+ Indian banks via RBI Account Aggregator.</p>
              <p className="text-[11px] text-slate-600">Click &quot;Fetch Live Bank Balances&quot; to test real execution.</p>
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>RBI AA Framework</span>
            <span>Zero Data Selling</span>
          </div>
        </div>
      </div>
    </div>
  );
};
