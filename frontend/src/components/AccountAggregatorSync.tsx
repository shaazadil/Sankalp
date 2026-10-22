"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
    <div id="account-aggregator" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [EXECUTION // RBI-REGULATED AA]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              ZERO CSV UPLOAD
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            Instant Account Aggregator Bank Sync
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Zero manual CSV spreadsheets. Cryptographically fetch real-time bank balances and auto-route them into your 5 Pots.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-100 border border-neutral-300 text-xs font-mono font-bold text-black">
          <span>● 256-BIT ENCRYPTED</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Consent Form */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-black text-black uppercase">
              RBI CONSENT MANDATE
            </h3>
            <span className="text-xs font-mono text-neutral-500">[NO PASSWORDS]</span>
          </div>

          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <label className="text-xs font-mono font-bold text-neutral-700 block">LINKED MOBILE NUMBER</label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-500">+91</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="w-full bg-white border border-neutral-300 rounded p-1.5 text-black font-mono font-bold text-sm outline-none"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="space-y-1.5 bg-[#F8F9FA] p-4 rounded-xl border border-neutral-200">
            <label className="text-xs font-mono font-bold text-neutral-700 block">AA GATEWAY PROVIDER</label>
            <select
              value={fiuProvider}
              onChange={(e) => setFiuProvider(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded p-2 text-black font-mono font-bold text-xs outline-none cursor-pointer"
            >
              <option value="finvu">Finvu (Cookiejar Technologies)</option>
              <option value="onemoney">OneMoney (Finsec AA)</option>
              <option value="setu">Setu AA (Pine Labs)</option>
              <option value="anumati">Anumati AA</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-mono text-neutral-700 space-y-1">
            <div className="font-bold text-black uppercase">
              DIRECT-FROM-BANK CONSENT
            </div>
            <p className="text-xs text-neutral-600 font-sans">
              No debit card PIN or NetBanking password required. Consent is verified through official RBI AA protocols.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full py-3.5 px-4 rounded-lg bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:bg-neutral-300 disabled:text-neutral-500 cursor-pointer"
          >
            {isSyncing ? "QUERYING RBI AA NETWORK..." : "FETCH LIVE BANK BALANCES →"}
          </button>

          {error && (
            <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-xs font-mono">
              {error}
            </div>
          )}
        </div>

        {/* Live Aggregated Accounts & Pots Distribution */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between space-y-5">
          {syncData ? (
            <div className="space-y-4">
              {/* Summary Banner */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-300 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">TOTAL SYNCED LIQUID FUNDS</span>
                  <span className="text-2xl font-black text-black">
                    ₹{syncData.total_liquid_balance.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-neutral-600 block mt-0.5">
                    CREDIT DETECTED: ₹{syncData.detected_monthly_cashflow.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase bg-black text-white px-2.5 py-1 rounded font-bold">
                    {syncData.sync_status}
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-1">
                    ID: {syncData.consent_id.slice(0, 15)}...
                  </span>
                </div>
              </div>

              {/* Bank Accounts List */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-black block">
                  CONNECTED BANK ACCOUNTS
                </span>
                <div className="space-y-2">
                  {syncData.accounts?.map((acc: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-neutral-200 flex items-center justify-between font-mono">
                      <div>
                        <p className="text-xs font-black text-black">{acc.bank_name}</p>
                        <p className="text-[11px] text-neutral-500">
                          {acc.account_type} • {acc.masked_account_number}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-black">
                          ₹{acc.balance.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">
                          SYNCED REAL-TIME
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto Assigned 5 Pots */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200 space-y-3 font-mono">
                <span className="text-xs uppercase font-bold text-black block">
                  AUTO-ASSIGNED 5-POT DISTRIBUTION
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(syncData.auto_assigned_5pots || {}).map(([pot, val]: any, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white border border-neutral-300">
                      <span className="text-[10px] text-neutral-500 uppercase block">
                        {pot.replace("_", " ")}
                      </span>
                      <span className="text-xs font-black text-black">
                        ₹{Number(val).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500 text-xs space-y-2 text-center font-mono">
              <span className="text-lg font-bold text-black">[RBI AA GATEWAY]</span>
              <p className="text-neutral-800">Ready to sync with 14+ Indian banks via RBI Account Aggregator.</p>
              <p className="text-neutral-500">Click &ldquo;Fetch Live Bank Balances&rdquo; to execute.</p>
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>RBI AA FRAMEWORK</span>
            <span className="font-bold text-black">[ZERO DATA SELLING]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
