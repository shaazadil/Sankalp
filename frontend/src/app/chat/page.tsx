"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Send,
  ArrowLeft,
  Bot,
  User,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Copy,
  Check,
  Zap,
  Bookmark,
  Building2,
  HeartHandshake,
  CreditCard,
  Car,
  Clock,
  Layers,
  MessageSquare,
  PlusCircle,
} from "lucide-react";
import { sendChatMessage, getChatHistory, savePlan, ChatResponse } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
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
    title: "Bengaluru Move @ ₹9 LPA",
    desc: "Can I afford ₹18k rent with landlord deposit shock?",
    icon: Building2,
    prompt: "I got an offer for 9 LPA in Bengaluru. Can I realistically afford an 18k apartment with deposit?",
  },
  {
    title: "₹15L Wedding in 18 Months",
    desc: "Calculate required monthly SIP and gold allocation",
    icon: HeartHandshake,
    prompt: "How much monthly SIP and Gold SGB do I need to save ₹15 Lakhs for my wedding in 18 months?",
  },
  {
    title: "Old vs New Tax Regime",
    desc: "Compare take-home with ₹18k rent HRA & 80E interest",
    icon: Layers,
    prompt: "Compare New vs Old Tax Regime for ₹9 LPA CTC with ₹18,000 monthly rent and education loan.",
  },
  {
    title: "₹25L Education Loan EMI",
    desc: "Plan 60/40 family split without straining savings",
    icon: CreditCard,
    prompt: "How to budget for a ₹25 Lakh education loan EMI with a 60/40 family split on my salary?",
  },
  {
    title: "₹8L First Car Purchase",
    desc: "Compare 5-year loan EMI vs cash savings outright",
    icon: Car,
    prompt: "Can I afford an ₹8 Lakh car with a 5-year loan on ₹9 LPA salary, or should I save cash?",
  },
  {
    title: "Emergency Runway Check",
    desc: "How many months of survival fund do I need?",
    icon: Clock,
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
        "Namaste! 🙏 I'm your **Sankalp Financial Co-Pilot**.\n\nI specialize in navigating Indian life milestones without any Wall Street jargon—from **real in-hand CTC breakdown**, **Bengaluru 6–8 month landlord deposit shocks**, **family remittances**, to **wedding SIPs & 80E tax deductions**.\n\nWhat milestone or decision is on your mind today?",
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

  // 1-Click Apply Plan to Dashboard
  const handleApplyToDashboard = (preview: any) => {
    if (!preview) return;
    sessionStorage.setItem("sankalp_applied_preview", JSON.stringify(preview));
    router.push("/dashboard");
  };

  // Save blueprint directly to user account
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      {/* 1. Global Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem("sankalp_user");
        }}
      />

      {/* 2. Large-Scale Workspace Subheader */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 py-3 sticky top-16 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Open Budget Dashboard</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              AI Financial Milestone Advisor
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <Zap className="w-2.5 h-2.5" />
              Groq LPU (~300ms)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-500 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Start fresh conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace Container with Sidebar & Chat Stream */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Control Panel / Presets */}
        <aside className="w-full md:w-80 shrink-0 space-y-4 hidden md:block">
          <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Milestone Starters
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Select any Indian financial question to receive verified mathematical calculations:
            </p>

            <div className="space-y-2 pt-1">
              {STARTER_PROMPTS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="w-full text-left p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500/50 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      <IconComponent className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Context Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border border-emerald-800/40 space-y-2 text-xs">
            <span className="font-bold text-emerald-300 block">Why Sankalp AI is Different:</span>
            <ul className="text-[11px] text-zinc-300 space-y-1 list-disc pl-4">
              <li>Deterministic Indian income tax calculation</li>
              <li>Bengaluru &amp; Mumbai 6–10 mo deposit logic</li>
              <li>Family remittance built into runway</li>
              <li>1-Click plan sync with live dashboard</li>
            </ul>
          </div>
        </aside>

        {/* Central Chat Stream */}
        <main className="flex-1 flex flex-col justify-between min-h-[600px] bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4 sm:p-6 overflow-hidden">
          {/* Messages Stream */}
          <div className="space-y-6 pb-6 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 sm:px-5 py-3.5 text-sm leading-relaxed transition-all shadow-sm ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none"
                  }`}
                >
                  {/* Content formatting */}
                  <div className="whitespace-pre-wrap font-sans text-sm">
                    {msg.content.split("\n\n").map((paragraph, pIdx) => (
                      <p key={pIdx} className="mb-2.5 last:mb-0">
                        {paragraph.split("**").map((chunk, cIdx) =>
                          cIdx % 2 === 1 ? (
                            <strong
                              key={cIdx}
                              className={
                                msg.role === "user"
                                  ? "font-bold text-white"
                                  : "font-bold text-zinc-950 dark:text-white"
                              }
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

                  {/* Computed Blueprint Card */}
                  {msg.preview && (
                    <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-200/60 dark:border-emerald-800/40">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Calculated Financial Blueprint</span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60">
                          Deterministic Math
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs mb-3">
                        {msg.preview.annual_ctc && (
                          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-100 dark:border-emerald-900/40">
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">
                              Annual CTC
                            </span>
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                              ₹{(msg.preview.annual_ctc / 100000).toFixed(1)} Lakhs
                            </span>
                          </div>
                        )}

                        {msg.preview.estimated_monthly_in_hand && (
                          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-100 dark:border-emerald-900/40">
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">
                              In-Hand Take Home
                            </span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                              ₹{Math.round(msg.preview.estimated_monthly_in_hand).toLocaleString("en-IN")}/mo
                            </span>
                          </div>
                        )}

                        {msg.preview.balanced_rent && (
                          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-100 dark:border-emerald-900/40">
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">
                              Recommended Rent Cap
                            </span>
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                              ₹{Math.round(msg.preview.balanced_rent).toLocaleString("en-IN")}/mo
                            </span>
                          </div>
                        )}

                        {msg.preview.recommended_regime && (
                          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-100 dark:border-emerald-900/40">
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">
                              Tax Regime
                            </span>
                            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 uppercase">
                              {msg.preview.recommended_regime}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons inside card */}
                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                        <button
                          onClick={() => handleApplyToDashboard(msg.preview)}
                          className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
                        >
                          <span>Apply to My Live Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleSaveBlueprint(msg.id, msg.preview)}
                          className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                            saveSuccessMap[msg.id]
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {saveSuccessMap[msg.id] ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved!</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Save Plan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Reply Chips */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      {msg.quickReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => handleSend(reply)}
                          className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-emerald-950/60 text-zinc-700 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-300 border border-zinc-200 dark:border-zinc-700/60 transition cursor-pointer"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Footer Timestamp & Copy */}
                  <div
                    className={`flex items-center justify-between text-[10px] mt-2 pt-1 ${
                      msg.role === "user" ? "text-emerald-100" : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    <span>{msg.timestamp || "Just now"}</span>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        className="hover:text-zinc-700 dark:hover:text-zinc-300 transition flex items-center gap-1"
                        title="Copy advice"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-zinc-500 dark:text-zinc-400 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
                  Sankalp AI is calculating real take-home, Indian tax deductions, and deposit runway...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <div className="relative rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus-within:border-emerald-500 transition-all p-2 flex items-center gap-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything (e.g., 'Moving Kolkata to Bengaluru on ₹9 LPA, can I afford ₹16k rent?')"
                className="flex-1 resize-none bg-transparent px-3 py-1.5 text-sm outline-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 max-h-32"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputVal.trim() || isLoading}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  inputVal.trim() && !isLoading
                    ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 scale-100"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-60"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 px-1">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                100% Private &amp; Deterministic
              </span>
            </div>
          </div>
        </main>
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
