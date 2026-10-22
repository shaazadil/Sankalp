"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage, getChatHistory, savePlan, ChatResponse } from "@/lib/api";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthModal } from "@/components/AuthModal";
import { VisualDemonstration } from "@/components/VisualDemonstration";
import { SavedPlansModal } from "@/components/SavedPlansModal";

interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  quickReplies?: string[];
  preview?: {
    goal?: string;
    annual_ctc?: number;
    estimated_monthly_in_hand?: number;
    balanced_rent?: number;
    survival_pot?: number;
    family_pot?: number;
    growth_pot?: number;
    recommended_regime?: string;
    advice_summary?: string;
  };
  timestamp?: string;
}

const STARTER_PROMPTS = [
  {
    tag: "01",
    title: "Bengaluru Move @ ₹9 LPA",
    desc: "Can I afford ₹18k rent with landlord deposit shock?",
    prompt: "I got an offer for 9 LPA in Bengaluru. Can I realistically afford an 18k apartment with deposit?",
  },
  {
    tag: "02",
    title: "₹15L Wedding in 18 Months",
    desc: "Calculate required monthly SIP and gold allocation",
    prompt: "How much monthly SIP and Gold SGB do I need to save ₹15 Lakhs for my wedding in 18 months?",
  },
  {
    tag: "03",
    title: "Old vs New Tax Regime",
    desc: "Compare take-home with ₹18k rent HRA & 80E interest",
    prompt: "Compare New vs Old Tax Regime for ₹9 LPA CTC with ₹18,000 monthly rent and education loan.",
  },
  {
    tag: "04",
    title: "₹25L Education Loan EMI",
    desc: "Plan 60/40 family split without straining savings",
    prompt: "How to budget for a ₹25 Lakh education loan EMI with a 60/40 family split on my salary?",
  },
  {
    tag: "05",
    title: "₹8L First Car Purchase",
    desc: "Compare 5-year loan EMI vs cash savings outright",
    prompt: "Can I afford an ₹8 Lakh car with a 5-year loan on ₹9 LPA salary, or should I save cash?",
  },
  {
    tag: "06",
    title: "Emergency Runway Check",
    desc: "How many months of survival fund do I need?",
    prompt: "How much emergency fund do I need in liquid savings if my fixed expenses are ₹28,000/month?",
  },
];

