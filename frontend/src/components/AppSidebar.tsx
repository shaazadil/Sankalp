"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Sliders,
  Layers,
  Building2,
  Sparkles,
  Bookmark,
  User,
  LogOut,
  ChevronRight,
  Zap,
  Menu,
  X,
  PlayCircle,
  Swords,
  Scale,
  Flame,
  Award,
  Users,
} from "lucide-react";

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

  const isHome = pathname === "/";
  const isDashboard = pathname === "/dashboard";
  const isChat = pathname === "/chat";

  const formatLakhs = (val: number) => {
    return (val / 100000).toFixed(1) + " LPA";
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Header & Brand */}
      <div className="space-y-6">
        {/* Brand identity */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 p-[1px] shadow-lg shadow-emerald-500/10">
              <div className="h-full w-full rounded-[11px] bg-[#070b13] flex items-center justify-center transition-all group-hover:bg-[#070b13]/80">
                <span className="font-heading font-black text-lg text-emerald-400 tracking-wider">
                  सं
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  SANKALP
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Financial Life Co-Pilot
              </p>
            </div>
          </Link>

          {/* Close for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Profile Snapshot Card */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/[0.08] shadow-inner space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Active Profile
            </span>
            {onOpenProfile && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenProfile();
                }}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <span>Edit</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm font-bold text-slate-100 tabular-nums">
                ₹{formatLakhs(currentCtc)}
              </p>
              <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                {currentCity} ➔ {targetCity}
              </p>
            </div>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {/* Main Views */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Workspace
            </span>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isDashboard
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Personal Dashboard</span>
            </Link>

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isHome
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Product Tour &amp; Math</span>
            </Link>
          </div>

          {/* Interactive Tools */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Interactive Engines (13)
            </span>
            <a
              href="#pots-studio"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>5-Pots Budget Studio</span>
              </div>
              <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                Core
              </span>
            </a>

            <a
              href="#battle-royale"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                <span>Offer Battle Royale</span>
              </div>
              <span className="text-[9px] bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                1
              </span>
            </a>

            <a
              href="#tax-tug-of-war"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-3.5 h-3.5 text-teal-400" />
                <span>Tax Tug-of-War</span>
              </div>
              <span className="text-[9px] bg-teal-500/15 text-teal-300 px-1.5 py-0.5 rounded font-mono">
                2
              </span>
            </a>

            <a
              href="#family-calibrator"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Family Remittance</span>
              </div>
              <span className="text-[9px] bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                3
              </span>
            </a>

            <a
              href="#lifestyle-creep"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Lifestyle Creep FIRE</span>
              </div>
              <span className="text-[9px] bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                4
              </span>
            </a>

            <a
              href="#commute-elasticity"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Commute Elasticity</span>
              </div>
              <span className="text-[9px] bg-blue-500/15 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                5
              </span>
            </a>

            <a
              href="#impulse-cooling"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Impulse Cooling 72h</span>
              </div>
              <span className="text-[9px] bg-purple-500/15 text-purple-300 px-1.5 py-0.5 rounded font-mono">
                6
              </span>
            </a>

            <a
              href="#sabbatical-runway"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sabbatical Runway</span>
              </div>
              <span className="text-[9px] bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                7
              </span>
            </a>

            <a
              href="#reverse-milestone"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Reverse Milestone</span>
              </div>
              <span className="text-[9px] bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                8
              </span>
            </a>

            <a
              href="#chaos-simulator"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Chaos Stress-Tester</span>
              </div>
              <span className="text-[9px] bg-rose-500/15 text-rose-300 px-1.5 py-0.5 rounded font-mono">
                9
              </span>
            </a>

            <a
              href="#cohort-radar"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cohort Peer Radar</span>
              </div>
              <span className="text-[9px] bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                10
              </span>
            </a>

            <a
              href="#account-aggregator"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                <span>AA Real-Bank Sync</span>
              </div>
              <span className="text-[9px] bg-teal-500/15 text-teal-300 px-1.5 py-0.5 rounded font-mono">
                B1
              </span>
            </a>

            <a
              href="#broker-execution"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Tap Broker Orders</span>
              </div>
              <span className="text-[9px] bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                B2
              </span>
            </a>

            <a
              href="#readiness-score"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Readiness Score &amp; Perks</span>
              </div>
              <span className="text-[9px] bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                B3
              </span>
            </a>
          </div>

          {/* Intelligence & Actions */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Intelligence &amp; Plans
            </span>

            {/* AI Co-Pilot trigger */}
            <Link
              href="/chat"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                isChat
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Financial Co-Pilot</span>
              </div>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold uppercase">
                Chat
              </span>
            </Link>

            {/* Saved Plans */}
            {onOpenPlans && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenPlans();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Saved Life Plans</span>
                </div>
              </button>
            )}

            {/* Visual Demo Tour */}
            {onOpenDemo && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenDemo();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-4 h-4 text-indigo-400" />
                  <span>Visual Demonstration</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom User Session & System Health */}
      <div className="pt-6 border-t border-white/[0.08] space-y-3">
        {/* User Card */}
        {user ? (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase">
                {user.full_name ? user.full_name[0] : user.email[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user.full_name || user.email.split("@")[0]}
                </p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenAuth();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In with OTP</span>
          </button>
        )}

        {/* Engine status indicator */}
        <div className="px-2 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>FastAPI Math Core</span>
          </div>
          <span className="font-mono text-slate-600">Deterministic</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navigation Bar with Toggle */}
      <div className="lg:hidden sticky top-0 z-40 w-full backdrop-blur-xl bg-[#080c14]/90 border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-heading font-black text-sm">
            सं
          </div>
          <span className="font-heading font-extrabold text-base tracking-tight text-white">
            SANKALP
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={onOpenProfile}
              className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
            >
              {user.full_name ? user.full_name.split(" ")[0] : "Profile"}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-[11px] font-semibold text-white bg-emerald-600 px-3 py-1 rounded-lg"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-white/5 border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#090d16] border-r border-white/[0.08] p-5 h-full z-10 flex flex-col shadow-2xl">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Sticky Fixed Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 bg-[#090d16] border-r border-white/[0.08] p-5 flex-col flex-shrink-0 z-30">
        {navContent}
      </aside>
    </>
  );
};
