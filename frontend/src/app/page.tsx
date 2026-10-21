"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthModal } from "@/components/AuthModal";
import { VisualDemonstration } from "@/components/VisualDemonstration";
import {
  FinancialProfileModal,
  FinancialProfileFormValues,
} from "@/components/FinancialProfileModal";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Zap,
  Sliders,
  DollarSign,
  HeartHandshake,
  Clock,
  Building2,
  Layers,
  Lock,
  Mail,
  Check,
  Coffee,
  PiggyBank,
  Home as HomeIcon,
  CreditCard,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  // User session state
  const [user, setUser] = useState<{ email: string; token: string; full_name?: string } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Live Interactive Simulator State on Landing Page
  const [demoCtc, setDemoCtc] = useState<number>(900000); // 9 LPA
  const [demoRent, setDemoRent] = useState<number>(16000);
  const [demoFamily, setDemoFamily] = useState<number>(10000);
  const [demoSip, setDemoSip] = useState<number>(12000);
  const [demoRegime, setDemoRegime] = useState<string>("new");
  const [demoEmis, setDemoEmis] = useState<number>(0);
  const [demoSavings, setDemoSavings] = useState<number>(150000);
  const [demoCity, setDemoCity] = useState<string>("Kolkata");
  const [demoTargetCity, setDemoTargetCity] = useState<string>("Bengaluru");
  const [demoGoal, setDemoGoal] = useState<string>("relocation");

  const handleSaveDemoProfile = (values: FinancialProfileFormValues) => {
    setDemoCtc(values.annual_ctc);
    setDemoRent(values.current_rent);
    setDemoFamily(values.family_support);
    setDemoSip(values.current_monthly_sip);
    setDemoRegime(values.tax_regime);
    setDemoEmis(values.existing_emis);
    setDemoSavings(values.current_savings);
    setDemoCity(values.current_city);
    setDemoTargetCity(values.target_city);
    setDemoGoal(values.active_goal);
    sessionStorage.setItem(
      "sankalp_applied_preview",
      JSON.stringify({
        annual_ctc: values.annual_ctc,
        balanced_rent: values.current_rent,
        recommended_regime: values.tax_regime,
      })
    );
  };

  // Read saved user session
  useEffect(() => {
    const saved = localStorage.getItem("sankalp_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("sankalp_user");
      }
    }
  }, []);

  const handleLoginSuccess = (userData: { email: string; token: string; full_name?: string }) => {
    setUser(userData);
    localStorage.setItem("sankalp_user", JSON.stringify(userData));
    router.push("/dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("sankalp_user");
  };

  // Live Math calculations for interactive simulator
  const monthlyGross = Math.round(demoCtc / 12);
  const estimatedTax =
    demoRegime === "new"
      ? Math.max(0, Math.round(((demoCtc - 775000) * 0.1) / 12))
      : Math.round(monthlyGross * 0.12);
  const epfDeduction = Math.round(Math.min(monthlyGross * 0.5, 15000) * 0.12);
  const monthlyInHand = Math.max(20000, monthlyGross - estimatedTax - epfDeduction - 200);

  const survivalPot = demoRent + 8000 + 3500;
  const obligationsPot = demoEmis;
  const familyPot = demoFamily;
  const growthPot = demoSip;
  const guiltFreeUpiPot = Math.max(0, monthlyInHand - (survivalPot + obligationsPot + familyPot + growthPot));
  const emergencyMonths = (((demoSavings || 150000) / (survivalPot + familyPot + demoEmis)) || 4.5).toFixed(1);

  return (
    <div className="flex min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. App Sidebar */}
      <AppSidebar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        onLogout={handleLogout}
        currentCtc={demoCtc}
        currentCity={demoCity}
        targetCity={demoTargetCity}
      />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 border-b border-white/[0.08]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Zero-Based Cashflow Architecture • Built for Indian Life Milestones</span>
            </div>

            {/* Master Headline in Outfit Font */}
            <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Gain total control of your money. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Give every rupee a purpose.
              </span>
            </h1>

            {/* Subheading in Plain English */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
              Traditional budgets look backward and make you feel guilty. Sankalp brings proactive{" "}
              <strong className="text-slate-200">zero-based cashflow planning</strong> to Indian professionals—handling real in-hand salaries, metro landlord deposit shocks, family remittances, and ambitious milestones.
            </p>

            {/* Clean Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Go to My Personal Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Sign In with Email Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <a
                href="#live-simulator"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0c111e] border border-white/[0.1] hover:bg-slate-800 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Try Live Interactive Budget</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 bg-[#0c111e] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero Bank Passwords Needed
              </span>
              <span className="flex items-center gap-1.5 bg-[#0c111e] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                100% Free &amp; Private
              </span>
              <span className="flex items-center gap-1.5 bg-[#0c111e] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Instant Email Code Access
              </span>
              <span className="flex items-center gap-1.5 bg-[#0c111e] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Deterministic Indian Tax Math
              </span>
            </div>

          {/* Hero Visual Image Asset (Replacing raw icons with high-end graphic) */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-2xl bg-zinc-900 group">
              <img
                src="/images/smart_pots_visual.jpg"
                alt="Smart Zero-Based Budgeting 5 Pots Architecture"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                    Visual Methodology
                  </span>
                  <p className="text-white font-heading font-bold text-sm sm:text-base">
                    The 5 Smart Pots: Every single rupee is assigned to Survival, Obligations, Family, Guilt-Free UPI, or Wealth Growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Simple Pillars of Sankalp */}
      <section className="py-20 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              The Proven Philosophy
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
              The 4 Pillars of Sankalp
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Money isn&apos;t math; it&apos;s behavior. These 4 habits take the stress out of your finances forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#0c111e] border border-white/[0.08] space-y-3 hover:border-emerald-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-base flex items-center justify-center font-heading">
                1
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                Give Every Rupee a Job
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                As soon as your salary hits your account, assign every single rupee to a specific pot—rent, food, parents, EMIs, or guilt-free fun. No money is left to disappear.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#0c111e] border border-white/[0.08] space-y-3 hover:border-teal-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 font-black text-base flex items-center justify-center font-heading">
                2
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                Embrace True Expenses
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Break massive upcoming shocks—like a 6–10 month Bengaluru landlord deposit, annual term insurance, or Diwali trips—into predictable monthly bites.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#0c111e] border border-white/[0.08] space-y-3 hover:border-amber-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-black text-base flex items-center justify-center font-heading">
                3
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                Roll With The Punches
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Life happens. If you overspent on dining out or had an emergency doctor visit, adjust money between pots in one tap. No guilt. No broken budgets.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-[#0c111e] border border-white/[0.08] space-y-3 hover:border-indigo-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-black text-base flex items-center justify-center font-heading">
                4
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                Age Your Money
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Increase your emergency runway until you are living on the money you earned last month, breaking the paycheck-to-paycheck cycle forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Interactive Budget Simulator Sandbox */}
      <section id="live-simulator" className="py-20 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                Interactive Cashflow Sandbox
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Experience Zero-Based Budgeting in Real Time
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Slide the controls below to see how every rupee of your Indian salary is allocated with surgical precision.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Input My Exact Numbers</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Tax Regime:</span>
                <div className="bg-[#0c111e] border border-white/[0.08] p-1 rounded-xl flex items-center text-xs font-bold">
                  <button
                    onClick={() => setDemoRegime("new")}
                    className={`px-3 py-1 rounded-lg transition ${
                      demoRegime === "new" ? "bg-emerald-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    New Regime
                  </button>
                  <button
                    onClick={() => setDemoRegime("old")}
                    className={`px-3 py-1 rounded-lg transition ${
                      demoRegime === "old" ? "bg-emerald-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Old Regime (HRA)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Card */}
          <div className="bg-[#0c111e] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-8">
            {/* Top Stat Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#080d17] border border-white/[0.06]">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Annual CTC
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
                  ₹{(demoCtc / 100000).toFixed(1)} LPA
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                  Monthly In-Hand
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums">
                  ₹{monthlyInHand.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                  Emergency Runway
                </span>
                <span className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400 font-mono font-heading">
                  {emergencyMonths} Months
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  Zero-Balance Check
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 inline-flex items-center gap-1 mt-1 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Rupee Assigned!
                </span>
              </div>
            </div>

            {/* Sliders Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-700 dark:text-zinc-300">Annual Salary (CTC)</span>
                  <span className="text-emerald-600 font-mono">₹{(demoCtc / 100000).toFixed(1)} Lakhs</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={3500000}
                  step={50000}
                  value={demoCtc}
                  onChange={(e) => setDemoCtc(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                  <span>₹5 LPA</span>
                  <span>₹20 LPA</span>
                  <span>₹35 LPA</span>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-700 dark:text-zinc-300">Monthly Rent</span>
                  <span className="text-rose-600 font-mono">₹{demoRent.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={8000}
                  max={50000}
                  step={1000}
                  value={demoRent}
                  onChange={(e) => setDemoRent(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                  <span>₹8,000</span>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-700 dark:text-zinc-300">Family Remittance</span>
                  <span className="text-amber-600 font-mono">₹{demoFamily.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30000}
                  step={1000}
                  value={demoFamily}
                  onChange={(e) => setDemoFamily(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                  <span>₹0</span>
                  <span>₹15,000</span>
                  <span>₹30,000</span>
                </div>
              </div>
            </div>

            {/* The 5 Smart Pots Visualization */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Where Every Rupee Is Assigned This Month
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5 font-heading">
                      <HomeIcon className="w-3.5 h-3.5" /> Survival Pot
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {Math.round((survivalPot / monthlyInHand) * 100)}%
                    </span>
                  </div>
                  <div className="text-lg font-black text-rose-700 dark:text-rose-300 font-mono font-heading">
                    ₹{survivalPot.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Rent, electricity, wifi &amp; essentials
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 font-heading">
                      <CreditCard className="w-3.5 h-3.5" /> Obligations
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {obligationsPot > 0 ? Math.round((obligationsPot / monthlyInHand) * 100) : 0}%
                    </span>
                  </div>
                  <div className="text-lg font-black text-blue-700 dark:text-blue-300 font-mono font-heading">
                    ₹{obligationsPot.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Active EMIs &amp; Credit Cards
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 font-heading">
                      <HeartHandshake className="w-3.5 h-3.5" /> Family Pot
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {Math.round((familyPot / monthlyInHand) * 100)}%
                    </span>
                  </div>
                  <div className="text-lg font-black text-amber-700 dark:text-amber-300 font-mono font-heading">
                    ₹{familyPot.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Parents support &amp; home transfers
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 font-heading">
                      <Coffee className="w-3.5 h-3.5" /> Guilt-Free UPI
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {Math.round((guiltFreeUpiPot / monthlyInHand) * 100)}%
                    </span>
                  </div>
                  <div className="text-lg font-black text-purple-700 dark:text-purple-300 font-mono font-heading">
                    ₹{guiltFreeUpiPot.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Dining, Swiggy, movies &amp; travel
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-heading">
                      <PiggyBank className="w-3.5 h-3.5" /> Wealth &amp; SIP
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {Math.round((growthPot / monthlyInHand) * 100)}%
                    </span>
                  </div>
                  <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 font-mono font-heading">
                    ₹{growthPot.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Emergency runway, SIPs &amp; Gold
                  </p>
                </div>
              </div>
            </div>

            {/* Launch Dashboard Action: Opens AuthModal if not signed in */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
                Sign in to save this plan, calculate metro deposit shocks, and model wedding or loan goals.
              </div>

              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Open My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Sign In to Unlock Full Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dedicated Large-Scale AI Assistant Showcase (with High-Tech Graphic Asset) */}
      <section className="py-20 bg-gradient-to-b from-zinc-900 to-zinc-950 text-white border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              Dedicated Webpage Feature
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white">
              Meet Your 24/7 AI Financial Co-Pilot
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Have doubts about rent affordability, Old vs New Tax Regime, or how much to send parents? Ask in simple English. The AI generates complete financial blueprints that you can apply to your live dashboard with one click.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Visual AI Graphic Asset */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 group">
              <img
                src="/images/ai_advisor_visual.jpg"
                alt="AI Financial Co-Pilot Dashboard Interface"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                    Context-Aware Intelligence
                  </span>
                  <p className="text-white font-heading font-bold text-sm">
                    Trained on Indian Tax Sections (80C, 80D, 80E) and Bangalore/Mumbai Metro Rent Dynamics.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-white">Instant One-Click Plan Application</h4>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    When the AI generates a budget blueprint, simply click &ldquo;Apply Plan to My Dashboard&rdquo; and your live pots, rent sliders, and tax regime sync immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-white">100% Deterministic Tax &amp; HRA Calculations</h4>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    The AI combines natural language advice with our verified mathematical engine—no hallucinated tax brackets or bogus deduction numbers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-white">Full Screen Dedicated Assistant Experience</h4>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    A comprehensive, large-scale workspace at <code>/chat</code> with milestone starters, saved chats, exportable plans, and financial profile integration.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-zinc-950" />
                  <span>Open Dedicated AI Advisor Webpage</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Comparison Table: Sankalp vs Spreadsheets */}
      <section className="py-20 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Why We Are Different
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Spreadsheets Look Backward. Sankalp Looks Forward.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800">
              <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-extrabold uppercase tracking-wider text-[11px] font-heading">
                <tr>
                  <th className="p-4 sm:p-5">Feature</th>
                  <th className="p-4 sm:p-5 text-zinc-500">Traditional Spreadsheets</th>
                  <th className="p-4 sm:p-5 bg-emerald-600 text-white">Sankalp Zero-Based Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-zinc-900 dark:text-zinc-100 font-heading">Approach</td>
                  <td className="p-4 sm:p-5 text-zinc-500">Looking back at past expenses with guilt</td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                    Proactive zero-based assignment of every rupee
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-zinc-900 dark:text-zinc-100 font-heading">Indian Tax Math</td>
                  <td className="p-4 sm:p-5 text-zinc-500">Manual error-prone formulas</td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                    Automatic Old vs New Tax comparison &amp; EPF
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-zinc-900 dark:text-zinc-100 font-heading">Metro Landlord Deposits</td>
                  <td className="p-4 sm:p-5 text-zinc-500">Ignored until you face a cash crisis</td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                    Calculated deposit shock &amp; amortized recovery
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-zinc-900 dark:text-zinc-100 font-heading">Family Remittance</td>
                  <td className="p-4 sm:p-5 text-zinc-500">Treated as a generic expense</td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                    First-class priority pot built into your runway
                  </td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-zinc-900 dark:text-zinc-100 font-heading">AI Financial Co-Pilot</td>
                  <td className="p-4 sm:p-5 text-zinc-500">None</td>
                  <td className="p-4 sm:p-5 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                    24/7 dedicated advisor with one-click plan apply
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-emerald-950 via-teal-950 to-zinc-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white">
            Stop wondering where your salary went. <br />
            <span className="text-emerald-400">Tell it where to go today.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto font-normal">
            No bank passwords. No spreadsheets. Log in with your email address in 10 seconds and unlock your personalized private financial dashboard.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-base shadow-xl transition hover:scale-105 active:scale-95 font-heading"
              >
                Go to My Dashboard →
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-base shadow-xl transition hover:scale-105 active:scale-95 cursor-pointer font-heading flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                <span>Sign In with Email Code (Free)</span>
              </button>
            )}

            <Link
              href="/chat"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-zinc-900/80 border border-zinc-700 text-zinc-200 hover:bg-zinc-800 font-bold text-base transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Talk to AI Assistant</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Clean Footer */}
      <footer className="py-12 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-heading font-black text-sm">
              सं
            </div>
            <div>
              <span className="font-heading font-extrabold text-zinc-900 dark:text-zinc-100 text-sm">
                Sankalp
              </span>
              <p className="text-[11px] text-zinc-500">India-First Zero-Based Financial Life Planner</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/" className="hover:text-emerald-600 transition">
              Overview
            </Link>
            <Link href="/chat" className="hover:text-emerald-600 transition">
              AI Advisor
            </Link>
            <button onClick={() => setIsAuthOpen(true)} className="hover:text-emerald-600 transition cursor-pointer">
              Email Sign In
            </button>
          </div>

          <div className="text-[11px] text-zinc-400">
            &copy; 2026 Sankalp Financial AI. All calculations 100% deterministic.
          </div>
        </div>
      </footer>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <VisualDemonstration
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

      <FinancialProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        initialValues={{
          annual_ctc: demoCtc,
          tax_regime: demoRegime,
          current_rent: demoRent,
          family_support: demoFamily,
          existing_emis: demoEmis,
          current_savings: demoSavings,
          current_monthly_sip: demoSip,
          current_city: demoCity,
          target_city: demoTargetCity,
          active_goal: demoGoal,
        }}
        onSave={handleSaveDemoProfile}
      />
    </div>
  );
}
