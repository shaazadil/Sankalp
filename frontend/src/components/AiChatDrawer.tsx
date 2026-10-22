"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { sendChatMessage } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  preview?: any;
  quickReplies?: string[];
}

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string | null;
  onApplyPlanFromChat?: (preview: any) => void;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  token,
  onApplyPlanFromChat,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste! I am your Sankalp financial co-pilot. You can consult me on high-stakes life decisions:\n\nTell me what's on your mind—like moving to a new city, wedding budgets, education loan payoff, or CTC vs take-home—and I will map out the numbers with zero jargon.",
      quickReplies: [
        "Moving Kolkata to Bengaluru for 9 LPA",
        "Plan ₹15L Wedding in 18 Months",
        "Explain CTC vs. Take-Home Salary",
      ],
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      const data = await sendChatMessage(text, token);
      const botMsg: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: data.response,
        quickReplies: data.suggested_quick_replies,
        preview: data.computed_preview,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: "Oops! Couldn't reach the advisor. Please check that the backend is active, or try asking in a moment.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        className="w-full max-w-lg bg-white h-full border-l-2 border-black shadow-2xl flex flex-col justify-between"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-black text-white text-xs font-mono font-black uppercase tracking-wider rounded">
              AI
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base text-black uppercase tracking-tight">
                  Sankalp Co-Pilot
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F4F5F7] text-black border border-black/20">
                  DETERMINISTIC
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-600">
                Jargon-Free Indian Financial Guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="/chat"
              className="px-2 py-1 rounded border border-black/20 hover:border-black text-[11px] font-mono font-bold text-black transition"
              title="Open full-page chat"
            >
              [FULL ↗]
            </a>
            <button
              onClick={() => setMessages([messages[0]])}
              className="px-2 py-1 rounded border border-black/20 hover:border-black text-[11px] font-mono font-bold text-black transition cursor-pointer"
              title="Clear chat"
            >
              [CLEAR]
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-black/20 hover:border-black flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm bg-[#F4F5F7]">
          {messages.map((m) => (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              key={m.id}
              className={`flex gap-3 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded bg-black text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  AI
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-3 ${
                  m.role === "user"
                    ? "bg-black text-white font-medium rounded-br-none shadow-sm"
                    : "bg-white text-black rounded-bl-none border-2 border-black/10 shadow-sm"
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.content}</p>

                {/* Instant preview card if returned by backend */}
                {m.preview && onApplyPlanFromChat && (
                  <div className="p-3.5 rounded-xl bg-[#F4F5F7] border-2 border-black text-black space-y-2 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-black uppercase text-black">
                      <span>● LIVE MATH COMPUTED</span>
                    </div>
                    {m.preview.estimated_in_hand && (
                      <div className="text-xs flex justify-between font-mono">
                        <span className="text-zinc-600 font-semibold">Calculated In-Hand:</span>
                        <span className="font-black text-black">₹{Math.round(m.preview.estimated_in_hand).toLocaleString("en-IN")}/mo</span>
                      </div>
                    )}
                    {m.preview.security_deposit_shock && (
                      <div className="text-xs flex justify-between font-mono">
                        <span className="text-zinc-600 font-semibold">Locked Deposit:</span>
                        <span className="font-black text-black">₹{Math.round(m.preview.security_deposit_shock).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <button
                      onClick={() => onApplyPlanFromChat(m.preview)}
                      className="w-full mt-2 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm uppercase tracking-wide"
                    >
                      <span>Load into Dashboard</span>
                      <span>→</span>
                    </button>
                  </div>
                )}

                {/* Quick reply chips */}
                {m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {m.quickReplies.map((qr, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(qr)}
                        className="text-[11px] font-bold px-3 py-1 rounded-lg bg-white hover:bg-black hover:text-white text-black border border-black/20 hover:border-black transition active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded bg-zinc-300 text-black text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-black/20">
                  YOU
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-zinc-700 text-xs font-mono font-bold">
              <div className="w-7 h-7 rounded bg-black text-white text-xs flex items-center justify-center shrink-0">
                ...
              </div>
              <span className="animate-pulse">Computing deterministic projection...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t-2 border-black bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything in plain English..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#F4F5F7] border border-black/20 text-xs sm:text-sm font-semibold text-black placeholder-zinc-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 disabled:bg-zinc-200 text-white disabled:text-zinc-400 font-black text-xs transition cursor-pointer disabled:cursor-not-allowed uppercase tracking-wider"
            >
              SEND →
            </button>
          </form>
          <span className="text-[10px] text-zinc-500 font-mono block text-center mt-2 font-medium">
            AI calculations verified by deterministic math engine. Zero hallucinated arithmetic.
          </span>
        </div>
      </motion.div>
    </div>
  );
};
