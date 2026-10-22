"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { AnonymousCohortRadar } from "@/components/AnonymousCohortRadar";

export default function CohortRadarPage() {
  return (
    <DashboardShell
      title="Anonymous Indian Tech Cohort Radar"
      subtitle="Benchmark your savings discipline, rent ratio, and runway against verified software engineers in your salary bracket."
      badge="Peer Intelligence"
    >
      <AnonymousCohortRadar />
    </DashboardShell>
  );
}
