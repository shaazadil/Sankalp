"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { FamilyRemittanceCalibrator } from "@/components/FamilyRemittanceCalibrator";

export default function FamilyRemittancePage() {
  return (
    <DashboardShell
      title="Family Remittance Guilt-Free Calibrator"
      subtitle="Balance filial support to parents with your retirement compounding—protecting your emergency buffer against medical shocks."
      badge="Filial Care Engine"
    >
      <FamilyRemittanceCalibrator monthlyIncome={75000} />
    </DashboardShell>
  );
}
