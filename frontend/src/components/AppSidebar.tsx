"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { checkBackendHealth } from "@/lib/api";

interface AppSidebarProps {
  user: { email: string; full_name?: string } | null;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  onOpenPlans?: () => void;
  onOpenDemo?: () => void;
  onOpenChat?: () => void;
  onLogout: () => void;
  currentCtc?: number;
  currentCity?: string;
  targetCity?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenPlans,
  onOpenDemo,
  onOpenChat,
  onLogout,
  currentCtc = 900000,
  currentCity = "Kolkata",
  targetCity = "Bengaluru",
}) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"connected" | "unavailable" | "checking">("checking");

  const isHome = pathname === "/";
  const isDashboard = pathname === "/dashboard";
  const isChat = pathname === "/chat";

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus(res.status);
    });
    const interval = setInterval(() => {
      checkBackendHealth().then((res) => {
        setBackendStatus(res.status);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatLakhs = (val: number) => {
    return (val / 100000).toFixed(1) + " LPA";
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Header & Brand */}
      <div className="space-y-4">
        {/* Brand identity - Minimal, Bold & Impactful without decorative AI icons */}
        <div className="flex items-center justify-between px-1 pt-1">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center font-heading font-black text-base tracking-tighter">
              सं
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg tracking-tight text-black group-hover:text-neutral-700 transition-colors">
                  SANKALP
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300">
                  SYSTEM
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-semibold tracking-tight uppercase">
                Financial Architecture
              </p>
            </div>
          </Link>

          {/* Close for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-neutral-500 hover:text-black rounded-lg hover:bg-neutral-100 transition font-mono font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Quick Baseline Card */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 font-mono">
              Baseline Parameters
            </span>
            {onOpenProfile && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenProfile();
                }}
                className="text-[10px] text-black hover:underline font-bold transition cursor-pointer"
              >
                EDIT →
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-base font-extrabold text-black tabular-nums">
                ₹{formatLakhs(currentCtc)}
              </p>
              <p className="text-xs text-neutral-600 font-medium truncate max-w-[130px]">
                {currentCity} → {targetCity}
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-neutral-700 bg-white border border-neutral-300 px-2 py-1 rounded-lg">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4 max-h-[calc(100vh-290px)] overflow-y-auto pr-1">
          {/* Main Views */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 font-mono">
              Overview
            </span>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isDashboard
                  ? "bg-black text-white shadow-sm"
                  : "text-neutral-700 hover:text-black hover:bg-neutral-100"
              }`}
            >
              <span className="font-heading font-extrabold text-sm tracking-tight">Executive Dashboard</span>
              <span className="text-[10px] font-mono opacity-80">HUB</span>
            </Link>

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isHome
                  ? "bg-black text-white shadow-sm"
                  : "text-neutral-700 hover:text-black hover:bg-neutral-100"
              }`}
            >
              <span className="font-heading font-bold text-sm tracking-tight">Product Architecture</span>
              <span className="text-[10px] font-mono opacity-80">DOCS</span>
            </Link>
          </div>

          {/* 5 Core Decision Engines */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 font-mono">
              Core Decision Engines (5)
            </span>

            {[
              { num: "01", label: "Salary & Tax Tug-of-War", badge: "80C/80D", href: "/engines/tax-tug-of-war" },
              { num: "02", label: "City Relocation Radar", badge: "Deposit", href: "/engines/relocation" },
              { num: "03", label: "Budget 5-Pots Studio", badge: "5-Pots", href: "/engines/budget-pots" },
              { num: "04", label: "Education Loans", badge: "80E", href: "/engines/education-loans" },
              { num: "05", label: "Goals & Milestones", badge: "SIP/Gold", href: "/engines/goals-milestones" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  pathname === item.href
                    ? "bg-black text-white font-bold shadow-sm"
                    : "text-neutral-700 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold opacity-60">{item.num}</span>
                  <span className="font-semibold text-xs tracking-tight">{item.label}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  pathname === item.href ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"
                }`}>
                  {item.badge}
                </span>
              </Link>
            ))}
          </div>

          {/* Specialized Intelligence Engines */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 font-mono">
              Advanced Modules (12)
            </span>

            {[
              { num: "06", label: "Offer Battle Royale", badge: "CTC", href: "/engines/offer-battle" },
              { num: "07", label: "Family Remittance", badge: "Shield", href: "/engines/family-remittance" },
              { num: "08", label: "Lifestyle Creep FIRE", badge: "Appraisal", href: "/engines/lifestyle-creep" },
              { num: "09", label: "Commute Elasticity", badge: "Traffic", href: "/engines/commute-elasticity" },
              { num: "10", label: "Impulse Buy 72h", badge: "Cooling", href: "/engines/impulse-cooling" },
              { num: "11", label: "Sabbatical Runway", badge: "Break", href: "/engines/sabbatical-runway" },
              { num: "12", label: "Reverse Milestone", badge: "Sacrifice", href: "/engines/reverse-milestone" },
              { num: "13", label: "Chaos Stress-Tester", badge: "Blast", href: "/engines/chaos-simulator" },
              { num: "14", label: "Tech Cohort Radar", badge: "Cohort", href: "/engines/cohort-radar" },
              { num: "15", label: "AA Bank Sync", badge: "Live AA", href: "/execution/account-aggregator" },
              { num: "16", label: "1-Tap Broker Orders", badge: "Orders", href: "/execution/broker-orders" },
              { num: "17", label: "Readiness Score", badge: "FICO", href: "/engines/readiness-score" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  pathname === item.href
                    ? "bg-black text-white font-bold shadow-sm"
                    : "text-neutral-700 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold opacity-60">{item.num}</span>
                  <span className="font-semibold text-xs tracking-tight">{item.label}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  pathname === item.href ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"
                }`}>
                  {item.badge}
                </span>
              </Link>
            ))}
          </div>

          {/* Intelligence & Plans */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 font-mono">
              Tools &amp; Vault
            </span>

            <Link
              href="/chat"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isChat
                  ? "bg-black text-white"
                  : "text-neutral-800 hover:text-black hover:bg-neutral-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold opacity-60">AI</span>
                <span className="font-semibold text-xs tracking-tight">AI Advisor Chat</span>
              </div>
              <span className="text-[9px] bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded font-bold font-mono">
                CO-PILOT
              </span>
            </Link>

            {onOpenPlans && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenPlans();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold opacity-60">PL</span>
                  <span className="font-semibold text-xs tracking-tight">Saved Plans Vault</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">OPEN →</span>
              </button>
            )}

            {onOpenDemo && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenDemo();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold opacity-60">DM</span>
                  <span className="font-semibold text-xs tracking-tight">Interactive Tour</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">PLAY →</span>
              </button>
            )}

            {onOpenProfile && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold opacity-60">ST</span>
                  <span className="font-semibold text-xs tracking-tight">Settings &amp; Baseline</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">CONFIG →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom User Session */}
      <div className="pt-3 border-t border-neutral-200 space-y-2">
        {user ? (
          <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs uppercase font-mono">
                {user.full_name ? user.full_name[0] : user.email[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-black truncate">
                  {user.full_name || user.email.split("@")[0]}
                </p>
                <p className="text-[10px] text-neutral-500 truncate max-w-[120px] font-mono">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs font-mono font-bold text-neutral-500 hover:text-black px-1.5 py-0.5 rounded transition cursor-pointer"
            >
              EXIT
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenAuth();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-black text-white hover:bg-neutral-800 font-extrabold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer font-sans"
          >
            <span>SIGN IN WITH EMAIL</span>
            <span className="font-mono">→</span>
          </button>
        )}

        {/* Real Backend Status */}
        <div className="px-2 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendStatus === "connected"
                  ? "bg-black"
                  : backendStatus === "checking"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span className="font-bold text-neutral-700">
              {backendStatus === "connected" ? "FASTAPI CONNECTED" : "OFFLINE"}
            </span>
          </div>
          <span className="text-[9px] text-neutral-400 font-bold">PY 3.12</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 py-3 flex items-center justify-between no-print">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-black text-white flex items-center justify-center font-heading font-black text-xs">
            सं
          </div>
          <span className="font-heading font-black text-base tracking-tight text-black">
            SANKALP
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={onOpenProfile}
              className="text-[11px] font-bold text-black bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-300 font-mono"
            >
              {user.full_name ? user.full_name.split(" ")[0] : "Profile"}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-[11px] font-bold text-white bg-black px-3 py-1 rounded-lg"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-black bg-neutral-100 border border-neutral-300 font-mono font-bold text-xs cursor-pointer"
          >
            MENU
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex no-print">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-72 max-w-[85vw] bg-white border-r border-neutral-200 p-5 h-full z-10 flex flex-col shadow-2xl"
            >
              {navContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 bg-white border-r border-neutral-200 p-4 flex-col flex-shrink-0 z-30 no-print">
        {navContent}
      </aside>
    </>
  );
};
