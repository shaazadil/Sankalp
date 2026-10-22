"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { LifestyleCreepTimeMachine } from "@/components/LifestyleCreepTimeMachine";

export default function LifestyleCreepPage() {
  return (
    <DashboardShell
      title="Lifestyle Creep Time Machine"
      subtitle="When you get an appraisal hike, lifestyle inflation silently swallows it. See the exact retirement years saved by splitting your increment."
      badge="FIRE Accelerator"
    >
      <LifestyleCreepTimeMachine currentCtc={1200000} />
    </DashboardShell>
  );
}
