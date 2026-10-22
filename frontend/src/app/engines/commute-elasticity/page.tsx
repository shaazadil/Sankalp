"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { CommuteRentElasticity } from "@/components/CommuteRentElasticity";

export default function CommuteElasticityPage() {
  return (
    <DashboardShell
      title="Commute vs. Rent Elasticity Sandbox"
      subtitle="Living 15km away looks cheaper on 99acres until you factor in cab surges, city traffic, and 300+ hours lost per year."
      badge="Urban Mobility"
    >
      <CommuteRentElasticity />
    </DashboardShell>
  );
}
