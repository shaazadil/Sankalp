"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { EmergencyChaosSimulator } from "@/components/EmergencyChaosSimulator";

export default function ChaosSimulatorPage() {
  return (
    <DashboardShell
      title="Emergency Domino Chaos Simulator"
      subtitle="Trigger life shocks (layoffs, medical emergencies, deposit disputes) to test whether your 5 pots absorb the blast or if compounding SIPs get liquidated."
      badge="Stress-Testing"
    >
      <EmergencyChaosSimulator />
    </DashboardShell>
  );
}
