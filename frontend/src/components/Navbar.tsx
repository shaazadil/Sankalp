"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-neutral-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-9 w-9 rounded-lg bg-black flex items-center justify-center text-white font-heading font-black text-base shadow-sm"
            >
              <span>सं</span>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-tight text-black">
                  SANKALP
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300">
                  SYSTEM
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono tracking-wide hidden sm:block">
                INDIAN CASHFLOW ARCHITECTURE
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links - Pure Typography, No Icons */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs font-bold">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-md transition-all ${
                isHome
                  ? "bg-white text-black shadow-xs font-black border border-neutral-200"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              OVERVIEW
            </Link>

            {user ? (
              <Link
                href="/dashboard"
                className={`px-3.5 py-1.5 rounded-md transition-all ${
                  isDashboard
                    ? "bg-white text-black shadow-xs font-black border border-neutral-200"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                DASHBOARD
              </Link>
            ) : (
              <a
                href="/#live-simulator"
                className="px-3.5 py-1.5 rounded-md text-neutral-600 hover:text-black transition-all"
              >
                LIVE SANDBOX
              </a>
            )}

            <Link
              href="/chat"
              className={`px-3.5 py-1.5 rounded-md transition-all ${
                isChat
                  ? "bg-white text-black shadow-xs font-black border border-neutral-200"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              ADVISOR
            </Link>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {onOpenPlans && (
                <button
                  onClick={onOpenPlans}
                  className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 transition cursor-pointer"
                >
                  [SAVED PLANS]
                </button>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-300 text-xs font-mono font-bold text-black"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                <span className="max-w-[140px] truncate uppercase">
                  {user.full_name || user.email.split("@")[0]}
                </span>
              </Link>

              <button
                onClick={onLogout}
                className="text-xs font-mono font-bold px-2.5 py-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                title="Log out"
              >
                LOGOUT →
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-black hover:bg-neutral-800 text-white shadow-xs transition-all cursor-pointer"
            >
              SIGN IN WITH EMAIL →
            </motion.button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden px-2.5 py-1.5 text-xs font-mono font-bold text-black border border-neutral-300 rounded-lg"
          >
            {mobileMenuOpen ? "[CLOSE]" : "[MENU]"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-bold text-black hover:bg-neutral-100"
          >
            OVERVIEW
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-black hover:bg-neutral-100"
            >
              MY DASHBOARD
            </Link>
          ) : (
            <a
              href="/#live-simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-black hover:bg-neutral-100"
            >
              LIVE SANDBOX
            </a>
          )}
          <Link
            href="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-bold text-black hover:bg-neutral-100"
          >
            AI ADVISOR
          </Link>
        </div>
      )}
    </header>
  );
};
