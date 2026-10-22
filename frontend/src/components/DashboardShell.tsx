"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthModal } from "@/components/AuthModal";
import { FinancialProfileModal, FinancialProfileFormValues } from "@/components/FinancialProfileModal";
import { SavedPlansModal } from "@/components/SavedPlansModal";
import { VisualDemonstration } from "@/components/VisualDemonstration";
import { AiChatDrawer } from "@/components/AiChatDrawer";
import { getFinancialProfile, updateFinancialProfile, getMyPlans } from "@/lib/api";

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  title,
  subtitle,
  badge = "Decision Engine",
  children,
}) => {
  const pathname = usePathname();

  // User Session State
  const [user, setUser] = useState<{ email: string; token: string; full_name?: string } | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // User Profile Baseline
  const [annualCtc, setAnnualCtc] = useState<number>(900000);
  const [currentCity, setCurrentCity] = useState<string>("Kolkata");
  const [targetCity, setTargetCity] = useState<string>("Bengaluru");
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("sankalp_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        getMyPlans(parsed.token).then(setSavedPlans).catch(() => {});
        getFinancialProfile(parsed.token)
          .then((profile) => {
            if (profile) {
              setAnnualCtc(profile.annual_ctc);
              setCurrentCity(profile.current_city);
              setTargetCity(profile.target_city);
            }
          })
          .catch(() => {});
      } catch (e) {
        localStorage.removeItem("sankalp_user");
      }
    }
    setIsAuthChecked(true);
  }, []);

  const handleLoginSuccess = (userData: { email: string; token: string; full_name?: string }) => {
    setUser(userData);
    localStorage.setItem("sankalp_user", JSON.stringify(userData));
    getFinancialProfile(userData.token)
      .then((profile) => {
        if (profile) {
          setAnnualCtc(profile.annual_ctc);
          setCurrentCity(profile.current_city);
          setTargetCity(profile.target_city);
        }
      })
      .catch(() => {});
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("sankalp_user");
  };

  const handleSaveProfile = async (values: FinancialProfileFormValues) => {
    setAnnualCtc(values.annual_ctc);
    setCurrentCity(values.current_city);
    setTargetCity(values.target_city);
    if (user?.token) {
      updateFinancialProfile(values, user.token).catch(() => {});
    }
  };

  // Auth gate if user is not logged in
  if (isAuthChecked && !user) {
    return (
      <div className="flex min-h-screen bg-[#F4F5F7] text-[#09090B] font-sans">
        <AppSidebar
          user={null}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenPlans={() => setIsPlansOpen(true)}
          onOpenDemo={() => setIsDemoOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
          onLogout={handleLogout}
          currentCtc={annualCtc}
          currentCity={currentCity}
          targetCity={targetCity}
        />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full bg-white border border-neutral-300 rounded-3xl p-8 shadow-sm text-center space-y-6"
          >
            <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-300 text-black flex items-center justify-center mx-auto font-mono font-black text-sm">
              LOCK
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
                Private Workspace
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-heading">
                Unlock {title}
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Enter your email address to receive an instant access code and model your finances in private.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-2.5 text-xs sm:text-sm text-neutral-700 font-medium">
              <div className="flex items-center gap-2">
                <span className="font-mono text-black font-bold">—</span>
                <span>Zero bank logins or credentials required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-black font-bold">—</span>
                <span>Deterministic Indian tax &amp; salary algorithms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-black font-bold">—</span>
                <span>Save multiple life milestone blueprints</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-4 rounded-full bg-black text-white hover:bg-neutral-800 font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>SIGN IN WITH EMAIL</span>
                <span className="font-mono">→</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black transition"
              >
                <span>Explore Overview &amp; Public Demo →</span>
              </Link>
            </div>
          </motion.div>
        </main>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-[#09090B] font-sans selection:bg-neutral-900 selection:text-white">
      {/* Persistent Left Sidebar */}
      <AppSidebar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPlans={() => setIsPlansOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onLogout={handleLogout}
        currentCtc={annualCtc}
        currentCity={currentCity}
        targetCity={targetCity}
      />

      {/* Main Workspace - fluid window scrolling with zero interruptions */}
      <main className="flex-1 min-w-0 pb-20">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-white/95 border-b border-neutral-200 px-4 sm:px-8 py-4 shadow-xs">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-xs font-mono font-bold text-neutral-600 hover:text-black transition-colors"
                >
                  <span>← DASHBOARD</span>
                </Link>
                <span className="text-neutral-300">/</span>
                <span className="px-3 py-1 rounded-full bg-neutral-100 text-black border border-neutral-300 text-xs font-mono font-bold uppercase tracking-wider">
                  {badge}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black font-heading">
                {title}
              </h1>
              {subtitle && <p className="text-sm sm:text-base text-neutral-600 font-medium">{subtitle}</p>}
            </div>

            {/* Top Right Controls - rounded-full pill buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-bold transition cursor-pointer"
              >
                <span>AI ADVISOR</span>
                <span className="font-mono text-[10px]">●</span>
              </button>

              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-extrabold transition shadow-sm cursor-pointer"
              >
                <span>ADJUST BASELINE</span>
                <span className="font-mono">→</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dedicated Page Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Shared Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <FinancialProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={handleSaveProfile}
        initialValues={{
          annual_ctc: annualCtc,
          tax_regime: "new",
          current_rent: 16000,
          family_support: 10000,
          existing_emis: 0,
          current_savings: 150000,
          current_monthly_sip: 12000,
          current_city: currentCity,
          target_city: targetCity,
          active_goal: "relocation",
        }}
      />

      <SavedPlansModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
        plans={savedPlans}
        onLoadPlan={() => {}}
        onDeletePlan={(planId) => {
          setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
        }}
      />

      <VisualDemonstration
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
