"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendOtp, verifyOtp } from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; token: string; full_name?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [emailDelivered, setEmailDelivered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  if (!isOpen) return null;

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || isLoading) return;
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await sendOtp(email.trim().toLowerCase());
      setSuccessNotice(res.message);
      setEmailDelivered(!!res.email_sent);
      if (res.dev_code) {
        setGeneratedCode(res.dev_code);
        setCode(res.dev_code);
      }
      setStep("code");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send verification code. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || isLoading) return;
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await verifyOtp(email.trim().toLowerCase(), code.trim(), fullName.trim());
      onLoginSuccess({
        email: res.email,
        token: res.access_token,
        full_name: res.full_name,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-6 text-black">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white font-heading font-black text-sm">
              सं
            </div>
            <div>
              <h3 className="font-black text-base text-black font-heading uppercase">
                AUTHENTICATE ACCOUNT
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                PASSWORDLESS EMAIL OTP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-mono font-bold text-neutral-500 hover:text-black px-2 py-1 rounded bg-neutral-100 cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-xs font-mono text-red-800">
            {errorMsg}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                YOUR NAME (OPTIONAL)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3 rounded-lg bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white disabled:text-neutral-500 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              {isLoading ? "SENDING CODE..." : "SEND 6-DIGIT CODE →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4 font-mono">
            <div className="p-3.5 rounded-lg bg-neutral-100 border border-neutral-300 text-xs text-neutral-800">
              <p className="font-bold text-black uppercase">{successNotice || `CODE SENT TO ${email}`}</p>
              {emailDelivered ? (
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Check your inbox (or Spam/Promotions folder).
                </p>
              ) : (
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Code generated. (Configure SMTP_USER in backend/.env for production email delivery)
                </p>
              )}
            </div>

            {generatedCode && (
              <div className="p-4 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-center">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                  DEV VERIFICATION CODE
                </span>
                <span className="text-3xl font-black tracking-widest text-black font-mono">
                  {generatedCode}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase">
                ENTER 6-DIGIT CODE
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9FA] border border-neutral-300 text-lg font-black tracking-widest text-black text-center focus:outline-none focus:border-black transition font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length < 6}
              className="w-full py-3 rounded-lg bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white disabled:text-neutral-500 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              {isLoading ? "VERIFYING..." : "VERIFY &amp; OPEN DASHBOARD →"}
            </button>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-neutral-500 hover:text-black transition cursor-pointer"
              >
                [CHANGE EMAIL]
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSendCode()}
                className="font-bold text-black hover:underline transition cursor-pointer"
              >
                [RESEND CODE]
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
