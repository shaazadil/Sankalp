"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, User, Play, LogOut, CheckCircle2, LayoutDashboard, MessageSquare } from "lucide-react";

interface NavbarProps {
  user: { email: string; full_name?: string } | null;
  onOpenAuth: () => void;
  onOpenDemo: () => void;
  onOpenPlans: () => void;
  onLogout: () => void;
  onToggleChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenDemo,
  onOpenPlans,
  onLogout,
  onToggleChat,
}) => {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Nav Tabs */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="font-bold text-lg tracking-wider">सं</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
                  Sankalp
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  India AI
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
                Life Milestone Financial Co-Pilot
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-semibold">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                !isChatPage
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/chat"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isChatPage
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>AI Co-Pilot</span>
            </Link>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Visual Demo Tour Button */}
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Watch the animated Bangalore relocation walkthrough"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span className="hidden sm:inline">Interactive Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* AI Advisor Link/Toggle */}
          {!isChatPage ? (
            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Ask AI Advisor</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Dashboard</span>
            </Link>
          )}

          {/* User Account / Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPlans}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition cursor-pointer"
              >
                Saved Plans
              </button>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="max-w-[100px] truncate">{user.full_name || user.email.split("@")[0]}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
