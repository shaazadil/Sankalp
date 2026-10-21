"use client";

import React, { useState } from "react";
import { Zap, CheckCircle2, QrCode, ArrowUpRight, ShieldCheck, Loader2, DollarSign, PieChart } from "lucide-react";
import { dispatchBrokerExecution } from "@/lib/api";

interface BrokerExecutionProps {
  defaultAmount?: number;
}

export const OneTapBrokerExecution: React.FC<BrokerExecutionProps> = ({ defaultAmount = 15000 }) => {
  const [broker, setBroker] = useState("zerodha");
  const [potType, setPotType] = useState("growth");
  const [amount, setAmount] = useState(defaultAmount);
  const [basket, setBasket] = useState("nifty50_gold_hedge");
  const [upiVpa, setUpiVpa] = useState("user@okhdfcbank");

  const [isDispatching, setIsDispatching] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDispatch = async () => {
    setIsDispatching(true);
    setError(null);
    try {
      const data = await dispatchBrokerExecution({
        broker_id: broker,
        pot_type: potType,
        monthly_amount: amount,
        basket_type: basket,
        upi_vpa: upiVpa,
      });
      setExecutionResult(data);
    } catch (e: any) {
      setError(e.message || "Failed to dispatch broker execution order");
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div id="broker-execution" className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Industry Benchmark: Zerodha / Smallcase
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                1-Tap AutoPay Basket
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading mt-0.5">
              1-Tap Broker Multi-Basket Execution
            </h2>
            <p className="text-xs text-slate-400">
              Transform passive budgeting advice into active orders. Directly dispatch SIP allocations to Zerodha, Groww, or Smallcase via UPI AutoPay.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.06] text-xs font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Direct Exchange Routing</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Terminal (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c111e] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Execution Terminal</span>
            <span className="text-xs font-mono text-amber-400">SEBI Regulated APIs</span>
          </h3>

          {/* Broker Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 block font-mono">Target Depository / Broker</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "zerodha", label: "Zerodha" },
                { id: "groww", label: "Groww" },
                { id: "smallcase", label: "Smallcase" },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBroker(b.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold font-mono border transition-all ${
                    broker === b.id
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-[#080d17] text-slate-400 border-white/[0.06] hover:text-white"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Basket Selection */}
          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <label className="text-[11px] text-slate-400 block font-mono">Curated Asset Basket</label>
            <select
              value={basket}
              onChange={(e) => setBasket(e.target.value)}
              className="w-full bg-transparent text-white font-mono font-bold text-xs outline-none cursor-pointer"
            >
              <option value="nifty50_gold_hedge" className="bg-[#0c111e]">Nifty 50 Index + Sovereign Gold Hedge (Balanced)</option>
              <option value="all_weather_growth" className="bg-[#0c111e]">All-Weather High Alpha Flexi-Cap (Aggressive)</option>
              <option value="conservative_debt_liquid" className="bg-[#0c111e]">Liquid Fund + Arbitrage Tank (Capital Protection)</option>
            </select>
          </div>

          {/* Monthly Amount */}
          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Monthly AutoPay SIP:</span>
              <span className="font-mono font-bold text-emerald-400">₹{amount.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={2000}
              max={100000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-400"
            />
          </div>

          {/* UPI VPA */}
          <div className="space-y-1.5 bg-[#080d17] p-3.5 rounded-2xl border border-white/[0.06]">
            <label className="text-[11px] text-slate-400 block font-mono">UPI VPA for AutoPay Mandate</label>
            <input
              type="text"
              value={upiVpa}
              onChange={(e) => setUpiVpa(e.target.value)}
              className="w-full bg-[#0c111e] border border-white/[0.08] text-white font-mono text-xs rounded-xl p-2.5 outline-none"
              placeholder="username@okhdfcbank"
            />
          </div>

          <button
            type="button"
            onClick={handleDispatch}
            disabled={isDispatching}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            {isDispatching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating UPI AutoPay Mandate...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Dispatch 1-Tap Broker Order
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Execution Dispatch Result (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#090d18] border border-white/[0.08] flex flex-col justify-between space-y-5">
          {executionResult ? (
            <div className="space-y-4">
              {/* Order Status Banner */}
              <div className="p-4 rounded-2xl bg-[#0c111e] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Broker Gateway Status</span>
                  <span className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {executionResult.mandate_status.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono block mt-0.5">
                    Order ID: {executionResult.order_id} • {executionResult.broker}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <QrCode className="w-5 h-5" />
                </div>
              </div>

              {/* Basket Allocation Breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                  Dispatched Asset Breakdown (₹{amount.toLocaleString("en-IN")}/mo)
                </span>
                <div className="space-y-2">
                  {Object.entries(executionResult.basket_allocation || {}).map(([asset, val]: any, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#0c111e] border border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <PieChart className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-medium text-white">{asset}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        ₹{Number(val).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verdict & Approval Deep Link */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs">
                <div className="font-bold text-amber-300">
                  {executionResult.execution_verdict}
                </div>
                <p className="text-[11px] text-slate-300">
                  AutoPay notification sent to <span className="font-mono text-white">{upiVpa}</span>. Approve the ₹{amount.toLocaleString("en-IN")}/mo recurring mandate on your UPI app to commence automatic SIP execution.
                </p>
                <div className="pt-2">
                  <a
                    href={executionResult.upi_autopay_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-[11px] font-mono hover:bg-amber-300 transition-colors"
                  >
                    Open UPI Mandate Link <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-xs space-y-2 text-center">
              <Zap className="w-8 h-8 text-slate-600" />
              <p>Execute real SIP orders directly into your brokerage account.</p>
              <p className="text-[11px] text-slate-600">Select parameters and click &quot;Dispatch 1-Tap Broker Order&quot;.</p>
            </div>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>UPI AutoPay 2.0</span>
            <span>Zero Brokerage Markups</span>
          </div>
        </div>
      </div>
    </div>
  );
};
