"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { TaxTugOfWar } from "@/components/TaxTugOfWar";

export default function TaxTugOfWarPage() {
  const [annualCtc, setAnnualCtc] = useState(1200000);

  useEffect(() => {
    const saved = localStorage.getItem("sankalp_user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        // default or fetched CTC
      } catch (e) {}
    }
  }, []);

  return (
    <DashboardShell
      title="Salary & Tax Regime Tug-of-War"
      subtitle="Compare Old Regime (80C, 80D, HRA) vs New Simplified Regime in real-time."
      badge="Core Engine 1"
    >
      <TaxTugOfWar annualCtc={annualCtc} />
    </DashboardShell>
  );
}
