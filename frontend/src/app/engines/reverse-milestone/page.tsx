"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { ReverseMilestoneStudio } from "@/components/ReverseMilestoneStudio";

export default function ReverseMilestonePage() {
  return (
    <DashboardShell
      title="Reverse Milestone Accelerator"
      subtitle="Dial lifestyle micro-sacrifices (dining cuts, vacation pauses) to snap dream milestone completion dates forward by months."
      badge="Sacrifice Levers"
    >
      <ReverseMilestoneStudio />
    </DashboardShell>
  );
}
