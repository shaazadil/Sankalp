"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
    <div id="broker-execution" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              [EXECUTION // BROKER ORDERS]
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded font-mono font-bold uppercase">
              UPI AUTOPAY BASKET
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading mt-1">
            1-Tap Broker Multi-Basket Execution
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Turn passive budgeting advice into active orders. Directly dispatch SIP allocations to Zerodha, Groww, or Smallcase via UPI AutoPay.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-100 border border-neutral-300 text-xs font-mono font-bold text-black">
          <span>● SEBI EXCHANGE ROUTING</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Terminal */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-black text-black uppercase">
              EXECUTION TERMINAL
            </h3>
            <span className="text-xs font-mono text-neutral-500">[SEBI APIS]</span>
          </div>

          {/* Broker Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-neutral-700 block">TARGET DEPOSITORY / BROKER</label>
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
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    broker === b.id
                      ? "bg-black text-white border-black"
                      : "bg-[#F8F9FA] text-neutral-700 border-neutral-300 hover:border-black"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Basket Selection */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <label className="text-xs font-mono font-bold text-neutral-700 block">CURATED ASSET BASKET</label>
            <select
              value={basket}
              onChange={(e) => setBasket(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded p-2 text-black font-mono font-bold text-xs outline-none cursor-pointer"
            >
              <option value="nifty50_gold_hedge">Nifty 50 Index + Sovereign Gold (Balanced)</option>
              <option value="all_weather_growth">All-Weather Flexi-Cap (Aggressive Alpha)</option>
              <option value="conservative_debt_liquid">Liquid Arbitrage Fund (Capital Preservation)</option>
            </select>
          </div>

          {/* Monthly Amount */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-neutral-700">MONTHLY AUTOPAY SIP:</span>
              <span className="text-black">₹{amount.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min={2000}
              max={100000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full cursor-pointer accent-black"
            />
          </div>

          {/* UPI VPA */}
          <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-neutral-200">
            <label className="text-xs font-mono font-bold text-neutral-700 block">UPI VPA FOR MANDATE</label>
            <input
              type="text"
              value={upiVpa}
              onChange={(e) => setUpiVpa(e.target.value)}
              className="w-full bg-white border border-neutral-300 text-black font-mono font-bold text-xs rounded p-2 outline-none"
              placeholder="username@okhdfcbank"
            />
          </div>

          <button
            type="button"
            onClick={handleDispatch}
            disabled={isDispatching}
            className="w-full py-3.5 px-4 rounded-lg bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:bg-neutral-300 disabled:text-neutral-500 cursor-pointer"
          >
            {isDispatching ? "GENERATING AUTOPAY MANDATE..." : "DISPATCH 1-TAP BROKER ORDER →"}
          </button>

          {error && (
            <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-xs font-mono">
              {error}
            </div>
          )}
        </div>

        {/* Execution Dispatch Result */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-neutral-300 shadow-xs flex flex-col justify-between space-y-5">
          {executionResult ? (
            <div className="space-y-4">
              {/* Order Status Banner */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-300 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block">BROKER STATUS</span>
                  <span className="text-base font-black text-black">
                    ✓ {executionResult.mandate_status.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <span className="text-xs text-neutral-600 block mt-0.5">
                    ORDER ID: {executionResult.order_id} • {executionResult.broker.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase bg-black text-white px-2.5 py-1 rounded font-bold">
                    MANDATE QUEUED
                  </span>
                </div>
              </div>

              {/* Basket Allocation Breakdown */}
              <div className="space-y-2 font-mono">
                <span className="text-xs uppercase font-bold text-black block">
                  DISPATCHED ASSET BREAKDOWN (₹{amount.toLocaleString("en-IN")}/MO)
                </span>
                <div className="space-y-2">
                  {Object.entries(executionResult.basket_allocation || {}).map(([asset, val]: any, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-neutral-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-black">{asset}</span>
                      <span className="text-xs font-black text-black">
                        ₹{Number(val).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verdict & Approval Deep Link */}
              <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300 space-y-2 text-xs font-mono">
                <div className="font-black text-black">
                  {executionResult.execution_verdict}
                </div>
                <p className="text-neutral-600">
                  AutoPay notification sent to <span className="font-bold text-black">{upiVpa}</span>. Approve the ₹{amount.toLocaleString("en-IN")}/mo recurring mandate on your UPI app to commence automatic SIP execution.
                </p>
                <div className="pt-2">
                  <a
                    href={executionResult.upi_autopay_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 rounded bg-black text-white font-mono font-bold text-xs uppercase"
                  >
                    OPEN UPI MANDATE LINK →
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500 text-xs space-y-2 text-center font-mono">
              <span className="text-lg font-bold text-black">[1-TAP BROKER DISPATCH]</span>
              <p className="text-neutral-800">Execute real SIP orders directly into your brokerage account.</p>
              <p className="text-neutral-500">Select parameters and click &ldquo;Dispatch 1-Tap Broker Order&rdquo;.</p>
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>UPI AUTOPAY 2.0 PROTOCOL</span>
            <span className="font-bold text-black">[ZERO MARKUPS]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