export default function ChatPage() {
  const router = useRouter();

  // User state
  const [user, setUser] = useState<{ email: string; token: string; full_name?: string } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: "initial-assistant-greeting",
      role: "assistant",
      content:
        "Namaste! I am your Sankalp Financial Co-Pilot.\n\nI specialize in navigating Indian life milestones with mathematical precision—from real in-hand CTC breakdown, Bengaluru 6–8 month landlord deposit shocks, family remittances, to wedding SIPs and 80E tax deductions.\n\nWhat milestone or decision is on your mind today?",
      quickReplies: [
        "Moving to Bengaluru for 9 LPA: What is my in-hand?",
        "Plan ₹15L Wedding in 18 Months",
        "Should I choose New or Old Tax Regime?",
        "How much emergency fund do I need?",
      ],
      timestamp: "Just now",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveSuccessMap, setSaveSuccessMap] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load user session and stored chat
  useEffect(() => {
    const savedUser = localStorage.getItem("sankalp_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        getChatHistory(parsed.token)
          .then((history) => {
            if (history && history.length > 0) {
              const formatted: ChatMessageItem[] = history.map((h) => ({
                id: h.id,
                role: h.role as "user" | "assistant",
                content: h.content,
                preview: h.extracted_data,
                timestamp: h.created_at
                  ? new Date(h.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : undefined,
              }));
              setMessages((prev) => [prev[0], ...formatted]);
            }
          })
          .catch(() => {});
      } catch (e) {
        localStorage.removeItem("sankalp_user");
      }
    }

    const localChat = sessionStorage.getItem("sankalp_chat_cache");
    if (localChat) {
      try {
        const parsedMsgs = JSON.parse(localChat);
        if (Array.isArray(parsedMsgs) && parsedMsgs.length > 1) {
          setMessages(parsedMsgs);
        }
      } catch (e) {}
    }
  }, []);

  // Save chat to session cache
  useEffect(() => {
    if (messages.length > 1) {
      sessionStorage.setItem("sankalp_chat_cache", JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customText?: string) => {
    const text = (customText || inputVal).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessageItem = {
      id: "u-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal("");
    setIsLoading(true);

    try {
      const res: ChatResponse = await sendChatMessage(text, user?.token);
      const botMessage: ChatMessageItem = {
        id: "a-" + Date.now(),
        role: "assistant",
        content: res.response,
        quickReplies: res.suggested_quick_replies,
        preview: res.computed_preview,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessageItem = {
        id: "err-" + Date.now(),
        role: "assistant",
        content:
          "Oops! We encountered a slight connection hiccup with our financial engine. Please check that the backend is active and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    sessionStorage.removeItem("sankalp_chat_cache");
    setMessages([messages[0]]);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyToDashboard = (preview: any) => {
    if (!preview) return;
    sessionStorage.setItem("sankalp_applied_preview", JSON.stringify(preview));
    router.push("/dashboard");
  };

  const handleSaveBlueprint = async (msgId: string, preview: any) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (!preview) return;

    try {
      const payload = {
        title: preview.goal || `AI Plan: ₹${((preview.annual_ctc || 900000) / 100000).toFixed(1)}L CTC`,
        goal_category: "ai_blueprint",
        monthly_income: preview.estimated_monthly_in_hand || 62400,
        total_fixed_expenses: preview.survival_pot || 27500,
        total_emis: 0,
        family_support: preview.family_pot || 10000,
        monthly_savings_potential: preview.growth_pot || 12000,
        emergency_runway_months: 5.2,
        health_score: 85,
        summary: preview.advice_summary || "AI Blueprint calculated with zero-based pots.",
        scenarios: [],
      };
      await savePlan(payload, user.token);
      setSaveSuccessMap((prev) => ({ ...prev, [msgId]: true }));
      setTimeout(() => {
        setSaveSuccessMap((prev) => ({ ...prev, [msgId]: false }));
      }, 3000);
    } catch (e) {
      console.error("Save blueprint failed:", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-[#09090B] font-sans selection:bg-neutral-900 selection:text-white">
      {/* 1. App Sidebar */}
      <AppSidebar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem("sankalp_user");
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Workspace Subheader */}
        <div className="bg-white border-b border-neutral-200 px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-mono font-bold text-black px-4 py-2 rounded-full border border-neutral-300 hover:border-black transition"
            >
              ← DASHBOARD
            </Link>
            <div className="h-4 w-[1px] bg-neutral-300" />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
              <h1 className="text-base sm:text-lg font-black text-black font-heading uppercase tracking-tight">
                AI Financial Milestone Advisor
              </h1>
              <span className="hidden sm:inline-flex text-xs font-mono font-bold px-3 py-1 rounded-full bg-neutral-100 text-black border border-neutral-300">
                [DETERMINISTIC MATH]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="text-xs font-mono font-bold text-neutral-700 hover:text-black px-4 py-2 rounded-full border border-neutral-300 hover:border-black transition cursor-pointer"
              title="Start fresh conversation"
            >
              [NEW CHAT]
            </button>
          </div>
        </div>

        {/* 3. Main Workspace Container */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
          {/* Left Control Panel / Presets */}
          <aside className="w-full md:w-80 shrink-0 space-y-4 hidden md:block">
            <div className="p-6 rounded-3xl bg-white border border-neutral-300 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-black">
                  MILESTONE STARTERS
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">[06]</span>
              </div>
              <p className="text-sm font-medium text-neutral-600">
                Select any Indian financial question to receive verified mathematical calculations:
              </p>

              <div className="space-y-2.5 pt-1">
                {STARTER_PROMPTS.map((item, idx) => (
                  <motion.button
                    whileHover={{ x: 2 }}
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="w-full text-left p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-black transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-sm font-black font-heading text-black">
                      <span className="font-mono text-xs text-neutral-500">
                        [{item.tag}]
                      </span>
                      <span className="truncate">{item.title}</span>
                    </div>
                    <p className="text-xs font-medium text-neutral-600 mt-1 line-clamp-1">
                      {item.desc}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Context Card */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-300 space-y-3 text-xs">
              <span className="font-black text-black block font-heading uppercase tracking-wide text-sm">
                Why Sankalp Math Differs:
              </span>
              <ul className="text-sm font-medium text-neutral-600 space-y-2 list-disc pl-4">
                <li>Deterministic Indian income tax calculation</li>
                <li>Bengaluru &amp; Mumbai 6–10 mo deposit logic</li>
                <li>Family remittance built into runway</li>
                <li>1-Click plan sync with live dashboard</li>
              </ul>
            </div>
          </aside>

          {/* Central Chat Stream */}
          <main className="flex-1 flex flex-col justify-between min-h-[600px] bg-white rounded-3xl border border-neutral-300 shadow-sm p-5 sm:p-7 overflow-hidden">
            {/* Messages Stream */}
            <div className="space-y-6 pb-6 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={msg.id}
                    className={`flex gap-3 sm:gap-4 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-9 h-9 rounded-full bg-neutral-200 border border-neutral-400 text-black font-mono text-xs font-black flex items-center justify-center shrink-0">
                        AI
                      </div>
                    )}

                    <div
                      className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed transition-all shadow-xs ${
                        msg.role === "user"
                          ? "bg-[#E2E4E9] text-black font-semibold rounded-tr-none border border-neutral-300"
                          : "bg-[#F8F9FA] border border-neutral-300 text-black rounded-tl-none font-normal"
                      }`}
                    >
                      {/* Content formatting */}
                      <div className="whitespace-pre-wrap font-sans text-sm sm:text-base">
                        {msg.content.split("\n\n").map((paragraph, pIdx) => (
                          <p key={pIdx} className="mb-2.5 last:mb-0">
                            {paragraph.split("**").map((chunk, cIdx) =>
                              cIdx % 2 === 1 ? (
                                <strong
                                  key={cIdx}
                                  className="font-black text-black"
                                >
                                  {chunk}
                                </strong>
                              ) : (
                                chunk
                              )
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Computed Blueprint Card - Clean Grey/White surface, no black card */}
                      {msg.preview && (
                        <div className="mt-4 p-5 rounded-2xl bg-white border border-neutral-300 shadow-xs">
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200">
                            <span className="text-sm font-black text-black font-heading uppercase tracking-wide">
                              ● Calculated Financial Blueprint
                            </span>
                            <span className="text-xs font-mono font-bold text-neutral-800 bg-neutral-100 uppercase px-2.5 py-1 rounded-full border border-neutral-300">
                              DETERMINISTIC
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-3">
                            {msg.preview.annual_ctc && (
                              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono">
                                <span className="text-xs text-neutral-600 block uppercase font-bold">
                                  Annual CTC
                                </span>
                                <span className="font-black text-black text-base">
                                  ₹{(msg.preview.annual_ctc / 100000).toFixed(1)} Lakhs
                                </span>
                              </div>
                            )}

                            {msg.preview.estimated_monthly_in_hand && (
                              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono">
                                <span className="text-xs text-neutral-600 block uppercase font-bold">
                                  In-Hand Take Home
                                </span>
                                <span className="font-black text-black text-base">
                                  ₹{Math.round(msg.preview.estimated_monthly_in_hand).toLocaleString("en-IN")}/mo
                                </span>
                              </div>
                            )}

                            {msg.preview.balanced_rent && (
                              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono">
                                <span className="text-xs text-neutral-600 block uppercase font-bold">
                                  Rent Cap
                                </span>
                                <span className="font-black text-black text-base">
                                  ₹{Math.round(msg.preview.balanced_rent).toLocaleString("en-IN")}/mo
                                </span>
                              </div>
                            )}

                            {msg.preview.recommended_regime && (
                              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 font-mono">
                                <span className="text-xs text-neutral-600 block uppercase font-bold">
                                  Tax Regime
                                </span>
                                <span className="font-black text-black uppercase text-base">
                                  {msg.preview.recommended_regime}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action buttons inside card */}
                          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                            <button
                              onClick={() => handleApplyToDashboard(msg.preview)}
                              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs font-black bg-black text-white hover:bg-neutral-800 transition cursor-pointer uppercase tracking-wider"
                            >
                              <span>Apply to Live Dashboard</span>
                              <span>→</span>
                            </button>

                            <button
                              onClick={() => handleSaveBlueprint(msg.id, msg.preview)}
                              className={`w-full sm:w-auto px-5 py-3 rounded-full text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                                saveSuccessMap[msg.id]
                                  ? "bg-black text-white border-black"
                                  : "bg-white border-neutral-300 hover:border-black text-black"
                              }`}
                            >
                              {saveSuccessMap[msg.id] ? "[SAVED ✓]" : "[SAVE BLUEPRINT]"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Quick Reply Chips */}
                      {msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-neutral-200">
                          {msg.quickReplies.map((reply, rIdx) => (
                            <button
                              key={rIdx}
                              onClick={() => handleSend(reply)}
                              className="text-xs font-bold px-4 py-1.5 rounded-full bg-white hover:bg-black hover:text-white text-black border border-neutral-300 hover:border-black transition cursor-pointer"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Footer Timestamp & Copy */}
                      <div className="flex items-center justify-between text-xs mt-2 pt-1 font-mono text-neutral-600">
                        <span>{msg.timestamp || "Just now"}</span>
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => copyToClipboard(msg.id, msg.content)}
                            className="font-bold hover:underline cursor-pointer"
                            title="Copy advice"
                          >
                            {copiedId === msg.id ? "[COPIED ✓]" : "[COPY]"}
                          </button>
                        )}
                      </div>
                    </div>

                    {msg.role === "user" && (
                      <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-300 text-black font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        YOU
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 items-center text-xs font-mono font-bold text-black animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
                    ...
                  </div>
                  <div className="px-5 py-3.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs text-black">
                    Calculating real take-home, Indian tax deductions, and deposit runway...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-neutral-200">
              <div className="relative rounded-full bg-neutral-50 border border-neutral-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all p-2 flex items-center gap-3">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything (e.g., 'Moving Kolkata to Bengaluru on ₹9 LPA, can I afford ₹16k rent?')"
                  className="flex-1 resize-none bg-transparent px-4 py-2 text-sm font-semibold outline-none text-black placeholder-neutral-500 max-h-32"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputVal.trim() || isLoading}
                  className={`px-6 py-3 rounded-full text-xs font-black transition-all flex items-center justify-center cursor-pointer uppercase tracking-wider ${
                    inputVal.trim() && !isLoading
                      ? "bg-black text-white hover:bg-neutral-800"
                      : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  SEND →
                </button>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-neutral-600 mt-2 px-3">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span className="font-bold text-black">[100% PRIVATE &amp; DETERMINISTIC]</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <VisualDemonstration
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onApplyPreset={() => {
          setIsDemoOpen(false);
          router.push("/dashboard");
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          localStorage.setItem("sankalp_user", JSON.stringify(userData));
        }}
      />

      <SavedPlansModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
        plans={[]}
        onLoadPlan={() => {}}
        onDeletePlan={() => {}}
      />
    </div>
  );
}
