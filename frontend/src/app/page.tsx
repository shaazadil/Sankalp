"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthModal } from "@/components/AuthModal";
import { VisualDemonstration } from "@/components/VisualDemonstration";
import {
  FinancialProfileModal,
  FinancialProfileFormValues,
} from "@/components/FinancialProfileModal";

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
    <div className="flex min-h-screen bg-[#F4F5F7] text-[#09090B] font-sans selection:bg-neutral-900 selection:text-white">
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

      {/* Main Workspace with uninterrupted fluid window scrolling */}
      <main className="flex-1 min-w-0">
        {/* 2. Hero Section - Minimal High-Contrast Design */}
        <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28 border-b border-neutral-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Minimal Monospace Tag */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-mono font-bold tracking-wider uppercase"
            >
              <span>[ZERO-BASED CASHFLOW ARCHITECTURE // INDIA-FIRST]</span>
            </motion.div>

            {/* Master Headline in Bold, Large Aesthetic */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black leading-[1.05]"
            >
              Master your wealth. <br />
              <span className="text-neutral-500">
                Give every single rupee a purpose.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-600 font-medium leading-relaxed"
            >
              Traditional budgets look backward and create guilt. Sankalp orchestrates proactive{" "}
              <strong className="text-black font-black">zero-based cashflow planning</strong> for Indian
              professionals—calibrating real take-home CTC, Bangalore rental deposits, family remittance, and compounding wealth.
            </motion.p>

            {/* Action Buttons - Rounded Full Pill Design */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-9 py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-sm tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition"
                >
                  <span>LAUNCH DASHBOARD →</span>
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full sm:w-auto px-9 py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-sm tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>LAUNCH DASHBOARD →</span>
                </button>
              )}

              <a
                href="#live-simulator"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white border-2 border-neutral-300 hover:border-black text-black font-mono font-bold text-sm tracking-wider uppercase transition flex items-center justify-center gap-2"
              >
                <span>OPEN LIVE SANDBOX ↓</span>
              </a>
            </motion.div>

            {/* Trust Highlights - Pure Clean Rounded-Full Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold text-neutral-700"
            >
              <span className="px-4 py-2 rounded-full bg-neutral-100 border border-neutral-300">
                ● ZERO BANK PASSWORDS
              </span>
              <span className="px-4 py-2 rounded-full bg-neutral-100 border border-neutral-300">
                ● 100% PRIVATE &amp; LOCAL-FIRST
              </span>
              <span className="px-4 py-2 rounded-full bg-neutral-100 border border-neutral-300">
                ● INSTANT EMAIL CODE ACCESS
              </span>
              <span className="px-4 py-2 rounded-full bg-neutral-100 border border-neutral-300">
                ● DETERMINISTIC INDIAN TAX MATH
              </span>
            </motion.div>

            {/* Hero Visual Image Asset */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="pt-8 max-w-4xl mx-auto"
            >
              <div className="relative rounded-3xl overflow-hidden border border-neutral-300 shadow-sm bg-neutral-100 group">
                <img
                  src="/images/smart_pots_visual.jpg"
                  alt="Smart Zero-Based Budgeting 5 Pots Architecture"
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="p-5 bg-white border-t border-neutral-200 text-left flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                      ARCHITECTURAL SCHEMA
                    </span>
                    <p className="text-black font-heading font-black text-base sm:text-lg">
                      The 5 Smart Pots: Survival, Obligations, Family, Guilt-Free UPI, and Wealth Compounding.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-neutral-100 text-black border border-neutral-300">
                    5-POT PROTOCOL
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. The 4 Simple Pillars of Sankalp */}
        <section className="py-20 border-b border-neutral-200 bg-[#F4F5F7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
                CORE OPERATING METHOD
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-black tracking-tight">
                The 4 Pillars of Sankalp
              </h2>
              <p className="text-base text-neutral-600">
                Money is behavior, not math. These 4 habits eliminate financial stress with deterministic clarity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1 */}
              <div className="p-7 rounded-2xl bg-white border border-neutral-300 space-y-4 transition-all hover:border-black shadow-xs">
                <div className="w-11 h-11 rounded-full bg-neutral-100 text-black border border-neutral-300 font-mono font-black text-sm flex items-center justify-center">
                  01
                </div>
                <h3 className="font-heading font-black text-lg text-black">
                  Give Every Rupee a Job
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  The moment your salary hits your account, assign every single rupee to an intentional pot—rent, food, parents, EMIs, or guilt-free fun. No money is left unaccounted.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-7 rounded-2xl bg-white border border-neutral-300 space-y-4 transition-all hover:border-black shadow-xs">
                <div className="w-11 h-11 rounded-full bg-neutral-100 text-black border border-neutral-300 font-mono font-black text-sm flex items-center justify-center">
                  02
                </div>
                <h3 className="font-heading font-black text-lg text-black">
                  Embrace True Expenses
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  Break large upcoming shocks—like a 6–10 month Bengaluru landlord deposit, annual term insurance, or Diwali trips—into predictable, amortized monthly bites.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-7 rounded-2xl bg-white border border-neutral-300 space-y-4 transition-all hover:border-black shadow-xs">
                <div className="w-11 h-11 rounded-full bg-neutral-100 text-black border border-neutral-300 font-mono font-black text-sm flex items-center justify-center">
                  03
                </div>
                <h3 className="font-heading font-black text-lg text-black">
                  Roll With The Punches
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  Life happens. Overspent dining out or incurred a doctor fee? Shift liquidity between pots in one tap. No guilt. No broken budgets.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-7 rounded-2xl bg-white border border-neutral-300 space-y-4 transition-all hover:border-black shadow-xs">
                <div className="w-11 h-11 rounded-full bg-neutral-100 text-black border border-neutral-300 font-mono font-black text-sm flex items-center justify-center">
                  04
                </div>
                <h3 className="font-heading font-black text-lg text-black">
                  Age Your Money
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  Expand your liquid runway until you are comfortably living on income earned last month, permanently ending the paycheck-to-paycheck loop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Live Interactive Budget Simulator Sandbox */}
        <section id="live-simulator" className="py-20 border-b border-neutral-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
                  [LIVE SANDBOX // 0.00 ZERO-BASED]
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-black tracking-tight mt-1">
                  Experience Zero-Based Budgeting
                </h2>
                <p className="text-sm sm:text-base text-neutral-600 mt-1 font-medium">
                  Adjust the sliders below to see how every rupee of your Indian salary is allocated with surgical precision.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  CUSTOM INPUTS →
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-neutral-600">REGIME:</span>
                  <div className="bg-neutral-100 border border-neutral-300 p-1 rounded-full flex items-center text-xs font-mono font-bold">
                    <button
                      onClick={() => setDemoRegime("new")}
                      className={`px-3.5 py-1 rounded-full transition cursor-pointer ${
                        demoRegime === "new" ? "bg-black text-white font-black" : "text-neutral-600 hover:text-black"
                      }`}
                    >
                      NEW
                    </button>
                    <button
                      onClick={() => setDemoRegime("old")}
                      className={`px-3.5 py-1 rounded-full transition cursor-pointer ${
                        demoRegime === "old" ? "bg-black text-white font-black" : "text-neutral-600 hover:text-black"
                      }`}
                    >
                      OLD (HRA)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Card */}
            <div className="bg-[#F8F9FA] rounded-3xl border border-neutral-300 overflow-hidden p-6 sm:p-8 space-y-8">
              {/* Top Stat Bar - Bold Black Tabular Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-neutral-200">
                <div>
                  <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                    ANNUAL CTC
                  </span>
                  <span className="text-2xl sm:text-4xl font-black text-black font-mono tabular-nums">
                    ₹{(demoCtc / 100000).toFixed(1)} LPA
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                    MONTHLY IN-HAND
                  </span>
                  <span className="text-2xl sm:text-4xl font-black text-black font-mono tabular-nums">
                    ₹{monthlyInHand.toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                    RUNWAY BUFFER
                  </span>
                  <span className="text-2xl sm:text-4xl font-black text-black font-mono">
                    {emergencyMonths} MO
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                    ZERO BALANCE
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-900 px-3 py-1.5 rounded-full bg-emerald-100 inline-block mt-1 border border-emerald-300">
                    ✓ 100% ASSIGNED
                  </span>
                </div>
              </div>

              {/* Sliders Area */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3 p-5 rounded-2xl bg-white border border-neutral-200">
                  <div className="flex justify-between text-sm font-bold font-mono">
                    <span className="text-black uppercase">Annual CTC</span>
                    <span className="text-black font-black text-base">₹{(demoCtc / 100000).toFixed(1)} L</span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={3500000}
                    step={50000}
                    value={demoCtc}
                    onChange={(e) => setDemoCtc(Number(e.target.value))}
                    className="w-full cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 font-mono">
                    <span>₹5L</span>
                    <span>₹20L</span>
                    <span>₹35L</span>
                  </div>
                </div>

                <div className="space-y-3 p-5 rounded-2xl bg-white border border-neutral-200">
                  <div className="flex justify-between text-sm font-bold font-mono">
                    <span className="text-black uppercase">Monthly Rent</span>
                    <span className="text-black font-black text-base">₹{demoRent.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    min={8000}
                    max={50000}
                    step={1000}
                    value={demoRent}
                    onChange={(e) => setDemoRent(Number(e.target.value))}
                    className="w-full cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 font-mono">
                    <span>₹8K</span>
                    <span>₹25K</span>
                    <span>₹50K</span>
                  </div>
                </div>

                <div className="space-y-3 p-5 rounded-2xl bg-white border border-neutral-200">
                  <div className="flex justify-between text-sm font-bold font-mono">
                    <span className="text-black uppercase">Family Remittance</span>
                    <span className="text-black font-black text-base">₹{demoFamily.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30000}
                    step={1000}
                    value={demoFamily}
                    onChange={(e) => setDemoFamily(Number(e.target.value))}
                    className="w-full cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 font-mono">
                    <span>₹0</span>
                    <span>₹15K</span>
                    <span>₹30K</span>
                  </div>
                </div>
              </div>

              {/* The 5 Smart Pots Visualization */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                  5-POT DISTRIBUTION THIS MONTH:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-neutral-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-black uppercase">
                        01 // SURVIVAL
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        {Math.round((survivalPot / monthlyInHand) * 100)}%
                      </span>
                    </div>
                    <div className="text-2xl font-black text-black font-mono">
                      ₹{survivalPot.toLocaleString("en-IN")}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Rent, electricity, wifi &amp; groceries
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-neutral-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-black uppercase">
                        02 // OBLIGATIONS
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        {obligationsPot > 0 ? Math.round((obligationsPot / monthlyInHand) * 100) : 0}%
                      </span>
                    </div>
                    <div className="text-2xl font-black text-black font-mono">
                      ₹{obligationsPot.toLocaleString("en-IN")}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Active EMIs &amp; loan payments
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-neutral-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-black uppercase">
                        03 // FAMILY
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        {Math.round((familyPot / monthlyInHand) * 100)}%
                      </span>
                    </div>
                    <div className="text-2xl font-black text-black font-mono">
                      ₹{familyPot.toLocaleString("en-IN")}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Parents support &amp; home transfers
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-neutral-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-black uppercase">
                        04 // GUILT-FREE
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        {Math.round((guiltFreeUpiPot / monthlyInHand) * 100)}%
                      </span>
                    </div>
                    <div className="text-2xl font-black text-black font-mono">
                      ₹{guiltFreeUpiPot.toLocaleString("en-IN")}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Dining, Swiggy, shopping &amp; leisure
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border-2 border-black space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-black uppercase">
                        05 // WEALTH &amp; SIP
                      </span>
                      <span className="text-xs font-mono font-black text-black">
                        {Math.round((growthPot / monthlyInHand) * 100)}%
                      </span>
                    </div>
                    <div className="text-2xl font-black text-black font-mono">
                      ₹{growthPot.toLocaleString("en-IN")}
                    </div>
                    <p className="text-xs text-neutral-600">
                      Emergency fund, Index SIPs &amp; Gold
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200">
                <div className="text-xs sm:text-sm font-mono text-neutral-600 text-center sm:text-left">
                  Sign in with your email to persist your customized 5-pot allocation and run all 17 financial engines.
                </div>

                {user ? (
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  >
                    <span>OPEN DASHBOARD →</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>SIGN IN TO UNLOCK →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 5. AI Assistant Showcase */}
        <section className="py-20 bg-white border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <span className="px-4 py-1.5 rounded-full bg-neutral-100 text-black text-xs font-mono font-bold uppercase tracking-wider border border-neutral-300">
                [CO-PILOT // 24/7 INTELLIGENCE]
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-black">
                Meet Your AI Financial Co-Pilot
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
                Need guidance on Bangalore rent affordability, Old vs New Tax Regime, or education loan payoff strategies? Ask in natural language. The assistant generates mathematically sound blueprints that you can apply with one click.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Visual Graphic Asset */}
              <div className="relative rounded-3xl overflow-hidden border border-neutral-300 shadow-sm bg-neutral-100 group">
                <img
                  src="/images/ai_advisor_visual.jpg"
                  alt="AI Financial Co-Pilot Interface"
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="p-5 bg-white border-t border-neutral-200">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                    CONTEXT-AWARE VERIFICATION
                  </span>
                  <p className="text-black font-heading font-black text-base">
                    Trained on Indian Tax Sections (80C, 80D, 80E, 24b) and metro rental dynamics.
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-6">
                <div className="space-y-1.5 p-6 rounded-2xl bg-[#F8F9FA] border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    <h4 className="font-heading font-black text-lg text-black">One-Click Plan Execution</h4>
                  </div>
                  <p className="text-sm text-neutral-600 pl-4 font-normal">
                    When the AI crafts a custom budget plan, tap &ldquo;Apply Plan to My Dashboard&rdquo; and your live pots, rent sliders, and tax regime sync immediately.
                  </p>
                </div>

                <div className="space-y-1.5 p-6 rounded-2xl bg-[#F8F9FA] border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    <h4 className="font-heading font-black text-lg text-black">Deterministic Math Engine</h4>
                  </div>
                  <p className="text-sm text-neutral-600 pl-4 font-normal">
                    The assistant pairs LLM reasoning with our verified mathematical engine—preventing hallucinated tax slabs, bogus deductions, or arbitrary formulas.
                  </p>
                </div>

                <div className="space-y-1.5 p-6 rounded-2xl bg-[#F8F9FA] border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    <h4 className="font-heading font-black text-lg text-black">Dedicated Full-Screen Workspace</h4>
                  </div>
                  <p className="text-sm text-neutral-600 pl-4 font-normal">
                    A comprehensive workspace at <code>/chat</code> with milestone prompts, conversation history, exportable summaries, and user profile sync.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition"
                  >
                    <span>OPEN DEDICATED AI ADVISOR →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Comparison Table - No black cards, clean grey column */}
        <section className="py-20 border-b border-neutral-200 bg-[#F4F5F7]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
                METHOD COMPARISON
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-black tracking-tight">
                Spreadsheets Look Backward. Sankalp Looks Forward.
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse rounded-2xl overflow-hidden shadow-xs border border-neutral-300">
                <thead className="bg-neutral-100 text-black font-mono font-black uppercase tracking-wider text-xs border-b border-neutral-300">
                  <tr>
                    <th className="p-4 sm:p-5">FEATURE</th>
                    <th className="p-4 sm:p-5 text-neutral-500">TRADITIONAL SPREADSHEETS</th>
                    <th className="p-4 sm:p-5 bg-neutral-200 text-black font-black border-l border-r border-neutral-300">
                      SANKALP ZERO-BASED METHOD
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white font-medium">
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-black font-mono">Philosophy</td>
                    <td className="p-4 sm:p-5 text-neutral-500">Looking back at past expenses with guilt</td>
                    <td className="p-4 sm:p-5 font-bold text-black bg-neutral-100 border-l border-r border-neutral-300">
                      Proactive zero-based assignment of every rupee
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-black font-mono">Indian Tax Math</td>
                    <td className="p-4 sm:p-5 text-neutral-500">Manual error-prone spreadsheet cells</td>
                    <td className="p-4 sm:p-5 font-bold text-black bg-neutral-100 border-l border-r border-neutral-300">
                      Automatic Old vs New Tax comparison &amp; EPF calibration
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-black font-mono">Metro Rent Shocks</td>
                    <td className="p-4 sm:p-5 text-neutral-500">Ignored until a sudden deposit crisis</td>
                    <td className="p-4 sm:p-5 font-bold text-black bg-neutral-100 border-l border-r border-neutral-300">
                      Calculated deposit shock &amp; amortized recovery plans
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-black font-mono">Family Remittance</td>
                    <td className="p-4 sm:p-5 text-neutral-500">Treated as a generic miscellaneous expense</td>
                    <td className="p-4 sm:p-5 font-bold text-black bg-neutral-100 border-l border-r border-neutral-300">
                      First-class priority pot built directly into emergency runway
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-black font-mono">AI Financial Co-Pilot</td>
                    <td className="p-4 sm:p-5 text-neutral-500">None</td>
                    <td className="p-4 sm:p-5 font-bold text-black bg-neutral-100 border-l border-r border-neutral-300">
                      24/7 dedicated advisor with instant 1-click dashboard apply
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 7. Final Call to Action */}
        <section className="py-20 bg-white text-center border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-black">
              Stop wondering where your salary went. <br />
              <span className="text-neutral-500">Command every rupee with Sankalp.</span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-medium">
              No bank passwords. No spreadsheets. Authenticate with your email in 10 seconds and unlock your personalized private financial life planner.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-9 py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-sm tracking-wider uppercase shadow-md transition"
                >
                  GO TO MY DASHBOARD →
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full sm:w-auto px-9 py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-mono font-bold text-sm tracking-wider uppercase shadow-md transition cursor-pointer"
                >
                  SIGN IN WITH EMAIL (FREE) →
                </button>
              )}

              <Link
                href="/chat"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white border-2 border-neutral-300 hover:border-black text-black font-mono font-bold text-sm tracking-wider uppercase transition"
              >
                TALK TO AI ASSISTANT →
              </Link>
            </div>
          </div>
        </section>

        {/* 8. Clean Minimal Footer */}
        <footer className="py-12 bg-white text-xs sm:text-sm text-neutral-500 font-mono">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-black font-heading font-black text-sm">
                सं
              </div>
              <div>
                <span className="font-heading font-black text-sm text-black">
                  SANKALP
                </span>
                <span className="text-neutral-400 ml-2">
                  // Deterministic Financial Engineering
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-neutral-600">
              <Link href="/dashboard" className="hover:text-black transition">
                Executive Cockpit
              </Link>
              <Link href="/chat" className="hover:text-black transition">
                AI Milestone Chat
              </Link>
              <button
                onClick={() => setIsDemoOpen(true)}
                className="hover:text-black transition cursor-pointer"
              >
                Architecture Tour
              </button>
            </div>

            <div className="text-[11px] text-neutral-500">
              © {new Date().getFullYear()} Sankalp Systems. Zero Bank Credentials. Built for Indian Builders.
            </div>
          </div>
        </footer>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Visual Architectural Tour */}
      <VisualDemonstration
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onApplyPreset={() => {
          setIsDemoOpen(false);
          router.push("/dashboard");
        }}
      />

      {/* Financial Profile Modal */}
      <FinancialProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={handleSaveDemoProfile}
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
      />
    </div>
  );
}
