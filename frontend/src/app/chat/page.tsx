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
} from "lucide-react";
import { sendChatMessage, getChatHistory, ChatResponse } from "@/lib/api";
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
    prompt: "I got an offer for 9 LPA in Bengaluru. Can I realistically afford an 18k apartment with deposit?",
  },
  {
    title: "₹15L Wedding in 18 Months",
    desc: "Calculate required monthly SIP and gold allocation",
    prompt: "How much monthly SIP and Gold SGB do I need to save ₹15 Lakhs for my wedding in 18 months?",
  },
  {
    title: "Old vs New Tax Regime",
    desc: "Compare take-home with ₹18k rent HRA & 80E interest",
    prompt: "Compare New vs Old Tax Regime for ₹9 LPA CTC with ₹18,000 monthly rent and education loan.",
  },
  {
    title: "₹25L Education Loan EMI",
    desc: "Plan 60/40 family split without straining savings",
    prompt: "How to budget for a ₹25 Lakh education loan EMI with a 60/40 family split on my salary?",
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load user session and stored chat
  useEffect(() => {
    const savedUser = localStorage.getItem("sankalp_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Optionally load cloud chat history for logged-in user
        getChatHistory(parsed.token)
          .then((history) => {
            if (history && history.length > 0) {
              const formatted: ChatMessageItem[] = history.map((h) => ({
                id: h.id,
                role: h.role as "user" | "assistant",
                content: h.content,
                preview: h.extracted_data,
                timestamp: h.created_at ? new Date(h.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
              }));
              setMessages((prev) => [prev[0], ...formatted]);
            }
          })
          .catch(() => {});
      } catch (e) {
        localStorage.removeItem("sankalp_user");
      }
    }

    // Load local chat cache if available
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
        content: "Oops! We encountered a slight connection hiccup with our financial engine. Please check that the backend is active and try again.",
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
    // Store preview params in session so dashboard can prefill
    sessionStorage.setItem("sankalp_applied_preview", JSON.stringify(preview));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem("sankalp_user");
        }}
        onToggleChat={() => {}}
      />

      {/* Chat Sub-Header */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 py-3 sticky top-16 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Financial Co-Pilot
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
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-500 px-2.5 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Clear message history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between">
        {/* Messages Stream */}
        <div className="space-y-6 pb-6">
          {/* Starter Quick Actions (If only greeting exists) */}
          {messages.length === 1 && (
            <div className="my-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Popular Indian Financial Scenarios</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTER_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="text-left p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500 dark:hover:border-emerald-500/80 hover:shadow-sm transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center justify-between">
                      <span>{item.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render Messages */}
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
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 sm:px-5 py-3.5 text-sm leading-relaxed transition-all shadow-sm ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none"
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

                {/* If Assistant returned a Computed Preview Card */}
                {msg.preview && (
                  <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200/60 dark:border-emerald-800/40">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Calculated Financial Blueprint</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase">
                        Verified Math
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs mb-3">
                      {msg.preview.annual_ctc && (
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/70 border border-emerald-100 dark:border-emerald-900/40">
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                            Annual CTC
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            ₹{(msg.preview.annual_ctc / 100000).toFixed(1)} Lakhs
                          </span>
                        </div>
                      )}

                      {msg.preview.estimated_monthly_in_hand && (
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/70 border border-emerald-100 dark:border-emerald-900/40">
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                            In-Hand Take Home
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{Math.round(msg.preview.estimated_monthly_in_hand).toLocaleString("en-IN")}/mo
                          </span>
                        </div>
                      )}

                      {msg.preview.balanced_rent && (
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/70 border border-emerald-100 dark:border-emerald-900/40">
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                            Max Safe Rent
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            ₹{Math.round(msg.preview.balanced_rent).toLocaleString("en-IN")}/mo
                          </span>
                        </div>
                      )}

                      {msg.preview.recommended_regime && (
                        <div className="p-2 rounded-lg bg-white/70 dark:bg-zinc-900/70 border border-emerald-100 dark:border-emerald-900/40">
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                            Tax Recommendation
                          </span>
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase">
                            {msg.preview.recommended_regime} Regime
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleApplyToDashboard(msg.preview)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <span>Load into Dashboard & View 5 Pots</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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

                {/* Footer info: Timestamp & Copy */}
                <div
                  className={`flex items-center justify-between text-[10px] mt-2 pt-1 ${
                    msg.role === "user"
                      ? "text-emerald-100"
                      : "text-zinc-400 dark:text-zinc-500"
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
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
                Sankalp AI is analyzing salary components, Bengaluru landlord norms, and tax slabs...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-4 pt-2 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent dark:from-zinc-950 dark:via-zinc-950 dark:to-transparent">
          <div className="relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-all p-2 flex items-center gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything (e.g., 'I got 9 LPA in Bangalore, can I afford 18k rent?')"
              className="flex-1 resize-none bg-transparent px-3 py-1.5 text-sm outline-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 max-h-32"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputVal.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                inputVal.trim() && !isLoading
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 scale-100"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-60"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 px-2">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              100% Confidential • No API Keys in Client
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VisualDemonstration
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onApplyPreset={() => {
          setIsDemoOpen(false);
          router.push("/");
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
