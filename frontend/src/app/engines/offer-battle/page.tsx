"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { JobOfferBattleRoyale } from "@/components/JobOfferBattleRoyale";

export default function OfferBattlePage() {
  return (
    <DashboardShell
      title="The Job Offer Battle Royale"
      subtitle="Stop falling for headline CTC. Compare real take-home cash, rent deductions, ESOP probability, and 3-year net worth."
      badge="Decision Arena"
    >
      <JobOfferBattleRoyale />
    </DashboardShell>
  );
}
