"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  User,
  LogOut,
  CheckCircle2,
  LayoutDashboard,
  Home,
  Menu,
  X,
  Mail,
  Sliders,
} from "lucide-react";

interface NavbarProps {
  user: { email: string; full_name?: string } | null;
  onOpenAuth: () => void;
  onOpenPlans?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenPlans,
  onLogout,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const isDashboard = pathname === "/dashboard";
  const isChat = pathname === "/chat";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <span className="font-heading font-black text-lg tracking-wider">सं</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
                  Sankalp
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Zero-Based
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
                Life Milestone Financial Co-Pilot
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-semibold">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                isHome
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Overview</span>
            </Link>

            {/* Only show direct Dashboard tab if user is signed in */}
            {user ? (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  isDashboard
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>My Dashboard</span>
              </Link>
            ) : (
              <a
                href="/#live-simulator"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Live Sandbox</span>
              </a>
            )}

            <Link
              href="/chat"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                isChat
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>AI Advisor</span>
            </Link>
          </nav>
        </div>

        {/* Clean, Uncrowded Action Control */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {onOpenPlans && (
                <button
                  onClick={onOpenPlans}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
                >
                  Saved Plans
                </button>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="max-w-[120px] truncate">
                  {user.full_name || user.email.split("@")[0]}
                </span>
              </Link>

              <button
                onClick={onLogout}
                className="p-2 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Exactly ONE Clean, Bold Sign In Button */
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Sign In with Email</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Home className="w-4 h-4 text-emerald-600" />
            <span>Overview</span>
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>My Dashboard</span>
            </Link>
          ) : (
            <a
              href="/#live-simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Live Sandbox</span>
            </a>
          )}
          <Link
            href="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Milestone Advisor</span>
          </Link>
        </div>
      )}
    </header>
  );
};
