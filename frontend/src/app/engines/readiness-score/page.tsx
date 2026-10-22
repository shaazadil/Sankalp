"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { SankalpScoreMeter } from "@/components/SankalpScoreMeter";

export default function ReadinessScorePage() {
  return (
    <DashboardShell
      title="Financial Readiness & Sankalp Score"
      subtitle="Comprehensive multi-factor index combining emergency runway resilience, savings rate velocity, and tax efficiency."
      badge="Index Benchmark"
    >
      <SankalpScoreMeter
        runwayMonths={6.2}
        savingsRatePercent={26}
        taxEfficiency={92}
      />
    </DashboardShell>
  );
}
